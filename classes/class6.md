---
layout: slideshow
title: Applications asynchrones
subtitle: AJAX, Server push, Websockets
scripts: ['http://coffeescript.org/extras/coffee-script.js']
---

<section>

## Applications synchrones

**Action → Requête → Réponse HTML → Action → ...**

1. L'utilisateur demande une URL
   
   ~~~
   GET /action?parametres HTTP/1.1
   ...
   ~~~

2. Le server répond avec du HTML.

3. L'utilisateur quitte la page en
   
   - Cliquant un **lien**,
   - Cliquant un **bouton de type `submit`**,
   - **rafraîchissant**.
   
   ~~~
   POST /autre_action?parametres HTTP/1.1
   ...
   ~~~
    
4. Le server répond avec de l'autre HTML.

</section>
<section>

## Et l'état ?

### HTTP est **sans état**

Dans le **Web 1.0**, le server est **le seul** responsable du maintien
de l'état

- dans la logique de l'application (URLs, requêtes, etc.)
- dans son stockage local (sessions, bases de données),
- chez le client (cookies).

### Action → Requête → Réponse HTML → ...

**Dommage collatéral :** le browser perd l'état (à l'exception de son
  stockage local) à chaque nouvelle **action**.

**Démonstration :** <a href="../assets/referrer-echoer.html">naviguez
  vers la racine,</a> puis revenez.

Temps passé sur ces slides : <span id="date"></span>

<script type="text/javascript">
    var start = new Date();
    setInterval(function () {
      var d = new Date(new Date() - start);
      $('#date').innerHTML = d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds();
    }, 1000);
</script>

</section>
<section>

## Navigation synchrone

![Description du modèle de flux de données du Web 1.0, par Jesse J Garret](../assets/web1.0.png)
{:.centered}

</section>
<section>

## Exemple synchrone

<form method='GET' action='http://answers.yahoo.com/search/search_result'>
**Ask [Yahoo](http://answers.yahoo.com/) :**
<input name='p' type='text' value='AJAX' />
<input type='submit' value='Ask' />
</form>

~~~
<form method='GET'
  action='http://answers.yahoo.com/search/search_result'>
  
  <input name='p' type='text' value='AJAX' />
  <input type='submit' value='Ask' />
</form>
~~~
{:.compact}

</section>
<section>

## Navigation asynchrone

![Description of the AJAX dataflow model, by Jesse J Garret](../assets/web2.0.png)
{:.centered}

</section>
<section>

## Exemple asynchrone

<form id='yahoo'>
  **Ask [Yahoo](http://answers.yahoo.com/) :**
  <input id='query' type='text' value='AJAX' />
  <input type='submit' value='Ask' />
</form>

<div id='answers'></div>
<style scoped>
#answers {
	width: 90%;
	height: 440px;
	margin: auto;
	border: solid thin gray;
	border-radius: 5px;
	box-shadow: 0 0 2px gray inset;
	overflow-y: auto;
	transition: opacity 2s;
	-webkit-transition: opacity 2s;
}
#answers.fadein { opacity: 1; }
#answers.fadeout { opacity: 0.1; }
</style>

<script type="text/coffeescript">
$('#yahoo').onsubmit = (submit) ->
  $('#answers').className = 'fadeout'
  
  xhr = new XMLHttpRequest()
  query = $('#query').value
  qs = ("#{k}=#{encodeURIComponent(v)}" for k,v of {
    q: "select * from answers.search where query='#{query}'"
    format: 'json'
    diagnostics: 'true'
    callback: ''
  }).join('&')
  xhr.open 'GET', 'http://query.yahooapis.com/v1/public/yql?' + qs

  xhr.responseType = 'json'
  xhr.onload = ->
    try
      if (xhr.response)
        {query: results: Question : qlist} = xhr.response
        q = qlist[Math.floor Math.random() * qlist.length]
        $('#answers').innerHTML = """
          <p><b>Question:</b> #{q.Content}</p>
          <p><b>Best answer:</b> #{q.ChosenAnswer}</p>
        """
      else
        $('#answers').innerHTML = '<p>Pas de résultats.</p>'
      $('#answers').className = 'fadein'

  # Necessary to wait for transition end
  # (too lazy to handle the transitionend event)
  setTimeout ( ->
    xhr.send()
  ), 2000
  
  submit.preventDefault()
</script>

</section>
<section>

## Navigation asynchrone

Quels éléments pour une navigation asynchrone ?

### Action ≠ Requête

- JavaScript intercepte les actions (*évènements*) de l'utilisateur.

### Requêtes asynchrones (`XMLHttpRequest`)

- JavaScript peut initier une requête **indépendamment** des actions de
  l'utilisateur,
- Les requêtes **n'interrompent pas** la navigation.

### *Server push* (`EventSource`, Web sockets)

- Le serveur peut envoyer des données au client sans attendre une
  requête.

</section>
<section>

# `XMLHttpRequest`

</section>
<section>

## `XMLHttpRequest`

Introduit par Microsoft dans IE5, maintenant un standard W3C.

- Envoie des requêtes **POST ou GET** (ou autre) vers le server ;
- **Ne bloque pas le browser** en attendant la response ;
- Exécute une callback asynchrone à l'arrivée de la response.

~~~
/***************  Cliquez !  ***************/
mydiv.onclick = function() {
  xhr = new XMLHttpRequest();
  xhr.open("GET", "../LICENCE.md");
  xhr.onload = function(event) {
	alert(xhr.response);
  }
  xhr.send();
}
~~~
{: #ajax-demo}

<style scoped>
#ajax-demo {
  cursor: pointer;
  transition: box-shadow 0.2s;
  -webkit-transition: box-shadow 0.2s;
}
#ajax-demo:hover { box-shadow: 0 0 20px blue; }
#ajax-demo.loading { box-shadow: 0 0 20px red; }
</style>

<script type="text/coffeescript">
do (div = $('#ajax-demo')) ->
  div.onclick = ->
    div.className = 'loading'
    xhr = new XMLHttpRequest()
    xhr.open "GET", "../LICENCE.md"
    xhr.onload = ->
      setTimeout ( ->
        alert xhr.response
        div.className = ''
      ), 500
    xhr.send()
</script>

</section>
<section>

### Creation et préparation

~~~
xhr = new XMLHttpRequest();
xhr.open("POST", "http://.../action?params");
~~~

### Callbacks

~~~
xhr.onload = function(event) {
  console.log('Succes');
}
xhr.onerror = function(event) {
  console.log('Erreur');
}
xhr.onabort = function(event) {
  console.log("Annulé par l'utilisateur");
}
xhr.onprogress = function(event) {
  console.log('Téléchargement...');
}
~~~

</section>
<section>

### Envoyer des données

~~~
xhr.setRequestHeader('Content-Type', 'text/plain')
xhr.send("Hello world !");
~~~

Simuler un formulaire
([peut aussi envoyer des données binaires](https://developer.mozilla.org/en-US/docs/Web/Guide/Using_FormData_Objects))

~~~
var formData = new FormData();
formData.append('q', 'AJAX');
formData.append('hl', 'en');
// Content-Type: multipart/form-data  par defaut
xhr.send(formData);
~~~

Envoyer du JSON

~~~
var data = { primes : [2, 3, 5, 7],
             even   : [2, 4, 6, 8] };
xhr.setRequestHeader('Content-Type',
	                 'application/json')
xhr.send(JSON.stringify(data));
~~~

</section>
<section class="compact">

## Lire la réponse

~~~
xhr.onload = function() {
  // Texte simple (indépendamment du type de la réponse)
  console.log(xhr.responseText);
  // XML (si la réponse est dans ce format)
  console.log(xhr.responseXML);
  // Variable (texte par défaut ?)
  console.log(xhr.response);
}
~~~

Pré-traitement de la réponse par le browser

~~~
xhr.responseType = "json";
xhr.onload = function() {
  var obj = xhr.response;  // transformé en objet JavaScript
  console.log(obj.toto);   // par le browser
}
~~~

- `text` : texte,
- `document` : DOM HTML,
- `arraybuffer`, `Blob` : données binaires.

</section>
<section class="compact">

## L'API AJAX de JQuery

`XMLHttpRequest` commence à être bien supporté, mais les frameworks
JavaScript offrent une interface simplifiée et compatible avec les
vieux browsers. En JQuery

~~~
$.ajax({
  url      :  'http://example.com/api/json/query',
  type     :  'GET',
  // équivalent de responseType
  dataType :  'json',
  // conversion et gestion automatique de GET et POST
  data     :  { car: 'peugeot', color: 'bleu' },
  // Callbacks pour les évènements
  success  :  function() { ... },
  error    :  function() { ... },
  complete :  function() { ... }
});
~~~

- La requête est créée et envoyée en un seul coup,
- Utilise des noms non-standards pour les évènements,
- dans les callbacks `this` est rattaché à l'objet XHR.

</section>
<section class="compact">

## Étude de cas : Yahoo answers

<pre><code>$('#yahoo').onsubmit = function(e) {
<div id="xhr-input">  var query = $('#query').value;
</div>  var xhr = new XMLHttpRequest();

<div id="xhr-yql">  var yql = encodeURIComponent(
    "SELECT * FROM answers.search WHERE query='"
    + query + "'");
</div>
<div id="xhr-open">  xhr.open('GET', 'http://query.yahooapis.com/v1/public/yql'
    + '?<span class="xhr-json">format=json</span>&diagnostics=true&callback=&q=' + yql);
</div>
  xhr.onload = callback;
<div class="xhr-json">  xhr.responseType = 'json';
</div>  xhr.send();
}
</code></pre>

<style>
html[data-incremental="1"] #xhr-input,
html[data-incremental="2"] #xhr-yql,
html[data-incremental="3"] #xhr-open,
html[data-incremental="4"] .xhr-json
{ outline: solid thick red; }
</style>

- Récupération le contenu du champs de texte ;
- Préparation d'une interrogation au format YQL de Yahoo ;
- Préparation de la requête à <http://query.yahooapis.com/v1/public/yql> ;
- On attend un résultat au format JSON.
{: .incremental}

</section>
<section class="compact">

## Étude de cas : Yahoo answers

<pre><code>var callback = function(e) {
  if (xhr.response) {
	var liste = <span class="xhr-parse">xhr.response.query.results.Question</span>;
<div id="xhr-random">    var q = liste[Math.floor(Math.random() * liste.length)];
</div>    <span class="xhr-dom">$('#answers').innerHTML</span> =
	    '&lt;p&gt;&lt;b&gt;Question:&lt;/b&gt; ' + <span class="xhr-parse">q.Content</span> + '&lt;/p&gt;' +
        '&lt;p&gt;&lt;b&gt;Best answer:&lt;/b&gt; ' + <span class="xhr-parse">q.ChosenAnswer</span> + '&lt;/p&gt;';
  } else {
    <span class="xhr-dom">$('#answers').innerHTML</span> = '&lt;p&gt;Pas de résultats.&lt;/p&gt;';
  }
}
</code></pre>

<style>
html[data-incremental="1"] .xhr-parse,
html[data-incremental="2"] #xhr-random,
html[data-incremental="3"] .xhr-dom
{ outline: solid thick red; }
</style>

- La réponse (au format JSON) est automatiquement convertie en objet
  JavaScript ;
- On sélectionne une question au hasard ;
- On insère le résultat dans la page via le DOM.
{: .incremental}

</section>
<section>

# Formats d'échange de données

</section>
<section>

## Formats de données en AJAX

AJAX est l'acronyme de *« Asynchronous JavaScript and XML »*.

Mais chaque composant est optionnel, en particulier XML !

Selon l'application, l'un des formats suivants peut être mieux adapté
qu'un autre :

- **Pas de données** : les entêtes HTTP suffisent ;
- **Texte** simple ;
- Extraits de **HTML** ;
- **JavaScript**, **CSS**, ... ;
- **JSON**, autres formats *légers* (YAML, ...) ;
- **XML**, autres formats structurés (HTML, ...) ;
- Données **binaires**, encodage Base64, ... ;
- ...

Utiliser l'entête `Content-Type` pour déclarer le format.

</section>
<section>

### Texte ou rien

Pour des actions simples comme

- Sauvegardes automatiques (mails, documents, etc.),
- Avancement.

~~~
POST /api/save HTTP/1.1
Host: mail.google.com
...

Dear Sir,

It is my ple
~~~
{:.http}

~~~
HTTP/1.1 200 OK
Content-Type: text/plain
...

23
~~~
{:.http}

</section>
<section class="compact">

## HTML

Pour une inclusion directe de fragments HTML (par ex., billets de
blog, commentaires, ...)

~~~
GET /?post=23389 HTTP/1.1
Host: www.wordpress.com
...
~~~
{:.http}

~~~
HTTP/1.1 200 OK
Content-Type: text/html
...

<article class='post' id='post23389'>
<p>I've always thought...
~~~
{:.http}

Exemple d'inclusion dans le document:

~~~
xhr.onload = function() {
    $('#main').innerHTML = xhr.responseText;
});
~~~

**Problème:** Viole la séparation entre **données**, **présentation**
  et **logique**.

</section>
<section class="compact">

## JavaScript

~~~
GET /api/car?user=toto HTTP/1.1
Host: www.example.com
...
~~~
{:.http}

~~~
HTTP/1.1 200 OK
Content-Type: application/javascript
...

{ car   : 'peugeot',
  color : 'blue'    }
~~~
{:.http}

Exemple d'inclusion dans le document

~~~
xhr.onload = function() {
  var res = eval(xhr.responseText);
}
~~~

### Problèmes graves

- Viole la séparation de la logique ;
- Grande risuqe de failles XSS.

</section>
<section class="compact">

## JSON

JSON est un sous-ensemble *léger* des types de données de JavaScript
(**nombres**, **chaînes**, **tableaux** et **objets**)

~~~
GET /api/car?user=toto HTTP/1.1
Host: www.example.com
...
~~~
{:.http}

~~~
HTTP/1.1 200 OK
Content-Type: application/json
...

{ "car" : "peugeot", "color" : "blue" }
~~~
{:.http}

### Avantages / Désavantages

- Beaucoup plus compact que XML, facile et rapide à évaluer ;
- Moins puissant que XML ;
- Supporté par tous les browsers modernes ;
- Pas de risques d'évaluer du code dangéreux ;
- Peut créer une vulnérabilité XSS si évalué avec `eval()`.

</section>
<section class="compact">

## XML

Pour des données riches et structurées (par ex., requêtes BD, geodata,
...)

~~~
GET /v1/public/yql?q=SELECT * FROM geo.places WHERE text "Paris" HTTP/1.1
Host: query.yahooapis.com
...
~~~
{:.no-highlight .compact}

(La requête a été légèrement modifiée pour faciliter la lecture)

~~~
HTTP/1.1 200 OK
Content-Type: application/xml
...

<?xml version="1.0" encoding="UTF-8"?>
<query xmlns:yahoo="http://www.yahooapis.com/v1/base.rng" yahoo:count="10" yahoo:created="2012-03-14T04:38:52Z" yahoo:lang="en-US">
    ...
    <results>
        <place xmlns="http://where.yahooapis.com/v1/schema.rng" xml:lang="en-US" yahoo:uri="http://where.yahooapis.com/v1/place/615702">
            <woeid>615702</woeid>
            <placeTypeName code="7">Town</placeTypeName>
            <name>Paris</name>
            ...
~~~
{:.http .compact}

</section>
<section>

## XML

### Évaluation, manipulation

- **XPath**: *Query language* pour la sélection de nœuds dans un arbre
  XML ;
- **XSLT** (Extensible Stylesheet Language Transformations):
    transformations de documents XML.
    
### Avantages / Disadvantages

- Puissant, robuste ;
- Supporté par beaucoup de services web.
- Verbeux, relativement lent ;
- Peux d'implantations complètes ;
- Spécification énorme avec des risques de failles de securité.

</section>
<section>

# Communication bidirectionnelle

</section>
<section>

## *Server push*

### Problème : AJAX est **unidirectionnel**

1. Le client envoie des données dans la requête,
2. Le server répond avec des données.

- Le server ne peut pas initier un transfert de données ;
- Le server ne peut pas appeler des fonctions (déclencher des
  évènements) chez le client.

**Simuler** une communication bidirectionnelle
  ([Comet](http://en.wikipedia.org/wiki/Comet_%28programming%29))

- *Short polling*, *Long polling*, *Streaming*.

**Vraie** communication bidirectionnelle

- `EventSource`, WebSockets.

</section>
<section>

## *Polling*

Utile pour : notifications, compatibilité avec vieux browsers

### *Short polling*

1. Le client envoie une requête AJAX à **intervalles réguliers** (de
   l'ordre de la seconde),
2. S'il y a des notifications depuis la dernière requête, le server
   les envoie dans la réponse.

### *Long polling*, *Streaming*

1. Le client ouvre une connexion HTTP avec le server,
2. Le server envoie les entêtes mais ne ferme pas la connexion,
3. Lorsque des notifications arrivent, le server les envoie dans la
   connexion ;
4. (*long polling*) Le server ferme la connexion.

</section>
<section>

## Polling

### Avantages

- Compatible avec les vieux browsers,
- Ne demande pas de support spécifique chez le server.

### Désavantages

- Gourmand en bande passante et ressources (*overhead* du protocole
  HTTP),
- Latence.

</section>
<section class="compact">

## Event stream

Format de streaming **unidirectionnel Server → Client** : la connexion
reste ouverte

<pre class="http"><code>HTTP/1.1 200 OK
Content-Type: text/event-stream
...

<span id="evt-1">data: un message</span>

<div id="evt-2">data: un autre
data: message
</div>
<div id="evt-3">event: toto
data: un message avec un nom
</div>
<span id="evt-4">data: { "msg" : ["Porquoi", "pas", "du", "JSON"] }</span>
</code></pre>

<style>
html[data-incremental="1"] #evt-1,
html[data-incremental="2"] #evt-2,
html[data-incremental="3"] #evt-3,
html[data-incremental="4"] #evt-4
{ outline: solid thick red }
</style>

1. Un message d'une ligne,
2. Un message sur plusieurs lignes,
3. Un message *nommé*,
4. On est libres de choisir le format des données.
{:.incremental}

</section>
<section>

## `EventSource`

Le client est notifié des messages du server par des **évènements**

~~~
var evt = new EventSource("/api/notifications");

// Messages sans nom
evt.addEventListener('message', function(e) {
  console.log(e.data);
});

// Messages nommés
evt.addEventListener('toto', function(e) {
  console.log('Évènement nommé :', e.data);
});
~~~

- **Pro :** Léger, Simple,
- **Contre :** Unidirectionnel, Nécessite le support du server,
- **Démo :** <http://server-sent-events-demo.herokuapp.com/>.

</section>
<section class="compact">

## Web Sockets

Protocole de communication **full-duplex**, compatible avec HTML

- Protocole applicatif **au dessus de TCP** : pas de overhead HTTP ;
- Conçu pour utiliser le **même port** que HTTP (port 80 par défaut).

~~~
GET /app/socket HTTP/1.1
Upgrade: websocket
Connection: Upgrade
...
~~~
{:.http}

~~~
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
...
~~~
{:.http}

1. Le client demande une connexion web socket,
2. Le server répond avec `101 Switching Protocols`,
3. Le server et le client établissent une connexion TCP de type Web
   Socket.
{:.incremental}

</section>
<section>

## Web Sockets

### Avantages

- Bidirectionnels,
- Peu de overhead.

### Désavantages

- Nécessitent de support dans le server,
- Pas adaptés au modèle d'exécution Apache+PHP.

### En pratique

Utiliser des bibliothèques qui **abstraient** du mécanisme utilisé
(Web Sockets, Flash, ...).

- Node.js : <http://socket.io/> (très simple à utiliser),
- PHP : <http://socketo.me/> (très difficile à configuer).

</section>
<section>

# Applications REST

</section>
<section>

## Applications REST

**REST** (Representational State Transfer) est un paradigme pour les
  applications distribuées

- **Client-Server** (pas de peer-to-peer) ;
- **Sans état** (au contraire de CORBA, par ex.) ;
- **Cacheable** ;
- **Par niveaux** (c.-à-d.., compatible avec l'utilisation de **proxies**) ;
- **Interface uniforme** (verbes GET, POST, PUT, DELETE, ...).

### En pratique

- Une *application web REST* exploite au maximum l'expressivité du
  protocole HTTP ;
- Tous les *services RESTful* sont basés sur HTTP.

**Avantages:** Simplicité, Scalabilité.

</section>
<section>

## APIs REST

Après un long monopole des interfaces SOAP, beaucoup de services web
migrent maintenant vers des APIs REST

- **Google APIs**: <http://code.google.com/more/> ;
- **Open Street Maps**: <http://wiki.openstreetmap.org/wiki/API> (geodata, cartes) ;
- **Amazon**: <http://aws.amazon.com/> ;
- **The Weather Channel**: <http://www.weather.com/services/xmloap.html> ;
- **Facebook**: <http://developers.facebook.com> (authentification, graphe social) ;
- **Yahoo**: <http://developer.yahoo.com/> ;
- ...

La majorité de ces APIs offre des interfaces XML et JSON.

Essayez la
[Console YQL de Yahoo](http://developer.yahoo.com/yql/console/) !

</section>
<section>

## Lectures

### AJAX, `XMLHttpRequest`

- [Tutoriel MDN `XMLHttpRequest`](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest),
- [Tutoriel MDN `FormData`](https://developer.mozilla.org/docs/Web/Guide/Using_FormData_Objects),
- Manuel de JQuery : <http://api.jquery.com/>.

### JSON

- Définition de JSON : <http://www.json.org/>,
- [Guides MDN](https://developer.mozilla.org/docs/JSON).

### Communication bidirectionnelle

- [Tutoriel MDN `EventSource`](https://developer.mozilla.org/docs/Server-sent_events/Using_server-sent_events)
- [Guides MDN Web Sockets](https://developer.mozilla.org/docs/WebSockets).

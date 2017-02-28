---
layout: lesson
title: Applications asynchrones
subtitle: AJAX et XMLHttpRequest
scripts: '../assets/js/stackoverflow-api.js'
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/ajax.webm
    quizzes:
      - 58a4d0ff6e24fc1857e29130
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

<form method='GET' action='http://stackoverflow.com/search'>
**Ask [StackOverflow](http://stackoverflow.com/) :**
<input name='q' type='text' value='AJAX' />
<input type='submit' value='Ask' />
</form>

~~~
<form method='GET' action='http://stackoverflow.com/search'>
  
  <input name='q' type='text' value='AJAX' />
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

<form id='stack'>
  **Ask [StackOverflow](http://stackoverflow.com/) :**
  <input id='query' type='text' value='AJAX' />
  <input type='submit' value='Ask' />
</form>

<div id='answers'></div>
<style>
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

</section>
<section>

## Navigation asynchrone

Quels éléments pour une navigation asynchrone ?

### Action ≠ Requête

- JavaScript intercepte les actions (*évènements*) de l'utilisateur.

### Requêtes asynchrones (`XMLHttpRequest`, [Fetch API](https://fetch.spec.whatwg.org/))

- JavaScript peut initier une requête **indépendamment** des actions de
  l'utilisateur,
- Les requêtes **n'interrompent pas** la navigation.

### *Server push* (`EventSource`, Web sockets)

- Le serveur peut envoyer des données au client sans attendre une
  requête.

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
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "../LICENSE");
  xhr.onload = function(event) {
    alert(xhr.response);
  }
  xhr.send();
}
~~~
{: #ajax-demo .javascript}

<style>
#ajax-demo {
  cursor: pointer;
  transition: box-shadow 0.2s;
  -webkit-transition: box-shadow 0.2s;
}
#ajax-demo:hover { box-shadow: 0 0 20px blue; }
#ajax-demo.loading { box-shadow: 0 0 20px red; }
</style>

<script>
var div = $('#ajax-demo')
div.onclick = function() {
  div.classList.add('loading');
  xhr = new XMLHttpRequest();
  xhr.open("GET", "../LICENSE");
  xhr.onload = function () {
    setTimeout(function() {
      alert(xhr.response);
	  div.classList.remove('loading');
    }, 500);
  }
  xhr.send();
}
</script>

</section>
<section>

### Creation et préparation

~~~
var xhr = new XMLHttpRequest();
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
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send(JSON.stringify(data));
~~~

</section>
<section class="compacts">

## Lire la réponse

~~~
xhr.onload = function() {
  console.log(xhr.responseText);  // Texte simple
  console.log(xhr.responseXML);   // XML (si la réponse est dans ce format)
  console.log(xhr.response);      // Configurable (texte par défaut)
}
~~~

Pré-traitement de la réponse par le browser

~~~
xhr.responseType = "json";
xhr.onload = function() {
  var obj = xhr.response;         // transformé en objet JavaScript
  console.log(obj.toto);          // par le browser
}
~~~

- `responseType = "text"` : texte (default),
- `responseType = "document"` : arbre DOM d'un document HTML,
- `responseType = "arraybuffer"`, `responseType = "Blob"` : données binaires.

</section>
<section>

## Étude de cas : API StackOverflow

<pre><code>document.querySelector('#SO').onsubmit = function(e) {
<div id="xhr-input">  var query = <span class="urlencode">encodeURIComponent</span>(document.querySelector('#query').value);
</div>  var xhr = new XMLHttpRequest();
<div id="xhr-open">  xhr.open('GET', 'https://api.stackexchange.com/2.2/search/advanced'
    + '?q=' + query + '&site=stackoverflow');
</div>
  xhr.onload = callback;
<div class="xhr-json">  xhr.responseType = 'json';
</div>  xhr.send();
<div id="xhr-prevent">  e.preventDefault();
</div>}
</code></pre>

<style>
html[data-incremental="1"] #xhr-input,
html[data-incremental="2"] .urlencode,
html[data-incremental="3"] #xhr-open,
html[data-incremental="4"] .xhr-json,
html[data-incremental="5"] #xhr-prevent
{ outline: solid thick red; }
</style>

- Récupération du contenu du champs de texte ;
- Échappement des caractères spéciaux ;
- Préparation de la requête à <https://api.stackexchange.com> ;
- On attend un résultat au format JSON ;
- On arrête la soumission du formulaire.
{: .incremental}

</section>
<section>

## Étude de cas : API StackOverflow

<pre><code>var callback = function(e) {
  if (xhr.response && <span class="xhr-parse">xhr.response.<span class="xhr-api">items</span></span>) {
    var liste = <span class="xhr-parse">xhr.response.<span class="xhr-api">items</span></span>;
<div id="xhr-list">    for (var i = 0; i < liste.length; i++) {
      <span class="xhr-dom">document.querySelector('#answers > ul').innerHTML</span> =
        '&lt;li&gt;' + <span class="xhr-parse">liste<span class="xhr-api">[i].title</span></span> + '&lt;/li&gt;';
	}
</div>  } else {
    <span class="xhr-dom">document.querySelector('#answers').innerHTML</span> =
      '&lt;p&gt;Pas de résultats.&lt;/p&gt;';
  }
}
</code></pre>

<style>
html[data-incremental="1"] .xhr-parse,
html[data-incremental="2"] #xhr-list,
html[data-incremental="3"] .xhr-dom,
html[data-incremental="4"] .xhr-api
{ outline: solid thick red; }
</style>

- La réponse (au format JSON) est automatiquement convertie en objet
  JavaScript ;
- On construit une liste des questions répondant aux critères ;
- On insère le résultat dans la page via le DOM ;
- Voir la documentation complète de l'API : <https://api.stackexchange.com/docs/>.
{: .incremental}

</section>
<section>

## Lectures

- Eloquent Javascript, [Chapitre 17](http://eloquentjavascript.net/17_http.html).

- [Pages AJAX du MDN](https://developer.mozilla.org/fr/docs/AJAX) (aussi [en anglais](https://developer.mozilla.org/en-US/docs/AJAX)).

- [Tutoriel MDN `XMLHttpRequest`](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest).

- [Tutoriel MDN `FormData`](https://developer.mozilla.org/docs/Web/Guide/Using_FormData_Objects).

</section>

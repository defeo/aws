---
layout: lesson
title: JavaScript asynchrone
---

<section>

## Parallelisme et évènements 

JavaScript est *single-threaded* (en général) :

- Pas de mécanismes de parallélisme natifs,

- Interactions asynchrones réalisés par une *boucle d'évènements*,

- Exemples d'interfaces asynchrones :
  
  - `setTimeout`, `setInterval`,
  - Évènements DOM,
  - `XMLHttpRequest`, Fetch API,
  - Node.js : accès disque, réseau, bases de données, gestionnaires de
    requête, ...

</section>
<section>

## Callbacks

Le mécanisme de base de la *programmation par évènements* est la
*fonction de callback* :

~~~
function callback() {                  // À appeler dans 2 secondes
	console.log('Hello world');
}

setTimeout(callback, 2000);
~~~

~~~
div.addEventListener('click',
	function() {                       // À appeler dès qu'il y a un
		console.log('Hello click');    // click sur l'objet div
	});
~~~
{:.javascript}

~~~
app.get('/toto',
        function(req, res) {           // À appeler à l'arrivée d'une
			res.send("Hello world");   // requête pour /toto
        });
~~~

</section>
<section class="compact">

## *Callback hell*


~~~
app.get('/toto', function(req, res) {
	setTimeout(function() {
		db.query('SELECT * FROM users', function(err, result) {
			if (err)
				console.log(err);
			else if (result.length > 0) {
				db.query(...)
			}	
		});
	}, 2000);
});
~~~

Difficile à coder

- Gestion de cas : succès/insuccès.
- Boucles d'actions asynchrones :
  - **exercice :** afficher *« Hello World »* toutes les 2 secondes sans se
	servir de `setInterval`.
- Synchronisation :
  - attendre la fin de deux ou plusieurs actions asynchrones.
  - attendre la fin d'une parmi plusieurs actions asynchrones.

</section>
<section>

## Générateurs (ES6)

Utilisation principale : répéter des évènements asynchrones.

<div class="two-cols">

~~~
function* generateur() {
	var cnt = 0;
	while (true)
		yield cnt++;
}

var g = generateur();
for (var i = 0; i < 9; i++)
	console.log( g.next() );
~~~

~~~
{ value: 0, done: false }
{ value: 1, done: false }
{ value: 2, done: false }
{ value: 3, done: false }
{ value: 4, done: false }
{ value: 5, done: false }
{ value: 6, done: false }
{ value: 7, done: false }
{ value: 8, done: false }
~~~

</div>

Mots clef :

- `function*` : pour définir un générateur,
- `yield` : équivalent asynchrone de `return`,
- `yield*` : pour déléguer à un autre générateur.

</section>
<section>

## Promesses (ES6)

Utiles pour : *linéariser* et *synchroniser* les callbacks. Exemple de
AJAX avec l'API fetch :

~~~
fetch('/api/donnees.json').then(
	function (res) {
		console.log('téléchargement réussi', res);
	},
	function (err) {
		console.log('téléchargement échoué', err);
	});
~~~

- `fetch('/api/donnees.json')` renvoie une *promesse*,
- `.then(success, fail)` définit quoi faire après que la promesse a
  terminé :
  - `success` : exécuté si la promesse a réussi.
  - `fail` : exécuté si la promesse a eu une erreur.
- `new Promise()` pour créer une promesse définie par l'utilisateur.
- `.catch()` : à la place de `.then` pour gérer uniquement les erreurs.

</section>
<section>

## Lectures

- [MDN sur les iterateurs](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/function*)
- [MDN sur les générateurs](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Les_protocoles_iteration),
- Promesses A+ : <https://www.promisejs.org/>,
- Eloquent JavaScript,
  [Chapitre 17](http://eloquentjavascript.net/17_http.html#promises)
  sur les promesses,
- [Article sur les promesses](http://www.html5rocks.com/en/tutorials/es6/promises/),
- [Article sur l'API fetch](https://hacks.mozilla.org/2015/03/this-api-is-so-fetching/).

</section>

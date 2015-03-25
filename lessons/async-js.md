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

</section>
<section>

## Promesses (ES6)

https://www.promisejs.org/
http://eloquentjavascript.net/17_http.html

</section>
<section>

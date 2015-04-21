---
layout: lesson
title: JSON
subtitle: Formats d'échange de données en AJAX
video:
  url: https://www.dropbox.com/s/ys3vvcuu3mt81ic/json.webm?dl=1
---

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
- **XML**, autres formats structurés (XHTML, ...) ;
- Données **binaires**, encodage Base64, ... ;
- ...

Utiliser l'entête `Content-Type` pour déclarer le format.

</section>
<section>

## Texte ou rien

<div class="two-cols">

Pour des actions simples comme

- Sauvegardes automatiques (mails, documents, etc.),
- Avancement.

</div>

~~~
POST /api/savemail HTTP/1.1
Host: webmail.example.com
...

Cher Monsieur,

Par la présente je vo
~~~
{:.http}

~~~
HTTP/1.1 200 OK
Content-Type: text/plain
...

39
~~~
{:.http}

</section>
<section>

## HTML

Pour une inclusion directe de fragments HTML (par ex., billets de
blog, commentaires, ...)

~~~
GET /api/post/23389 HTTP/1.1
Host: blog.example.com
...
~~~
{:.http}

~~~
HTTP/1.1 200 OK
Content-Type: text/html
...

<article class='post' id='post23389'><p>J'ai toujours cru...
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

## XML

Pour des données riches et structurées (par ex., requêtes BD, geodata,
...)

~~~
GET /v1/public/yql?q=SELECT * FROM geo.places WHERE text="Paris" HTTP/1.1
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
<query xmlns:yahoo="http://www.yahooapis.com/v1/base.rng" yahoo:count="10" yahoo:created="2015-03-17T22:05:40Z" yahoo:lang="en-US">
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
    
### Avantages / Désavantages

- Puissant, robuste ;
- Verbeux, relativement lent ;
- Peux d'implantations complètes ;
- Spécification énorme avec des risques de failles de securité.

</section>
<section>

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

{ car : 'peugeot', color : 'blue' }
~~~
{:.http}

Exemple d'inclusion dans le document

~~~
xhr.onload = function() {
  var res = eval(xhr.responseText);
}
~~~

<div class="two-cols">

### Problèmes graves

- Viole la séparation de la logique ;
- Grande risque de failles XSS.

</div>
</section>
<section class="compacta">

## JSON (JavaScript Object Notation)

JSON est un langage *léger* de représentation de données, basé sur JavaScript.

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

<div class="two-cols">

### Pour / Contre

- Plus compact que XML, facile et rapide à évaluer ;
- Moins puissant que XML ;
- Supporté par tous les browsers modernes ;
- Pas de risques d'évaluer du code dangéreux ;
- Peut créer une vulnérabilité XSS si évalué avec `eval()`.

</div>
</section>
<section>

## JSON

- Créé en 2000 par Douglas Crockford : <http://json.org/>.
- Sous-ensemble de JavaScript : code JSON valide → code JavaScript
  valide
  ([presque](http://timelessrepo.com/json-isnt-a-javascript-subset)).
- Extrêmement populaire pour les API de type REST.
- Exemples de APIs JSON :
  [Google](https://developers.google.com/apis-explorer/),
  [Yahoo](https://developer.yahoo.com/yql/),
  [Facebook](http://developers.facebook.com),
  [OpenStreetMap](http://wiki.openstreetmap.org/wiki/API),
  [Wikipedia](http://www.mediawiki.org/wiki/API:Main_page),
  [StackOverflow](https://api.stackexchange.com/),
  [GitHub](https://developer.github.com/v3/),
  [Ville de Paris](http://opendata.paris.fr/),
  [Vélib](https://developer.jcdecaux.com/#/home),
  [WordPress](http://wp-api.org/), ...

### Types de données

- Nombres : `10`, `10.3`, `10.0003e-10`,
- Chaînes de caractères : `"abcdef"`,
- Booléens : `true`, `false`,
- `null`,
- Listes : `[ 1, 2, "abcdef", true ]`,
- Objects : `{ "clef" : "valeur", "autre_clef" : 1, "encore_une" : null }`.

</section>
<section>

## Exemple JSON

~~~
{
  "voitures" :
  [
    { "modèle"          : "peugeot",
	  "couleur"         : "bleu",
	  "immatriculation" : 2008,
	  "révisions"       : [ 2012, 2014 ]
    },
	{ "modèle"          : "citroën",
	  "couleur"         : "blanc",
	  "immatriculation" : 1999,
	  "révisions"       : [ 2003, 2005, 2007, 2009, 2011, 2013 ]
	}
  ],
  "date" : "2015-03-18"
}
~~~

</section>
<section>

## JavaScript ⊄ JSON

~~~
{ "voiture"  : "peugeot",
  "vitesses" : [1, 2, 3, 10] }
~~~

Codes JavaScript équivalents qui donnent une erreur en JSON :

~~~
{ 'voiture'  : 'peugeot',
  'vitesses' : [1, 2, 3, 10] }
~~~
{:.javascript}

~~~
{ voiture  : "peugeot",
  vitesses : [1, 2, 3, 10] }
~~~
{:.javascript}

~~~
{ "voiture"  : "peugeot",
  "vitesses" : [1, 2, 3, 10, ], }
~~~
{:.javascript}

~~~
{ "voiture"  : "peugeot",
  "vitesses" : [0x1, 0x2, 0x3, 0xA] }
~~~
{:.javascript}

</section>
<section class="compact">

## Utilisation de JSON

**Silex :** Transformer un objet PHP en réponse JSON

~~~
return $app->json(array( "voiture" => "peugeot",
                         "vitesses" => array(1, 2, 3, 10)));
~~~
{:.php}

**Express :** Transformer un objet JavaScript en réponse JSON

~~~
res.json({ voiture: "peugeot",
           vitesses: [1, 2, 3, 10] });
~~~
{:.javascript}

**Browser/Node.js :** Transformations JSON ↔ Objet JavaScript

<div class="two-cols">

~~~
var a = JSON.stringify({ a: "b",
                         c: [1, 2] });
console.log(a);
console.log(JSON.parse(a));
~~~

~~~
{"a":"b","c":[1,2]}
Object { a: "b", c: [1, 2] }
~~~

</div>

**AJAX :** interprétation automatique des réponses JSON

<div class="two-cols">

~~~
xhr.responseType = 'json';
xhr.onload = function() {
  console.log(xhr.response);
}
~~~

~~~
Object { voiture: "peugeot",
         vitesses : [1, 2, 3, 10] }
~~~

</div>
</section>
<section>

## Lectures

- Eloquent JavaScript, Chapitres
  [5](http://eloquentjavascript.net/05_higher_order.html) et
  [17](http://eloquentjavascript.net/17_http.html),
- Définition de JSON : <http://www.json.org/>,
- [Guides MDN à JSON](https://developer.mozilla.org/docs/JSON),
- [Référence Express](http://expressjs.com/4x/api.html#res.json),
- [Référence Silex](http://silex.sensiolabs.org/doc/usage.html#json),

### Quelques consoles pour tester des APIs JSON

- Google : <https://developers.google.com/apis-explorer/>,
- Yahoo : <https://developer.yahoo.com/yql/console/>,
- Ville de Paris : <http://opendata.paris.fr/explore/>,
- Facebook : <https://developers.facebook.com/tools/explorer/>,

</section>

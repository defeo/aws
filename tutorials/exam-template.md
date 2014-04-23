---
layout: tutorial
title: Pré-sujet d'examen 2014
---

Ce document constitue un *pré-sujet* d'examen. On donne ici des
questions-type. Ces questions peuvent tomber à l'examen telles
quelles, en forme légèrement modifiée, ou pas du tout. Il est aussi
possible que des questions totalement dissemblables de celles-ci
soient posées à l'examen.

Vous devez répondre à ces questions en vous basant sur les
technologies vues en cours : HTML, CSS, Twig, PHP, Silex, JavaScript,
Node.js, JQuery, MySQL, ... Lorsque plusieurs technologies permettent
d'obtenir le même résultat (par exemple, Silex vs Node.js), vous êtes
libres de choisir la technologie que vous préférez.

Le jour de l'examen, vous avez droit d'apporter vos propres réponses à
ces questions. Ce sont les seuls documents autorisés.


## HTML et CSS

Considérez le code HTML suivant

~~~
<body>
  <ul id="menu">
	<li class="odd">One</li>
	<li class="even">Two</li>
	<li class="odd">Three</li>
  </ul>
  <div id="nav">
	<div class="nav">
	  <h2>Nav 1</h2>
	  <h3 class="odd">Link 1</h3>
	  <h3 class="even">Link 2</h3>
	  <h3 class="odd">Link 3</h3>
	</div>
	<div class="nav">
	  <h2>Nav 2</h2>
	</div>
	<div class="nav">
	  <form id="login">
		<input id="text" type="text" title="Insert text">
		<input id="number" type="text" title="Insert number">
		<input type="submit">
	  </form>
	</div>
  </div>
  <div id="main">
	<h1>Lorem Ipsum</h1>
	<h2>dolor sit amet, consectetur adipisicing elit, sed do eiusmod
	  tempor incididunt ut labore et dolore magna aliqua.</h2>
	<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco
	  laboris nisi ut aliquip ex ea commodo consequat.</p>
	<p>Duis aute irure dolor in reprehenderit in voluptate velit
	  esse cillum dolore eu fugiat nulla pariatur.</p>
  </div>
</body>
~~~

Indiquez à quels éléments correpondent les sélecteurs CSS suivants :

* `ul .odd`,
* `div.odd`,
* `#nav`,
* `[type=text]`,
* `form [title]`,
* `#main h1+h2`,
* `.even, .odd`,
* `div div div`.


## JavaScript et DOM

Considérez l'extrait HTML suivant

~~~
<table id="alt" class="mytable">
  <tr><td>A</td><td>B</td></tr>
  <tr><td>C</td><td>D</td></tr>
  <tr><td>E</td><td>F</td></tr>
  <tr><td>G</td><td>H</td></tr>
</table>
<button id="swap">Swap</button>
~~~

Sans toucher au code HTML, écrivez du code JavaScript (et
éventuellement du code CSS) qui, à chaque clic du bouton, cache de
façon alternative les lignes paires ou impaires de la table.

-----------------

Considérez l'extrait HTML suivant

~~~
<ul id="modifyme"></div>
~~~

1. Écrivez une fonction JavaScript qui prend en entrée un nombre *n*,
   et qui ajoute à la liste `modifyme` *n* puces énumérant les nombres
   jusqu'à *n*, comme ceci :
   
   * 1,
   * 2,
   * 3,
   * 4.

2. Écrivez une fonction qui prend en entrée un entier *m* et qui met
   en gras la *m*-ième ligne de la liste précédente.

3. On ajoute les éléments HTML suivants
   
   ~~~
   <button id="plus" >+</button> <!-- Ajoute une puce -->
   <button id="moins">-</button> <!-- Enlève une puce -->
   <button id="up"   >↑</button> <!-- Déplace vers le haut le gras -->
   <button id="down" >↓</button> <!-- Déplace vers le bas le gras -->
   ~~~
   
   Écrivez des gestionnaires associés aux clics de ces boutons, qui
   appellent réalisent les fonctionnalités décrites en commentaire, à
   l'aide des fonctions écrites au points précédents.


## Logique server et base de données

Dans une base de données MySQL on a trois tables `francais`, `english`
et `italiano`, dont voici un extrait

<style scoped>
  table.inline {
    display: inline-table;
	margin: 0 2em;
  }
</style>

| id | term
|---
| 1  | banane
| 2  | pomme
| 3  | poire
{:.pretty.inline }

| id | term
|---
| 1  | banana
| 3  | pear
| 2  | apple
{:.pretty.inline }

| id | term
|---
| 2  | mela
| 1  | banana
| 3  | pera
{:.pretty.inline }

1. Écrivez un formulaire qui permet de saisir un mot, une langue de
   départ, une langue d'arrivée et d'en demander la traduction.

2. Écrivez un gestionnaire pour l'URL `/translate` qui prend en
   paramètre (vous êtes libres de choisir la façon de passer les
   paramètres qui mieux vous convient) un mot, une langue de départ et
   une langue d'arrivée et qui répond avec la traduction du mot, ou
   une erreur si le mot n'est pas dans la base.

-------

Un *URL shortener* est un service web permettant de générer des URLs
courtes qui pointent vers des URLs d'autres sites. Un exemple d'un tel
service est [bitly](http://bitly.com). Par exemple, l'URL de cette
page a été soumise à <https://bitly.com/shorten/>, qui l'a raccourcie
en <http://bit.ly/1fmDXsX>.

Concevez un simple *URL shortener*. Il s'agit d'une application avec
deux routes :

- Une route `/shorten` qui prend en paramètre une URL, la sauvegarde
  dans la base de données, et renvoie le lien raccourci ;
- Une route `/u/{id}` (`id` est un paramètre entier), qui récupère
  l'URL d'identifiant `id` dans la base, et qui redirige vers
  celle-ci.

Décrivez la structure de la base de données et donnez le code des
gestionnaires.


## AJAX et JSON

Un site sportif offre une API json permettant d'explorer sa base de
données (matchs, journées de championnat, etc.)

L'API répond aux URLs `'/journee/{n}'` (`n` est un paramètre entier)
avec la liste des matchs de la journée `n`. Le format est le suivant :

~~~
{ "journee" : 10,
  "matchs"  : [
	{ "id"         : 1000,
	  "date"       : "2014-05-10T20:30:00+02:00",
	  "lieu"       : "CSS Arena",
	  "hote"       : "Olympique Json",
	  "adversaire" : "AFC Ajax",
	  "arbitre"    : "Charles REST"
	},
	{ "id"       : 1005,
	  ...
	},
	...
  ]
}
~~~

Considérez le code HTML suivant

~~~
<ul id="journees">
  <li data-journee="1">Journée 1</li>
  <li data-journee="2">Journée 2</li>
  <li data-journee="3">Journée 3</li>
  ...
</ul>
<table id="calendrier">
  <thead>
	<th><td>Match</td><td>Date</td><td>Arbitre</td></th>
  </thead>
  <tbody></tbody>
</table>
~~~

Écrivez du code JavaScript qui, lorsque on clique sur l'une des
journées dans la liste, envoie une requête AJAX à l'API et affiche le
résultat dans le corps du tableau `calendrier`.


## Applications multi-utilisateurs

Concevez une simple application web qui représente une cagnotte
virtuelle. Il n'y a pas de comptes d'utilisateurs. Les clients peuvent

- ajouter une somme à la cagnotte,
- prélever une somme de la cagnotte, à condition qu'il y ait assez
  d'argent
- suivre en temps réel l'évolution de la cagnotte.

Décrivez les routes de l'application, la structure de la base de
données, et les vues (templates). Donnez ensuite les parties
principales du code (i.e., pas la peine de recopier la configuration
de la base de données, par contre le code des gestionnaires est
intéressant).


## Sécurité

Considérez ce gestionnaire

~~~
app->get('/url/{x}', function(Application $app, $x) {
	$a = $app->query->get('a');
	$b = $app['session']->get('b');
	$q = $app['db']->query("SELECT * FROM t WHERE a=? AND b='$b'", array($a));
	$r = $q->fetch();
	$msg = "$a pomme, $b poire, $x banane";
	return $app['twig']->render('template.twig', array(
		"msg" => $msg;
		"r"   => $r,
	));
});
~~~

avec ce code pour `template.twig`

{% raw %}
~~~
<div id="msg">
  {{ msg | raw }}
</div>
<dl>
{% for k, v in r %}
  <dt>{{ k | raw }}</dt><dd>{{ v }}</dd>
{% endfor %}
</dl>
~~~
{:.django}
{% endraw %}

1. Expliquer quelles sont les voies d'injection SQL possibles et
   comment les réparer.
2. Expliquer quelles sont les voies d'injection XSS possibles et
   comment les réparer.

------------

Considérez ce gestionnaire

~~~
app->get('/url', function(Application $app) {
	$x = $app->request->get('param1');
	$y = $app->request->get('param2');
	if ($app['db']->execute('UPDATE table SET y=? WHERE x=?', array($y, $x)))
		return 'OK';
	else
		return 'Error';
});
~~~

1. Expliquer pourquoi il est vulnérable aux attaques CSRF.
2. Expliquer quel est l'impact de la politique CORS sur ces attaques.
3. Expliquer quelles contre-mesures permettent de mitiger ces
   attaques, et montrer comment les mettre en œuvre.

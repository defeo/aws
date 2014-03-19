---
layout: slideshow
title: Frameworks web
subtitle: API HTTP, routage, templates
---

{% raw %}

<section>

### Application, requête, réponse

<svg style="margin:auto;display:block" width="700" height="500"
	viewBox="0 -250 700 500">
  <defs>
    <marker id="arrow" orient="auto"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         transform="matrix(-0.8,0,0,-0.8,-10,0)"
		 fill="black" stroke="black"
         marker-start="none" />
    </marker>
	<image id="symfony-svg"	xlink:href="../assets/symfony.svg" width="151" height="168"/>
  </defs>

  <g class="code" style="font-size: 16px">
	<text x="10" y="-240">
	  <tspan dy="16">POST /url?a=b HTTP/1.1</tspan>
	  <tspan x="10" dy="32">Host: www.myhost.com</tspan>
	  <tspan x="10" dy="16">Accept-Language: "fr;en"</tspan>
	  <tspan x="10" dy="16">Content-Type: application/json</tspan>
	  <tspan x="10" dy="32">{ "func": "is_prime",</tspan>
	  <tspan x="10" dy="16" xml:space="preserve">  "nums": [1,2,3,4,5,6,7,8] }</tspan>
	</text>

	<text x="10" y="236">
	  <tspan xml:space="preserve">  "primes": [2,3,5,7] }</tspan>
	  <tspan x="10" dy="-16">{ "status": "ok",</tspan>
	  <tspan x="10" dy="-32">Content-Type: application/json</tspan>
	  <tspan x="10" dy="-16">Content-Length: 40</tspan>
	  <tspan x="10" dy="-16">Set-Cookie: sessid=0A5FD2</tspan>
	  <tspan x="10" dy="-32">HTTP/1.1 200 OK</tspan>
	</text>
  </g>
  <use xlink:href="#symfony-svg" x="300" y="-80" />
  <g fill="none" stroke="black" stroke-width="1.5" marker-end="url(#arrow)">
	<path d="m 300,-185 q 70,0 70,120" />
	<path d="m 370,70 q 0,80 -70,100" />
  </g>
  
  <g class="incremental" fill="none" stroke="red" stroke-dasharray="5,3" >
	<g>
	  <text x="470" y="-230" fill="red" stroke="none">Requête :</text>
	  <path d="m 465,-235 -145,0" />
	  <rect x="1" y="-249" width="320" height="149" />
	</g>
	<g style="font-size:80%">
	  <text x="490" y="-210" fill="red" stroke="none">query string</text>
	  <path d="M 485,-215 Q 270,-210 120,-220 " />
	  <rect x="100" y="-240" width="4.1ex" height="1em" />
	</g>
	<g style="font-size:80%">
	  <text x="490" y="-190" fill="red" stroke="none">entêtes</text>
	  <rect x="5" y="-207" width="307" height="55" />
	  <path d="m 485,-195 -173,0" />
	</g>
	<g style="font-size:80%">
	  <text x="490" y="-170" fill="red" stroke="none">corps de la requête</text>
	  <rect x="5" y="-145" width="305" height="38" />
	  <path d="m 485,-175 -175,50" />
	</g>
	<g style="font-size:80%">
	  <text x="490" y="-150" fill="red" stroke="none">méthode, url, cookies, ...</text>
	</g>
	
	<g>
	  <text x="470" y="180" fill="red" stroke="none">Réponse :</text>
	  <rect x="1" y="100" width="320" height="149" />
	  <path d="m 465,175 -145,0" />
	</g>
	<g style="font-size:80%">
	  <text x="490" y="200" fill="red" stroke="none">code d'état</text>
	  <rect x="100" y="109" width="60" height="1em" />
	  <path d="m 485,195 C 260,195 485,118 160,118" />
	</g>
	<g style="font-size:80%">
	  <text x="490" y="220" fill="red" stroke="none">corps de la réponse</text>
	  <rect x="5" y="200" width="250" height="45" />
	  <path d="m 485,215 -230,0" />
	</g>
	<g style="font-size:80%">
	  <text x="490" y="240" fill="red" stroke="none">entêtes, cookies, ...</text>
	</g>
	
	<g>
	  <text x="470" y="-40" fill="red" stroke="none">Application :</text>
	  <path d="M 465,-45 420,-20" />
	  
	  <text x="490" y="-20" fill="red" stroke="none" style="font-size:80%">
	    <tspan>router</tspan>
	    <tspan x="490" dy="20">moteur de templates</tspan>
	    <tspan x="490" dy="20">sessions</tspan>
	    <tspan x="490" dy="20">interface BD</tspan>
	    <tspan x="490" dy="20">middlewares</tspan>
	    <tspan x="490" dy="20">...</tspan>
	  </text>
	</g>
  </g>
</svg>

</section>
<section class="compact">

## L'application

### Silex (PHP)

~~~
require_once 'vendor/autoload.php';
$app = new Silex\Application();

$app->get();      // Le router
$app->post();
$app->match();

$app->run();      // Exécution
~~~

### Express (Node.js)

~~~
var express = require('express');
var app = express();

app.get();        // Le router
app.post();
app.use();

app.listen(80);   // Exécution
~~~


</section>
<section class="compact">

## L'objet requête

### Silex

~~~
use Symfony\Component\HttpFoundation\Request;

$app->get('/', function(Request $req) {
	$req->query;      // Query string
	$req->request;    // corps de la requête
	$req->headers;    // entêtes HTTP
	$req->cookies;    // cookies
});
~~~

### Express

~~~
app.use(express.query()).use(express.bodyParser()); // config

app.get('/', function(req, res) {
	req.query;        // query string
	req.body;         // corps de la requête
	req.headers;      // entêtes HTTP
	req.cookies;      // cookies
});
~~~

</section>
<section class="compact">

## L'objet réponse (Silex)

~~~
use Symfony\Component\HttpFoundation\Response;
~~~

Écrire une réponse simple

~~~
return 'Hello world';
~~~

Envoyer un *code d'état* et des entêtes

~~~
return new Response(404, 'Not Found', headers);
~~~

Envoyer un fichier statique

~~~
return $app->sendFile('static-file.html');
~~~

Faire une rédirection

~~~
return $app->redirect('/other/path');
~~~

Envoyer des données au format JSON

~~~
return $app->json( array('a' => 'b') );
~~~

</section>
<section class="compact">

## L'objet réponse (Node.js)

Écrire une réponse simple

~~~
res.send('Hello world');
~~~

Envoyer un *code d'état* et des entêtes

~~~
res.setHeader('Content-Type', 'text/plain');
res.send(404, 'Not Found');
~~~

Envoyer un fichier statique

~~~
res.sendfile('static-file.html');
res.download('static-attachment.mp3');
~~~

Faire une rédirection

~~~
res.redirect('/other/path');
~~~

Envoyer des données au format JSON

~~~
res.json({ 'a' : 'b' });
~~~

</section>
<section>

## Anatomie de l'application


<svg style="margin:auto;display:block" width="700" height="450"
	viewBox="0 -225 700 450">
  <defs>
    <marker id="arrow-start" orient="auto"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         transform="matrix(0.8,0,0,0.8,10,0)"
		 fill="black" stroke="black"
         marker-start="none" />
    </marker>
  </defs>

  <use x="50" y="-140" xlink:href="#symfony-svg" />
  <g stroke="black" fill="none"  marker-end="url(#arrow)" stroke-dasharray="5,2">
    <path d="M 120,-200 120,-125" />
	<path d="M 180,-60 Q 200,-20 345,-20" />
	<g marker-start="url(#arrow-start)">
	  <path d="M 500,0 500,120" />
	  <path d="M 500,-55 500,-155" />
    </g>
	<path d="M 345,-10 Q 120,-10 120,145" />
  </g>
  <g class="code">
    <text x="0" y="-205" fill="black">GET /path/to/resource/arg1/arg2</text>
	<text x="350" y="-40">
	  <tspan style="font-weight:bold">function</tspan><tspan>($arg1, $arg2) {</tspan>
	  <tspan x="350" dy="25" xml:space="preserve">  ...</tspan>
	  <tspan x="350" dy="25">}</tspan>
	</text>
	<text x="340" y="140">
	  <tspan>&lt;h1&gt;Hello <tspan style="font-weight:bold">{{ user }}</tspan>!&lt;/h1&gt;</tspan>
	</text>
	<text x="260" y="-160">SELECT * FROM user WHERE id=$arg1;</text>
	<text x="0" y="170">
	  <tspan>HTTP/1.1 200 OK</tspan>
	  <tspan x="0" dy="40">&lt;h1&gt;Hello toto!&lt;/h1&gt;</tspan>
	</text>
  </g>
  <g fill="red" stroke="red">
    <text x="220" y="-30">Router</text>
	<text x="540" y="20">Gestionnaire</text>
    <text x="400" y="70">Template engine</text>
	<text x="440" y="-100">Database</text>
	<text x="100" y="60">Réponse</text>
  </g>
  <rect fill="none" stroke="red" stroke-width="2" x="340" y="-70" width="350" height="95" />
</svg>

</section>
<section>

## Le router

Le *router* fait l'association: **méthode+URL → code à exécuter**

~~~
$app->get('/url', function() {...});
~~~

Il peut aussi traduire une partie de l'URL en arguments de la fonction

~~~
$app->get('/url/{a1}/{a2}', function($a1, $a2) {
	...
});
~~~

En Express

~~~
app.get('/url/:a1/:a2', function(req, res) {
	console.log(req.params.a1);
});
~~~

</section>
<section>

## Séparation des *vues*

**Le problème :** considérez ce gestionnaire

~~~
$res = '<html><head><title>Bla</title><body><table>';
foreach ($array as $k => $v) {
	$res .= "<tr><td>$k</td><td>$v</td></tr>";
}
return $res . '</table></body></html>';
~~~
{:.php}

- Confusion entre **logique** et **présentation**,
- Code difficile à lire et à organiser,
- Syntaxe très lourde (répétition de la variable `$res`),
- Pas possible de colorier la syntaxe HTML dans un éditeur,
- Risques de sécurité...

Les **templates** naissent pour résoudre ces problèmes.

</section>
<section>

# Templates

</section>
<section>

## Templates

Un exemple de *template*

~~~
<!DOCTYPE html>
<html>
  <head>
    <title>Blabla</title>
  </head>
  <body>
    <h1>Bonjour {{ user }}</h1>
	
	{% include 'content.html' %}
  </body>
</html>
~~~
{:.django}

- La valeur de la variable `user` est remplacée pour `{{ user }}` ;
- Le contenu de `content.html` est inséré dans la sortie ;
- Tout le reste est renvoyé à l'identique.

</section>
<section>

## Langages de templating

Les *langanges de templating* permettent, en général, de

- Remplacer des variables (`{{ var }}`) ;
- Exécuter des tests (`{% if %}`) ;
- Boucler sur des tableaux (`{% for %}`) ;
- Inclure d'autres templates (`{% include %}`, `{% block %}`, `{% extends %}`) ;
- Chaîner des transformations (`{{ var | upper | strip }}`) ;
- Appliquer des opérateurs simples (mathématiques, logiques, comparaisons).

Quelques langages de templating

- À la [Django](https://www.djangoproject.com/) (Python) :
  [Twig](http://twig.sensiolabs.org/) (PHP),
  [Jinja](http://jinja.pocoo.org/) (Python),
  [Swig](http://paularmstrong.github.io/swig/) (Node.js).
- *Sans logique* : [Mustache](http://mustache.github.io/),
  [Handlebars](http://handlebarsjs.com/),
  [Hogan](http://twitter.github.io/hogan.js/).
- *Embedded* : [PHP](http://php.net/), [ASP](http://www.asp.net/), JSP, Eruby,
  [EJS](http://embeddedjs.com/).
- *Toute une philosphie* : [Jade](http://jade-lang.com/).

</section>
<section>

## Twig

Substitution de variables, filtres 

~~~
Hello {{ nom }}
~~~
{:.django}

Filtres

~~~
En majuscules : {{ nom | upper }}
Une liste : {{ list | join(', ') }}
~~~
{:.django}

~~~
{% filter upper %}
  {{ nom }}
{% endfilter %}
~~~
{:.django}

</section>
<section>

## Contrôle

Conditionnel

~~~
{% if nom == 'toto' %}
  ...
{% endif %}
~~~
{:.django}

Boucle

~~~
{% for i in range(0, 10) %}
  Utilisateur : {{ users[i] }}
{% endfor %}
~~~
{:.django}

~~~
{% for u in users %}
  Utilisateur : {{ u }}
{% endfor %}
~~~
{:.django}

</section>
<section>

## Modularité

Inclusion

~~~
{% include 'autre_template.html' %}
~~~
{:.django}

Macros

~~~
{% macro greet(nom) %}
  Bonjour Mr {{ nom }}
{% endmacro %}
~~~
{:.django}

~~~
{% from "macros.html" import greet %}

{{ greet('toto') }}
~~~
{:.django}

</section>
<section>

Héritage

~~~
Voici le template `main.html`
Le contenu de ces blocs est affiché tel quel

{% block titre %}
  Un titre quelconque
{% endblock %}

{% block pied %}
  Copyright Pinco Pallino
{% endblock %}
~~~
{:.django}

~~~
{% extends 'main.html' %}

Ce bloc va remplacer le bloc titre de `main.html`

{% block titre %}
  Commen hériter
{% endblock %}
~~~
{:.django}

</section>
<section class="compact">

## Utiliser Twig: `render`

dans Silex

~~~
$app->register(new Silex\Provider\TwigServiceProvider(), 
               array('twig.path' => 'templates'));

$app->get('/', function(Application $app) {
	return $app['twig']->render('hello.html', array(
		'nom' => 'Toto'
	));
});
~~~

dans Express (s'applique aussi à d'autres langages de templating)

~~~
var twig = require('twig');
app.set('views', 'templates');   // où trouver les templates
app.set('view engine', 'html');      // à quelle extension
app.engine('html', twig.__express);  // associer twig

app.get('/', function(req, res) {
	res.render('hello.html', { 'nom' : 'Toto' });
});
~~~

</section>
<section>

# Échappement

</section>
<section>

## Échappement

- La programmation web comporte le melange de plusieurs langages de
  programmation : HTML, CSS, JavaScript, PHP, templates, SQL, ...
- Chaque langange à ses caractères spéciaux. Par ex.: `<`, `>`, `&`,
  `'`, `"`

Considérez ce gestionnaire

~~~
function(Request $req) {
  return '<h1>' . $req->query->get('nom') . '</h1>';
}
~~~

Nom : <input id="replace" type="text" value="A&lt;U , Z>U"><input type="button" id="go" value="Go">

<div id="frame" style="width:80%;height:2em;margin:auto;border:solid thin #ccc;box-shadow:1px 1px 2px #aaa inset;padding: 5px"></div>

<script>
$('#go').onclick = function() {
  $('#frame').innerHTML = '<strong>' + $('#replace').value + '</strong>';
}
</script>

Les caractères `<U , Z>` sont interprétés comme la balise `<U>`.

</section>
<section>


## Échappement HTML

HTML définit des séquences d'échappement pour ses caractères spéciaux,
appelées *character entities*.

| `&lt;` | `&gt;` | `&amp;` | `&quot;` | `&apos;` |
|  `<`   |  `>`   |   `&`   |   `"`    |   `'`    |
{: #entities .centered }

<style scoped>
#entities td { padding: 0.5ex 2em }
#entities td:not(:first-child) { border-left: solid thin #aaa }
</style>

Ces remplacements sont appliqués automatiquement par

- La fonction `htmlspecialchars()` de PHP,
- La fonction `$app->escape()` de Silex,
- Twig et la majorité des autres moteurs de templates.

**ATTENTION : n'utiliser que pour du HTML !**

- JSON : remplacer `'` → `\'`, `"` → `\"`,
- JavaScript : comme JSON, mais avec beaucoup de soin !

</section>
<section>

## Échappement dans Twig

Les remplacements `{{ var }}` sont échappés par défaut.

Désactiver l'échappement :

~~~
{% autoescape false %} {{ nom }} {% endautoescape %}
{{ nom | raw }}
~~~

Réactiver l'échappement :

~~~
{% autoescape 'html' %}{{ nom }}{% endautoescape %}
{% autoescape 'css' %}{{ nom }}{% endautoescape %}
{{ nom | escape }}
{{ nom | e }}
~~~

Nom : <input id="replace-esc" type="text" value="A&lt;U , Z>U"><input type="button" id="go-esc" value="Go">

<div id="frame-esc" style="width:80%;height:2em;margin:auto;border:solid thin #ccc;box-shadow:1px 1px 2px #aaa inset;padding: 5px"></div>

<script>
function escape(unsafe) {
  return unsafe
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&apos;");
}
$('#go-esc').onclick = function() {
  $('#frame-esc').innerHTML = '<strong>' + escape($('#replace-esc').value) + '</strong>';
}
</script>

</section>
<section>

### Lectures

Silex

- La [doc officielle](http://silex.sensiolabs.org/documentation) (en anglais),
- Le
  [*Book* de Symfony](http://symfony.com/fr/doc/current/book/index.html)
  (disponible aussi
  [en anglais](http://symfony.com/doc/current/book/index.html)),
- La [référence de Symfony](http://api.symfony.com/master/) (en
  anglais),

Express

- La [référence de Node.js](http://nodejs.org/api/),
- Les [aides de NodeJitsu](http://docs.nodejitsu.com/),
- Le [guide de Express](http://expressjs.com/guide.html),
- La [référence de Express](http://expressjs.com/3x/api.html),

Twig

- La [doc officielle](http://twig.sensiolabs.org/documentation) (en anglais),
- L'[introduction pour les designers](http://twig.sensiolabs.org/doc/templates.html) (en anglais),
- Le [tutoriel de Symfony](http://symfony.com/fr/doc/current/book/templating.html) (en français).

</section>

{% endraw %}

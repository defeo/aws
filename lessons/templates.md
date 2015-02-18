---
layout: lesson
title: Langages de templates
subtitle: Twig et ses compagnons
---

{% raw %}

<section>

## Séparation des *vues*

**Le problème :** considérez ce gestionnaire (PHP)

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

## Templates

Un exemple de *template* (Twig)

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

## Twig <small>(langage de templates par défaut de Silex)</small>

**Contexte :** dictionnaire d'associations **clé → valeur** passé au
template. Par exemple :

- `nom` → `toto`
- `users` → `[titi, tutu, tata]`

### Substitution de variables, filtres 

<div class="two-cols">

~~~
Hello {{ nom }}
~~~
{:.django}

~~~
Hello toto
~~~

</div>

### Filtres

<div class="two-cols">

~~~
En majuscules : {{ nom | upper }}
Une liste : {{ users | join(', ') }}

{% filter upper %}
  {{ nom }}
{% endfilter %}
~~~
{:.django}

~~~
En majuscules : TOTO
Une liste : titi, tutu, tata


  TOTO
~~~

</div>

</section>
<section>

## Contrôle

### Conditionnel

<div class="two-cols">

~~~
{% if nom == 'toto' %}
Bonjour mon cher
{% else %}
Bonjour
{% endif %}
~~~
{:.django}

~~~
Bonjour mon cher
~~~

</div>

### Boucle

<div class="two-cols">

~~~
{% for i in range(0, 3) %}
  Utilisateur : {{ users[i] }}
{% endfor %}

{% for u in users %}
  Utilisateur : {{ u }}
{% endfor %}
~~~
{:.django}

~~~
Utilisateur: titi
Utilisateur: tutu
Utilisateur: tata

Utilisateur: titi
Utilisateur: tutu
Utilisateur: tata
~~~

</div>

</section>
<section>

## Modularité

### Inclusion

~~~
{% include 'autre_template.html' %}
~~~
{:.django}

### Macros

~~~
{% macro greet(nom) %}
  Bonjour Mr {{ nom }}
{% endmacro %}
~~~
{:.django}

<div class="two-cols">

~~~
{% from "macros.html" import greet %}

{{ greet('toto') }}
~~~
{:.django}

~~~
Bonjour Mr toto
~~~

</div>

</section>
<section>

### Héritage

<div class="two-cols">

~~~
Voici le template `main.html`
Les blocs sont affichés tels quels

{% block titre %}
  Un titre quelconque
{% endblock %}

{% block pied %}
  Copyright Pinco Pallino
{% endblock %}
~~~
{:.django}

~~~ 
Voici le template `main.html`
Les blocs sont affichés tels quels

  Un titre quelconque

  Copyright Pinco Pallino
~~~

</div>
<div class="two-cols">

~~~
{% extends 'main.html' %}

{% block titre %}
  Remplace titre
{% endblock %}
~~~
{:.django}

~~~
Voici le template `main.html`
Les blocs sont affichés tels quels

  Remplace titre

  Copyright Pinco Pallino
~~~

</div>

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
app.set('views', 'templates');       // où trouver les templates
app.set('view engine', 'html');      // à quelle extension
app.engine('html', twig.__express);  // associer twig

app.get('/', function(req, res) {
	res.render('hello.html', { 'nom' : 'Toto' });
});
~~~

</section>
<section>

## Échappement

- La programmation web comporte le melange de plusieurs langages de
  programmation : HTML, CSS, JavaScript, PHP, templates, SQL, ...
- Chaque langage a ses caractères spéciaux. Par ex.: `<`, `>`, `&`,
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
- Twig et la majorité des autres moteurs de templates,
- Des modules de Node.js, comme [escape-html](https://www.npmjs.com/package/escape-html).

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

## Lectures

- La [doc officielle de Twig](http://twig.sensiolabs.org/documentation) (en anglais),
- L'[introduction pour les designers](http://twig.sensiolabs.org/doc/templates.html) (en anglais),
- Le [tutoriel de Symfony](http://symfony.com/fr/doc/current/book/templating.html) (en français).

</section>

{% endraw %}

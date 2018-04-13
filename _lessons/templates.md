---
layout: lesson
title: Template languages
subtitle: Django and friends
excerpt: ""
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/templates.webm
    quizzes:
      - 58a4d0ff6e24fc1857e290e0
      - 58a4d0ff6e24fc1857e290ec
      - 58a4d0ff6e24fc1857e290fb
scripts: 'https://unpkg.com/nunjucks@3.0.1/browser/nunjucks.js'
---

{% raw %}

<section>

## Generating HTML

### In classic JavaScript

```js
function(req, res) {
    let user = req.session.user;
    res.send('<!Doctype html><html><head><title>Main page</title></head>'
        + '<body><h1>Hello ' + user + '</h1></body></html>');
}
```

Imagine writing this for **every** HTML page your app needs to
generate...

</section>
<section>

### Starting from JS version ES6

```js
function(req, res) {
    let user = req.session.user;
    res.send(`
<!Doctype html>
<html>
    <head>
        <title>Main page</title>
    </head>
    <body>
        <h1>Hello ${user}</h1>
    </body>
</html>
`);
}
```

More readable, useful for small snippets, but still...

</section>
<section>

## Separating *views* from logic

**The problem**

~~~js
function(req, res) {
    let body = '<html><head><title>Bla</title><body><table>';
    for (let k in v) {
        body += `<tr><td>${k}</td><td>${v[k]}</td></tr>`;
    }
    res.send(body + '</table></body></html>');
}
~~~

- Confusion between **logic** and **presentation**,
- Code hard to read and organize,
- Very heavy syntax (`body` variable repeated thrice),
- No HTML syntax highlighting in code editors,
- Security risks (injections, etc.)...

**Template languages** address these problems.

</section>
<section>

## Early template languages: PHP

~~~php
<!DOCTYPE html>
<html>
  <head>
    <title>Blabla</title>
  </head>
  <body>
    <h1>Hello <?php echo $user; ?></h1>
    
    <?php include "content.php"; ?>
  </body>
</html>
~~~

- Delimiters `<?php` ... `?>` introduce arbitrary executable PHP code,
- Everything outside of delimiters is left as is.

**Security risks:** No escaping by default, too powerful.

</section>
<section>

## Modern template languages

An example

~~~django
<!DOCTYPE html>
<html>
  <head>
    <title>Blabla</title>
  </head>
  <body>
    <h1>Hello {{ user }}</h1>
    
    {% include "content.html" %}
  </body>
</html>
~~~

- Dedicated language, distinct from platform language, less powerful:
  - The value of the `user` variable is replaced for `{{ user }}`;
  - The contents of `content.html` are injected in the output;
  - Everything else is output as is.

</section>
<section>

## Template languages

*Template languages* typically have these features:

- Replace variables (`{{ var }}`);
- Execute tests (`{% if %}`);
- Loop over lists, arrays and dictionaries (`{% for %}`);
- Include other templates (`{% include %}`, `{% block %}`, `{% extends %}`);
- Chain transformations (`{{ var | upper | strip }}`);
- Apply simple operators (mathematical, logical, comparisons).

Some template languages

- *A la* [Django](https://www.djangoproject.com/) (Python):
  [Jinja](http://jinja.pocoo.org/) (Python),
  **[Nunjucks](https://mozilla.github.io/nunjucks/) (Node.js)**,
  [Twig](http://twig.sensiolabs.org/) (PHP).
- *Logic-less*: [Mustache](http://mustache.github.io/),
  [Handlebars](http://handlebarsjs.com/),
  [Hogan](http://twitter.github.io/hogan.js/).
- *Embedded*: [PHP](http://php.net/), [ASP](http://www.asp.net/), JSP, Eruby,
  [EJS](http://embeddedjs.com/).
- *A whole other world*: [Pug](https://pugjs.org/).

</section>
<section>

## Nunjucks <small>(<https://mozilla.github.io/nunjucks/>)</small>

**Context:** a dictionary of **key → value** associations given to the
template engine. For example:

- `name` → `"toto"`
- `users` → `["titi", "tutu", "tata"]`

### Variable substitution, filters

<div class="two-cols">

~~~django
Hello {{ name }}
~~~

~~~
Hello toto
~~~

</div>

### Filtres

<div class="two-cols">

~~~django
Upper case: {{ name | upper }}
A list: {{ users | join(', ') }}

{% filter upper %}
  {{ name }}
{% endfilter %}
~~~

~~~
Upper case: TOTO
A list: titi, tutu, tata


  TOTO
~~~

</div>

</section>
<section>

## Control

### Conditionals

<div class="two-cols">

~~~django
{% if name == 'toto' %}
Hello my dear
{% else %}
Hello
{% endif %}
~~~

~~~
Hello my dear
~~~

</div>

### Loops

<div class="two-cols">

~~~django
{% for i in range(0, 3) %}
  User: {{ users[i] }}
{% endfor %}

{% for u in users %}
  User: {{ u }}
{% endfor %}
~~~

~~~
User: titi
User: tutu
User: tata

User: titi
User: tutu
User: tata
~~~

</div>

</section>
<section>

## Modularity

### Inclusion

~~~django
{% include 'other_template.html' %}
~~~

### Macros

~~~django
{% macro greet(name) %}
  Hello Mr {{ name }}
{% endmacro %}
~~~

<div class="two-cols">

~~~django
{% from "macros.html" import greet %}

{{ greet('toto') }}
~~~

~~~
Hello Mr toto
~~~

</div>

</section>
<section>

### Inheritance

<div class="two-cols">

~~~django
Here's the `main.html` template
Blocks are shown as is

{% block title %}
  A title
{% endblock %}

{% block footer %}
  Copyright Pinco Pallino
{% endblock %}
~~~

~~~ 
Here's the `main.html` template
Blocks are shown as is

  A title

  Copyright Pinco Pallino
~~~

</div>
<div class="two-cols">

~~~django
{% extends 'main.html' %}

{% block title %}
  Replaces title
{% endblock %}
~~~

~~~
Here's the `main.html` template
Blocks are shown as is

  Replaces title

  Copyright Pinco Pallino
~~~

</div>

</section>
<section>

## Using Nunjucks in Express: `res.render()`

~~~js
...
const app = express();

const nunjucks = require("nunjucks");
nunjucks.configure('views', {
    express: app,
    autoescape: true                 // automatic escaping
    noCache: false                   // cache templates from filesystem
});

app.set('views', 'templates');       // look for template files are in 
                                     // 'templates' folder

app.get('/', function(req, res) {
    res.render('hello.html', { name : 'Toto' });
});
~~~

</section>
<section>

## Escaping

- Web programming mixes many different programming languages: HTML,
  CSS, JavaScript, PHP, templates, SQL, ...
- Each language has its own special characters. E.g.: `<`, `>`, `&`,
  `'`, `"`

Take this handler:

~~~js
function(req, res) {
  res.send(`<h1>${req.query.name}</h1>`);
}
~~~

Name: <input id="replace" type="text" value="A&lt;U , Z>U"><input type="button" id="go" value="Go">

<div id="frame" style="width:80%;height:2em;margin:auto;border:solid thin #ccc;box-shadow:1px 1px 2px #aaa inset;padding: 5px"></div>

<script>
$('#go').onclick = function() {
  $('#frame').innerHTML = '<strong>' + $('#replace').value + '</strong>';
}
</script>

Characters `<U , Z>` are interpreted as the `<U>` html tag!

</section>
<section>


## HTML escaping

HTML defines escaping sequences for its special characters,
called *character entities*.

| `&lt;` | `&gt;` | `&amp;` | `&quot;` | `&apos;` |
|  `<`   |  `>`   |   `&`   |   `"`    |   `'`    |
{: #entities .centered }

<style scoped>
#entities td { padding: 0.5ex 2em }
#entities td:not(:first-child) { border-left: solid thin #aaa }
</style>

These substitutions are automatically performed by

- Nunjucks, and the majority of templating engines,
- Some dedicated Node.js modules, like
  [escape-html](https://www.npmjs.com/package/escape-html).

**WARNING: only use for HTML!**

- JSON: replace `'` → `\'`, `"` → `\"` (in practice, use
  `JSON.stringify()`, `res.json()`),
- JavaScript: like JSON, but much more carefully!

</section>
<section>

## Escaping in Nunjucks

The `{{ var }}` substitutions are escaped by default

Disabling escaping:

~~~
{{ name | safe }}
~~~

Re-activating escaping:

~~~
{{ name | escape }}
~~~

Name: <input id="replace-esc" type="text" value="A&lt;U , Z>U"><input type="button" id="go-esc" value="Go">

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

## Nunjucks in the browser

- Add Nunjucks to your HTML page with a `<script>` tag
  
  ```html
  <script src="nunjucks.js"></script>
  ```
  
- Use `nunjucks.render(template, context)` to evaluate templates
  
  ```js
  nunjucks.render('index.html', { foo: 'bar' });
  ```
  
See instructions at <https://mozilla.github.io/nunjucks/getting-started.html>

<div id="njk">
<p>Template</p><p>Context</p><p>Document</p>
<textarea id="njk-src">
&lt;h3>Hello {{ name }}&lt;/h3>

&lt;ul>
  {% for u in users %}
  &lt;li>{{ u }}&lt;/li>
  {% endfor %}
&lt;/ul>
</textarea>
<div id="njk-ctx" title="Open JavaScript console and modify `context` variable"></div>
<iframe id="njk-dst"></iframe>
</div>

<script>
var context = {
    name: 'toto',
    users: ['titi', 'tutu', 'tata'],
};
$('#njk').css({
    'padding': '0 1em',
    'display': 'grid',
    'grid-template-columns': 'repeat(3, 1fr)',
    ':scope > *': {
        'border': 'solid thin black',
        'overflow': 'auto',
        'height': '10em',
        'font-size': 'smaller',
    },
    '#njk-ctx': {
        'font-family': 'mono',
        'white-space': 'pre',
    },
    'p': {
        border: 'none',
        height: 'inherit',
        'text-align': 'center',
        'font-weight': 'bold',
    }
});
const dst = $('#njk-dst');
const ctx = $('#njk-ctx');
const src = $('#njk-src');
setInterval(
    () => {
        dst.contentDocument.body.innerHTML = nunjucks.renderString(src.value, context);
        ctx.textContent = JSON.stringify(context, null, 2);
    },
    2000);
</script>

</section>
<section>

## References

- [Installing Nunjucks](https://mozilla.github.io/nunjucks/getting-started.html),
- The [official Nunjucks docs](https://mozilla.github.io/nunjucks/templating.html).

</section>

{% endraw %}

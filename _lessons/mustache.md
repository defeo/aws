---
layout: lesson
title: Templates sans logique
subtitle: Mustache et dérivés
excerpt: ""
---

{% raw %}

<section>

## Langages sans logique

- En oppositions aux langages de templates *riches* : Django, Twig,
  Jinja, ...

- Aucun opérateur logique : `for`, `if`, `while`, variables, ...

- Deux principes fondateurs :
  
  - Les **valeurs primitives** (entiers, chaînes, ...) sont
    **remplacées** dans le template,
  
  - Les **listes** sont **itérées**.

**Exemples :** Mustache, Hogan, Handlebars, ...

</section>
<section>

## Syntaxe Mustache

- Remplacement
  
  ~~~
  Hello {{nom}} !
  ~~~

- *Section* (l'opérateur le plus important)
  
  ~~~
  Bonjour {{#connu}} {{nom}} {{/connu}},
  ~~~

- *Section* inversé

  ~~~
  {{^connu}} Présentez-vous {{/connu}}
  ~~~

- Partiels (inclusion)
  
  ~~~
  {{> autre_template}}
  ~~~
  {:.no-highlight}

- Commentaires
  
  ~~~
  {{! ceci est un commentaire }}
  ~~~

</section>
<section>

## Remplacement

Identique aux autres langages de templates

<div class="two-cols">

~~~
Hello {{nom}}!
~~~

~~~
Hello toto!
~~~

</div>

Étant donné le contexte `nom` → `"toto"`.

</section>
<section>

## Sections

- Remplacent le bloc `if`
  
  <div class="two-cols">
  
  ~~~
  Hello
  {{#test}}
    {{nom}}
  {{/test}}
  ~~~
  
  ~~~
  Hello
    toto
  ~~~
  
  </div>

- Remplacent le bloc `for`
  
  <div class="two-cols">
  
  ~~~
  Hello
  {{#liste}}
    {{nom}},
  {{/liste}}
  ~~~
  
  ~~~
  Hello
    titi
	tutu
	tata
  ~~~
  
  </div>

<div class="two-cols">

Contexte :

- `test` → `true`,
- `nom` → `"toto"`,
- `liste` → `[ nom → "titi", nom → "tutu", nom → "tata"]`.

</div>
</section>
<section>

## Sections

- Remplacent les filtres
  
  <div class="two-cols">
  
  ~~~
  {{#filtre}}
    Hello toto
  {{/filtre}}
  ~~~
  
  ~~~
    HELLO TOTO
  ~~~

  </div>

Contexte :

- `filtre` → `function(x) { return x.toUpperCase(); }`

</section>
<section>

## Sections inversées

- Remplacent le `else`
  
  <div class="two-cols">
  
  ~~~
  Hello
  {{^test}}
    {{nom}}
  {{/test}}
  ~~~
  
  ~~~
  Hello
    toto
  ~~~
  
  </div>
  
  Contexte : `test` → `false`, `nom` → `"toto"`,

## Partiels

- Importe et exécute `autre_template.mustache`,
  
  ~~~
  {{> autre_template }}
  ~~~
  {:.no-highlight}

- Inclusion dynamique, littérale, possibilité d'inclusions récursives.

</section>
<section>

## Lectures

- [Spécification officielle](https://mustache.github.io/mustache.5.html),

- [Démonstrateur en ligne](http://tryhandlebarsjs.com/),

- [Exemple de partiel récursif](https://gist.github.com/jrdmcgr/5816645),

- [Documentation de Hogan.js](http://twitter.github.io/hogan.js/) (par Twitter).

## Modules pour node.js

- <https://www.npmjs.com/package/mustache>,
- <https://www.npmjs.com/package/handlebars>,
- <https://www.npmjs.com/package/node-hogan>.

</section>

{% endraw %}

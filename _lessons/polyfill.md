---
layout: lesson
title: Presque comme JQuery
subtitle: Écrire son framework JS en <100 lignes
---

{% include defs.html %}

<section>

## Se simplifier la vie (ma *polyfill* préférée)

La fonctionnalité la plus demandée de JQuery est la navigation du DOM
(fonction `$`).

Mais :

- JQuery est gros.

- JQuery est lent

- JQuery contient plein de code pour la compatibilité avec les vieux
  browsers (pas forcément un mal)

Dans un browser moderne, on peut avoir une fonctionnalité similaire à
`$` en quelques lignes .

</section>
<section>

## Des noms courts

On utilise

- `$` pour sélectionner le premier élément qui correspond à la *query*,

- et `$$` pour les sélectionner tous.

Il suffit de créer des *alias* pour `querySelector` et
`querySelectorAll` (attention à la [portée du this](advanced-js)).

~~~
$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);
~~~

</section>
<section>

### Définis pour tout élément

On étend les mêmes *alias* à tous les éléments, pour faire des
sélections récursives.

~~~
HTMLElement.prototype.$ = HTMLElement.prototype.querySelector;
HTMLElement.prototype.$$ = HTMLElement.prototype.querySelectorAll;
~~~

### Itérer

On ajoute une façon simple d'itérer sur les listes d'éléments

~~~
Nodelist.prototype.forEach = Array.prototype.forEach;
~~~

### Exemple d'utilisation

~~~
$('table').$$('tr').foreach(function(row) {
	console.log(row);
});
~~~

</section>
<section>

## Un peu plus riche

Voici le [polyfill complet]({{ github_blob }}/js/polyfills.js) utilisé
par ces pages.

En <100 lignes, on a :

- Les alias décrits précédemment.

- Des méthodes `on` et `once`, pour attacher les évènements à la
  JQuery.

- Un remplacement pour `innerHTML` inspiré par
  [Pug](https://pugjs.org/) (voir
  [le CodePen](http://codepen.io/defeo/pen/xbYawz)).

- Une méthode pour modifier plusieurs propriétés CSS d'un coup,
  récursivement (voir
  [le CodePen](http://codepen.io/defeo/pen/ogqdLM)).


</section>

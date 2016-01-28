---
layout: lesson
title: Le DOM
subtitle: Document Object Model
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/dom.webm
    quizzes:
      - 56aa9c0c87b68f1300ba9106
---

<section>

## Document Object Model

#### Qu'est-ce que le DOM ?

- Une **API** (des objets JavaScript),
- À chaque élément d'une page HTML correspond un *objet*,
- Tous les objets héritent de `HTMLElement` (qui hérite de `Node`).
- Un document HTML valide est représenté par un **arbre** d'objets du DOM.

#### Comment JavaScript intéragit avec le document ?

- À travers les **méthodes du DOM** (ajouter, enlever des éléments,
  modifier le style, etc.),
- À travers les **gestionnaires d'évènements** (actions de la souris, du
  clavier, etc.).

</section>
<section>

## Les éléments racine

### Window

La fenêtre du browser

~~~
window.innerHeight + " x " + window.innerWidth
~~~

<script>
function size() {
    document.getElementById('size').innerHTML = window.innerHeight + " x " + window.innerWidth;
}
window.addEventListener('load', size, false);
window.addEventListener('resize', size, false);
</script>

Taille courante : **<span id='size'></span>**

### Document

Le document HTML

~~~ 
document.referrer
~~~

Vous avez navigué vers cette page de :
<script>document.write(document.referrer)</script>

</section>
<section class="compact">

<style scoped>
pre { cursor: pointer; }
</style>

## Sélectionner les éléments (browsers modernes)

`querySelector` renvoie la première balise correspondante au sélecteur CSS

~~~
document.querySelector('.start + span')
	.style.backgroundColor = 'red';
~~~
{: onclick="document.querySelector('.start + span').style.backgroundColor = 'red'"}

~~~
document.querySelector('#ilove').querySelector('span')
	.style.backgroundColor = 'blue';
~~~
{: onclick="document.querySelector('#ilove').$('span').style.backgroundColor = 'blue'"}

`querySelectorAll` renvoie la liste des balises

~~~
var nodes = document.querySelectorAll('#ilove span');
for (var i = 0 ; i < nodes.length ; i++)
	nodes[i].style.color = 'white';
~~~
{: onclick="Array.prototype.forEach.call(document.querySelectorAll('#ilove span'), function(x) {x.style.color='white'\})"}

**Exemple** (cliquez sur les exemples ci-dessus)

<h3 class="centered" id="ilove">
<span class="start">I </span><span id='L'>L</span>ove DOM
</h3>

~~~
<div id="ilove">
<span class="start">I </span><span id='L'>L</span>ove DOM
</div>
~~~

</section>
<section class="compact">

## Autres méthodes

Accès direct (pour les vieux browsers)
: `getElementById` (équivalent à `#id`),
: `getElementsByName` (équivalent à `[name=...]`),
: `getElementsByTagName` (équivalent à `tag`),
: `getElementsByClassName` (équivalent à `.class`).

Traverser l'arbre
: Fils : `children`, `firstElementChild`, `lastElementChild`, ...
: Sœurs : `nextElementSibling`, `previousElementSibling`,
: Parent : `parentElement`.

Modifier l'arbre
: Créer : `document.createElement`, `cloneNode`,
: Ajouter : `appendChild`, `insertBefore`, ...
: Supprimer : `removeChild`, ...
: Remplacer : `replaceChild`, ...

#### Agir directement sur le HTML : `.innerHTML`, `.outerHTML`

~~~
node.innerHTML += "<p>Modifier le <em>HTML</em></p>";
~~~
{:.javascript}

</section>
<section class="compact">

## Accès aux attributs

~~~
<div class="ma-classe" data-ma-donnee="1" title="hello">
~~~
{:.html}

#### Attributs quelconques : `getAttribute`, `setAttribute`

~~~
element.setAttribute('title', 'hi');
~~~

### Accès à la classe : `className`, `classList`

~~~
element.className = "classe1";
element.classList.add("classe2");
element.classList.remove("classe1");
~~~

#### Accès au style : `style`

~~~
element.style.color = 'white'
~~~

#### API dataset

~~~
element.dataset['ma-donnee'] = 2;
~~~


</section>
<section class="compact">



## Événements

**Dans le HTML**: `onload`, `onclick`, `onmouseover`, `onkeypress`, `ondrag`, ...

<div onmouseover="this.style.opacity='0.4'" onmouseout="this.style.opacity='1'">

~~~
<!-- passer la souris sur ce bloc -->
<div id="mydiv" onmouseover="this.style.opacity='0.4'"
                onmouseout="this.style.opacity='1'">
~~~

</div>

**De JavaScript**: meilleure séparation du HTML, à préférer.

~~~
document.querySelector('#mydiv').onmouseover = function(e) {
	this.style.opacity = '0.4';
};
~~~

**De JavaScript**: encore mieux, pas de conflicts avec d'autres scripts !

~~~
function fade() {
    this.style.opacity = '0.4';
}

document.querySelector('#mydiv').addEventListener('mouseover', fade);
~~~

</section>
<section class="compact">

## L'objet evenement

~~~
element.onclick = function (event) {
	console.log(event);
}
~~~

Le paramètre `event` du gestionnaire d'événements contient plusieurs
champs importants

- `currentTarget` : élément à qui le gestionnaire est associé ;
- `target` : élément qui a déclanché l'événement (peut être un fils de
  `currentTarget`) ;
- `type` : type de l'événement (souris, clavier, etc.) ;
- `which` : quelle touche a été appuyée ;
- ...

Et des méthodes

- `stopPropagation` : arrête la propagation de l'événement aux parents ;
- `preventDefault` : évite l'action par défaut associée à l'évènement
  (par ex., arrête la soumission d'un formulaire).


Voir <https://developer.mozilla.org/docs/Web/API/Event>

</section>
<section>

## Plus sur le DOM

*Eloquent JavaScript* par Marijn Haverbeke, 2nd edition
: <http://eloquentjavascript.net/>, avec exemples interactifs !

*JavaScript Éloquent* par Marijn Haverbeke, 1e édition (en français)
: <http://fr.eloquentjavascript.net/>,

Le tutoriel de W3Schools
: <http://www.w3schools.com/jsref/>.

La référence du DOM implanté par Firefox
: <https://developer.mozilla.org/docs/DOM/DOM_Reference>.

Plus de ressources, par le MDN
: <https://developer.mozilla.org/DOM>

Plus d'outils (*DOM inspectors*)
: Dans Firefox (`Shift+Ctrl+C`) et Chrome (`F12`) : **outils du développeur**.

</section>
<section>

## Frameworks client

Les *frameworks client* JavaScript sont des bibliothèques qui étendent
JavaScript dans le browser.
  
#### Pourquoi ?

- Remédier aux **incompatibilités des browsers** ;
- Simplifier **les tâches fréquentes** (par ex., utiliser
  `querySelector`, *parser* des données XML ou JSON) ;
- **Enrichir** la sémantique de JavaScript (par ex. ajouter `forEach`
  aux listes d'éléments du DOM) ;
- Améliorer **l'interface utilisateur** (par ex. animations, contrôles avancés).

Ils deviennent indispensables *en production*, lorsqu'un site doit
être largement accessible.

</section>
<section>

## JQuery

JQuery est un framework JavaScript très populaire. Il hérite de
concepts provenants de [Prototype](http://prototypejs.org/) et
[Script.aculo.us](http://script.aculo.us/).

#### Caractéristiques principales

- Compatibilité Cross-browser ;
- Sélecteurs à la `querySelector` ;
- Éléments DOM enrichis ;
- Framework AJAX ;
- Noyau très compact (seulement 31k);
- Composants UI modulaires (JQuery UI) ;
- Architecture à plug-ins.

**Documentation :** <http://docs.jquery.com/>,

**JQquery UI :**  <http://jqueryui.com/>.

</section>

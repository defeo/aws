---
layout: slideshow
title: JavaScript et le DOM
ssubtitle: 
---

<section>

## JavaScript

JavaScript est un langage de scripting *interprété*, *dynamique*,
*faiblement typé*, *basé sur les prototypes* qui supporte les styles
de programmation *à objets*, *fonctionnel* et *impératif*.

**Interprété :** le code est distribué au format source et interprété à
la volée.

**Dynamiquement typé :** les variables peuvent changer de type pendant
l'exécution.

**Faiblement typé :** des variables avec types différent peuvent être
combinées sans conversions explicites.
  
**Basé sur les prototypes :** il n'y a pas de distinction entre
classes et objets : **tout est objet**.
  
**Fonctionnel:** les fonctions sont des *objecs de première classe*.

JavaScript **n'est pas Java**. Il est bien plus proche de Python ou
Ruby.

</section>
<section>

## Hello world

### Vieux style

[Tester](javascript:alert('Hello world!')) (marche seulement dans un browser)

~~~
alert('Hello world');
~~~

### Nouveau style

[Tester](javascript:console.log('Hello world!')) (Firefox :
`Shift+Ctrl+K`, Chrome : `F12`)

~~~
console.log('Hello world!');
~~~

Marche aussi hors du browser, par ex., dans
[Node.js](http://nodejs.org/).

</section>
<section class="compact">

## La syntaxe JavaScript

~~~
if (x == 1) {
    ...
} else if (x == 2) {
    ...
} else {
    ...
}
~~~


~~~
switch (2+x) {
case 4:
    ...
	break;
case 5+1:
    ...
	break;
default:
    ...
}
~~~

</section>
<section class="compact">

~~~
for ( var i = 0 ; i < 10 ; i++ ) {
    ...
}
~~~

~~~
for ( var x in obj ) {
    ...
}
~~~

~~~
while (condition) {
    ...
}
~~~


~~~
do {
    ...
} while (condition);
~~~

</section>
<section class="compact">

~~~
try {
    ...
} catch (e) {
    if (e instanceof SyntaxError) {
        ...
    } else {
        ...
    }
} finally {
    ...
}
~~~

Note : il n'y a pas encore de standard pour capturer des exceptions
d'un type spécifique.

</section>
<section>

## Variables

#### Les variables doivent être déclarées !

~~~
var a = 0;
a += 1;
~~~

Les variables non déclarées ont **portée globale**.

~~~
function setA() { a = 1; }
setA();
console.log(a);  // affiche 1
~~~

À utiliser avec parcimonie.

#### Les variables sont typées dynamiquement

~~~
var a = 1;
a = 'quelque chose';
~~~

</section>
<section>

## Constantes

**Constantes prédéfinies** : `undefined`, `NaN`, `Infinity`.

#### Utilisation de `undefined`

~~~
function bon(x, y) {
	// teste si l'utilisateur a passé
	// une valeur pour y 
	if (undefined === y)
		...
}
~~~


~~~
function mauvais(x, y) {
	if (undefined == y)
		// s'exécute même si y vaut 0 ou ''
		...
}
~~~


</section>
<section>

## Quelques opérateurs

**Comparaison faible**

~~~
var x = 2;
x == '2';     // true
~~~

**Comparison forte** 

~~~
var x = 2;
x === '2';    // false
~~~

**Existence d'attribut** (teste si une propriété est définie dans un
object)

~~~
if ('property' in obj) ...;
if ('key' in myarray) ...;     // moins utile
~~~

</section>
<section>

## Tableaux

#### Allocation dynamique

~~~
var myarray = ['un', 'deux', 'trois'];
myarray[5] = 'cinq';
myarray.length;                        // donne 6
~~~

#### Tableaux associatifs

~~~
var myarray = []
myarray['six'] = 6;
~~~


#### Méthodes prédéfinies

(seulement pour un tableau non associatif)

~~~
// donne is 'un+deux+trois'
['un', 'deux', 'trois'].join('+')
~~~

</section>
<section>

## Fonctions

#### Syntaxe simple

(les arguments n'ont pas besoin du mot clef `var`)

~~~
function incr(a) {
    return a+1;
}
~~~

#### Les fonctions sont des objets de première classe

~~~
function apply(f, x) {
    return f(x);
}

apply(incr, 4);          // donne 5
~~~

</section>
<section>

#### Fonctions anonymes

~~~
myFun = function () {
    ...
}
~~~

### Fonctions imbriquées (et fermetures)

~~~
function counter() {
    var c = 0;
    return function(step) {
        return c += step;
    }
}

var cnt = counter();
[cnt(1), cnt(2), cnt(1)]      // donne [1, 3, 4]
~~~

Voir <http://bonsaiden.github.com/JavaScript-Garden/#function>.

</section>
<section>

## Fonctions *variadiques*

#### Omettre des arguments

~~~
function maybe(x, y) {
    if (undefined === y) 
        return x;
    else
        return x+y;
}

maybe(1);          // donne 1
maybe(1, 2);       // donne 3
~~~

</section>
<section>

#### Donner plus d'arguments

~~~
function prepend(x) {
    var res = []
    for (var a in arguments)
        res.push(x + arguments[a]);
    
    return res
}

// donne ['pre-a', 'pre-bbb', 'pre-c']
prepend('pre-', 'a', 'bbb', 'c');
~~~

</section>
<section class="compact">

## Objets

### Objets anonymes

(similaires aux tableaux associatifs)

~~~
var myObj = {
    car: "Peugeot",
    color: "blue"
};

'car' in myObj;              // true
myObj.car == "Peugeot";      // true
myObj['car'] == "Peugeot";   // true

var prop = 'car';
myObj[prop] == "Peugeot";    // true
~~~
{:.javascript}

Les contenus d'un objet peuvent **changer dynamiquement**

~~~
var myObj = {};
myObj.car = "Renault";
~~~

</section>
<section class="compact">

## Méthodes

~~~
var myObj = {
  jour: "5",
  mois: "Janvier",
  annee: "2012",
   
  anglais: enDate,
  
  francais: function() {
    return this.jour  + " " + this.mois + " " + this.annee;
  }
}

function enDate() {
  return this.mois + " "  + this.jour  + ", " + this.annee;
}

myObj.custom = function() {
  return this.annee  + "-" + this.mois + "-" + this.jour;
}
~~~

</section>
<section class="compact">

## Portée de `this` (avancé)

Dans une méthode `this` se réfère à l'objet courant

~~~
var myobj = {
	mymethod: function(a, b) {
		console.log(this, a, b);
	}
}
myobj.mymethod(1, 2)             // affiche myobj, 1, 2
~~~

pour une fonction, il se réfère à l'*objet global* (`Window` dans un
browser)

~~~
var myfunc = myobj.mymethod
myfunc(1, 2)                     // affiche window, 1, 2
~~~

`this` peut être *lié* (*bound* en anglais)

~~~
// affichent tous myobj, 1, 2
var myfunc2 = myfunc.bind(myobj);  myfunc2(1, 2);
myfunc.call(myobj, 1, 2);
myfunc.apply(myobj, [1, 2]);
~~~
{:.javascript}

Voir <http://bonsaiden.github.io/JavaScript-Garden/#function.this>.

</section>
<section>

## Constructeurs

Les constructeurs sont des simples fonctions

~~~
function Car(model, color, year) {
    this.model = model;
    this.color = color;
    this.year = year;
    
    this.revision = function() {
        return this.year + 5;
    }
}

var mycar = new Car("Peugeot", "blue", 2010);


// donne 2015
mycar.revision();
~~~

</section>
<section class="compact">

## Prototypes (avancé)

Les prototypes remplacent l'héritage

~~~
function A() { this.one = 1; }

function B() { this.two = 2; }
B.prototype = new A();

var C = new B();
C.one;                         // donne 1
C.two;                         // donne 2
~~~

Les prototypes enrichissent les objets

~~~
var foo = "bar";
foo.methodeBete;                    // undefined

String.prototype.methodeBete = function() {
	return "bête";
}
foo.methodeBete();                  // donne "bête"
~~~

</section>
<section>

## Objets prédéfinis

`String`, `Array`, `Boolean`, `Number`, `Date`: les noms disent tout

`Math`: Fonctions mathématiques (exp, log, etc.)

~~~
Math.PI;         // la constante pi
Math.sqrt(16);   // donne 4
~~~

`RegExp`: expressions régulières (syntaxe à la Perl)

~~~
var pattern = RegExp("sub", "i");

// pareil que la ligne du dessus
pattern = /sub/i;

// donne true
pattern.test("Substring")
~~~

</section>
<section>

## Lectures

*JavaScript Éloquent* par Marijn Haverbeke
: <http://fr.eloquentjavascript.net/>,

Le guide du MDN
: <https://developer.mozilla.org/docs/JavaScript/Guide>,

Les tutoriels de W3Schools
: <http://www.w3schools.com/js/>,

Plus de références dans la [page du cours](..).

</section>
<section>

# Le DOM

</section>
<section>

## Document Object Model

#### Qu'est-ce que le DOM ?

- Une **API** (des objets JavaScript),
- À chaque élément d'une page HTML correspond une *classe*,
- Toutes les classes héritent de `HTMLElement` (qui hérite de `Node`).
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

La fenêtre du browser (pas un objet du DOM, à proprement parler)

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
: Fils : `childNodes`, `firstChild`, `lastChild`, ...
: Sœurs : `nextSibling`, `previousSibling`,
: Parent : `parentNode`.

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

**De JavaScript**: meilleur séparation du HTML, à préférer.

~~~
document.querySelector('#mydiv').onmouseover =
    function(e) { this.style.opacity = '0.4'; };
~~~

**De JavaScript**: encore mieux, pas de conflicts avec d'autres scripts !

~~~
function fade() {
    this.style.opacity = '0.4';
}

document.querySelector('#mydiv')
	.addEventListener('mouseover', fade, false);
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

### Plus de lecture

Le tutoriel de W3Schools
: <http://www.w3schools.com/jsref/>.

La référence du DOM implanté par Firefox
: <https://developer.mozilla.org/docs/DOM/DOM_Reference>.

Plus de ressources, par le MDN
: <https://developer.mozilla.org/DOM>

### En pratique

- Utilisez [JQuery](http://jquery.com) pour la production.

### Plus d'outils (*DOM inspectors*)

- Dans Firefox (`Shift+Ctrl+C`) et Chrome (`F12`) : **dev tools**.

</section>
<section class="compact">

## Se simplifier la vie (ma *polyfill* préférée)

Des noms courts : `$` et `$$`

~~~
$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);
~~~

Définis pour tout élément

~~~
HTMLElement.prototype.$ =
	HTMLElement.prototype.querySelector;
HTMLElement.prototype.$$ =
	HTMLElement.prototype.querySelectorAll;
~~~

Et une façon simple d'itérer sur les listes d'éléments

~~~
Nodelist.prototype.forEach = Array.prototype.forEach;
~~~

Exemple d'utilisation

~~~
$('table').$$('tr').foreach(function(row) {
	console.log(row);
});
~~~

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


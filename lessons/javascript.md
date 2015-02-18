---
layout: lesson
title: JavaScript
subtitle: Le langage
video:
  url: https://www.dropbox.com/s/oliqr1d9de3wz6m/javascript.webm?dl=1
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
  
**Fonctionnel:** les fonctions sont des *objets de première classe*.

JavaScript **n'est pas Java**. Il est bien plus proche de Python ou
Ruby.

### Versions (Standard ECMAScript)

- **ECMA 5.1 (JavaScript 1.8.x)** – Implanté par la majorité des browsers.
- **ECMA 6 (ES6, JavaScript ?)** – La future version, voir la 
  [table de compatibilité](http://kangax.github.io/compat-table/es6/).


</section>
<section>

## Hello world

### Vieux style

[Tester](javascript:alert('Hello world!')) (marche seulement dans un browser)

~~~
alert('Hello world!');
~~~

**À éviter**, partout !

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

### Conditionnels

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

### Boucles

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

Nouveau en ES6 (différent de `for ... in`)

~~~
for ( var x of array ) {
	...
}
~~~

</section>
<section>

### Exceptions

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

### Les variables doivent être déclarées !

~~~
var a = 0;
a += 1;
~~~

- Les variables sont typées dynamiquement
  
  ~~~
  var a = 1;
  a = 'quelque chose';
  ~~~

- Les variables **non déclarées** ont **portée globale**.
  
  ~~~
  function setA() { a = 1; }
  setA();
  console.log(a);  // affiche 1
  ~~~
  
  Ceci va disparaître dans les futures version de JavaScript.

- ES6 remplace `var` par `let`, et la **portée locale aux fonctions** (à la Python)
  par la **portée locale aux blocs** (à la C/Java)

</section>
<section>

## Constantes

**Constantes prédéfinies** : `undefined`, `NaN`, `Infinity`.

**Déclaration de constantes** (nouveau dans ES6) : `const`

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
~~~

</section>
<section>

## Tableaux

### Allocation dynamique

~~~
var myarray = ['un', 'deux', 'trois'];
myarray[5] = 'cinq';
myarray.length;                        // donne 6
~~~

### Méthodes prédéfinies

~~~
// donne 'un+deux+trois'
['un', 'deux', 'trois'].join('+')
~~~

~~~
// donne -1
['un', 'deux', 'trois'].indexOf('quatre')
~~~

Autres méthodes :

- Itérateurs fonctionnels : `map`, `filter`, `reduce`, `every`, `some`, `forEach`, ...
- ES6 : `from`, `of`, `find`, `fill`, ...

</section>
<section>

## Fonctions

### Syntaxe simple

(les arguments n'ont pas besoin du mot clef `var`/`let`)

~~~
function incr(a) {
    return a+1;
}
~~~

### Les fonctions sont des objets de première classe

~~~
function apply(f, x) {
    return f(x);
}

apply(incr, 4);          // donne 5
~~~

</section>
<section class="compact">

### Fonctions anonymes

~~~
myFun = function () {
    ...
}
~~~

### Fonctions imbriquées (et clôture)

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

### Flèches <small>(nouveau en ES6)</small>

~~~
var f = (a, b) => a + b;    // équivalent à function f(a,b) { return a+b; }

[1, 2, 3].map( (x) => {
	var tmp = x;
	return tmp + 2;
});                         // donne [3, 4, 5]
~~~
{:.javascript}

</section>
<section class="compact">

## Fonctions *variadiques*

### Omettre des arguments

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

### Arguments par défaut <small>(nouveau en ES6)</small>

~~~
function val(x=0) {
	return x;
}

val();               // donne 0
val(1);              // donne 1
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

**Nouveau :** ES6 introduit les [**classes**](advanced-js) !

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

*Eloquent JavaScript* par Marijn Haverbeke, 2nd edition
: <http://eloquentjavascript.net/>, avec exemples interactifs !


*JavaScript Éloquent* par Marijn Haverbeke, 1e édition (en français)
: <http://fr.eloquentjavascript.net/>,

Le guide du MDN
: <https://developer.mozilla.org/docs/JavaScript/Guide>,

Les tutoriels de W3Schools
: <http://www.w3schools.com/js/>,

Plus de références dans la [page du cours](..).

</section>

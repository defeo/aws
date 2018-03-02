---
layout: lesson
title: JavaScript Avancé
subtitle: Sujets sélectionnés
---

<section class="compact">

## Portée de `this`

Dans une méthode `this` se réfère à l'objet courant

<div class="two-cols">

~~~js
var myobj = {
  mymethod: function(a, b) {
    console.log(this, a, b);
  }
}
myobj.mymethod(1, 2)
~~~

~~~
Object { mymethod: myobj.mymethod() } 1 2
~~~

</div>

pour une fonction, il se réfère à l'*objet global* (`Window` dans un
browser)

<div class="two-cols">

~~~js
var myfunc = myobj.mymethod
myfunc(1, 2)
~~~

~~~
Window → http://defeo.lu/aws/lessons/advanced-js 1 2
~~~

</div>

`this` peut être *lié* (*bound* en anglais)

<div class="two-cols">

~~~js
var myfunc2 = myfunc.bind(myobj);
myfunc2(1, 2);
myfunc.call(myobj, 1, 2);
myfunc.apply(myobj, [1, 2]);
~~~

~~~
Object { mymethod: myobj.mymethod() } 1 2
Object { mymethod: myobj.mymethod() } 1 2
Object { mymethod: myobj.mymethod() } 1 2
~~~

</div>

Voir <http://bonsaiden.github.io/JavaScript-Garden/#function.this>.

</section>
<section class="compact">

## Fermeture autour de `this`

Chaque fonction définit un nouveau `this`. Ceci est problèmatique avec
les fonctions anonymes.

<div class="two-cols">

~~~js
function Personne() {
  this.age = 0;
  // Viellit toutes les secondes 
  setInterval(function() { this.age += 1; }, 1000)
}
p = new Personne();
setInterval(function () { console.log(p); }, 1000)
~~~

~~~
Object { age: 0 }
Object { age: 0 }
Object { age: 0 }
~~~

</div>

**Solution :** sauvegarder `this` dans une variable locale.

<div class="two-cols">

~~~js
function Personne() {
  var self = this;
  self.age = 0;
  setInterval(function() { self.age++; }, 1000);
}
setInterval(function () { console.log(p); }, 1000)
~~~

~~~
Object { age: 1 }
Object { age: 2 }
Object { age: 3 }
~~~

</div>

</section>
<section>

## `this` en ES6

Les *fonctions flêche* de ES6 changent de sémantique, pour s'adpter à
cet usage.

<div class="two-cols">

~~~js
function Personne() {
  this.age = 0;
  // Viellit toutes les secondes 
  setInterval(() => {
    this.age += 1;
  }, 1000)
}
p = new Personne();
setInterval(function () { console.log(p); }, 1000)
~~~

~~~
Object { age: 1 }
Object { age: 2 }
Object { age: 3 }
~~~

</div>

La *fonction anonyme flêche* est *fermée* autour du `this` de la
portée englobante.

Voir aussi
[la page MDN sur le sujet](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions).

</section>
<section class="compact">

## Prototypes

Les prototypes remplacent l'héritage

~~~js
function A() { this.one = 1; }

function B() { this.two = 2; }
B.prototype = new A();

var C = new B();
C.one;                         // donne 1
C.two;                         // donne 2
~~~

Les prototypes enrichissent les objets

~~~js
var foo = "bar";
foo.methodeBete;                    // undefined

String.prototype.methodeBete = function() {
        return "bête";
}
foo.methodeBete();                  // donne "bête"
~~~

</section>

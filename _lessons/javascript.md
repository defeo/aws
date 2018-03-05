---
layout: lesson
title: JavaScript
subtitle: The language
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/javascript.webm
    quizzes:
      - 58900075ba7ec5013560f7c1
---

<section class="compact">

## JavaScript ([ECMA-262](https://en.wikipedia.org/wiki/ECMAScript))

JavaScript is a *scripting* language, *interpreted*, *dynamic*,
*weakly typed*,  
supporting *object-oriented*, *functional* and *imperative*
programming styles.

**Interpreted:** code is distributed in source format, and interpreted
on the fly.

**Dynamically typed:** variables can change type during execution.

**Weakly typed:** variables with different types can be *combined*
without explicit conversions.

**Object-oriented:** *everything is an object* in JavaScript.
  
**Functional:** functions are *first class objects*.

JavaScript **is not Java**. It is much closer to Python or Ruby.

| 1996 | **JavaScript 1.0** | First version introduced by Netscape.
| 1997 | **ECMA 1 (JavaScript 1.3)** | First standardized version.
| ...
| 2011 | **ECMA 5.1 (JavaScript 1.8.x)** | Implemented by most browsers.
| 2015 | **ECMA 6 (ES2015)** | Adds classes, `for ... of`, arrow functions, promises, ...
| ... | **ECMA 7,8,... (ES2016, ES2017, ...)** | Yearly revisions. See the [compatibility table](https://kangax.github.io/compat-table/es6/).
{:.pretty.compact style="margin:auto"}


</section>
<section>

## Hello world

### Old style

[Test it!](javascript:alert('Hello world!')) (only works in a browser)

~~~js
alert('Hello world!');
~~~

**Avoid it**, any time!

### Modern style

[Test it!](javascript:console.log('Hello world!')) (Firefox:
`Shift+Ctrl+K`, Chrome: `F12`)

~~~js
console.log('Hello world!');
~~~

Also works outside a browser, e.g., in [Node.js](https://nodejs.org/).

</section>
<section class="compact">

## JavaScript syntax

### Types

<div class="two-cols">

Numbers

```js
0, 1, -1, 1.32, 1e10, 0x3E, NaN, Infinity
```

Strings

```js
"Hello world"
'Hello world'
`Hello world`
```

Booleans

```js
true
false
```

Other constants

```js
undefined
null
```

Objects

```js
{ a: 1, 
  b: "hello", 
  c: { a: 1 } }
```

Arrays

```js
[ 1, 2,
  [ "a", "b" ] ]
```

</div>

</section>
<section>

### Variables

Always declare your variables

~~~js
let a = 0;
a += 1;
~~~

- Variables are dynamically typed
  
  ~~~js
  let a = 1;
  a = 'something';
  ~~~

- Scope is **local to the block**
  
  ```js
  let a = 1;
  if (true) {
      let a = 2;
      console.log(a);   // prints 2
  }
  console.log(a);       // prints 1
  ```

</section>
<section>

### Other types of variables

#### Alternative *old-style* syntax (scope *local to the function*)

```js
var a = 1;
if (true) {
    var a = 2;        // this is useless
    console.log(a);   // prints 2
}
console.log(a);       // prints 2
```

#### Constants

<div class="two-cols">

```js
const b = 1;
const b = 2;
```

```
TypeError: invalid assignment to const `b'
```

```js
const b = [1, 2];
b[2] = 10;
console.log(b);
```

```
Array [ 1, 2, 10 ]
```

</div>


</section>
<section>

### Conditionals

~~~js
if (x == 1) {
    ...
} else if (x == 2) {
    ...
} else {
    ...
}
~~~


~~~js
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

### Loops

<div class="two-cols">

~~~js
for ( let i = 0 ; i < 3 ; i++ ) {
    console.log(i);
}
~~~

```
0
1
2
```

~~~js
let obj = { a: 1, b: "hello" };
for ( let x in obj ) {
    console.log(x, obj[x]);
}
~~~

```
a 1
b hello
```

~~~js
let array = ["a", "b", "c"];
for ( let x of array ) {     // New in ES6
    console.log(x);
}
~~~

```
a
b
c
```

~~~js
while (true) {
    console.log("hello");
}
~~~

```
hello
hello
...
```

~~~js
do {
    console.log("hello");
} while (true);
~~~

```
hello
hello
...
```

</div>

</section>
<section>

### Exceptions

~~~js
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

**Note:** contrary to other languages (e.g., Python), it is not
allowed to have more than one `catch` clause.

</section>
<section>

## Some operators

**Weak comparison**

~~~js
let x = 2;
x == '2';     // true
~~~

**Strong comparison** 

~~~js
let x = 2;
x === '2';    // false
~~~

**Property existence** (tests si une propriété est définie dans un
object)

~~~js
let obj = { a: 1, b: 'hello' };
'a' in obj;                      // true
'hello' in obj;                  // false
~~~

**Arithmetic:** `+`, `-`, `*`, `/`, ...

**Boolean:** `<`, `>`, `<=`, `>=`, `!`, `&&`, `||`, `^`, ...

**String concatenation:** `+`

</section>
<section>

## Strings

Single `'` and double `"` quote are **equivalent**.

```js
"Hello world"
'Hello world'
```

### Backquotes `` ` ``  <small>(new in ES6)</small>
    
- Newlines **allowed** in backquotes:
  
  ```js
  `Hello
   world`
  ```
  
- **Template strings**
  
  <div class="two-cols">
  
  ```js
  let x = "brave new";
  `Hello ${x} world`;
  ```
  
  ```
  Hello brave new world
  ```
  
  </div>

</section>
<section>

## Arrays

### Dynamic allocation

~~~js
let myarray = ['one', 'two', 'three'];
myarray[5] = 'five';
myarray.length;                        // gives 6
~~~

### Common methods

<div class="two-cols">

~~~js
['one', 'two', 'three'].join('+')
~~~

```
one+two+three
```

~~~js
['one', 'two', 'three'].indexOf('four')
~~~

```
-1
```

</div>

Other methods

- Functional iterators: `map`, `filter`, `reduce`, `every`, `some`, `forEach`, ...
- New in ES6: `from`, `of`, `find`, `fill`, ...

</section>
<section>

## Functions

### Simple syntax

(Do not use `var`/`let` with function arguments)

~~~js
function incr(a) {
    return a+1;
}
~~~

### Functions are *first-class objects*

~~~js
function apply(f, x) {
    return f(x);
}

apply(incr, 4);          // gives 5
~~~

</section>
<section class="compact">

### Anonymous functions

~~~js
let myFun = function (a, b) {
    ...
}
~~~

New in ES6:

```js
let myOtherFun = (a, b) => {   // New in ES6
    ...
}
```

### More on *arrow functions*

Shorter version:

```js
let f = (a, b) => a + b;
```

Is equivalent to:

```js
let f = (a, b) => {
    return a + b;
}
```

Arrow functions have [slightly different
semantics](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#Description)
when used inside classes.

</section>
<section class="compact">

### *Variadic* functions

#### Omit arguments

~~~js
function maybe(x, y) {
    if (undefined === y) 
        return x;
    else
        return x+y;
}

maybe(1);          // gives 1
maybe(1, 2);       // gives 3
~~~

#### Default arguments <small>(new in ES6)</small>

~~~js
function val(x=0) {
    return x;
}

val();               // gives 0
val(1);              // gives 1
~~~

</section>
<section>

### Nested functions (and closures)

~~~js
function counter() {
    let c = 0;
    return function(step) {
        return c += step;
    }
}

let cnt = counter();
[cnt(1), cnt(2), cnt(1)]      // gives [1, 3, 4]
~~~

The anonymous function is *closed around* the *outer variable* `c`:

- `c` acts *like a global* variable for the anonymous function,
- `c` is *local* to `counter`.

</section>
<section class="compact">

## Objects

### *Anonymous* objects

(similar to Python *dicts*, *associative arrays*, ...)

~~~js
let myObj = {
    car: "Peugeot",
    color: "blue"
};

'car' in myObj;              // true
myObj.car == "Peugeot";      // true
myObj['car'] == "Peugeot";   // true

let prop = 'car';
myObj[prop] == "Peugeot";    // true
~~~

An object contents can **change dynamically**

~~~js
let myObj = {};
myObj.car = "Renault";
~~~

</section>
<section>

### Classes <small>(new in ES6)</small>

~~~js
class Car {
    constructor(speed) {
        this.speed = speed;
    }
    vroom() {
        console.log('VR' + 'O'.repeat(this.speed) + 'M!');
    }
}
class Ferrari extends Car {
    constructor() {
        super(20);
    }
}

v = new Ferrari();
v.vroom();
~~~

~~~
VROOOOOOOOOOOOOOOOOOOOM!
~~~

</section>
<section>

### More on classes

- Classes are just *functions producing objects*;

  <div class="two-cols">
  
  ```js
  class A{}
  typeof(A)
  typeof(new A())
  new A() instanceof A
  ```
  
  ```js
  
  "function"
  "object"
  true
  ```
  
  </div>

- Only *single inheritance* allowed.

- Learn more [on
  MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).

</section>
<section>

## Some predefined classes

`String`, `Array`, `Boolean`, `Number`, `Date`: name says everything

`Math`: Mathematical functions (exp, log, etc.)

~~~js
Math.PI;         // the pi constant
Math.sqrt(16);   // gives 4
~~~

`RegExp`: regular expressions (Perl-like syntax)

~~~js
let pattern = new RegExp("sub", "i");

// same as the previous line
pattern = /sub/i;

// gives true
pattern.test("Substring");
~~~

</section>
<section>

## References

*Eloquent JavaScript* by Marijn Haverbeke
: <https://eloquentjavascript.net/>, with interactive examples!


*JavaScript Éloquent* by Marijn Haverbeke, 1st edition (in French)
: <http://fr.eloquentjavascript.net/>,

MDN guide on JavaScript
: <https://developer.mozilla.org/docs/JavaScript/Guide>,

W3Schools tutorials
: <https://www.w3schools.com/js/>,

More references in the [course main page](..).

</section>

---
layout: lesson
title: JSON
subtitle: Data formats and AJAX
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/json.webm
    quizzes:
      - 58a4d0ff6e24fc1857e2913e
---

<section>

## AJAX and data formats

AJAX stands for *"Asynchronous JavaScript and XML"*.

But every component is optional, XML above all!

Depending on the application, one of the following data formats may be
preferred:

- **No data:** HTTP headers are enough;
- **Simple text**;
- **HTML** excerpts;
- **JavaScript**, **CSS**, ...;
- **JSON**, other *lightweight* formats (YAML, ...);
- **XML**, other structured formats (XHTML, ...);
- **Binairy** data, Base64 encoded data, ...;
- ...

Use the `Content-Type` HTTP header to declare the format.

</section>
<section>

## Text or nothing

<div class="two-cols">

For simple actions, such as

- Auto-saves (mails, documents, etc.),
- Progress.

</div>

```http
POST /api/savemail HTTP/1.1
Host: webmail.example.com
...

Dear Sir,

I am wrting to y
```


```http
HTTP/1.1 200 OK
Content-Type: text/plain
...

39
```

</section>
<section>

## HTML

For direct inclusion of HTML fragments (e.g., blog posts, comments,
...)

```http
GET /api/post/23389 HTTP/1.1
Host: blog.example.com
...
```

```http
HTTP/1.1 200 OK
Content-Type: text/html
...

<article class='post' id='post23389'><p>I've always believed...
```

Example: attaching to the DOM

```js
xhr.onload = function() {
    $('#main').innerHTML = xhr.responseText;
});
```

**Problem:** Violates separation betwen **data**, **presentation** and
**logic**.

</section>
<section class="compact">

## XML

For rich, structured data (e.g., DB requests, geodata, ...)

```
GET /v1/public/yql?q=SELECT * FROM geo.places WHERE text="Paris" HTTP/1.1
Host: query.yahooapis.com
...
```

(the request has been slightly modified to ease reading)

```http
HTTP/1.1 200 OK
Content-Type: application/xml
...

<?xml version="1.0" encoding="UTF-8"?>
<query xmlns:yahoo="http://www.yahooapis.com/v1/base.rng" yahoo:count="10" yahoo:created="2015-03-17T22:05:40Z" yahoo:lang="en-US">
    <results>
        <place xmlns="http://where.yahooapis.com/v1/schema.rng" xml:lang="en-US" yahoo:uri="http://where.yahooapis.com/v1/place/615702">
            <woeid>615702</woeid>
            <placeTypeName code="7">Town</placeTypeName>
            <name>Paris</name>
            ...
```

</section>
<section>

## XML

### Evaluation, manipulation

- **XPath**: *Query language* for selecting nodes in a XML tree;
- **XSLT** (Extensible Stylesheet Language Transformations): XML
  document transformations.
    
### Advantages / Disadvantages

- Powerful, robust;
- Verbose, relatively slow;
- Few complete implementations;
- Huge specification, with security risks.

</section>
<section>

## JavaScript

```http
GET /api/car?user=toto HTTP/1.1
Host: www.example.com
...
```

```http
HTTP/1.1 200 OK
Content-Type: application/javascript
...

{ car : 'peugeot', color : 'blue' }
```

Example: attaching to the DOM

```js
xhr.onload = function() {
  var res = eval(xhr.responseText);
}
```

<div class="two-cols">

### Serious problems

- Violates separation from logic;
- Huge [XSS](xss) risk!

</div>
</section>
<section>

## JSON (JavaScript Object Notation)

JSON is a *lightweight* data representation language, based on
JavaScript.

```http
GET /api/car?user=toto HTTP/1.1
Host: www.example.com
...
```

```http
HTTP/1.1 200 OK
Content-Type: application/json
...

{ "car" : "peugeot", "color" : "blue" }
```

<div class="two-cols">

### Pros / Cons

- More compact than XML, easy and fast to evaluate;
- Less powerful than XML;
- Supported by all modern browsers;
- No security risks...
- ...unless you evaluate it with `eval()`, of course.

</div>
</section>
<section>

## JSON

- Crated in 2000 by Douglas Crockford: <https://json.org/>.
- Subset of JavaScript: valid JSON code → valid JavaScript
  code
  ([almost](http://timelessrepo.com/json-isnt-a-javascript-subset)).
- Very popular in REST APIs.
- Some JSON API examples:
  [Google](https://developers.google.com/apis-explorer/),
  [Yahoo](https://developer.yahoo.com/yql/),
  [Facebook](https://developers.facebook.com),
  [OpenStreetMap](https://wiki.openstreetmap.org/wiki/API),
  [Wikipedia](https://www.mediawiki.org/wiki/API:Main_page),
  [StackOverflow](https://api.stackexchange.com/),
  [GitHub](https://developer.github.com/v3/),
  [Ville de Paris](https://opendata.paris.fr/),
  [Vélib](https://developer.jcdecaux.com/#/home),
  [WordPress](http://v2.wp-api.org/), ...

### Data types

- Numbers: `10`, `10.3`, `10.0003e-10`,
- Strings: `"abcdef"`,
- Booleans: `true`, `false`,
- `null`,
- Lists: `[ 1, 2, "abcdef", true ]`,
- Objects: `{ "key" : "value", "other_key" : 1, "one_more" : null }`.

</section>
<section>

## JSON example

```js
{
  "cars" :
  [
    { "model"       : "peugeot",
      "color"       : "blue",
      "plate"       : 2008,
      "inspections" : [ 2012, 2014 ]
    },
    { "model"       : "citroën",
      "color"       : "white",
      "plate"       : 1999,
      "inspections" : [ 2003, 2005, 2007, 2009, 2011, 2013 ]
    }
  ],
  "date" : "2015-03-18"
}
```

</section>
<section>

## JavaScript ⊄ JSON

```js
{ "car"   : "peugeot",
  "gears" : [1, 2, 3, 10] }
```

Some equivalent JavaScript code that is invalid JSON:

```js
{ 'car'   : 'peugeot',
  'gears' : [1, 2, 3, 10] }
```

```js
{ car   : "peugeot",
  gears : [1, 2, 3, 10] }
```

```js
{ "car"   : "peugeot",
  "gears" : [1, 2, 3, 10, ], }
```

```js
{ "car"   : "peugeot",
  "gears" : [0x1, 0x2, 0x3, 0xA] }
```

</section>
<section>

## Using JSON

**Express:** Transform a JavaScript object in JSON response

```js
res.json({ car: "peugeot",
           gears: [1, 2, 3, 10] });
```

**Browser/Node.js:** Transform JSON ↔ JavaScript object

<div class="two-cols">

```js
var a = JSON.stringify({ a: "b",
                         c: [1, 2] });
console.log(a);
console.log(JSON.parse(a));
```

```
{"a":"b","c":[1,2]}
Object { a: "b", c: [1, 2] }
```

</div>

**AJAX:** automatic interpretation of JSON responses

<div class="two-cols">

```js
xhr.responseType = 'json';
xhr.onload = function() {
  console.log(xhr.response);
}
```

```
Object { car: "peugeot",
         gears : [1, 2, 3, 10] }
```

</div>
</section>
<section>

## References

- Eloquent JavaScript, Chapters
  [5](http://eloquentjavascript.net/05_higher_order.html) and
  [17](http://eloquentjavascript.net/17_http.html),
- JSON definition: <https://www.json.org/>,
- [MDN guides to JSON](https://developer.mozilla.org/docs/JSON),
- [Express reference](http://expressjs.com/4x/api.html#res.json),

### Some JSON API consoles for testing

- Google: <https://developers.google.com/apis-explorer/>,
- Yahoo: <https://developer.yahoo.com/yql/console/>,
- Ville de Paris: <https://opendata.paris.fr/explore/>,
- Facebook: <https://developers.facebook.com/tools/explorer/>,

</section>

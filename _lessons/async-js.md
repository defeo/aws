---
layout: lesson
title: Asynchronous JavaScript
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/promises.webm
---

<section class="compact">

## Parallelism in JavaScript

JavaScript engines are *single-threaded*:

- All code runs in a single thread, in a single process,
  
  - In old browsers: one process for the whole browser,
  - In modern browsers: one tab = one process.

- No native way to do *background work*.

- All asynchronism is implemented through an *event loop*:
  
  ```python
  while True:                   # Fictive implementation of an event loop
      while queue.is_empty():
          wait()
      task = queue.pop()
      task.execute()
  ```

- Two types of function calls:
  
  - **Blocking:** they execute immediately, block the thread until
    they are done,
  - **Non-blocking:** they *yield* control to the event loop, *queue*
    a *task* when they are done.


</section>
<section class="compact">

## Function calls: blocking vs non-blocking

### Blocking calls

Most function calls:

- User defined functions,
- Computations: `Math`, string manipulations, array/object manipulations, ...
- DOM API: `.querySelector()`, `.appendChild`, ...
- `eval`, `require`, `console.log`, ...
- ...

### Non-blocking calls

- Sleeping: `setTimeout()`, `setInterval()`,
- Input/Output:
  - **System:** communicating with other processes (e.g., shell commands), ...
  - **Disk:** reading/writing files, reading/executing templates, ...
  - **Network:** reading/writing on sockets, HTTP requests/responses,
    `XMLHttpRequest`, `fetch()`, `app.listen()`, ...
  - **Databases:** connecting to databases, querying databases,
    `knex.raw()`, `knex.select()`, ...

</section>
<section class="compact">

## Handling asynchronous calls: *callbacks*

Classic technique, typical of *event-based* programming

```js
function callback() {             // (click to run)
  alert('Hello');
}
setTimeout(callback, 2000);       // Run callback in 2 secs
alert('world');
```
{:.eval}

1. `setTimeout` *queues* `callback`, to be executed in 2 seconds,
2. Control goes to the next instruction,
3. After 2 seconds, `callback` is executed.

### Also seen in *event handlers*, *request handlers*:

<div class="two-cols">
```js
// Call when a click happens
div.addEventListener('click',
  function(e) {
    console.log('Hello click');
  });
```

```js
// Call when a HTTP request happens
app.get('/toto',
  function(req, res) {
    res.send("Hello world");
  });
```
</div>

</section>
<section class="compact">

## The problem with callbacks: *Callback hell*

```js
app.get('/foo', function(req, res) {
  setTimeout(function() {
    knex.raw('SELECT * FROM users').asCallback(function(err, result) {
      if (err)
        console.log(err);
      else if (result.length > 0) {
        knex.raw(...).asCallback(...)
      }
    });
  }, 2000);
});
```

This style is error prone:

- **Code flow** hard to follow,
- **Errors** difficult to catch,
- Very painful to write **loops**:
  - **exercise:** write *"Hello world"* to the console every 2
    seconds, without using `setInterval`.
- Hard to **synchronize**:
  - waiting for the end of *two or more* actions,
  - waiting for the end of *the first among two or more* actions.

</section>
<section class="compact">

## Promises and `async/await`

Modern API and new syntax (only since ES2017) to handle asynchronous
code

```js
async function get_readme() {
  try {
    var response = await fetch('/README.md');    // wait for HTTP response
    var content = await response.text();         // wait for end of response body
    alert(content);
  } catch (err) {                                // asynchronous errors are catched too
    console.error(err);
  }
}
get_readme();
```
{:.eval}

1. Non-blocking functions (e.g., `fecth()`) return *Promises*,
2. `await` blocks execution until the promise is *done*,
3. when the promise is done `await` passes on the *promised* value.

- Must always be wrapped in `async` function.
- Can be used in `for` loops, etc.
- Only supported by modern APIs and libraries, e.g.,
  [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API),
  [Knex](http://knexjs.org/), ...


</section>
<section>

## Memorandum: long story short

- Always know **which calls are non-blocking**:
  - Local input/output;
  - Network requests (e.g., `fetch()`);
  - Database queries (e.g., `knex.raw()`, `knex.from()`, ...);
  - ...
  
- Always use `await` in front of non-blocking calls.

- Always wrap `await` in `async` function.

- Don't forget to catch errors with `try ... catch`.

**Sadly:** most failures to do so will result in subtle,
not-so-easy-to-read, errors!

</section>
<section>

# Ok. Now to the hardcore stuff!

</section>
<section>

## What on earth is a Promise?!

`async/await` is just *syntactic sugar* for:

```js
var p1 = fetch('/README.md');
var p2 = p1.then(function(response) {
    return response.text();
});
var p3 = p2.then(function(content) {
    console.log(content);
});
var p4 = p3.catch(function(err) {
    console.error(err);
});
console.log(p1, p2, p3, p4);
```
{:.eval}

- `p1`, `p2`, `p3`, `p4` are all **Promises**;
- A promise is a sort of **box** protecting a **value**;
- You (the programmer) are **only allowed** to act on the value by
  passing **callbacks**.

</section>
<section>

## Promises are *boxes*

<svg
   class="centered"
   style="display:block"
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   version="1.1"
   height="420" width="760">
  <style>
    .callback { fill: #aaa; }

    [data-on] { visibility: hidden }
    [data-incremental="1"] [data-on~="1"],
    [data-incremental="2"] [data-on~="2"],
    [data-incremental="3"] [data-on~="3"],
    [data-incremental="4"] [data-on~="4"],
    [data-incremental="5"] [data-on~="5"],
    [data-incremental="6"] [data-on~="6"],
    [data-incremental="7"] [data-on~="7"],
    [data-incremental="8"] [data-on~="8"],
    [data-incremental="9"] [data-on~="9"],
    [data-incremental="10"] [data-on~="10"]
    { visibility: visible }

    [data-incremental="1"] [data-not-on~="1"],
    [data-incremental="2"] [data-not-on~="2"],
    [data-incremental="3"] [data-not-on~="3"],
    [data-incremental="4"] [data-not-on~="4"],
    [data-incremental="5"] [data-not-on~="5"],
    [data-incremental="6"] [data-not-on~="6"],
    [data-incremental="7"] [data-not-on~="7"],
    [data-incremental="8"] [data-not-on~="8"],
    [data-incremental="9"] [data-not-on~="9"],
    [data-incremental="10"] [data-not-on~="10"]
    { visibility: hidden }
    
    [data-incremental="6"] #cb-response,
    [data-incremental="7"] #cb-response,
    [data-incremental="8"] #cb-content,
    [data-incremental="9"] #cb-content
    { fill: black }
  </style>
  <defs>
    <marker style="overflow:visible" id="arrow" refX="0" refY="0" orient="auto">
      <path transform="matrix(-0.8,0,0,-0.8,-10,0)" d="M 0,0 5,-5 -12.5,0 5,5 Z" />
    </marker>
  </defs>
  <g class="incremental">
    <g>
      <g fill="none" stroke="black">
        <rect y="9" x="70" height="60" width="70" />
        <path d="M 400,19 C 260,19 246,11 230,55" style="marker-end:url(#arrow)" />
        <path d="M 180,70 C 180,100 110,54 100,110"   style="marker-end:url(#arrow)" />
      </g>
      <g class="monotext" style="font-size:20px">
        <text y="29" x="10">p1 =</text>
        <text y="60" x="90" data-on="1 2 3 4" style="font-size:300%">?</text>
        <text y="43" x="75" data-not-on="1 2 3 4" style="font-size:50%">http://...</text>
        <text y="65" x="145" xml:space="preserve">.then(   )</text>
        <text id="cb-response" class="callback" y="23" x="400" xml:space="preserve"><tspan
        >function(response) {</tspan><tspan dy="20" x="400"
        >  return response.text()</tspan><tspan dy="20" x="400"
        >}</tspan></text>
      </g>
    </g>
    <g transform="translate(0,110)">
      <g fill="none" stroke="black">
        <rect y="9" x="70" height="60" width="70" />
        <path d="M 400,19 C 260,19 246,11 230,55" style="marker-end:url(#arrow)" />
        <path d="M 180,70 C 180,100 110,54 100,110"   style="marker-end:url(#arrow)" />
      </g>
      <g class="monotext" style="font-size:20px">
        <text y="29" x="10">p2 =</text>
        <text y="60" x="90" data-on="1 2 3 4 5 6" style="font-size:300%">?</text>
        <text y="43" x="75" data-not-on="1 2 3 4 5 6" style="font-size:60%">AWS – ...</text>
        <text y="65" x="145" xml:space="preserve">.then(   )</text>
        <text id="cb-content" class="callback" y="23" x="400" xml:space="preserve"><tspan
        >function(content) {</tspan><tspan dy="20" x="400"
        >  console.log(content)</tspan><tspan dy="20" x="400"
        >}</tspan></text>
      </g>
    </g>
    <g transform="translate(0,220)">
      <g fill="none" stroke="black">
        <rect y="9" x="70" height="60" width="70" />
        <path d="M 400,19 C 260,19 246,11 230,55" style="marker-end:url(#arrow)" />
        <path d="M 180,70 C 180,100 110,54 100,110"   style="marker-end:url(#arrow)" />
      </g>
      <g class="monotext" style="font-size:20px">
        <text y="29" x="10">p3 =</text>
        <text y="60" x="90" data-on="1 2 3 4 5 6 7 8" style="font-size:300%">?</text>
        <text y="43" x="75" data-not-on="1 2 3 4 5 6 7 8" style="font-size:60%">undefined</text>
        <text y="65" x="145" xml:space="preserve">.catch(   )</text>
        <text id="cb-catch" class="callback" y="23" x="400" xml:space="preserve"><tspan
        >function(err) {</tspan><tspan dy="20" x="400"
        >  console.error(err)</tspan><tspan dy="20" x="400"
        >}</tspan></text>
      </g>
    </g>
    <g transform="translate(0,330)">
      <g fill="none" stroke="black">
        <rect y="9" x="70" height="60" width="70" />
      </g>
      <g class="monotext" style="font-size:20px">
        <text y="29" x="10">p4 =</text>
        <text y="60" x="90" data-on="1 2 3 4 5 6 7 8 9" style="font-size:300%">?</text>
        <text y="43" x="75" data-not-on="1 2 3 4 5 6 7 8 9" style="font-size:60%">undefined</text>
      </g>
    </g>
  </g>
</svg>

- 5
- 6
- 7
- 8
- 9
- 10
{:.incremental style="display:none"}

</section>
<section>

## Chain promises

This style is more succint, and preferred:

```js
fetch('/README.md')
    .then(function(response) {
        return response.text();
    })
    .then(function(content) {
        alert(content);
    })
    .catch(function(err) {
        console.error(err);
    });
```
{:.eval}

Good to know:

- JavaScript automatically *decapsulates nested promises* (e.g.,
  `response.text()` returns a promise, the boxed value is passed to
  the next callback).
- Errors in the callbacks are passed to `.catch()`.
- An error not handled by a `.catch()` will usually crash the
  application.

</section>
<section class="compact">

## Careful with *naked* promises

Racing promises

```js
var start = Date.now()
function cb(response) {
  var elapsed = Date.now() - start;
  alert(`${response.url} (${elapsed}ms)`);
}
fetch('/index.html').then(cb);             // these two execute in parallel
fetch('/README.md').then(cb);
```
{:.eval}

If you want to order requests, you must *chain* callbacks (or use `async/await`)

```js
var start = Date.now()
fetch('/index.html')
  .then(function (response) {
    alert(`${response.url} (${Date.now() - start}ms)`);
    return fetch('/README.md');           // fetch 2nd only after 1st is done
  })
  .then(function (response) {
    alert(`${response.url} (${Date.now() - start}ms)`);
  });
```
{:.eval}

</section>
<section>

### Advanced parallelism

```js
Promise.all([                         // these two execute in parallel
  fetch('/index.html'),
  fetch('/README.md'),
]).then(function(responses) {
  alert(responses[0].url + ", "
        + responses[1].url);
  return fetch('/');                  // this one executes after
}).then(function(response) {
  alert(response.url);
});
```
{:.eval}

- Create your own promises using `new Promise()`,
- Advanced parallelism using the `Promise` inferface,
- Read more [on
  MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

</section>
<section>

## References

- Eloquent JavaScript,
  [Chapter 17](http://eloquentjavascript.net/17_http.html#promises)
  on promises,
- MDN docs on
  [`async/await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function),
- MDN docs on [using
  Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).
- [Article on promises](http://www.html5rocks.com/en/tutorials/es6/promises/),
- [Article on the fetch API](https://hacks.mozilla.org/2015/03/this-api-is-so-fetching/).
- An interactive visualisation of the event queue:
  <http://latentflip.com/loupe/>



</section>

<style>
.eval pre {
  cursor: pointer;
  box-shadow: 0 0 20px #aaf;
}
.eval:hover pre {
  box-shadow: 0 0 20px blue;
}
</style>
<script>
$$('.eval').forEach((p) => {
  p.title = "Click to run";
  p.on('click', (e) => eval(p.textContent));
});
</script>

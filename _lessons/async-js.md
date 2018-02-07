---
layout: lesson
title: Asynchronous JavaScript
---

<section class="compact">

## Parallelism in JavaScript

JavaScript engines are *single-threaded*:

- All code runs in a single thread, in a single process,
  
  - In old browsers: one process for the whole browser,
  - In modern browsers: one tab = one process.

- No native way to do *background work*.

- All asynchronism is implemented through a *event loop*:
  
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
	knex.raw('SELECT * FROM users').then(function(err, result) {
	  if (err)
		console.log(err);
	  else if (result.length > 0) {
		knex.raw(...).then(...)
	  }
	});
  }, 2000);
});
```

This style is error prone:

- **Code flow** hard to follow,
- **Exceptions** difficult to catch,
- Very painful to write **loops**:
  - **exercise:** write *"Hello world"* to the console every 2
    seconds, without using `setInterval`.
- Hard to **synchronize**:
  - waiting for the end of *two or more* actions,
  - waiting for the end of *the first among many* actions.

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
    console.log(err);
  }
}
get_readme();
```
{:.eval}

1. Non-blocking function (e.g., `fecth()`) returns a **Promise**,
2. `await` blocks execution until the promise is *done*,
3. when the promise is done `await` passes on the *return value*.

- Must always be wrapped in `async` function.
- Can be used in `for` loops, etc.
- Only supported by modern APIs and libraries, e.g.,
  [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API),
  [Knex](http://knexjs.org/), ...


</section>
<section>

## Under the hood: naked promises

`async/await` is just *syntactic sugar* for:

```js
fetch('/README.md')
  .then(function(response) {    // 2. wait for HTTP response
    return response.text();
  })
  .then(function(content) {     // 4. wait for end of response body
    alert(content);
  }).catch(function(err) {      // 5. catch asynchronous errors
    console.log(err);
  });
```
{:#promise.eval}

1. `fetch()` returns a *promise*,
2. `.then()` attaches a callback to the promise, to be called upon
   (successful) completion.
3. The return value of the callback (again a *promise*) is passed on
   by `.then()`,
4. The next `.then` attaches another callback.
5. `.catch()` attaches a callback for unsuccessful completion of
   promises.
{:.incremental}

<style>
[data-incremental="1"] #promise span:nth-child(1),
[data-incremental="2"] #promise span:nth-child(6),
[data-incremental="2"] #promise span:nth-child(8),
[data-incremental="3"] #promise span:nth-child(14),
[data-incremental="4"] #promise span:nth-child(21),
[data-incremental="4"] #promise span:nth-child(23),
[data-incremental="5"] #promise span:nth-child(34),
[data-incremental="5"] #promise span:nth-child(36)
{ outline: solid thick red }
</style>

</section>
<section class="compact">

## Careful with naked promises

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


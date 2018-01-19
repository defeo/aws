---
layout: lesson
title: "Keeping the state"
subtitle: Clients keeping state, Cookies, Storage API
scripts: "../assets/js/side-by-side-browser.js"
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/etat.webm
    quizzes:
      - 58900075ba7ec5013560f77f
      - 58900075ba7ec5013560f78d
---

<section>

## Persistence

HTTP is a **stateless** protocol.

- The `Cookie` / `Set-Cookie` headers, introduced by  Netscape in
  1996, were the Web's first mechanism for keeping the state.
- That same mechanism is still today the most used one.

### Examples

A server *keeps the state* of the client between two HTTP requests
(close or far apart in time)

- Filling forms in many steps;
- Browsing with authentication (webmail, social network, ...);
- User profiles;
- Data *in the cloud*;
- ...

</section>
<section>
<style>
#xkcd {
  text-align: center;
  margin-top: 4em;
}
#xkcd img { width: 100%; }
</style>

## Keeping the state is hard...

![](http://imgs.xkcd.com/comics/server_attention_span.png)
<http://xkcd.com/869>
{:#xkcd}

</section>
<section>

## Simulating state

HTTP does not have any native mechanism for keeping state, however it
can simulate it:

HTTP headers
: HTTP Authentication. (Rare in applications, mostly used in REST APIs).

GET/POST persistence
: Session identifiers, CSRF protections, ...

Cookies, Storage API, IndexedDB
: **Client-kept** state.

Volatile storage on the server
: **Short-termed** persistence: *sessions* (provided by the web
framework), *key-value stores* (Memcached, Redis, ...).

Persistent storage on the server
: **Long-termed** persistence: file system, databases (SQL, NoSQL,
  ...).

</section>
<section>

## GET/POST persistence

Passing the state via the request *parameters*

### Examples

Via the *query string*
  
~~~
http://.../profile?user=foo
~~~

Via the URL (provided by the framework *router*)
 
~~~
http://.../users/foo/profile
~~~

Via the request body (POST requests)
 
~~~http
POST /profile HTTP/1.1
...

user=foo
~~~

</section>
<section>

## GET/POST persistence

### Advantages

- Easy to deploy;
- Robust: browsers are unlikely to break it;
- *Linkability*, *Searchability*: data are integrated in the URL.

### Disadvantages

- Static links must be replaced by dynamical ones (template engines
  can help)
- Limited to small data.

### Potential security problems

Sensitive data (passwords, etc.) must not:

- **persist** in these channels.
- **transit** through the URL (risks tied to copy-pasting, proxy
  caching, ...).

</section>
<section>
<style>
#browser { display: flex; }
#browser .window, #browser .source {
  border: solid thin black;
}
#browser .window { flex: 0 1 19em; }
#browser .source {
  margin: 0;
  flex: 1;
}
#browser .address { border: solid 3px #aaa; }
#browser .body { padding: 1ex;
</style>

## Example (GET method)

```html
<form method="get" action="today">
  <h3>Hello, please introduce yourself</h3>
  <input type="text" name="name">
  <input type="submit" value="Enter">
</form>
```
{: #today style="display:none"}

```html
<p>Hello #name,
  <a href='tomorrow?name=#name'>see you tomorrow</a>
</p>
```
{: #tomorrow style="display:none"}

```html
<p>Hello #name</p>
```
{: #then style="display:none"}

<p id="browser"></p>

~~~js
app.get('/today', function(req, res) {
    n = req.query.name;
    res.send(`<p>Hello ${n}, <a href='tomorrow?name=${n}'>see you tomorrow</a></p>`);
});
~~~

~~~js
app.get('/tomorrow', function(req, res) {
    n = req.query.name;
    res.send(`<p>Hello ${n}</p>`);
});
~~~

</section>
<section>

## Cookies

*Key-value* pairs *temporarily* stored by the *client* **for a
website** (a domain name)

- The server asks to store a cookie by sending a `Set-Cookie` header
  
  ~~~http
  HTTP/1.1 200 OK
  ...
  Set-Cookie: user=foo
  ~~~

- Client-side JavaScript can also instruct the browser to store a
  cookie (this usage is superseded by the Storage API)
  
  ~~~js
  document.cookie = 'user=foo';
  ~~~

- The browser sends the cookie in **every** request **for the same
  domain name**
  
  ~~~http
  GET /app HTTP/1.1
  ...
  Cookie: user=foo
  ~~~

- Cookies are stored and sent with every request until **expiration**.

</section>
<section>

## Cookies and frameworks

#### In Node.js 

- Install the `cookie-parser` package with `npm`,
- Add it as an Express middleware.

~~~js
var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();
app.use(cookieParser());                  // add Express middleware

app.get(..., function(req, res) {
  req.cookies.user;                       // read cookies
  res.cookie('user', 'foo');              // write a cookie
  res.clearCookie('user');                // delete a cookie
});
~~~

</section>
<section>

## Storage API

- Key-value store, introduced in HTML5,
- Completely client-side API (accessed via JavaScript),
- Surpasses the cookies limitations on data size,
- Better guarantees on storage duration (still controlled by the
  client, though),
- Two interfaces, bound to the **domain name**:
  - `sessionStorage`: lasts until the browser is closed,
  - `localStorage`: persistent.

~~~js
if (sessionStorage['user'] === undefined) {
  sessionStorage['user'] = 'foo';
}
delete sessionStorage['user'];
~~~

More information: [MDN on storage](https://developer.mozilla.org/DOM/Storage).

</section>
<section>

## Client-kept storage

### Uses

- **Cookies:** *session identifiers*, compatibility,
- **Storage API:** any application, limited storage,
- **IndexedDB:** large data.

### Advantages/Disadvantages

- Light on the server, good for static websites.
- The client can refuse to store.

### Potential security problems

- Cookie theft: session hijacking.
- Never store a *master password* on the client, only *ephemeral
  passwords* should be stored (*session identifiers*).

</section>

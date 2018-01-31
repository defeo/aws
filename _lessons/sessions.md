---
layout: lesson
title: Sessions
subtitle: State keeping by the server
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/sessions.webm
    quizzes:
      - 58a4d0ff6e24fc1857e29107
---

<section>

## Sessions

Under the name of **sessions** go various techniques for keeping a
key-value **storage associated to a client** and **controlled by the
server**.

- Different from a simple *client-based storage*
  ([cookies, storage API](etat)):
  
  - The client cannot insert/modify data without help from the server
  
  - (optional) Stored data are not visible to the client.

- Typically short-lived:
  
  - Reduces risks associated to **session hijacking/fixing**.

</section>
<section>

## Mechanics of a session system

<div class="two-cols">
<div>

1. The client connects for the first time:
   
   - It is given a **session identifier**,
   - the server sets up a storage associated to the identifier.

2. When the client visits again the site:
   
   - It transmits the session identifier
   - the server *recovers* the storage.

</div>
<svg style="margin:auto;display:block;flex: 0 0 550px"
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:xlink="http://www.w3.org/1999/xlink"
   version="1.1"
   width="550"
   height="140">
  <style>
  /* <![CDATA[ */
    html[data-incremental="0"] #sessid-c {display: none}
    html[data-incremental="1"] #sessid-s,
    html[data-incremental="2"] #sessid-s,
    html[data-incremental="3"] #sessid-s {display: none}
	
	@keyframes flash0-s { from { stroke: #eee } to { stroke: #000 } }
	@keyframes flash1-s { from { stroke: #eee } to { stroke: #000 } }
	@keyframes flash0-f { from { fill: #eee } to { fill: #000 } }
	@keyframes flash1-f { from { fill: #eee } to { fill: #000 } }
	@-webkit-keyframes flash0-s { from { stroke: #eee } to { stroke: #000 } }
	@-webkit-keyframes flash1-s { from { stroke: #eee } to { stroke: #000 } }
	@-webkit-keyframes flash0-f { from { fill: #eee } to { fill: #000 } }
	@-webkit-keyframes flash1-f { from { fill: #eee } to { fill: #000 } }
	html[data-incremental="1"] .flash-s, html[data-incremental="3"] .flash-s
	{ animation: flash1-s 2s; -webkit-animation: flash1-s 2s; }
	html[data-incremental="2"] .flash-s
	{ animation: flash0-s 2s; -webkit-animation: flash0-s 2s; }
	html[data-incremental="1"] .flash-f, html[data-incremental="3"] .flash-f
	{ animation: flash1-f 2s; -webkit-animation: flash1-f 2s; }
	html[data-incremental="2"] .flash-f
	{ animation: flash0-f 2s; -webkit-animation: flash0-f 2s; }
  /* ]]> */
  </style>
  <defs>
    <marker class="flash-f"
       refX="0"
       refY="0"
       orient="auto"
       id="Arrow1Lend"
       style="overflow:visible">
      <path class="flash-s"
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         transform="matrix(-0.8,0,0,-0.8,-10,0)"
         style="fill-rule:evenodd;stroke:#000000;stroke-width:1pt;marker-start:none" />
    </marker>
  </defs>
  <g>
    <image
       xlink:href="../assets/firefox.png"
       x="0" y="30"
       width="100" height="71" />
    <image
       xlink:href="../assets/server.png"
       x="300" y="20"
       width="100" height="100" />
	<g class="flash-s"
	   style="fill:none;stroke:#000000;stroke-width:2;marker-end:url(#Arrow1Lend)">
        <path d="M 110,60 290,60" />
        <path d="M 290,90 110,90" />
	</g>
    <text x="10" y="20">CLIENT</text>
    <text x="300" y="20">SERVER</text>
    <g class="flash-f" style="font-family:mono;font-size:80%">
	   <text x="110" y="40">GET /</text>
	   <text id="sessid-c" x="163" y="40">?id=a434ef</text>
	   <text id="sessid-s" x="150" y="120">id=a434ef</text>
    </g>
	<rect class="flash-s" x="400" y="4" width="140" height="130"
	   style="fill:none;stroke:#000000;stroke-width:4;stroke-dasharray:4 4"></rect>
    <text x="403" y="25" style="font-weight: bold;font-size: 70%" class="flash-f">Sess a434ef</text>
	<g style="font-size:70%" class="incremental flash-f">
	   <text x="415" dy="55">user: toto</text>
	   <text x="415" dy="85">loggedin: yes</text>
	   <text x="415" dy="115">likes: oranges</text>
	</g>
  </g>
</svg>
</div>

</section>
<section>

## Session identifiers

Many possible channels (any techniques used for [keeping the state on the client](etat)):

- URL (*query string*, path)
  
  ~~~
  https://www.example.com/home?sessid=a3423f344
  https://www.example.com/a3423f344/home
  ~~~

- Hidden forms
  
  ~~~html
  <input type="hidden" name="sessid" value="a3423f344">
  ~~~

- Cookies (the most used one):
  
  ~~~
  Cookie: sessid=a3423f344
  ~~~

- Storage API (with AJAX).

**Security**: session identifiers must be **ephemeral**, **random**
and **hard to guess**.

</section>
<section>

## Storage by the server

- Possible storage areas:
  
  - volatile memory (RAM),
  - temporary file,
  - temporary database.

- The server is the only one to see and modify data.

- Potentially store large data (not recommended).

- Default sessions system historically implemented in PHP (temporary file).

- In Express:
  
  - [`express-session`](https://www.npmjs.com/package/express-session)
	(RAM, temporary database, ...).
  - ...

</section>
<section>

## Storage by the client

- Leveraging the **client** local storage: cookies, storage API.

- (Symmetric) **cryptographic** methods to guarantee
  
  - **Confidentiality →** Encryption: the server is the only one able
    to see the data.
  
  - **Integrity →** Signature (HMAC): the server is the only one able
    to create/modify data.

- Session identifier = storage area.

- Limited to small data.

- The server must generate a *random secret key*, and never give it
  away.

- In Express:
  [`cookie-session`](https://www.npmjs.com/package/cookie-session).

</section>
<section class="compact">

## Express example

~~~js
var express = require('express'),
    session = require('express-session');

app.use(session( {
  secret : '12345',
  resave: false,
  saveUninitialized: false,
} ));

app.get('/welcome', function (req, res) {
  req.session.user = req.query.user;       // Store data in the session
  ...
});

app.get('/next', function (req, res) {
  if (req.session.user) {                  // Retrieve data from the session
    res.end('Hello ' + req.session.user);
  } else {
    res.redirect('/welcome');              // If data is absent, redirect to /welcome
  }
});
~~~

</section>
<section>

## Sessions: pros/cons

### Advantages

- Transparent API, hides the protocol and implementation details.
- Often faster than querying a DB.

### Disadvantages

- Uses more resources than a simple client-based storage.
- Almost all implementations need the client to activate cookies.

### Alternatives and complementary systems

Global storage for the application

- Memory based key-value storages: Redis, ...
- *Big table*: Memcached, ...

</section>
<section>

## Security warnings

**Never store unencrypted sensible data on the client**
: Never transmit them via the URL.

**Always generate hard-to-guess session identifiers:** 
: use random number generators and long strings, let identifiers
depend on the HTTP(S) request.

**Use an encrypted transport layer:** 
: only use HTTPS for sensitive information (remember **all** personal
information is sensitive).

An attacker with the ability to **steal/fix** session identifiers can
acces **all the user data**.

**Use short-lived sessions:**
: session cookies, identifiers, ... must expire fast (or at least
regularly).

 

### AND NEVER TRUST THE CLIENT!
{:.centered}

</section>
<section>

## References

### Documentations

- Express
  - [`express-session`](https://www.npmjs.com/package/express-session),
  - [`cookie-session`](https://www.npmjs.com/package/cookie-session).

### Security

- [OWASP on fixation](https://www.owasp.org/index.php/Session_fixation),
- [OWASP on hijacking](https://www.owasp.org/index.php/Session_hijacking_attack).

</section>

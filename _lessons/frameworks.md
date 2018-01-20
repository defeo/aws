---
layout: lesson
title: Web Frameworks
subtitle: Web apps, HTTP API, Routing
excerpt: ""
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/frameworks.webm
    quizzes:
      - 58a4d0ff6e24fc1857e290c5
      - 58a4d0ff6e24fc1857e290d4
---

{% raw %}

<section>

## Before dynamic pages 

The earlier web servers just used to serve static files: HTML, images,
etc.

<svg style="margin:auto;display:block"
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:xlink="http://www.w3.org/1999/xlink"
   version="1.1"
   width="790"
   height="190">
  <defs>
    <marker
       refX="0"
       refY="0"
       orient="auto"
       id="Arrow1Lend"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         transform="matrix(-0.8,0,0,-0.8,-10,0)"
         style="fill-rule:evenodd;stroke:#000000;stroke-width:1pt;marker-start:none" />
    </marker>
  </defs>
  <g>
    <image
       xlink:href="../assets/firefox.png"
       x="0" y="30"
       width="138" height="99" />
    <image
       xlink:href="../assets/server.png"
       x="530" y="20"
       width="138" height="139" />
    <image
       xlink:href="../assets/document.png"
       x="680" y="10"
       style="opacity:0.5"
       width="44" height="60" />
    <path
       d="m 150,60 380,0"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow1Lend)" />
    <path
       d="m 530,90 -380,0"
       id="path4280"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow1Lend)" />
    <text
       x="25" y="160"
       xml:space="preserve" >CLIENT</text>
    <text
       x="580" y="190"
       xml:space="preserve" >SERVER</text>
    <text
       x="160" y="40"
       style="font-family:mono"
       xml:space="preserve" >GET /index.html HTTP/1.1</text>
    <text
       x="220" y="120"
       style="font-family:mono"
       xml:space="preserve" >HTTP/1.1 200 OK</text>
    <text
       x="220" y="170"
       style="font-family:mono"
       xml:space="preserve" ><html>...</html></text>
    <text
       x="660" y="35"
       style="font-size:smaller"
       xml:space="preserve" >index.html</text>
  </g>
</svg>

- URLs correspond to a path in the server's file system.

</section>
<section>

## Static Generation

- HTML files are assembled from various components,
- They are compiled together before being installed on the server.
{:.no-wrap}

#### A modern example

<svg style="margin:auto;display:block" width="504" height="200" transform="scale(0.7)" >
  <defs>
    <marker id="arrow" orient="auto"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         transform="matrix(-0.8,0,0,-0.8,-10,0)"
         style="fill-rule:evenodd;stroke:black;stroke-width:1pt;marker-start:none" />
    </marker>
    <image id="file"
        xlink:href="../assets/document.png"
        width="44" height="60" />
  </defs>
  <g style="-webkit-transform:scale(0.7);-ms-transform:scale(0.7)">
  <g style="font-family:Mono">
    <use xlink:href="#file" x="40" y="0" />
    <text x="0" y="80">menu.html</text>

    <use xlink:href="#file" x="40" y="100" />
    <text x="0" y="180">content.md</text>

    <use xlink:href="#file" x="40" y="200" />
    <text x="0" y="280">footer.pug</text>

    <a xlink:href="https://perl.org">
        <image xlink:href="../assets/perl.png" x="370" y="105" width="135" height="51" />
    </a>

    <use xlink:href="#file" x="620" y="100" />
    <text x="580" y="180">index.html</text>
  </g>
  <g style="stroke:black;stroke-width:2;marker-end:url(#arrow)">
    <path d="m 100,30 260,80" />
    <path d="m 100,130 60,0" />
    <path d="m 100,230 100,0" />

    <path d="m 300,130 60,0" />
    <path d="m 260,230 100,-80" />

    <path d="m 510,130 100,0" />
</g>
  <g style="fill:blue">
    <a xlink:href="https://daringfireball.net/projects/markdown/"><text x="170" y="138">Markdown</text></a>
    <a xlink:href="https://pugjs.org/"><text x="210" y="238">Pug</text></a>
  </g>
  </g>
</svg>

- [Markdown](https://daringfireball.net/projects/markdown/): Text → HTML transformation,
- [Pug](https://pugjs.org/): simplified syntax for HTML,
- [Perl](https://perl.org/): generic programming language.

**Another example:** These slides are statically generated
([Markdown](https://daringfireball.net/projects/markdown/) +
[Jekyll](https://jekyllrb.com/)).

</section>
<section>

## Web 1.0: dynamic pages

Document creation happens at the moment the HTTP request is received,
on the fly.

<svg style="margin:auto;display:block" width="720" height="270" transform="scale(0.8)">
  <defs>
    <marker
       refX="0"
       refY="0"
       orient="auto"
       id="Arrow2Lend"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         transform="matrix(-0.8,0,0,-0.8,-10,0)"
         style="fill-rule:evenodd;stroke:#000000;stroke-width:1pt;marker-start:none" />
    </marker>
    <marker
       refX="0"
       refY="0"
       orient="auto"
       id="Arrow2Lstart"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         transform="matrix(0.8,0,0,0.8,10,0)"
         style="fill-rule:evenodd;stroke:#000000;stroke-width:1pt;marker-start:none" />
    </marker>
  </defs>
  <g style="-webkit-transform:scale(0.8);-ms-transform:scale(0.8)">
    <image
       xlink:href="../assets/server.png"
       x="300" y="80"
       width="138" height="139" />
    <image
       xlink:href="../assets/document.png"
       x="480" y="10"
       style="opacity:0.2"
       width="44" height="60" />
    <image
       xlink:href="../assets/php.png"
       x="460" y="150"
       width="95" height="51" />
    <image
       xlink:href="../assets/server.png"
       x="700" y="60"
       style="opacity:0.5"
       width="70" height="70" />
    <image
       xlink:href="../assets/db.png"
       x="700" y="140"
       style="opacity:0.5"
       width="60" height="60" />
    <image
       xlink:href="../assets/document.png"
       x="705" y="220"
       style="opacity:0.2"
       width="44" height="60" />
    <image
       xlink:href="../assets/document.png"
       x="120" y="210"
       style="opacity:0.2"
       width="66" height="90" />
    <path
       d="m 40,120 250,0"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow2Lend)" />
    <path
       d="m 290,150 -250,0"
       id="path4280"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow2Lend)" />
    <path
       d="m 505,100 0,50"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow2Lend)" />
    <path
       d="m 550,150 100,-30"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow2Lend);marker-start:url(#Arrow2Lstart)" />
    <path
       d="m 560,175 90,0"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow2Lend);marker-start:url(#Arrow2Lstart)" />
    <path
       d="m 550,200 100,30"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow2Lend);marker-start:url(#Arrow2Lstart)" />
    <text
       x="0" y="100"
       style="font-family:monospace"
       xml:space="preserve" >GET /app.php HTTP/1.1</text>
    <text
       x="0" y="190"
       style="font-family:monospace"
       xml:space="preserve" >HTTP/1.1 200 OK</text>
    <text
       x="450" y="90"
       style="font-family:monospace"
       xml:space="preserve" >app.php</text>
    <text
       x="450" y="250"
       xml:space="preserve" >Scripting</text>
    <text
       x="450" y="280"
       xml:space="preserve" >engine</text>
    <text
       x="620" y="110"
       xml:space="preserve" >Authentication server</text>
    <text
       x="680" y="180"
       xml:space="preserve" >Database</text>
    <text
       x="660" y="270"
       xml:space="preserve" >XML template</text>
    <text
       x="60" y="250"
       xml:space="preserve" >Generated HTML</text>
    <text
       x="100" y="290"
       xml:space="preserve" >document</text>
  </g>
</svg>

The server can:

- Compile the document on the fly (like in static generation),
- Interact with other servers (authentication, API),
- Query databases,
- ...

</section>
<section>

## Web 2.0: Web applications

Centered around *user interaction*.

<svg style="margin:auto;display:block" width="720" height="250" transform="scale(0.8)">
  <defs>
    <marker
       refX="0"
       refY="0"
       orient="auto"
       id="Arrow2Lend"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         transform="matrix(-0.8,0,0,-0.8,-10,0)"
         style="fill-rule:evenodd;stroke:#000000;stroke-width:1pt;marker-start:none" />
    </marker>
    <marker
       refX="0"
       refY="0"
       orient="auto"
       id="Arrow2Lstart"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         transform="matrix(0.8,0,0,0.8,10,0)"
         style="fill-rule:evenodd;stroke:#000000;stroke-width:1pt;marker-start:none" />
    </marker>
  </defs>
  <g style="-webkit-transform:scale(0.8);-ms-transform:scale(0.8)">
    <image
       xlink:href="../assets/server.png"
       x="300" y="120"
       width="138" height="139" />
    <image
       xlink:href="../assets/symfony.svg"
       x="430" y="100"
       width="151" height="168" />
    <image
       xlink:href="../assets/server.png"
       x="700" y="60"
       style="opacity:0.5"
       width="70" height="70" />
    <image
       xlink:href="../assets/db.png"
       x="700" y="140"
       style="opacity:0.5"
       width="60" height="60" />
    <image
       xlink:href="../assets/document.png"
       x="705" y="220"
       style="opacity:0.2"
       width="44" height="60" />
    <image
       xlink:href="../assets/document.png"
       x="120" y="210"
       style="opacity:0.2"
       width="66" height="90" />
    <path
       d="m 40,120 250,0"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow2Lend)" />
    <path
       d="m 290,150 -250,0"
       id="path4280"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow2Lend)" />
    <path
       d="m 550,150 100,-30"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow2Lend);marker-start:url(#Arrow2Lstart)" />
    <path
       d="m 560,175 90,0"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow2Lend);marker-start:url(#Arrow2Lstart)" />
    <path
       d="m 550,200 100,30"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow2Lend);marker-start:url(#Arrow2Lstart)" />
    <text
       x="0" y="100"
       style="font-family:monospace"
       xml:space="preserve" >GET /users.json HTTP/1.1</text>
    <text
       x="0" y="190"
       style="font-family:monospace"
       xml:space="preserve" >HTTP/1.1 200 OK</text>
    <text
       x="480" y="80"
       xml:space="preserve" >Web</text>
    <text
       x="440" y="110"
       xml:space="preserve" >Application</text>
    <text
       x="620" y="110"
       xml:space="preserve" >Authentication Server</text>
    <text
       x="680" y="180"
       xml:space="preserve" >Database</text>
    <text
       x="660" y="270"
       xml:space="preserve" >XML template</text>
    <text
       x="60" y="250"
       xml:space="preserve" >Generated JSON</text>
    <text
       x="100" y="290"
       xml:space="preserve" >document</text>
  </g>
</svg>

- URLs no more correspond to files on the server,
- A URL points to a *virtual resource*, signifies an **action**,
- Web app execution done by
  - a web server (e.g., Apache+PHP, Tomcat+Java, ...),
  - its own server (e.g., Node.js, ...).

</section>
<section>

## Web frameworks

A *web framework* is a library and a toolkit, helping to build web
applications.

### Some typical framework components

- *HTTP(S) API*: parsing/writing of HTTP request/responses,
- *Router*: defines a correspondence **URL → Code to run**,
- *Template engine*: **Templates → HTML pages** generation,
- *Volatile storage*: persistence, sessions, memcache,
- *Database abstraction*,
- *Security mechanisms*: injections, XSS, CSRF,
- *Caching*, *Internationalisation*, ...

**Examples**: [Symfony](https://symfony.com/) (PHP),
[Zend](https://www.zend.com/) (PHP), **[Node.js](https://nodejs.org/)
(JavaScript)**, [Ruby on Rails](http://rubyonrails.org/) (Ruby),
[Django](https://www.djangoproject.com/) (Python),
[Flask](http://flask.pocoo.org/) (Python),
[Tornado](http://www.tornadoweb.org/) (Python), [Java
EE](https://www.oracle.com/technetwork/java/javaee/), ...

</section>
<section>

## Framework used in this course

### [Node.js](https://nodejs.org/) ...

*Event-driven web server* based on Chrome's **JavaScript** engine (*V8
engine*, written in C++)

- **Modules:** Web server, HTTP API, Packet manager (`npm`).
- **Optional modules** (developed by the community, distributed via
  `npm`)**:** Web/REST frameworks, Sessions, Memcache, Templates
  engines, Database abstraction, WebSockets, ...
  
### ... + [Express](https://expressjs.com/)

Web *Micro-framework* for Node.js (written en **JavaScript**)

- **Base components:** Request/Response HTTP API, URL router,
  Query string parser, Static file server, ...
- **Optional components** (installed via `npm`)**:** Request body
  parser, Cookie parser, Middlewares, CSRF protections, ...

</section>
<section>

### HTTP API: Application, request, response

<svg style="margin:auto;display:block" width="700" height="500"
    viewBox="0 -250 700 500">
  <defs>
    <marker id="arrow" orient="auto"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         transform="matrix(-0.8,0,0,-0.8,-10,0)"
         fill="black" stroke="black"
         marker-start="none" />
    </marker>
    <image id="symfony-svg"    xlink:href="../assets/node.svg" width="180" height="180"/>
  </defs>

  <g class="code" style="font-size: 16px">
    <text x="10" y="-240">
      <tspan dy="16">POST /url?a=b HTTP/1.1</tspan>
      <tspan x="10" dy="32">Host: www.myhost.com</tspan>
      <tspan x="10" dy="16">Accept-Language: "fr;en"</tspan>
      <tspan x="10" dy="16">Content-Type: application/json</tspan>
      <tspan x="10" dy="32">{ "func": "is_prime",</tspan>
      <tspan x="10" dy="16" xml:space="preserve">  "nums": [1,2,3,4,5,6,7,8] }</tspan>
    </text>

    <text x="10" y="206">
      <tspan xml:space="preserve">  "primes": [2,3,5,7] }</tspan>
      <tspan x="10" dy="-16">{ "status": "ok",</tspan>
      <tspan x="10" dy="-32">Content-Type: application/json</tspan>
      <tspan x="10" dy="-16">Content-Length: 40</tspan>
      <tspan x="10" dy="-16">Set-Cookie: sessid=0A5FD2</tspan>
      <tspan x="10" dy="-32">HTTP/1.1 200 OK</tspan>
    </text>
  </g>
  <use xlink:href="#symfony-svg" x="290" y="-100" />
  <g fill="none" stroke="black" stroke-width="1.5" marker-end="url(#arrow)">
    <path d="m 300,-185 q 70,0 70,120" />
    <path d="m 370,70 q 0,80 -70,100" />
  </g>
  
  <g class="incremental" fill="none" stroke="red" stroke-dasharray="5,3" >
    <g>
      <text x="470" y="-230" fill="red" stroke="none">Request:</text>
      <path d="m 465,-235 -145,0" />
      <rect x="1" y="-249" width="320" height="149" />
    </g>
    <g style="font-size:80%">
      <text x="490" y="-210" fill="red" stroke="none">query string</text>
      <path d="M 485,-215 Q 270,-210 110,-220 " />
      <rect x="79" y="-239" width="4.1ex" height="1em" />
    </g>
    <g style="font-size:80%">
      <text x="490" y="-190" fill="red" stroke="none">headers</text>
      <rect x="5" y="-207" width="307" height="55" />
      <path d="m 485,-195 -173,0" />
    </g>
    <g style="font-size:80%">
      <text x="490" y="-170" fill="red" stroke="none">request body</text>
      <rect x="5" y="-145" width="305" height="38" />
      <path d="m 485,-175 -175,50" />
    </g>
    <g style="font-size:80%">
      <text x="490" y="-150" fill="red" stroke="none">method, url, cookies, ...</text>
    </g>
    
    <g>
      <text x="470" y="150" fill="red" stroke="none">Response:</text>
      <rect x="1" y="70" width="320" height="149" />
      <path d="m 465,145 -145,-30" />
    </g>
    <g style="font-size:80%">
      <text x="490" y="170" fill="red" stroke="none">status code</text>
      <rect x="75" y="79" width="70" height="1em" />
      <path d="m 485,165 C 260,165 485,88 145,88" />
    </g>
    <g style="font-size:80%">
      <text x="490" y="190" fill="red" stroke="none">response body</text>
      <rect x="5" y="170" width="250" height="45" />
      <path d="m 485,185 -230,0" />
    </g>
    <g style="font-size:80%">
      <text x="490" y="210" fill="red" stroke="none">headers, cookies, ...</text>
    </g>

    <g>
      <text x="500" y="-40" fill="red" stroke="none">Application:</text>
      <path d="M 495,-45 450,-20" />

      <text x="520" y="-20" fill="red" stroke="none" style="font-size:80%">
        <tspan>router</tspan>
        <tspan x="520" dy="20">template engine</tspan>
        <tspan x="520" dy="20">sessions</tspan>
        <tspan x="520" dy="20">DB interface</tspan>
        <tspan x="520" dy="20">middlewares</tspan>
        <tspan x="520" dy="20">...</tspan>
      </text>
    </g>
  </g>
</svg>

</section>
<section>

## The web application in Express

1. Load the `express` module
   
   ```js
   var express = require('express');
   ```

2. Create the web application object
   
   ```js
   var app = express();
   ```

3. Define the *handlers* for the requests (*Routing*)
   
   ```js
   app.get('/', ...);
   app.post('/form', ...);
   app.all('/old', ...);
   ```

4. Let the application listen for connections (on port 80)
   
   ```js
   app.listen(80);
   ```

5. That's all folks!

</section>
<section>

## Anatomy of a handler

### The router

The *router* associates: **method+URL → code to run**

~~~js
app.get('/url', function(req, res) {
    ...
});
~~~

It can also translate part of the URL into arguments to the *callback*

~~~js
app.get('/url/:a1/:a2', function(req, res) {
    console.log(req.params.a1);
    console.log(req.params.a2);
    ...
});
~~~

</section>
<section>

### The request object

~~~js
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

// Configure the application
app
    .use(bodyParser.urlencoded({ extended: false }))
    .use(cookieParser());

app.get('/', function(req, res) {
    req.query;                    // query string
    req.body;                     // request body
    req.headers;                  // HTTP headers
    req.cookies;                  // cookies
});
~~~

</section>
<section>

### The response object

Send a simple answer

~~~js
res.send('Hello world');
~~~

Send a *status code* and some headers

~~~js
res.set('Content-Type', 'text/plain');
res.status(404).send('Not Found');
~~~

Send a static file

~~~js
res.sendFile('static-file.html');
res.download('static-attachment.mp3');
~~~

Redirect to another page

~~~js
res.redirect('/other/path');
~~~

Send JSON data

~~~js
res.json({ 'a' : 'b' });
~~~

</section>
<section>

## Hello world

```js
var express = require('express');

var app = express();

app.get('/hello', function(req, res) {
    if (req.query.name) {
        res.send(`<h1>Hello, ${req.query.name}</h1>`);
    } else {
        res.send('<h1>Hello world!</h1>');
    }
});

app.listen(80);
```

</section>
<section>

## Anatomy of the application

<svg style="margin:auto;display:block" width="950" height="450"
    viewBox="0 -225 1015 450">
  <defs>
    <marker id="arrow-start" orient="auto"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         transform="matrix(0.8,0,0,0.8,10,0)"
         fill="black" stroke="black"
         marker-start="none" />
    </marker>
  </defs>

  <use x="30" y="-170" xlink:href="#symfony-svg" />
  <g stroke="black" fill="none"  marker-end="url(#arrow)" stroke-dasharray="5,2">
    <path d="M 120,-200 120,-125" />
    <path d="M 180,-60 Q 200,-20 345,-20" />
    <g marker-start="url(#arrow-start)">
      <path d="M 700,0 700,120" />
      <path d="M 700,-55 700,-155" />
    </g>
    <path d="M 345,-10 Q 120,-10 120,145" />
  </g>
  <g class="code">
    <text x="0" y="-205" fill="black">GET /path/foo/bar</text>
    <text x="350" y="-40">
      <tspan>app.get(<tspan fill="#800">'/path/:v1/:v2'</tspan>, </tspan>
      <tspan style="font-weight:bold">function</tspan><tspan>(req, res) {</tspan>
      <tspan x="350" dy="25" xml:space="preserve">  ...</tspan>
      <tspan x="350" dy="25">}</tspan>
    </text>
    <text x="540" y="140">
      <tspan>&lt;h1&gt;Hello <tspan style="font-weight:bold">{{ user }}</tspan>!&lt;/h1&gt;</tspan>
    </text>
    <text x="460" y="-160">SELECT * FROM user WHERE id=${req.params.v1};</text>
    <text x="0" y="170">
      <tspan>HTTP/1.1 200 OK</tspan>
      <tspan x="0" dy="40">&lt;h1&gt;Hello foo!&lt;/h1&gt;</tspan>
    </text>
  </g>
  <g fill="red" stroke="red">
    <text x="220" y="-30">Router</text>
    <text x="840" y="20">Handler</text>
    <text x="600" y="70">Template engine</text>
    <text x="640" y="-100">Database</text>
    <text x="100" y="60">Response</text>
  </g>
  <rect fill="none" stroke="red" stroke-width="2" x="340" y="-70" width="665" height="95" />
</svg>

</section>
<section>

## References

- The [NodeSchool](https://nodeschool.io/) tutorials,
- The [Node.js reference](https://nodejs.org/api/),
- The [NodeJitsu help pages](https://docs.nodejitsu.com/),
- The [Express docs](https://expressjs.com/),
- Eloquent JavaScript, [chapter 20 on Node.js](https://eloquentjavascript.net/20_node.html).

</section>

{% endraw %}

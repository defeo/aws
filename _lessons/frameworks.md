---
layout: lesson
title: Frameworks Web
subtitle: Applications web, API HTTP, Routage
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/frameworks.webm
---

{% raw %}

<section>

## Avant les pages dynamiques

Le premiers servers web se limitaient à servir des fichiers statiques:
HTML, images, etc.

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

- L'URL correspond à un chemin dans le système de fichiers du serveur.

</section>
<section>

## Génération statique

- Les fichiers HTML sont assemblés à partir de plusieurs composants, 
- Ils sont compilés avant d'être chargés sur le serveur
{:.no-wrap}

#### Un exemple moderne

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
	<text x="0" y="280">footer.jade</text>

	<a xlink:href="http://perl.org">
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
    <a xlink:href="http://daringfireball.net/projects/markdown/"><text x="170" y="138">Markdown</text></a>
	<a xlink:href="http://jade-lang.com/"><text x="210" y="238">Jade</text></a>
  </g>
  </g>
</svg>

- [Markdown](http://daringfireball.net/projects/markdown/) : transformation Texte → HTML,
- [Jade](http://jade-lang.com/) : syntaxe simplifiée pour HTML,
- [Perl](http://perl.org/) : langage de programmation générique.

**Autre exemple :** Ces transparents sont générés statiquement
([Markdown](http://daringfireball.net/projects/markdown/) +
[Jekyll](http://jekyllrb.com/)).

</section>
<section>

## Web 1.0 : pages dynamiques

La création du document se fait au moment de la requête, à la volée.

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
       xml:space="preserve" >Moteur de</text>
    <text
       x="450" y="280"
       xml:space="preserve" >Scripting</text>
    <text
       x="620" y="110"
       xml:space="preserve" >Server d'authentification</text>
    <text
       x="680" y="180"
       xml:space="preserve" >Database</text>
    <text
       x="660" y="270"
       xml:space="preserve" >template XML</text>
    <text
       x="60" y="250"
       xml:space="preserve" >document HTML</text>
    <text
       x="100" y="290"
       xml:space="preserve" >généré</text>
  </g>
</svg>

Le serveur peut :

- Compiler le document à la volée (comme dans la génération statique),
- Interagir avec d'autres serveurs (authentification, API, ...),
- Interroger des bases de données.

</section>
<section>

## Web 2.0 : Applications web

Focalisées autour de *l'interaction* avec l'utilisateur.

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
       x="440" y="80"
       xml:space="preserve" >Application</text>
    <text
       x="480" y="110"
       xml:space="preserve" >Web</text>
    <text
       x="620" y="110"
       xml:space="preserve" >Server d'authentification</text>
    <text
       x="680" y="180"
       xml:space="preserve" >Database</text>
    <text
       x="660" y="270"
       xml:space="preserve" >template XML</text>
    <text
       x="60" y="250"
       xml:space="preserve" >document JSON</text>
    <text
       x="100" y="290"
       xml:space="preserve" >généré</text>
  </g>
</svg>

- Les URL ne correspondent plus à des fichiers sur le serveur,
- Une URL indique une *ressource virtuelle*, une **action**,
- Exécution de l'application web 
  - par un serveur web (par ex., Apache+PHP, Tomcat+Java, ...),
  - ou par son propre serveur (par ex., Node.js, ...).
  

</section>
<section>

## Frameworks Web

Un *framework web* est une bibliothèque et une collection d'outils qui
facilitent la construction d'applications web.

### Quelques composants classiques d'un framework

- *API HTTP(S)* : parsing/écriture de requêtes/réponses HTTP,
- *Router* : définit la correspondance **URL → Code à exécuter**,
- *Moteur de templates*: génération **Modèles → Pages HTML**,
- *Stockage volatile*: persistance, sessions, memcache,
- *Abstraction de bases de données*,
- *Mechanismes de sécurité*: injections, XSS, CSRF,
- *Caching*, *Internationalisation*, ...

**Exemples**: [Symfony](http://symfony.com/) (PHP),
**[Silex](http://silex.sensiolabs.org/) (PHP, basé sur Symfony)**,
[Zend](http://www.zend.com/) (PHP), **[Node.js](http://nodejs.org/)
(JavaScript)**, [io.js](https://iojs.org/) (JavaScript),
[Ruby on Rails](http://rubyonrails.org/) (Ruby),
[Django](https://www.djangoproject.com/) (Python),
[Flask](http://flask.pocoo.org/) (Python),
[Tornado](http://www.tornadoweb.org/) (Python),
[Java EE](http://www.oracle.com/technetwork/java/javaee/), ...

</section>
<section>

## Frameworks étudiés dans ce cours

### [Silex](http://silex.sensiolabs.org/) (PHP)

*Micro-framework* dérivé de [Symfony](http://symfony.com/).

- **Modules :** API HTTP, Router, Sessions.
- **Modules optionnels :** Moteur de templates
  ([Twig](http://twig.sensiolabs.org/)), Abstraction de bases de
  données ([Doctrine](http://www.doctrine-project.org/)), Protections
  CSRF, Caching, Internationalisation, Mail, ...

### [Node.js](http://nodejs.org/) + [Express](http://expressjs.com/) (JavaScript)

*Micro-framework* web écrit en JavaScript (V8).

- **Modules :** Server Web, API HTTP, Gestionnaire de paquets (`npm`).
- **Modules optionnels** (développés par la communeauté, distribués
  via `npm`) **:** Router, Middlewares, Sessions, Memcache, Moteurs de
  templates, Abstraction de bases de données, Protections CSRF,
  WebSockets, ...

</section>
<section>

### API HTTP : Application, requête, réponse

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
	<image id="symfony-svg"	xlink:href="../assets/symfony.svg" width="151" height="168"/>
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

	<text x="10" y="236">
	  <tspan xml:space="preserve">  "primes": [2,3,5,7] }</tspan>
	  <tspan x="10" dy="-16">{ "status": "ok",</tspan>
	  <tspan x="10" dy="-32">Content-Type: application/json</tspan>
	  <tspan x="10" dy="-16">Content-Length: 40</tspan>
	  <tspan x="10" dy="-16">Set-Cookie: sessid=0A5FD2</tspan>
	  <tspan x="10" dy="-32">HTTP/1.1 200 OK</tspan>
	</text>
  </g>
  <use xlink:href="#symfony-svg" x="300" y="-80" />
  <g fill="none" stroke="black" stroke-width="1.5" marker-end="url(#arrow)">
	<path d="m 300,-185 q 70,0 70,120" />
	<path d="m 370,70 q 0,80 -70,100" />
  </g>
  
  <g class="incremental" fill="none" stroke="red" stroke-dasharray="5,3" >
	<g>
	  <text x="470" y="-230" fill="red" stroke="none">Requête :</text>
	  <path d="m 465,-235 -145,0" />
	  <rect x="1" y="-249" width="320" height="149" />
	</g>
	<g style="font-size:80%">
	  <text x="490" y="-210" fill="red" stroke="none">query string</text>
	  <path d="M 485,-215 Q 270,-210 120,-220 " />
	  <rect x="100" y="-240" width="4.1ex" height="1em" />
	</g>
	<g style="font-size:80%">
	  <text x="490" y="-190" fill="red" stroke="none">entêtes</text>
	  <rect x="5" y="-207" width="307" height="55" />
	  <path d="m 485,-195 -173,0" />
	</g>
	<g style="font-size:80%">
	  <text x="490" y="-170" fill="red" stroke="none">corps de la requête</text>
	  <rect x="5" y="-145" width="305" height="38" />
	  <path d="m 485,-175 -175,50" />
	</g>
	<g style="font-size:80%">
	  <text x="490" y="-150" fill="red" stroke="none">méthode, url, cookies, ...</text>
	</g>
	
	<g>
	  <text x="470" y="180" fill="red" stroke="none">Réponse :</text>
	  <rect x="1" y="100" width="320" height="149" />
	  <path d="m 465,175 -145,0" />
	</g>
	<g style="font-size:80%">
	  <text x="490" y="200" fill="red" stroke="none">code d'état</text>
	  <rect x="100" y="109" width="60" height="1em" />
	  <path d="m 485,195 C 260,195 485,118 160,118" />
	</g>
	<g style="font-size:80%">
	  <text x="490" y="220" fill="red" stroke="none">corps de la réponse</text>
	  <rect x="5" y="200" width="250" height="45" />
	  <path d="m 485,215 -230,0" />
	</g>
	<g style="font-size:80%">
	  <text x="490" y="240" fill="red" stroke="none">entêtes, cookies, ...</text>
	</g>
	
	<g>
	  <text x="470" y="-40" fill="red" stroke="none">Application :</text>
	  <path d="M 465,-45 420,-20" />
	  
	  <text x="490" y="-20" fill="red" stroke="none" style="font-size:80%">
	    <tspan>router</tspan>
	    <tspan x="490" dy="20">moteur de templates</tspan>
	    <tspan x="490" dy="20">sessions</tspan>
	    <tspan x="490" dy="20">interface BD</tspan>
	    <tspan x="490" dy="20">middlewares</tspan>
	    <tspan x="490" dy="20">...</tspan>
	  </text>
	</g>
  </g>
</svg>

</section>
<section class="compact">

## L'application

### Silex (PHP)

~~~
require_once 'vendor/autoload.php';
$app = new Silex\Application();

$app->get();      // Le router
$app->post();
$app->match();

$app->run();      // Exécution
~~~

### Express (Node.js)

~~~
var express = require('express');
var app = express();

app.get();        // Le router
app.post();
app.all();

app.listen(80);   // Exécution
~~~
{:.javascript}

</section>
<section class="compact">

## L'objet requête

### Silex

~~~
use Symfony\Component\HttpFoundation\Request;

$app->get('/', function(Request $req) {
	$req->query;      // Query string
	$req->request;    // corps de la requête
	$req->headers;    // entêtes HTTP
	$req->cookies;    // cookies
});
~~~

### Express

~~~
var bodyParser = require("body-parser"), cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded()).use(cookieParser()); // config

app.get('/', function(req, res) {
	req.query;        // query string
	req.body;         // corps de la requête
	req.headers;      // entêtes HTTP
	req.cookies;      // cookies
});
~~~
{:.javascript}

</section>
<section class="compact">

## L'objet réponse (Silex)

~~~
use Symfony\Component\HttpFoundation\Response;
~~~

Écrire une réponse simple

~~~
return 'Hello world';
~~~

Envoyer un *code d'état* et des entêtes

~~~
return new Response(404, 'Not Found', headers);
~~~

Envoyer un fichier statique

~~~
return $app->sendFile('static-file.html');
~~~

Faire une redirection

~~~
return $app->redirect('/other/path');
~~~

Envoyer des données au format JSON

~~~
return $app->json( array('a' => 'b') );
~~~

</section>
<section class="compact">

## L'objet réponse (Express)

Écrire une réponse simple

~~~
res.send('Hello world');
~~~

Envoyer un *code d'état* et des entêtes

~~~
res.set('Content-Type', 'text/plain');
res.status(404).send('Not Found');
~~~

Envoyer un fichier statique

~~~
res.sendFile('static-file.html');
res.download('static-attachment.mp3');
~~~

Faire une redirection

~~~
res.redirect('/other/path');
~~~

Envoyer des données au format JSON

~~~
res.json({ 'a' : 'b' });
~~~

</section>
<section>

## Anatomie de l'application


<svg style="margin:auto;display:block" width="1015" height="450"
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

  <use x="50" y="-140" xlink:href="#symfony-svg" />
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
    <text x="0" y="-205" fill="black">GET /path/toto/titi</text>
	<text x="350" y="-40">
	  <tspan>$app->get(<tspan fill="#800">'/path/{v1}/{v2}'</tspan>, </tspan>
	  <tspan style="font-weight:bold">function</tspan><tspan>($v1, $v2) {</tspan>
	  <tspan x="350" dy="25" xml:space="preserve">  ...</tspan>
	  <tspan x="350" dy="25">}</tspan>
	</text>
	<text x="540" y="140">
	  <tspan>&lt;h1&gt;Hello <tspan style="font-weight:bold">{{ user }}</tspan>!&lt;/h1&gt;</tspan>
	</text>
	<text x="460" y="-160">SELECT * FROM user WHERE id=$v1;</text>
	<text x="0" y="170">
	  <tspan>HTTP/1.1 200 OK</tspan>
	  <tspan x="0" dy="40">&lt;h1&gt;Hello toto!&lt;/h1&gt;</tspan>
	</text>
  </g>
  <g fill="red" stroke="red">
    <text x="220" y="-30">Router</text>
	<text x="840" y="20">Gestionnaire</text>
    <text x="600" y="70">Template engine</text>
	<text x="640" y="-100">Database</text>
	<text x="100" y="60">Réponse</text>
  </g>
  <rect fill="none" stroke="red" stroke-width="2" x="340" y="-70" width="665" height="95" />
</svg>

</section>
<section>

## Le router

Le *router* fait l'association : **méthode+URL → code à exécuter**

~~~
$app->get('/url', function() {...});
~~~

Il peut aussi traduire une partie de l'URL en arguments de la fonction

~~~
$app->get('/url/{a1}/{a2}', function($a1, $a2) {
	...
});
~~~

En Express

~~~
app.get('/url/:a1/:a2', function(req, res) {
	console.log(req.params.a1);
});
~~~

</section>
<section>

## Lectures

### Silex

- La [doc officielle](http://silex.sensiolabs.org/documentation) (en anglais),
- Le
  [*Book* de Symfony](http://symfony.com/fr/doc/current/book/index.html)
  (disponible aussi
  [en anglais](http://symfony.com/doc/current/book/index.html)),
- La [référence de Symfony](http://api.symfony.com/master/) (en
  anglais),

### Express

- Les tutoriels de [NodeSchool](http://nodeschool.io/),
- La [référence de Node.js](http://nodejs.org/api/),
- Les [aides de NodeJitsu](http://docs.nodejitsu.com/),
- La [doc de Express](http://expressjs.com/),
- Eloquent JavaScript, [chapitre 20 sur Node.js](http://eloquentjavascript.net/20_node.html).

</section>

{% endraw %}

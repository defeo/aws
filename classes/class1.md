---
layout: slideshow
title: Le WWW
subtitle: son histoire, ses langages
---

<section>

## Applications Web et Sécurité

<div class="incremental">

**Le prof :** Luca De Feo <http://defeo.lu/>

#### Le matériel de cours

- Le site (slides, TPs, vidéos) : <http://defeo.lu/aws/>.
- Pour ne pas perdre une mise à jour : le
  [flux ATOM](https://github.com/defeo/aws/commits/gh-pages.atom).
- L'ancien site : <http://was.defeo.lu/> (plus de matériel disponible).
{:.no-wrap}

**Le blog :** <http://defeo.lu/blog/> <small>(En anglais, un peu vide
pour l'instant. Si vous aimez ce cours, vous allez aimer au moins une
partie des posts)</small>

#### Les technologies

* [HTML5](http://www.w3schools.com/html/html5_intro.asp),
  [CSS3](http://www.w3schools.com/css/css3_intro.asp), (un minimum de
  familiarité est attendue),
* [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), [JSON](http://www.json.org/), AJAX, (WebSockets ?),
* [PHP](http://www.php.net/manual/fr/), [Twig](http://twig.sensiolabs.org/), [Symfony](http://symfony.com/doc/current/index.html)
* [MySql](http://dev.mysql.com/doc/refman/5.6/en/index.html), [Sqlite](http://www.sqlite.org/about.html), (Key-value stores ?)
* **Optionnel :** [Node.js](http://nodejs.org/about/), [Express.js](http://expressjs.com/).

</div>
</section>
<section>

### La structure du cours

- 8 cours : Mercredi 13h30 - 15h, amphi B,
- 8 TPs sur machine :
  - Groupe 1 : Mercredi 15h15 - 18h30, salle G101,
  - Groupe 2 : Mardi 15h15 - 18h30, salle G103.
  
  Venez avec *votre ordinateur* ou un *cartable numérique*.
  **Apportez un cable ethernet !** Développement dans le cloud grâce à
  l'IDE [Cloud9](https://c9.io).
	  
- Évaluation : 0.4 CC + 0.6 Ex (consulter scolarité)
  - Contrôle continu : projet à développer en TD (jeu de
	[Puissance 4](http://fr.wikipedia.org/wiki/Puissance_4))
	- première remise de code vers mi-mars,
	- deuxième remise début mai.
  - Examen : en amphi, je réfléchis à une nouvelle modalité.
{:.incremental}

</section>
<section>

# L'histoire du WWW

</section>
<section>

## L'histoire du WWW

De l'excellente [Courte histoire du World Wide Web](http://www.w3.org/History.html)

**1990** Tim Berners-Lee (MIT) et Robert Calliau (CERN) inventent le
*World Wide Web*

> HyperText is a way to link and access information of various kinds
> as a web of nodes in which the user can browse at will.
{:.cite}

En trois mois ils

- Définissent les Hypertextes, basés sur Dynatext SGML (précurseur de HTML) ;
- Inventent le protocole HTTP ;
- Écrivent le premier serveur web,
- et le premier browser **et éditeur** (appelé WorldWideWeb, puis Nexus).

</section>
<section>

### Le concept original

> HyperText is a way to link and access information of various kinds
> as a web of nodes in which the user can browse at will.
{:.cite}

![Image de la proposition originale de Berners-Lee](http://www.w3.org/History/1989/Image2.gif)
{:.centered}

</section>
<section>

### L'histoire du WWW

**1993** ViolaWWW et Mosaic sont les premiers browsers graphiques populaires.

**1994** Fondation du World Wide Web Consortium (W3C) par Berners-Lee.

**1995** Première release du serveur web Apache.

**1995** Rasmus Ledorf crée PHP.

**1995** Le développement de Netscape (précurseur de Mozilla) commence. JavaScript est né.

**1996** Macromedia distribue Flash.

**1997** Standardisation de JavaScript en ECMAScript. Les documents deviennent *dynamiques*.

</section>
<section>

### Structure d'une page Web 1.0

![Description du modèle de flux de données du Web 1.0, par Jesse J Garret](../assets/web1.0.png)
{:.centered}

</section>
<section>

**1998** Publication du standard XML.

**1999** Java popularise (crée?) le terme *Application Web*.

> Java Servlet API 2.2 includes one new feature so significant it
> may change the way the Web works. That feature: <span
> style="color:red">Web applications</span>.
{:.cite}

**2002** Publication du format d'échange de données JSON.

**2004** Des membres de Apple, Mozilla et Opera quittent le W3C pour
fonder le WHATWG. Le travail sur HTML5 est amorcé.

**2005** Jesse James Garret crée le mot *AJAX*, acronyme de
"Asynchronous Javascript and XML". Les applications web abandonnent le
design push-pull.

**2007** Le groupe de travail HTML du W3C accepte d'utiliser le draft
  de HTML5 du WHATWG's comme base pour son prochain standard HTML.

**2012** Le
[Plan 2014](http://dev.w3.org/html5/decision-policy/html5-2014-plan.html)
prévoit que HTML 5.0 deviendra une recommandation avant la fin de
cette année.

</section>
<section>

### Structure d'une application AJAX

![Description of the AJAX dataflow model, by Jesse J Garret](../assets/web2.0.png)
{:.centered}


</section>
<section style="font-size: 90%">

## Comprendre HTTP

HTTP (*Hypertext Transfer Protocol*) est un protocole *textuel, sans
état, à requête-réponse* destiné à *servir* des documents web.

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

**Requête :** Le client (browser) demande à lire ou modifier un document (hypertexte, image, ...)

**Réponse :** Le server envoie une réponse (pas nécessairement le document).

**Textuel :** Toutes les communications sont codées en ASCII.

**Sans état :** Le server ne se souvient pas du client entre deux requêtes.

</section>
<section>

## Le protocole HTTP

Servi habituellement sur le port 80. Exemple de dialogue HTTP.

**REQUÊTE**

    GET / HTTP/1.1
    Host: www.google.fr

</section>
<section>

**RÉPONSE**

    HTTP/1.1 200 OK
    Date: Tue, 24 Jan 2012 17:09:10 GMT
    Expires: -1
    Cache-Control: private, max-age=0
    Content-Type: text/html; charset=ISO-8859-1
    Set-Cookie: PREF=ID=4479751101deda66:FF=0:TM=1327424950:LM=1327424950:S=CDCjreHNXoofkoQk; expires=Thu, 23-Jan-2014 17:09:10 GMT; path=/; domain=.google.fr
    Set-Cookie: NID=56=jkWXBR2FaxtIwRcpdJ-3nAJqgoJ2hDIqdo0Q7-ttgoCSX_5go3FrbRWBWg0em3oKnE88UcPz-4sjCwQNxb7iPcs7vu-kXQ3zKnSlXH97v-TAQgOQfNx2QqCM2XNPCUUl; expires=Wed, 25-Jul-2012 17:09:10 GMT; path=/; domain=.google.fr; HttpOnly
    P3P: CP="This is not a P3P policy! See http://www.google.com/support/accounts/bin/answer.py?hl=en&answer=151657 for more info."
    Server: gws
    X-XSS-Protection: 1; mode=block
    X-Frame-Options: SAMEORIGIN
    Transfer-Encoding: chunked

    1000
    <!doctype html>...

</section>
<section>

## La requête HTTP

<pre><code><div id="http-req-req">POST /document.html HTTP/1.1
</div><div id="http-req-head">Host: www.example.com
User-Agent: Mosaic/2.1
Cookie: sessionid=aa03x;
Content-Length: 10
</div><div id="http-req-crlf">
</div><div id="http-req-body">1234567890</div></code></pre>

<style>
html[data-incremental="1"] #http-req-req {
	outline: solid thick red;
}
html[data-incremental="2"] #http-req-head {
	outline: solid thick red;
}
html[data-incremental="3"] #http-req-crlf {
	outline: solid thick red;
}
html[data-incremental="4"] #http-req-body {
	outline: solid thick red;
}
</style>


* Action,
* Entêtes (seulement `Host` est obligatoire),
* Une ligne vide (attention: `<CR><LF>`),
* Corps du message (Optionnel).
{:.incremental}


</section>
<section>

### La ligne d'action

    POST /document.html HTTP/1.1

#### Méthode

- **HEAD** Demande seulement les entêtes.
- **GET** Demande une page. Ne modifie pas l'état du server.
- **POST** Envoie des données. Peut entraîner une modification de l'état du server.

D'autres méthodes occasionnellement utilisées: `PUT`, `DELETE`,
`TRACE`, `OPTIONS`, `CONNECT`, `PATCH`.

#### Ressource

Adresse du document web.

#### Protocole

Deux possibilités: `HTTP/1.0` ou `HTTP/1.1`. (`HTTP/2.0` en cours?)

</section>
<section class="compact">

### Entêtes des requêtes

    Host: www.example.com
    User-Agent: Mosaic/2.1
    Cookie: sessionid=aa03x;
    Content-Length: 10

Servent à envoyer des meta-données au server.

#### Obligatoires

- **Host** Le nom de domaine du server à qui on envoie la requête.
- **Content-Length** Obligatoire seulement pour POST et PUT. Donne la longueur en octets du contenu.

### Fréquentes

- **Accept-*** Type de contenu que le client accepte (type, encodage, langue)
- **Cookie** Utilisé pour la persistance côté client.
- **Referer** Adresse qui a donné origine à la requête.
- **User-Agent** Nom du browser du client.
- **Content-Type** *MIME type* du contenu (texte, HTML, etc.).

Les applications peuvent définir leur propres entêtes (en général avec
un prefixe **X-**).

</section>
<section>

## Réponse HTTP

<pre><code><div id="http-res-res">HTTP/1.1 200 OK
</div><div id="http-res-head">Date: Tue, 24 Jan 2012 18:34:40 GMT
Server: Apache/2.2.21 (Debian)
Last-Modified: Fri, 10 Dec 2010 14:10:25 GMT
Content-Length: 53
Content-Type: text/html
Set-Cookie: sessionid=jkWXBR; expires=Wed, 25-Jul-2012 17:09:10 GMT; path=/; domain=.google.fr; HttpOnly
</div><div id="http-res-crlf">
</div><div id="http-res-body">&lt;html&gt;&lt;head&gt;/head&gt;&lt;body&gt;&lt;h1&gt;Hello world!&lt;/h1&gt;&lt;/html&gt</div></code></pre>

<style>
html[data-incremental="1"] #http-res-res {
	outline: solid thick red;
}
html[data-incremental="2"] #http-res-head {
	outline: solid thick red;
}
html[data-incremental="3"] #http-res-crlf {
	outline: solid thick red;
}
html[data-incremental="4"] #http-res-body {
	outline: solid thick red;
}
</style>

* *Status line*,
* Entêtes,
* Une ligne vide (attention: `<CR><LF>`),
* Contenu (Optionnel).
{:.incremental}

</section>
<section class="compact">

### La *status line*

    HTTP/1.1 200 OK

#### Protocole + code d'état + message

Les codes d'état décrivent le résultat de la requête. Les plus fréquents :

- **200 OK** Le document a été trouvé et envoyé au client.
- **301 MOVED PERMANENTLY** Rédirection permanente (nécessite `Location`).
- **302 FOUND**
- **303 SEE OTHER**
- **307 TEMPORARY REDIRECT** Différents types de rédirection (nécessitent `Location`).
- **400 BAD REQUEST** Le client a envoyé une requête mal formatée.
- **403 FORBIDDEN** Le document n'est pas accessible.
- **404 NOT FOUND** Le document est inconnu au server.
- **410 GONE** Le document n'existe plus.
- **418 I'M A TEAPOT** [Poison d'avril IETF 1998](http://tools.ietf.org/html/rfc2324).
- **500 INTERNAL SERVER ERROR** Erreur sur le server.
- **503 SERVICE UNAVAILABLE** Le server est momentanément indisponible.

</section>
<section>

### Entêtes de la réponse

    Date: Tue, 24 Jan 2012 18:34:40 GMT
    Server: Apache/2.2.21 (Debian)
    Last-Modified: Fri, 10 Dec 2010 14:10:25 GMT
    Content-Length: 53
    Content-Type: text/html
    Set-Cookie: sessionid=jkWXBR; expires=Wed, 25-Jul-2012 17:09:10 GMT; path=/; domain=.google.fr; HttpOnly

Plus fréquentes :

- **Date**, **Expires**, **Last-Modified** Gestion des caches.
- **Content-Type** [MIME type]() du contenu de la réponse.
- **Content-Length** Longueur en octets du contenu. Non obligatoire (peut être spécifié autrement).
- **Location** Utilisé par les rédirections.
- **Sever** Nom du logiciel du server.
- **Set-Cookie** Utilisé pour la persistance côté client.


</section>
<section>

# HTML

</section>
<section>

## Balises HTML

HTML est un *langage de balisage* (*markup language*), inspiré par
SGML, pour l'écriture de documents Hypertexte **lisibles par un
human** (!!!)

~~~
<tag>
  Mon contenu <tag>plus de contenu</tag>
</tag>
~~~

Les **Balises** (**tags**) délimitent du contenu textuel :

- À chaque balise ouvrante `<tag1>` correspond une balise fermante
  `</tag1>`.
- Une balise peut en contenir d'autres, proprement imbriquées.
- Toutes balises ne peut pas aller dans toute autre.
- Certaines balises n'ont pas de contenu. Dans ce cas `<tag></tag>`
  peut être raccourci en `<tag/>`.

</section>
<section>

## Attributs

Les balises peuvent avoir des **attributs**, dans la balise ouvrante.

~~~
<tag attribut1="valeur 1"
     attribut2='valeur 2'
     attribut3=valeur3>
  Contenu
</tag>
~~~

- Les valeurs des attributs sont contenues entre guillemets simples,
  doubles ou aucun guillemet ; dans ce dernier cas (à éviter)
  elles ne doivent pas contenir d'espace.
- Certains attributs sont obligatoires pour certains tags.

</section>
<section>

## Commentaires

Les commentaires sont écris entre `<!--` et `-->`

~~~
<!-- Ceci est un commentaire, ce sera ignoré -->
<tag>Ceci sera interprété par le browser</tag>
~~~

Bien évidemment, un commentaire **n'est pas une balise**, elle lui
ressemble juste un tout petit peu.

</section>
<section>

## La structure du document

Il y a un nombre limité de balises, l'utilisateur **ne peut pas** en inventer.

Tout document HTML **doit** avoir cette forme

~~~
<html>
  <head>
    <!--
	 Le head contient toutes les informations
     sur le document qui ne sont pas du contenu
     -->
    <title>Un titre</title>
  </head>
  <body>
    <!-- Le body contient le vrai Hypertexte -->
  </body>
</html>
~~~

</section>
<section>

## Ce qui va dans le `<head>`

Le `<head>` contient tout ce qui concerne le document, mais qui n'en
fait pas partie. Voici quelques unes de ses balises plus importantes.

`<title>`: Le titre du document. Obligatoire.

`<script>`: Code pour le scripting côté client (JavaScript, VBScript, etc.).

`<style`>: Directives d'affichage (CSS, etc.).

`<meta>`: Meta-informations sur le document (langue, encodage, etc.).

`<link>`: Documents reliés (flux de news, favicons, etc.)

`<base>`: Base pour la résolution des liens.

</section>
<section class="compact">

## Ce qui va dans le `<body>`

Le `<body>` contient le vrai contenu. Voici une petite
sélection de balises.

`<section>`, `<nav>`: Structure du document.

`<header>`, `<footer>`, `<aside>`, `<address>`: Structure d'une section.

`<p>`, `<h1>`, ..., `<h6>`: Un paragraphe de texte, un titre de
premier niveau, ..., un titre de sixième niveau.

`<a>`: Une *ancre*, c.-à-d. un lien vers d'autres contenus.

`<img>`, `<audio>`, `<video>`, `<object>`, `<svg>`: Inclusion de medias.

`<form>`, `<input>`, ...: Interaction avec l'utilisateur.

`<table>`, `<tr>`, `<td>`, ...: Tableaux.

`<strong>`, `<em>`: Texte présente *différemment* (par ex., gras ou italique)

`<div>`, `<span>`: Balises avec aucune signification (imporantes pour
faire le lien avec style et scripts).

Allez voir d'autres balises sur <http://www.w3schools.com/>.

</section>
<section>

## Attributs

Les attributs jouent plusieurs rôles. Voici les plus communs.

`id`: Assigne un identifiant à une balise. Doit être unique.

`class`: Assigne une balise à une **classe** (pour regroupement logique).

`src`: Indique où trouver les ressources externes.

`href`: HyperReference. Utilisé pour faire des liens aux ressources externes.

`style`: Pour ajouter des directives de style.

`title`: Donne plus d'informations sur une balise.

`onclick`, `onload`, `onmouseover`, ...: *Event hooks* pour les scripts.

`data-*`: Attributs définissables par les utilisateurs (depuis HTML5).

</section>
<section>

## Formulaires

<svg
   id="post-img"
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:xlink="http://www.w3.org/1999/xlink"
   version="1.1"
   width="280px"
   height="440px">
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
         style="fill-rule:evenodd;stroke:#000;stroke-width:1pt;marker-start:none" />
    </marker>
  </defs>
  <g style="font-size:smaller;font-family:monospace;opacity:0.3">
    <text x="20" y="30" xml:space="preserve">POST /user HTTP/1.1</text>
    <text x="20" y="60" xml:space="preserve">Host: www.captcha.net</text>
    <text x="20" y="90" xml:space="preserve">...</text>
    <text x="20" y="120" xml:space="preserve">first=Alan&</text>
    <text x="20" y="150" xml:space="preserve">last=Turing&</text>
    <text x="20" y="180" xml:space="preserve">sex=M&</text>
    <text x="20" y="210" xml:space="preserve">email=alan@gchq.gov.uk</text>
    <line x1="280" y1="290" x2="170" y2="290"
       style="fill:none;stroke:#000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow1Lend)" />
  </g>
  <image
    xlink:href="../assets/server.png"
	x="25" y="230"
	width="128" height="139" />
    <text
		x="20" y="400"
		style="font-size: smaller"
		xml:space="preserve" >www.captcha.net</text>
</svg>

<div id="post-form">
<label for="name">First name:</label>
<input type="text" value="Alan" name="first" id="first">
<br>
<label for="name">Last name:</label>
<input type="text" value="Turing" name="last" id="last">
<br>
Gender: <label for="male">Male</label>
<input type="radio" name="sex" id="male" value="M" checked>
<label for="female">Female</label>
<input type="radio" name="sex" id="female" value="F">
<br>
<label for="email">e-mail:</label>
<input type="email" value="alan@gchq.gov.uk" name="email" id="email">
<br>
<input type="button" value="Subscribe" onclick="document.querySelector('#post-img > g').style.opacity=1;">

~~~
<form method="POST"
      action="http://www.captcha.net/user">
  First name:
  <input type="text" name="first">
  <br>
  Last name:
  <input type="text" name="last">
  <br>
  Gender: Male
  <input type="radio" name="sex" value="M">
  Female
  <input type="radio" name="sex" value="F">
  <br>
  e-mail:
  <input type="email" name="email">
  <br>
  <input type="submit" value="Subscribe">
</form>
~~~
</div>

<style>
#post-img, #post-form {
  display: inline-block;
}
#post-form {
	font-size: 12pt;
	width: 470px;
}
</style>
 
</section>
<section>

## Contrôles des formulaires

La balise `<input>` représente presque tous les contrôles. Le choix se
fait à travers l'attribut `type`.

**Champs de texte :** <input type="text" placeholder="tapez quelque chose">

~~~
<input type="text">
~~~

**Boutons radio:** <input type="radio" name="choice" value="1">A <input type="radio" name="choice" value="2">B

~~~
<input type="radio" name="choice" value="choice-1">A
<input type="radio" name="choice" value="choice-2">B
~~~

**Checkbox:** <input type="checkbox" name="check1" value="1">C <input type="checkbox" name="check2" value="2">D

~~~
<input type="checkbox" name="check1" value="check-1">C
<input type="checkbox" name="check2" value="check-2">D
~~~

</section>
<section>

**Password:** <input type="password" value="strongpass">

~~~
<input type="password">
~~~

**Fichier:** <input type="file">

~~~
<input type="file">
~~~

**Email:** (depuis HTML5, vérifie qu'il y a un @) <input type="email">

~~~
<input type="email">
~~~

</section>
<section>


**Submit:** pour envoyer une requête <input type="submit" value="Send data">

~~~
<input type="submit" value="Send data">
~~~

**Button:** pour interaction avec les scripts <input type="button" value="Click me!">

~~~
<input type="button" value="Click me!">
~~~

**Image:** envoie les coordonnées du click <input type="image" src="../assets/like.svg" width="40" alt="Like!">

~~~
<input type="image" src="like.svg" alt="Like!">
~~~

D'autres nouveaux types sont définis dans HTML5 (pour la plus part,
pas encore bien supportés): **date**, **time**, **number**, **range**,
**color**, **tel**, **url**, ...

</section>
<section>

### Autres contrôles

**Text area:** <textarea> Du texte très long </textarea>

~~~
<textarea>
Du texte très long
</textarea>
~~~


**Selection list:**
<select>
  <option value="M">MySQL injection</option>
  <option value="X">XSS</option>
  <option value="C">CSRF</option>
</select>

~~~
<select>
  <option value="M">MySQL injection</option>
  <option value="X">XSS</option>
  <option value="C">CSRF</option>
</select>
~~~


Nouveaux (et mal supportés) en HTML5 :
`<datalist>`, `<keygen>` et `<output>`.

</section>
<section>


## Validation des formulaires

<style>
.validation:invalid {background-color:#F66}
</style>


Attribut `required`: prévient si pas rempli <input class="validation" type="text" required size="10">

~~~
<input type="text" required>
~~~

Attribut `pattern`: compare l'entrée à une regexp <input class="validation" type="text" pattern="[0-9]{6}" size="10">

~~~
<input type="text" pattern="[0-9]{6}">
~~~

Attribut `placeholder`: donne une suggestion <input class="validation" type="text" placeholder="tapez quelque chose" size="10">

~~~
<input type="text" placeholder="tapez quelque chose">
~~~

Attribut `novalidate`: désactive toutes les validations précédentes.

Plus d'autres contrôles standards (par ex., urls, emails, etc.) et des
attributs liés aux nombres, aux intervalles, aux fichiers, etc.

Des validations plus compliquées doivent être faites en Javascript.


</section>
<section>

## Suivez les standards

En s'efforçant de rendre plus facile ou plus puissant la programmation
web, les développeurs des browsers ont introduit au fil du temps des
tonnes de balises et règles d'interprétation *non standard*.

Ceci a finalement amené à des **mauvaises pratiques** en programmation
web, et à des **incompatibilités**.

Le W3C essaye d'imposer les standards du Web, aussi à travers ses
outils de **validation**.

**Servez-vous en :**

- <http://validator.w3.org/>
- <http://jigsaw.w3.org/css-validator/>
- <http://validator.w3.org/mobile/>
- <http://validator.w3.org/checklink>

</section>
<section>

### Déclarer le langage

Il faut déclarer le langage et la variante dans laquelle vous écrivez
vos documents. Un document HTML5 proprement déclaré commence comme ceci
(façon préférée dans ce cours)

~~~
<!DOCTYPE html>
<html>
    <head>...</head>
    <body>...</body>
</html>
~~~

Ou comme ceci (avec l'encodage XHTML)

~~~
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>...</head>
    <body>...</body>
</html>
~~~

</section>
<section>


### Jamais assez dit : attention à l'imbrication !

**Bien**

~~~
<p>
  <strong>Gras <em>et même italique</em></strong>
</p>
~~~

**MAL!!!!!!!**

~~~
<p>
  <strong>Gras <em>et même italique</strong></em>
</p>
~~~

~~~
<p>
  <strong>Gras <em>et même italique</em></strong>
~~~

</section>
<section>

### Bonne pratique : déclarer l'encodage

Par example (préférez l'encodage Unicode)

~~~
<head>
  <meta charset="utf-8" />
  ...
</head>
~~~

ou comme ceci (encore commun dans les versions françaises de Windows)

~~~
<head>
  <meta charset="iso-8859-1" />
  ...
</head>
~~~

</section>
<section>

# CSS

</section>
<section>

## Le contenu et l'affichage

Les balises HTML renseignent sur la **signification** (la
**sémantique**) des données, pas sur la façon de les **présenter**.

Exemple : la balise controversée `<i>` (à l'origine, *italique*)

~~~
<i>Some text</i>
~~~

> *Some text*

Cependant, la spécification HTML5 dit :

> The i element now represents a span of text in an alternate voice or
  mood, or otherwise offset from the normal prose in a manner
  indicating a different quality of text, such as a taxonomic
  designation, a technical term, an idiomatic phrase from another
  language, a thought, or a ship name in Western texts.
{:.cite}

</section>
<section>

### Ne jamais faire d'assomptions sur l'affichage

Pensez à

- Browsers en mode texte ;
- Utilisateurs malvoyants;
- Utilisateurs qui lisent dans des langues étrangères (qui pourraient
  ne pas posséder un concept similaire à l'*italique*);
- Site tiers qui pourraient réutiliser votre contenu.

Donc, qui décide de l'affichage ?

Les **Feuilles de style**.
{:.centered}

</section>
<section class="compact">

## Cascading Style Sheets

CSS est un langage pour l'expression de directives d'affichage.

**Cascading** veut dire que plusieurs feuilles de style peuvent
s'appliquer à un document, le résultat est calculé d'après des règles
de precedence *en cascade*.
  
~~~
p.lead {
  font-weight: bold;
  font-family: "Gill Sans MT", GillSans, sans-serif;
  padding: 2pt;
}

p.lead:first-letter {
  font-size: 200%;
}

p.lead em {
  font-variant: small-caps;
  font-style: normal;
}
~~~

<style>
p.lead {
  font-weight: bold;
  font-family: "Gill Sans MT", "Gill Sans", GillSans, sans-serif;
  padding: 2pt;
}

p.lead:first-letter {
  font-size: 200%;
}

p.lead em {
  font-variant: small-caps;
  font-style: normal;
}
</style>

<p class="lead">Lorem ispsum <em>dolor sit</em> amet</p>

</section>
<section class="compact">

## La syntaxe CSS

**Règles CSS**

~~~
selector {property: value; property:value; ...}
~~~

**Commentaires**

~~~
/* Ceci est la seul façon de faire des commentaires en CSS
   (en effet, // n'introduit pas un commentaire)       */
~~~

**At-rules**

~~~
@import "unautrestyle.css";  /* Importe dans la feuille
                                courante */
@media screen;               /* S'applique seulement à un
                                affichage sur écran (par ex.,
								pas à l'impression) */
~~~

Référence actuelle: <http://www.w3.org/TR/2011/REC-CSS2-20110607/>

Le draft CSS3 est trop grand pour tenir en un seul module. Voir <http://www.w3.org/Style/CSS/>

</section>
<section class="compact">

## Sélecteurs CSS

**Sélecteurs simples (`tag` est toujours optionnel)**

~~~
tag {...}                /* Toute balise <tag>            */
tag.class {...}          /* Tout <tag> de classe class    */
#id {...}                /* La balise identifiée par id   */
tag:pseudoclass {...}    /* Sélection de contenu spécial  */
tag[att=val] {...}       /* Tout <tag> ayant attribut att
                            égal à val                    */
~~~
{:.css}

**Combinateurs de sélecteurs**

~~~
selector, selector {...} /* Chacun des selector                */
parent child {...}       /* child s'il est un fils de parent   */
parent > child {...}     /* child seulement s'il est un fils
                            direct de parent                   */
sister ~ brother {...}   /* brother seulement s'il suit sister */
sister + brother {...}   /* brother seulement s'il suit
                            immediatement sister               */
~~~

Référence complète: <http://www.w3.org/TR/CSS2/selector.html>

Draft CSS3: <http://www.w3.org/TR/2011/REC-css3-selectors-20110929>

</section>
<section class="compact">

## Où va le style ?

~~~
<html>
  <head>
    <!-- Ceci s'applique à tout le document -->
    <link rel='stylesheet' href='sheet.css' type='text/css' />
    <style>
      body {font-family: Arial;}
    </style>
  </head>
  <body>
    <div>
      <!-- Ceci s'applique seuelement dans ce div -->
      <style scoped>
        p {color:blue;}
      </style>
      <!-- Ceci s'applique seulement à ce paragraphe
           La syntaxe CSS y est limitée -->
      <p style="font-weight:bold">...</p>
    </div>
  </body>
</html>
~~~

</section>
<section>

## Le document et le style

~~~
<style>
  .lerouge {color:red;}
  div.lerouge {background-color:yellow;}
  #lenoir {color:black;}
  div p {font-style:italic;}
</style>
...
<p class="lerouge">Premier</p>
<div class="lerouge">
  <p id="lenoir">Deuxième</p>
  <p>Troisième</p>
</div>
~~~

<style scoped>
  .lerouge {color:red;}
  div.lerouge {background-color:yellow;}
  #lenoir {color:black;}
  /* I cheat to avoid HTML4 unscoped problems */
  div.lerouge p {font-style:italic;}
</style>
<p class="lerouge">Premier</p>
<div class="lerouge">
  <p id="lenoir">Deuxième</p>
  <p>Troisième</p>
</div>

</section>
<section>

## Le *box model*

Il y a trois types de **boîtes** en CSS :

<div style="background-color: yellow">
**Bloc:** Un *bloc* est un rectangle. Il prend toute la largeur et
autant de hauteur que nécessaire.
</div>

**Inline:** <span style="background-color:yellow"> Les *inlines* se
comportent comme des lignes de texte, qui reviennent à la ligne
lorsqu'elles atteignent la marge. Elles prennent seulement l'espace
qu'elles occupent.</span>

<div style="display:inline-block;width:60%;background-color:yellow">
**Inline-block:** Les *inline blocks*, comme les blocs, ne reviennent
pas à la ligne.  Mais, comme les inline il peut y en avoir plusieurs
sur une même ligne, et ils ne prennent que l'espace qu'ils occupent.
</div>

<div style="display:inline-block;background-color:red;width:35%">

Je prends peu de place

</div>

</section>
<section>

## Le *inline*, le *block* et le truand

Il y a des règles sur quelles balises peuvent aller dans quelles
autres. Au vieux temps, il y avait deux catégories :

- Les blocs peuvent aller dans les blocs,
- Les inlines peuvent aller dans les inlines ou les blocs,
- Les blocs ne peuvent pas aller dans les inlines.

Depuis l'introduction de la propriété `display` en CSS, on peut
changer le type de boîte d'une balise ; et avec HTML5 les règles se
sont encore complexifiées.

- Blocs par défaut: **`<div>`**, `<hX>`, `<p>`, ...
- Inlines par défaut: **`<span>`**, `<a>`, `<em>`, `<img>`, texte simple, ...


</section>
<section>

## Le *flux*

Dans le **flux normal**, les boîtes disposées du **haut vers le bas**
et de **gauche à droite** (mais le dernier peut être changé).

Les boîtes peuvent **sortir du flux** en étant positionnées
explicitement, grâce à la propriété CSS `position`:

- **static:** Le flux par défaut.
- **absolute:** Positionnement en coordonnées X-Y par rapport au bloc
  conteneur.
- **fixed:**  Positionnement en coordonnées X-Y par rapport à l'écran.
- **relative:** Positionnement en coordonnées X-Y par rapport au point
  où l'élément se serait positionné normalement.

Les boîtes peuvent aussi sortir du flux en **floattant** (propriété `float`).

</section>
<section>

## Un peu de pratique

Les **Outils du développeur** permettent d'explorer les composants
d'une page web et le box model.

**Firefox:** `Shift+Ctrl+I`, `Shift+Ctrl+K`, `Shift+Ctrl+C`, .

**Chrome:** `F12`.

</section>
<section>

## Pour la semaine prochaine

* Révisez vos bases de HTML et CSS. Les tutoriels des W3Schools
  peuvent vous aider :
  - <http://www.w3schools.com/html/html5_intro.asp>,
  - <http://www.w3schools.com/css/css3_intro.asp>.
* Créez-vous un compte sur Cloud9 <https://c9.io/>.
* Vérifiez, si possible, que vous arrivez à vous servir d'internet et
  à vous connecter sur Cloud9 depuis votre salle de TP (avec votre
  ordinateur, ou un cartable numérique).

C'est tout !

</section>

---
layout: lesson
title: Sessions
subtitle: Maintien d'état contrôlé par le serveur
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/sessions.webm
---

<section>

## Sessions

Sous le nom de **sessions** on regroupe plusieurs techniques pour la
réalisation d'un **stockage** clef-valeur **associé à un client** mais
**contrôlé par le serveur**.

- Différent du simple *stockage par le client*
  ([cookies, storage API](etat)) :
  
  - Le client ne peut pas insérer/modifier les données sans l'accord
	du serveur.
  
  - (optionnel) Les données ne sont pas visibles par le client.

- En général de courte durée (minutes) :
  
  - Réduit les risques associés au **vol/fixation de session**,

</section>
<section>

## Mécanique d'un système de session

<div class="two-cols">
<div>

1. Le client se connecte pour la première fois :
   
   - Un **identifiant de session** lui est associé,
   - le stockage est mis en place.

2. Le client visite à nouveau le site :
   
   - Il transmet l'identifiant de session
   - le serveur *reconstruit* le stockage à partir de l'identifiant.

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

## Identifiants de session

Plusieurs canaux possibles (toutes les techniques de [maintien d'état](etat)) :

- URL (*query string*, chemin)
  
  ~~~
  /home?sessid=a3423f344
  /a3423f344/home
  ~~~
  {:no-highlight}

- Formulaires cachés
  
  ~~~
  <input type="hidden" name="sessid" value="a3423f344">
  ~~~
  {:.html}

- Cookies (le plus courant) :
  
  ~~~
  Cookie: sessid=a3423f344
  ~~~

- Storage API (avec AJAX).

**Sécurité** : les identifiants de session doivent être **éphémères**,
**aléatoires** et **difficiles à deviner**.

</section>
<section>

## Stockage par le serveur

- Zones de stockage possibles
  
  - mémoire volatile (RAM),
  - fichier temporaire,
  - base de données temporaire.

- Le serveur est le seul à voir et modifier les données.

- Capable de stocker beaucoup de données (mais déconseillé).

- Système de sessions par défaut en PHP et Silex (fichier temporaire).

- En Express :
  
  - [`express-session`](https://www.npmjs.com/package/express-session)
	(en mémoire).
  - [`express-sessions`](https://www.npmjs.com/package/express-sessions)
	(base de données temporaire).
  - ...

</section>
<section>

## Stockage par le client

- Utilisation du stockage local du **client** : cookies, storage API

- Méthodes **cryptographiques** (symétriques) pour garantir
  
  - **confidentialité →** Chiffrement : le serveur est le seul à voir
	les données.
  
  - **integrité →** Signature (HMAC) : le serveur est le seul à
    pouvoir créer/modifier les données.

- Identifiant de session = zone de stockage.

- Limité à des données de petite taille.

- Le serveur doit générer une *clef secrète aléatoire* et ne jamais
  le divulguer.

- En Express : [`cookie-session`](https://www.npmjs.com/package/cookie-session).

</section>
<section class="compact">

## Exemple en Silex

~~~
// Configuration
$app->register(new Silex\Provider\SessionServiceProvider());

$app->get('/welcome',
  function(Application $app, Request $req) {
    // On stocke dans la session
    $app['session']->set('user', $req->query->get('name'));
    ...
});

$app->get('/next', function(Application $app) {
  // On cherche dans la session
  $u = $app['session']->get('user');
  if ($u) {
    return 'Hello ' . $u;
  } else {
    // Si user n'est pas défini, or rédirige sur /welcome
    return $app->redirect('/welcome');
  }
});
~~~

</section>
<section class="compact">

## Exemple en Express

~~~
var express = require('express'),
    session = require('express-session');

app.use(session( { secret : '12345' } ));

app.get('/welcome', function (req, res) {
  // On stocke dans la session
  req.session.user = req.query.user;
  ...
});

app.get('/next', function (req, res) {
  // On cherche dans la session
  if (req.session.user) {
    res.end('Hello ' + req.session.user);
  } else {
    // Si user n'est pas défini, or rédirige sur /welcome
    res.redirect('/welcome');
  }
});
~~~

</section>
<section>

## Sessions : pour/contre

### Avantages

- API transparente, cache les détails du protocole et de
  l'implantation.
- Souvent plus rapide qu'une interrogation d'une BD.

### Désavantages

- Utilise plus de ressources serveur qu'un simple stockage par le
  client.
- Quasiment toutes les implantations nécessitent des cookies.

### Alternatives et compléments

Systèmes de stockage global pour l'application

- Clef-valeur en mémoire : Redis, ...
- *Big table* : Memcached, ...

</section>
<section>

## Rapples de sécurité

**Ne pas stocker de données sensibles non chiffrées chez le client**,
  ne pas les transmettre en clair par l'URL.

**Générer des identifiants de session difficiles à deviner :**
  utiliser des générateurs aléatoires et beaucoup de caractères, les faire
  dépendre de la requête HTTP(S).
  
**Chiffrer les sessions critiques :** transmettre exclusivement par
  HTTPS les informations sensibles.

Un attaquant qui peut **voler/fixer** un identifiant de session peut
accéder à **toutes les données** de l'utilisateur.

**Donner des durées de vie limitées :** les cookies de session, les
  identifiants, ... devraient périmer rapidement (ou régulièrement).
  
**ET NE JAMAIS FAIRE CONFIANCE AU CLIENT !**
{:.centered}

</section>
<section>

## Lectures

### Documentations

- [Sessions PHP](http://php.net/manual/en/book.session.php),
- [Sessions Silex](http://silex.sensiolabs.org/doc/providers/session.html),
- Express
  - [`express-session`](https://www.npmjs.com/package/express-session),
  - [`express-sessions`](https://www.npmjs.com/package/express-sessions),
  - [`cookie-session`](https://www.npmjs.com/package/cookie-session).

### Sécurité

- [OWASP sur la fixation](https://www.owasp.org/index.php/Session_fixation),
- [OWASP sur l'interception](https://www.owasp.org/index.php/Session_hijacking_attack).

</section>

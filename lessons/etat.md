---
layout: lesson
title: Maintien d'état
subtitle: Persistance côté client, Cookies, Storage API
scripts: ['http://coffeescript.org/extras/coffee-script.js']
video:
  url: https://www.dropbox.com/s/jykcelfvjs62g4e/etat.webm?dl=1
---

<section>

## Persistance

HTTP est un protocole **sans état**.

- Les entêtes `Cookie` / `Set-Cookie`, introduites par Netscape en
  1996, sont le premier mécanisme de maintien d'état pour le Web.
- Ce mécanisme reste encore aujourd'hui le plus utilisé.

### Exemples d'état

Le server se *souvient de l'état* du client entre deux requêtes
(proches ou distantes dans le temps)

- Remplissage de fourmulaires en plusieurs étapes ;
- Navigation avec authentification (webmail, réseau social, ...) ;
- Profil utilisateur ;
- Données *dans le cloud* ;
- ...

</section>
<section>
<style scoped>
#xkcd {
  text-align: center;
  margin-top: 4em;
}
#xkcd img { width: 100%; }
</style>

## Maintenir l'état, c'est dur...

![](http://imgs.xkcd.com/comics/server_attention_span.png)
<http://xkcd.com/869>
{:#xkcd}

</section>
<section>

## Simuler l'état

HTTP n'a pas de mécanisme natif pour maintenir l'état, mais il peut le
simuler :


Entêtes HTTP
: Authentification HTTP. (Pas courant, difficile à personnaliser).

Persistance GET/POST
: Identifiants de session, protections CSRF, ...

Cookies, Storage API, IndexedDB
: Persistance assurée par le **client**.

Stockage volatile côté server
: Persistance de **courte durée** : *sessions* (dépendant du framework),
*key-value stores* (Memcached, Redis, ...).

Stockage persistant côté server
: Persistance de **longue durée** : système de fichiers, bases de
données (SQL, NoSQL, ...).

</section>
<section>

## Persistance GET/POST

Passer l'état dans les *paramètres* de la requête

### Exemples

Par la *query string*
  
~~~
http://.../profile?user=toto
~~~
{:.bash}

Par l'URL (utilisation du *router*)
 
~~~
http://.../users/toto/profile
~~~
{:.bash}

Par le corps de la requête (de type POST)
 
~~~
POST /profile HTTP/1.1
...

user=toto
~~~
{:.bash}

</section>
<section>

## Persistance GET/POST

### Avantages

- Facile à implanter ;
- Robuste : les browsers ne risquent pas de le bloquer ;
- *Linkability*, *Searchability* : les données sont lisibles dans
  l'URL.

### Désavantages

- Les liens statiques doivent être générés dynamiquement (facilité par
  les templates) ;
- Limité à des données de petite taille.

### Problèmes potentiels de sécurité

Les données sensibles (mots de passe, etc.) ne doivent pas :

- **persister** dans ce canaux.
- **transiter** par l'URL (risques liés au copier-coller, aux caches des proxies, ...).

</section>
<section>
<style scoped>
#browser { display: flex; }
#browser .window, #browser .source {
  border: solid thin black;
  height: 7em;
}
#browser .window { flex: 0 1 19em; }
#browser .source {
  margin: 0;
  flex: 1;
}
#browser .address { border: solid 3px #aaa; }
#browser .body { padding: 1ex;
</style>

## Exemple (méthode GET)

<p id="browser"></p>
<script type="text/coffeescript">
$bw = $ '#browser'
$win = $bw.append 'div.window'
$adr = $win.append 'div.address'
$bdy = $win.append 'div.body'
$src = ($bw.append 'pre.source.html').append 'code'

$adr.textContent = 'http://.../'
$bdy.append 'h3 Bonjour, présentez-vous'
$bdy.innerHTML += '<input type="text"><button>Entrer</button>'
$src.textContent = '''
    <form method="get" action="aujourdhui">
      <h3>Bonjour, présentez-vous</h3>
      <input type="text" name="nom">
      <input type="submit" value="Entrer">
    </form>'''
hljs.highlightBlock $src

($bdy.$ 'button').on 'click', ->
 t = ($bdy.$ 'input').value
 $adr.textContent = "http://.../aujourdhui?nom=#{t}"
 $bdy.innerHTML = ""
 $bdy.append "p Bonjour #{t}, <a href='#'>à demain</a>"
 $src.textContent = """<p>Bonjour #{t},
   <a href='demain?nom=#{t}'>à demain</a>
 </p>"""
 hljs.highlightBlock $src

 ($bdy.$ 'a').on 'click', (e) ->
  $adr.textContent = "http://.../demain?nom=#{t}"
  $bdy.innerHTML = ""
  $bdy.append "p Bonjour #{t}"
  $src.textContent = "<p>Bonjour #{t}</p>"
  hljs.highlightBlock $src
  e.preventDefault()
  false
</script>

~~~
$app->get('/aujourdhui', function(Request $req){
    $n = $req->query->get("nom");
    return "<p>Bonjour $n, <a href='demain?nom=$n'>à demain</a></p>";
});
~~~
{:.php}

~~~
$app->get('/demain', function(Request $req){
    $n = $req->query->get("nom");
    return "<p>Bonjour $n</p>";
});
~~~
{:.php}

</section>
<section>

## Cookies

*clef-valeur* stockés *temporairement* par le *client* **pour
le compte d'un site** (domaine).

- Le server fait la demande avec une entête `Set-Cookie`
  
  ~~~
  HTTP/1.1 200 OK
  ...
  Set-Cookie: user=toto
  ~~~
  {:.bash}

- JavaScript peut aussi demander au browser de stocker un cookie
  (dépassé par la Storage API)
  
  ~~~
  document.cookie = 'user=toto';
  ~~~

- Le browser envoye le cookie dans toute requête **pour le même
  domaine**
  
  ~~~
  GET /app HTTP/1.1
  ...
  Cookie: user=toto
  ~~~

- Les cookies sont stockés et envoyés jusqu'à expiration.

</section>
<section class="compact">

## Cookies et frameworks

En Silex

~~~
use Symfony\Component\HttpFoundation as HTTP;

function handler(HTTP\Request $req) {
  $req->cookies->get('user');                                 // lire les cookies
  $res = new HTTP\Response();
  $res->headers->setCookie(new HTTP\Cookie('user', 'toto'));  // écrire un cookie
  $res->headers->clearCookie('user');                         // effacer un cookie
}
~~~

En Node.js

~~~
var cookieParser = require('cookie-parser');
app.use(cookieParser());

function handler(req, res) {
  req.cookies.user;                 // lire les cookies
  res.cookie('user', 'toto');       // écrire un cookie
  res.clearCookie('user');          // effacer un cookie
}
~~~

</section>
<section>

## Storage API

- Stockage clef-valeur, introduit avec HTML5,
- API entièrement côté client (JavaScript),
- Dépasse les limitations des cookies sur la taille des données,
- Garanties sur la durée du stockage.
- Deux interfaces, attachées au **domaine** :
  - `sessionStorage` : jusqu'à la fermeture du browser,
  - `localStorage` : persistant.

~~~
if (sessionStorage['user'] === undefined) {
  sessionStorage['user'] = 'toto';
}
delete sessionStorage['user'];
~~~


Plus d'informations : [page du MDN](https://developer.mozilla.org/DOM/Storage).

</section>
<section>

## Stockage par le client

### Utilisations

- **Cookies :** *identifiants de session*, compatibilité,
- **Storage API :** toutes applications, stockage de taille réduite,
- **IndexedDB :** grandes quantités de données.

### Avantages/Désavantages

- Léger pour le serveur, adapté à un site statique.
- Le client peut refuser le stockage.

### Problèmes de sécurité potentiels

- Vol de cookies : compromission de session,
- Ne jamais stocker un *mot de passe maître* chez le client, seulement
  des *mots de passe éphémères* (*identifiants de session*).


</section>

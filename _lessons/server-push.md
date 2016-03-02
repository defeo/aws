---
layout: lesson
title: Communication bidirectionnelle
subtitle: Server push et websockets
---

<section>

## *Server push*

### Problème : AJAX est **unidirectionnel**

1. Le client envoie des données dans la requête,
2. Le server répond avec des données.

- Le server ne peut pas initier un transfert de données ;
- Le server ne peut pas appeler des fonctions (déclencher des
  évènements) chez le client.

**Simuler** une communication bidirectionnelle
  ([Comet](http://en.wikipedia.org/wiki/Comet_%28programming%29))

- *Short polling*, *Long polling*, *Streaming*.

**Vraie** communication bidirectionnelle

- `EventSource`, WebSockets.

</section>
<section>

## *Polling*

Utile pour : notifications, compatibilité avec vieux browsers

### *Short polling*

1. Le client envoie une requête AJAX à **intervalles réguliers** (de
   l'ordre de la seconde),
2. S'il y a des notifications depuis la dernière requête, le server
   les envoie dans la réponse.

### *Long polling*, *Streaming*

1. Le client ouvre une connexion HTTP avec le server,
2. Le server envoie les entêtes mais ne ferme pas la connexion,
3. Lorsque des notifications arrivent, le server les envoie dans la
   connexion ;
4. (*long polling*) Le server ferme la connexion.

</section>
<section>

## Polling

### Avantages

- Compatible avec les vieux browsers,
- Ne demande pas de support spécifique chez le server.

### Désavantages

- Gourmand en bande passante et ressources (*overhead* du protocole
  HTTP),
- Latence.

</section>
<section class="compact">

## Event stream

Format de streaming **unidirectionnel Server → Client** : la connexion
reste ouverte

<pre class="http"><code>HTTP/1.1 200 OK
Content-Type: text/event-stream
...

<span id="evt-1">data: un message</span>

<div id="evt-2">data: un autre
data: message
</div>
<div id="evt-3">event: toto
data: un message avec un nom
</div>
<span id="evt-4">data: { "msg" : ["Porquoi", "pas", "du", "JSON"] }</span>
</code></pre>

<style>
html[data-incremental="1"] #evt-1,
html[data-incremental="2"] #evt-2,
html[data-incremental="3"] #evt-3,
html[data-incremental="4"] #evt-4
{ outline: solid thick red }
</style>

1. Un message d'une ligne,
2. Un message sur plusieurs lignes,
3. Un message *nommé*,
4. On est libres de choisir le format des données.
{:.incremental}

</section>
<section class="compact">

## Exemple de event stream : serveur

~~~
app.get('/api/notifications', function(req, res) {
  res.set({                                        // Configuration des entêtes
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });                                              // On envoie les entêtes
  res.writeHead(200);
  
  var count = 0;                                   // On envoie un message
  var timer = setInterval(function() {             // toutes les 2 secondes
    res.write('data: Hello ' + count + '\n\n');
    count++;
    if (count >= 10) {                             // Après 10 messages on
	  res.end();                                   // ferme la connexion
	  clearInterval(timer);
	}
  }, 2000);
});
~~~

- Facile en Node.js,
- Nécessite configuration spécifique pour Apache+PHP.

</section>
<section>

## Exemple `EventSource` : client

Le client est notifié des messages du server par des **évènements**

~~~
var evt = new EventSource("/api/notifications");

// Messages sans nom
evt.addEventListener('message', function(e) {
  console.log(e.data);
});

// Messages nommés
evt.addEventListener('toto', function(e) {
  console.log('Évènement nommé :', e.data);
});
~~~

- **Pour :** Léger, simple, relativement bien supporté,
- **Contre :** Unidirectionnel, nécessite le support du serveur,
- **Démo :** <http://www.w3schools.com/html/tryit.asp?filename=tryhtml5_sse>.

</section>
<section>

## Web Sockets

Protocole de communication **full-duplex**, compatible avec HTTP.

- Protocole applicatif **au dessus de TCP** : pas de overhead HTTP ;
- Conçu pour utiliser le **même port** que HTTP (port 80 par défaut).

<div class="two-cols">

~~~
GET /app/socket HTTP/1.1
Upgrade: websocket
Connection: Upgrade
...
~~~
{:.http}

~~~
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
...
~~~
{:.http}

</div>

1. Le client demande une connexion web socket,
2. Le server répond avec `101 Switching Protocols`,
3. Le server et le client établissent une connexion TCP de type Web
   (schema `ws://`) Socket.
{:.incremental}

</section>
<section>

## Web Sockets

### Avantages

- Bidirectionnels,
- Peu de overhead,
- Standardisés par l'IETF en 2011.

### Désavantages

- Nécessitent de support dans le server,
- Pas adaptés au modèle d'exécution Apache+PHP,
- API pas encore standardisée par le W3C.

### Bibliothèques

- Node.js : module
  [`websocket`](https://www.npmjs.com/package/websocket),
  <http://socket.io/> (cross browser, très simple à utiliser),
- PHP : <http://socketo.me/> (très difficile à configuer).

</section>
<section>

## Lectures

- [Tutoriel de html5rocks `EventSource`](http://www.html5rocks.com/en/tutorials/eventsource/basics/).
- [Tutoriel MDN `EventSource`](https://developer.mozilla.org/docs/Server-sent_events/Using_server-sent_events).
- [Guides MDN Web Sockets](https://developer.mozilla.org/docs/WebSockets).
- Exemple de [chat en Express+socket.io](http://socket.io/get-started/chat/).

</section>

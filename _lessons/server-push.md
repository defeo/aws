---
layout: lesson
title: Communication bidirectionnelle
subtitle: Server push et WebSockets
---

<section>

## *Server push*

### Problème : AJAX est **unidirectionnel**

1. Le client envoie des données dans la requête,
2. Le serveur répond avec des données.

- Le serveur ne peut pas initier un transfert de données ;
- Le serveur ne peut pas appeler des fonctions (déclencher des
  évènements) chez le client.

**Simuler** une communication bidirectionnelle
  ([Comet](http://en.wikipedia.org/wiki/Comet_%28programming%29))

- *Short polling*, *Long polling*, *Streaming*.

**Vraie** communication bidirectionnelle

- `EventSource`, WebSockets.

</section>
<section>

## *Polling*

Utile pour : notifications, compatibilité avec vieux navigateurs

### *Short polling*

1. Le client envoie une requête AJAX à **intervalles réguliers** (de
   l'ordre de la seconde),
2. S'il y a des notifications depuis la dernière requête, le server
   les envoie dans la réponse.

### *Long polling*, *Streaming*

1. Le client ouvre une connexion HTTP avec le serveur,
2. Le serveur envoie les entêtes mais ne ferme pas la connexion,
3. Lorsque des notifications arrivent, le serveur les envoie dans la
   connexion ;
4. (*long polling*) Le server ferme la connexion.

</section>
<section>

## Polling

### Avantages

- Compatible avec les vieux navigateurs,
- Ne demande pas de support spécifique chez le serveur.

### Désavantages

- Gourmand en bande passante et ressources (*overhead* du protocole
  HTTP),
- Latence.

</section>
<section class="compact">

## Event stream

Format de streaming **unidirectionnel Serveur → Client** : la connexion
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

Plus de détails : <https://hpbn.co/server-sent-events-sse/>.

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

- Facile en Node.js, plusieurs
  [paquets disponibles](https://www.npmjs.com/browse/keyword/server-sent-events)
  (notamment,
  [`sse-writer`](https://www.npmjs.com/package/sse-writer)).
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
2. Le serveur répond avec `101 Switching Protocols`,
3. Le serveur et le client établissent une connexion TCP de type Web Socket
   (schema `ws://` ou `wss://`).
{:.incremental}

</section>
<section>

## Exemple WebSocket : serveur

Exemple avec le paquet Node [`ws`](https://www.npmjs.com/package/ws):

```
var WebSocket = require('ws');

var server = new WebSocket.Server({ port: 8080 });

server.on('connection', function connection(ws) {
  ws.on('message', function(message) {
    console.log('received:', message);
  });

  ws.send('something');
});
```

</section>
<section>

## Exemple WebSocket : client (navigateur)

Exemple avec
l'[API standardisée par le W3C](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

```
var ws = new WebSocket('ws://localhost:8080');

ws.addEventListener('open', function(e) {
  ws.addEventListener('message', function(e) {
    console.log('received:', e.data);
  });
	
  ws.send('something else');
});
```

</section>
<section>

## Web Sockets

### Avantages

- Bidirectionnels,
- Peu de overhead,
- Standardisés par l'IETF en 2011 (et *Candidate Recommendation* du W3C),
- Disponibles dans tous les navigateurs modernes.

### Désavantages

- Nécessitent de support dans le serveur,
- Difficiles à configurer avec Apache+PHP.


### Bibliothèques

- Paquets Node.js : [`ws`](https://www.npmjs.com/package/ws),
  [`μws`](https://www.npmjs.com/package/uws),
  [`engine.io`](https://www.npmjs.com/package/engine.io),
  [`primus`](https://www.npmjs.com/package/primus), ...
- Bibliothèque compatible Node.js : <http://socket.io/>;
- PHP : <http://socketo.me/>.

</section>
<section>

## Lectures

- [Tutoriel de html5rocks `EventSource`](http://www.html5rocks.com/en/tutorials/eventsource/basics/).
- [Tutoriel MDN `EventSource`](https://developer.mozilla.org/docs/Server-sent_events/Using_server-sent_events).
- [Détail du protocole SSE](https://hpbn.co/server-sent-events-sse/)
  par [*Ilya Grigorik*](https://www.igvita.com/).
- [Guides MDN Web Sockets](https://developer.mozilla.org/docs/WebSockets).
- Exemple de [chat en Express+socket.io](http://socket.io/get-started/chat/).

</section>

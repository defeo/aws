---
layout: lesson
title: Two-way communication
subtitle: Server push and WebSockets
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/websockets.webm
---

<section>

## *Server push*

### Problem: AJAX is **one-way** (request/response)

1. The client sends data in the request,
2. The server replies with data.

- A server cannot **initiate data transfers**;
- A server cannot **initiate actions** on the client (reverse remote
  procedure call).

**Simulate** two-way communication (see
  [Comet](https://en.wikipedia.org/wiki/Comet_%28programming%29))

- *Short polling*, *Long polling*, *Streaming*.

**True** two-way communication

- `EventSource`, WebSockets, ...

</section>
<section>

## *Polling*

Useful for: notifications, backwards compatibility

### *Short polling*

1. The client **regularly** sends AJAX request (i.e., every few seconds),
2. If there's new data, the server sends it in the response.

### *Long polling*, *Streaming*

1. The client opens a HTTP with the server,
2. The server sends HTTP headers, **does not close connection**
   
   ```http
   HTTP/1.1 200 OK
   Connection: keep-alive
   ```

3. When new data arrives, the server sends it in the response body;
4. (only in *long polling*) the server shuts down the connection after
   the first batch of data, client opens a new connection.

</section>
<section>

## Polling

### Pros

- Backwards compatibility,
- No special server support (for short polling),

### Cons

- Expensive in bandwidth and resources (HTTP *overhead*),
- Latency.

</section>
<section>

## Web Sockets

**Full-duplex** communication protocol, HTTP-compatible.

- Application-level protocol **over TCP**: no HTTP overhead;
- Meant to use the **same port** as HTTP (80 or 443).

<div class="two-cols">

```http
GET /app/socket HTTP/1.1
Upgrade: websocket
Connection: Upgrade
...
```
{:#ws-client}

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
...
```
{:#ws-server}

</div>

<style>
html[data-incremental="1"] #ws-client pre,
html[data-incremental="2"] #ws-server pre
{ box-shadow: 0 0 5px 5px blue }
</style>

1. The client asks for a web socket connection via HTTP,
2. The server replies with `101 Switching Protocols`,
3. The server and the client establish a Web Socket TCP connection
   (`ws://` or `wss://` schema).
{:.incremental}

</section>
<section>

## WebSocket example: server

Example using the [`ws`](https://www.npmjs.com/package/ws) package:

```js
var WebSocket = require('ws');

var server = new WebSocket.Server({ port: 80 });

server.on('connection', function connection(ws) {
  ws.on('message', function(message) {
    console.log('received:', message);
  });

  ws.send('something');
});
```

</section>
<section>

## WebSocket example: client (browser)

Example using the [native browser
API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

```js
var ws = new WebSocket('ws://www.example.com/');

ws.addEventListener('open', function(e) {
  ws.addEventListener('message', function(e) {
    console.log('received:', e.data);
  });
    
  ws.send('something else');
});
```
</section>
<section>

## Server example with Express and ws <small>(see [demo](https://glitch.com/~defeo-lu-aws-ws-demo))</small>

```js
var http = require('http');
var express = require('express');
var WebSocket = require('ws');

var app = express();
var server = http.createServer(app);
var wsserver = new WebSocket.Server({ server: server });

wsserver.on('connection', function connection(ws) {
  ws.on('message', function(message) {
    console.log('received:', message);
  });

  ws.send('something');
});

server.listen(80);
```

</section>
<section>

## Web Sockets

### Pros

- Two-way
- Little overhead,
- Supported by all modern browsers.

### Cons

- Need special support in the server.
- Not compatible with old browsers.
- Hard to mix with old style web programming (best to go
  *full-WebSockets or nothing*).

### Node.js libraries

- Basic implementations: [`ws`](https://www.npmjs.com/package/ws),
  [`μws`](https://www.npmjs.com/package/uws),
  [`engine.io`](https://www.npmjs.com/package/engine.io),
  [`primus`](https://www.npmjs.com/package/primus), ...
- Overlay libraries: <https://socket.io/> (automatic fallback, JSON handling, ...).

</section>
<section>

## Other server push techniques

### Event streams and `EventSource` ([demo](https://www.w3schools.com/html/tryit.asp?filename=tryhtml5_sse))

- A standardized version of HTTP streaming,
- Uses special `Content-Type: text/event-stream`,
- Standardized browser support via the [`EventSource`
  API](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events).

**Pros:** easy to implement, compatible with old-style AJAX.  
**Cons:** HTTP overhead, one-way (server to client), inconsistent support.

### Service workers and Push notifications

- **[Service
  workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API):**
  technology for offline web apps, background work;
  
- **[Push
  notifications](https://developer.mozilla.org/en-US/docs/Web/API/Push_API):**
  API to send notifications to a Service Worker.

**Pros:** powerful, enables unique features (mobile oriented).  
**Cons:** still experimental, advanced API.

</section>
<section>

## References

### WebSockets

- MDN [guides on Web
  Sockets](https://developer.mozilla.org/docs/WebSockets): [writing
  clients](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications),
  [writing
  servers](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers),
  ...
- [`ws` package docs](https://github.com/websockets/ws).
- [Chat example](https://socket.io/get-started/chat/) with Express + socket.io.

### Other technologies

- [MDN tutorial on `EventSource`](https://developer.mozilla.org/docs/Server-sent_events/Using_server-sent_events).
- [html5rocks tutorial on `EventSource`](https://www.html5rocks.com/en/tutorials/eventsource/basics/).
- [Details on SSE](https://hpbn.co/server-sent-events-sse/)
  by [*Ilya Grigorik*](https://www.igvita.com/).
- [MDN on Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).
- [MDN on Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API).

</section>

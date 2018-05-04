---
title: AJAX, events, WebSockets
---

In this tutorial we will learn how to use AJAX and WebSockets to code
a *single page app*, a client-server application that runs from a
single view.

We will take the client-only Connect Four application we coded in
[this tutorial](tutorial2), and we will transform it in a multi-user
game app.

The references for this tutorial are:

- The [MDN page on JavaScript
  classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes),
- The [MDN page on
  XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest),
- The [MDN page on the Fetch
  API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch),
- The [MDN pages on AJAX](https://developer.mozilla.org/docs/AJAX),
- The [`ws` module docs](https://github.com/websockets/ws) for
  WebSockets.
- This [MDN tutorial on
  WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications).


## Prepare your workspace

Create a new Node app on Glitch. Install the following packages through `package.json`:

- `body-parser` for handling POST requests,
- `ws` for handling WebSockets.

Our application will use no templates, and for the moment we do not
need a database either.

## The main page

The only view for the user will be served from the `/` URL. This will
be a very simple static HTML page that loads a style sheet and the
client script. Something along these lines:

```html
<!Doctype html>
<html>
    <head>
        ...
        <link rel="stylesheet" href="..." />
    </head>
    <body>
        <div id="main">
            Please, enable JavaScript.
        </div>
        
        <script src="..."></script>
    </body>
</html>
```

1. Create a static HTML page as above (do not forget compulsory tags,
   such as `<meta charset>` and `<title>`), and serve it at the `/`
   URL, using `express.static()` (preferred) or `app.sendFile()` (see
   the [reflector
   tutorial](reflector#intermezzo-serving-static-files)).
   
2. Create the style sheet and the script (both empty, for the
   moment). Serve them using `express.static()` or `app.sendFile()`.
   
   Test that everything works correctly by, e.g., changing the text
   *"Please, enable JavaScript"* to *"Welcome to Connect Four!"* upon
   page load.

## Getting the user id

For the moment we will let the client choose its user name at page
load, without creating a user account with a password.

1. Upon loading the main page, show a popup asking for the user
   name. You can use the (synchronous, blocking, oldie but still
   goodie) function
   [`prompt`](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt)
   to create the popup.

2. When the user gives its name, save it in `sessionStorage`, so that
   the value is kept in memory as long as the browser stays open.
   
3. Modify your code so that the popup is only shown if a username is
   not available in [`sessionStorage`](../lessons/etat#storage-api)
   yet.
   
   You can use several browser tabs and/or private navigation
   (`Shift+Ctrl+P` in Firefox, `Shift+Ctrl+N` in Chrome) to do your
   tests. You can also empty the `sessionStorage` through the
   developer tools, or by issuing `sessionStorage.clear()` in the
   console.

4. Change the text shown in the main page to *"Hello ..."* when the
   user name is known (replace the dots by the user name).
   
## Communicating the user id to the server

We will now use AJAX to send the user name to the server, so that it
can create a list of all connected users.

We need a way to store the list of connected users on the server. Good
practice would suggest that we store this list in a database (either a
SQL database, or an in-memory key-value store, such as
[Redis](http://redis.io/)). However, we will make it simple and store
this list in a global variable in the server code. This technique is a
bit fragile and prone to memory leaks, but works nevertheless.

1. On the server side, create a **global variable** `connected_users`,
   initialized to the empty object:
   
   ```js
   var connected_users = {};
   ```

2. To conveniently represent the users, we will create a
   [JavaScript](../lessons/javascript#classes-new-in-es6)
   [class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).
   Create a class named `User` with a very simple constructor:
   
   ```js
   constructor(name) {
       this.name = name;
   }
   ```

3. Create a GET handler for the `/connect/:user` URL. When a request
   is received:
   
   - the username is recovered from the URL (use `req.params`);
   - a new `User` is created with the given name;
   - the user is added to `connected_users`, using the username as key:
     
     ```js
     connected_users[name] = new User(name);
     ```
     
     This will allow us to lookup users in `connected_users` quickly.

   After the user is inserted in `connected_users`, send an
   acknowledgment message using `res.json`.
   
   Test your handler by manually visiting `/connect/:user` in your
   browser.
   
4. On the client-side, now, use `XMLHttpRequest` or `fetch()` to send
   your username to `/connect/:user`. Wait for the acknowledgment
   message and log it to the console.

5. GET method is handy for debugging, however we are changing the
   state of the server with the route `connect/:user` and a GET 
   request should not change the state of the server.  Turn GET
   into POST for this route.

## Getting the user list

1. Create a new handler for the `/userlist` URL. It must take the
   contents of `connected_users`, transform them to a list, and send
   them via `res.json()`.
   
   **Hint:** To transform a JavaScript object to a list, you can
   either write a for loop, or use
   [`Object.values`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values).
   
2. On the client side, after having successfully connected, use
   `XMLHttpRequest` or `fetch()` to get the user list. Using the DOM
   API, dynamically present the user list in the browser as a
   `<table>` containing one row per user.
   
   Test using several tabs. You can also ask a fried to connect to
   your app.
   
   **Hint:** for convenience, it is best to write a function, say
   `createUserList`, that takes the list of users as input and returns
   a DOM element representing the `<table>`. Then you can add this DOM
   element to the document by replacing the children of the div
   `#main`.

3. Using `setInterval()`, update the list of users every 2 seconds.


## Handling disconnections

1. Create a **POST** handler for `/disconnect/:user`. When a request is
   received, the corresponding user is removed from `connected_users`.
   You can remove an element from an object by using
   
   ```js
   delete connected_users[...]
   ```

2. On the client side, listen for the
   [`beforeunload`](https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload)
   event that is fired when the browser window is closed. React by
   sending a
   [*beacon*](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)
   to `/disconnect/:user` (a *beacon* is like a POST AJAX request, but
   it is guaranteed to be sent even if the window is closing).
   
   Test your application using several tabs.
   
   **Note:** `beforeunload` is also fired when you reload the page, so
   expect a lot of disconnection events everytime you restart the
   server (as Glitch reloads the page automatically).

## Enter WebSockets

We have reached the limits of the AJAX technique. We could keep using
AJAX and *short polling* to write the full application, however this
would quickly become messy, slow and error prone. Instead, we will
replace our AJAX calls with WebSockets.

To handle WebSockets on the server side, we will use the [`ws`
module](https://www.npmjs.com/package/ws). On the client side, we will
use the native [`WebSocket`
API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications). These two have a very similar interface.

Let's start from the server. To load and configure the `ws` module,
modify your application like thus:

```js
var http = require('http');
var ws = require('ws');
var express = require('express');
var app = express();

// etc...

// We attach express and ws to the same HTTP server
var server = http.createServer(app);
var wsserver = new ws.Server({ 
    server: server,
});

// We define the WebSocket logic
wsserver.on('connection', function(wsconn) {
    console.log('Received new WS connection');
    wsconn.send('Hello world!');
    wsconn.on('message', function(data) {
        console.log(data);
    });
    // etc...
});

// Watch out for this: app.listen would break ws!
server.listen(process.env.PORT);
```

On the client side, it is very easy to talk to this WebSocket server

```js
var ws = new WebSocket('wss://' + window.location.host)

ws.addEventListener('open', function(e) {
    ws.send('Hi world!');
    ws.addEventListener('message', function(e) {
        console.log(e.data);
    });
});
```

**Warning:** Take note of the minor differences: 

- The event is named `connection` on the server and `open` on the
  client (as these are subtly different: it is always the client who
  *opens the connction*);
- It is `.addEventListener()` in the client and `.on()` in the server;
- Callback parameters are subtly different.

**Warning:** The `wss://` scheme is for WebSockets encrypted over
TLS. This is only compatible with an HTTPS server. If you are
developping locally, you must use `ws://` instead.

1. Remove the AJAX call to `/connect/:user` from the client. Replace
   it with a WebSocket message sending the user name to the server.
   
2. On the server side, wait for this message and insert the user into
   `connected_users`.

3. We will need to use the WebSocket channel to transfer many other
   messages, and the server and client must be able to distinguish
   them. Thus, it is not acceptable to send the username as plaintext
   data. Instead, we will serialize data using JSON.
   
   - On the client side, create a message with this structure:
     
     ```js
     { type: 'new_connection', username: '...' }
     ```
     
     serialize it using `JSON.stringify()` and send it via the
     WebSocket.
     
   - On the server side, parse the message with `JSON.parse()`, check
     that the message type is `new_connection`, then create the new
     user.
   
4. We need to keep track of which user is associated to which
   WebSocket connection. Store a reference to the current user inside
   the connection callback. Something like this:
   
   ```js
   function(wsconn) {
       var myuser = null;
       
       wsconn.on('message', function(data) {
           myuser = new User(...);
           ...
       });
   }
   ```

5. Remove the beacon to `/disconnect/:user`.

6. On the server side, detect a disconnection by listening to the
   `close` event on `wsconn`. If `myuser` is not `null`, remove the
   user from `connected_users`.

Test your application using several tabs. Verify that connections and
disconnections happen consistently.

## Ditching short polling

We still haven't removed the short polling to `/userlist`. We must now
notify all WebSocket clients whenever a connection/disconnection
happens.

1. Remove the AJAX calls to `/userlist` from the client.

2. By looking at [this
   example](https://github.com/websockets/ws#broadcast-example),
   modify your server so that it broadcasts to all connected clients
   the list of users whenever a connection or disconnetion happens.
   
   **Note:** You must now use `JSON.stringify()` on the server, and
   `JSON.parse()` on the client. Like you did before, choose a
   meaningful `type` for this message.

3. Modify your client so that it updates the list of users whenever it
   receives a new message.
   
Test your application using several browsers tabs.

## Challenging

We are ready to initiate a game. We need to encode the logic that
allows one user to challenge another. Instead of broadcast messages to
all users, we now need to send specific messages to each user.

1. Modify your `User` class to hold three parameters:
   
   ```js
   constructor(name, wsconn) {
       this.name = name;           // The user name
       this.wsconn = wsconn;       // The WS connection to the user browser
       this.state = 'AVAILABLE';   // An internal state
   }
   ```
   
2. In the server, modify the WebSocket message handler to pass the
   current connection to `new User(...)`.

3. The `wsconn` object is not serializable by `JSON.stringify()`; we
   must adapt our code. Add a `.toJSON()` method to the class
   `User`, like thus
   
   ```js
   toJSON() {
       return {
           name: this.name,
           state: this.state,
       }
   }
   ```
   
   Modify the server code so that it uses `serialize()` when
   broadcasting the user list.

3. Modify the client code producing the list of users, so that it puts
   next to the user names a column with *"Challenge"* buttons, like
   thus
   
   | foo | <button>Challenge</button>
   | bar | <button>Challenge</button>
   | baz | <button disabled>Challenge</button>
   {:.pretty.centered}
   
   The buttons must be *disabled* if the user state is not `AVAILABLE`
   (you can enable/disable a button `b` via JavaScript by setting
   `b.disabled` to `false/true`).
   
   Add an event listener to the *"Challenge"* buttons: whenever a
   button is clicked, a WebSocket message is sent to the server,
   containing the name of the challenged user.

4. In the server, add a `.invite(opponent)` method to the `User`
   class. This method takes another user (`opponent`) as parameter and
   does the following:
   
   - Checks that `opponent` is not `this` (a user can't challenge itself);
   - Checks that `opponent` and `this` are both `AVAILABLE`;
   - Switches the state of both `opponent` and `this` to `PLAYING`;
   - Returns `true`;
   
   Modify the WebSocket `message` handler to handle *challenge*
   message types. When a new challenge request is received, it calls
   the `.invite()` method on the challenger user, then

   - Sends a WebSocket message to `opponent` to notify it of the new
     game;
   - If everything has gone well:
     - it sends a WebSocket message to `this` to notify it of the
       start of the game;
     - it broadcasts a message to all users with the updated list of
       users;
   - If there has been an error:
     - it sends a WebSocket message to `this`, explaining the error.

5. Modify the client code to replace the user list with a message
   *"You are playing with..."* whenever a user is in `PLAYING` state.

Test your code using several browsers tabs.

## Quitting the game

Before coding the game, let's jump straight to the end of it.

1. In the server, create a class `Game` representing a game between
   two users. For the moment, this class only has two fields:
   `player1` and `player2`. By default, `player1` is the challenged.

2. Modify `User.invite()` so that it creates a new `Game` instance
   whenever a user challenges another. The `Game` instance will point
   to the two users, and each of the users will point to it.

3. Add a *"Quit"* button under the *"You are playing with..."*
   message. When the user clicks it, send a quit message to the
   server.

4. Add a `.quit()` method to the `Game` class. It resets the user
   states to `AVAILABLE`, and removes the references to itself.

5. Add a `.quit()` method to the `User` class. It must:
   
   - Check that the user is `PLAYING`,
   - Call the `.quit()` method of the associated `Game`,
   - Return `true` if everything went well.
   
   Modify the WebSocket `message` handler to handle *quit*
   message types. When a new quit request is received, it calls
   the `.quit()` method, then it must

   - Notify the opponent that the game is over,
   - If everything has gone well:
     - send a WebSocket message to `this` to notify it of the
       end of the game;
     - broadcast a message to all users with the updated list of
       users;
   - If there has been an error:
     - send a WebSocket message to `this`, explaining the error.

6. Modify the client so that it reverts to showing the list of users
   when a game has ended.

## Let's play

And we finally come to the real game. Using the code you wrote for
[the Connect Four tutorial](tutorial2), or [this
solution](https://codepen.io/defeo/pen/emPevV), you will make a full
multi-user Connect Four app.

Instructions are going to become more approximate from now on.

1. Below the *"You are playing with..."* message, show the game board.

2. Store the state of the game in the `Game` class: a 6×7 grid, and a
   variable tracking which player plays next (`player1` takes red and
   starts).

3. Modify the click handler on the board so that:
   
   - If the move is valid (it's the player's turn, and the column is
     not full), a message is sent to the server through the WebSocket;
   - If the move is invalid, an error message is shown.

4. Write the game logic in the server. When a move is received from
   the client, it must:
   
   - Check that the move is valid (checking on the client side is not
     enough);
   - Update the state;
   - Check if the move is a winning one.
   
   After doing the checks and updating the state, the server notifies
   both players of the new state.

5. When the game is over, both clients show a message indicating the
   winner, and go back to the `AVAILABLE` state.
   
Test your application with several games simultaneously.

## To go further (optional)

1. Integrate the database from [the previous tutorial](accounts):
   
   - The users authenticate with their username and password,
   - The colors of the tokens are chosen from the user preferences (the
     challenged user always gets it preferred color).
   - Keep track of the number of wins/losses in the database.
   - Show all this information in the user list.
   
   **Warning:** You will need to get values from the session in the
   WebSocket code. `express-session` does not work automatically with
   WebSockets. You will need this hack, as [described
   here](https://github.com/websockets/ws/blob/master/examples/express-session-parse/index.js).
   
   ```js
   var sess_storage = session({ 
       secret: "12345",
       resave: false,
       saveUninitialized: false,
   });
   app.use(sess_storage);

   var wsserver = new ws.Server({ 
       server: server,

       verifyClient: function(info, next) {
           sess_storage(info.req, {}, function(err) {
               if (err) {
                   next(false, 500, "Error: " + err);
               } else {
                   // Pass false if you want to refuse the connection
                   next(true);
               }
           });
       },
   });
   ```

   Then the session will be available in `wsconn.upgradeReq.session`.

1. Use a more elaborate challenging system, based upon four states:
  `AVAILABLE`, `INVITATION SENT`, `INVITATION RECEIVED` and
  `PLAYING`. Allow a user to decline an invitation.
  
1. Allow a user to quit a game by forfeiting (the game is considered
  lost for the user).
  
1. Handle unexpected disconnections (forfeit the game if the user is
  playing).
  
1. Allow playing many games simultaneously.

1. We already mentioned that using global variables is fragile. In a
   real-world scenario, where Node.js is distributed on many cores
   (see the [Cluster API](http://nodejs.org/api/cluster.html)), global
   memory is not even an option.
   
   Instead of using global state, you can use a database, for example
   an SQL one. However this is not the most efficient and practical
   solution.
   
   An in-memory NoSQL system, such as Redis, is more apt to the
   task. Its [pub/sub system](http://redis.io/topics/pubsub) works
   perfectly with Node.js and *server push*.
   
   Replace global variables with a Redis database. You will have to go
   through the [Redis manuals](http://redis.io/documentation) and the
   docs of the [`node_redis`](https://github.com/mranney/node_redis)
   module.
   
   Redis is not available on Glitch. The simplest way is to develop
   locally.

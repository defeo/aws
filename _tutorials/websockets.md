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
   
   You can use private navigation (`Shift+Ctrl+P` in Firefox,
   `Shift+Ctrl+N` in Chrome) to do your tests. You can also empty the
   `sessionStorage` through the developer tools, or by issuing
   `sessionStorage.clear()` in the console.

4. Change the text shown in the main page to *"Hello ..."* when the
   user name is known (replaced the dots by the user name).
   
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
   [JavaScript](../lessons/advanced-js#classes-en-es6)
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
   
   Test using private navigation and several browsers. You can also
   ask a fried to connect to your app.
   
   **Hint:** for convenience, it is best to write a function, say
   `createUserList`, that takes the list of users as input and returns
   a DOM element representing the `<table>`. Then you can add this DOM
   element to the document by replacing the children of the div
   `#main`.

3. Using `setInterval()`, update the list of users every 2 seconds.


## Handling disconnections

1. Create a POST handler for `/disconnect/:user`. When a request is
   received, the corresponding user is removed from `connected_users`.
   You can remove an element from an object by using
   
   ```js
   del connected_users[...]
   ```

2. On the client side, listen for the
   [`beforeunload`](https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload)
   event that is fired when the browser window is closed. React by
   sending a
   [*beacon*](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)
   to `/disconnect/:user` (a *beacon* is like a POST AJAX request, but
   it is guaranteed to be sent even if the window is closing).
   
   Test your application using private navigation and several browsers.


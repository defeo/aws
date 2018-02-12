---
title: JSON-Twitter
difficulty: 2
tags: [ajax, json]
publish: yes
---

The goal of this project is to code a Twitter-like application with
**no server-side rendering**. The server only offers a JSON-based
(REST) API to store and retrieve messages (*tweets*) from a
database. All the HTML rendering is done **on the client side** using
the DOM API, or a template engine such as
[nunjucks](https://mozilla.github.io/nunjucks/).

### Description

A Twitter-clone is simply a bulletin-board where everyone can post and
read messages. A message contains at least:

- a date,
- an author,
- a text.

These fields will be stored as columns in a SQL table. A second SQL
table will be used for storing users, their name and their password.

The server-side only offers a JSON API for creating/verifying users,
and for storing/retrieving messages.

The client interface must have the following *views*:

- A view for creating a new user;
- A view showing all the messages, from the most recent to the most
  ancient;
- A view to compose a new message.


#### Server API

The only non-JSON routes offered by the server will serve *static
assets*:

- `/pub/client.js`, the JavaScript code of the client UI;
- `/pub/client.css`, the CSS code of the client UI;
- `/`, the HTML code to start the client (a mostly empty HTML
  document, linking to `client.js` and `client.css`;
- any other needed asset, such as images, etc.

The rest of the server API will be JSON based. It will have, at least,
the following routes:

- `/signin` (POST) for creating a new user;
- `/messages` (GET) for getting the list of all messages, in
  chronological order;
- `/login` (POST) for verifying the user credentials;
- `/post` (POST) for posting a new message (this route must verify the
  user password).

#### Client API

Upon visiting the `/` URL, the client-side code in `client.js` loads
and builds the user interface.

All interactions with the server must be done via AJAX, using either
the [`XMLHttpRequest`
interface](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest),
or the [`fetch`
API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

- The main page shows the list of all messages, and menus to
  
  - login/logout,
  - create an account (hidden if the user is logged in),
  - post a new message (hidden if the user is not logged in).
  
  This page can be generated using the DOM API, or using a
  [client-side nunjucks
  template](https://mozilla.github.io/nunjucks/getting-started.html).

- When the user clicks on the create account menu, a form is shown (as
  a [*modal*](https://en.wikipedia.org/wiki/Modal_window), or
  replacing the main page) asking to enter (at least) a username and a
  password. When the user submits the form, an AJAX request is sent to
  `/signin`, then a confirmation or error message is shown depending
  on the result.
  
- When the user clicks on the login menu, a form is shown asking to
  enter a username and a password. The data is sent to `/login`, if
  the request is successful the client stores the login and password
  in the [local storage](lessons/etat), otherwise it show an error
  message.
  
- When the user clicks on the compose message menu, a form is shown
  asking to enter text. Username and password are retrieved from the
  local storage, and everything is sent to `/post`. Then a message is
  shown according to whether the action was successful or not.

- When the user clicks on the logout menu, the username and password
  are wiped from the local storage, and the interface is updated.

It is very important that all these interactions are done through
AJAX.

### Resources

- Guide on the [`XMLHttpRequest`
  interface](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest);
- Guide on the [`fetch`
  API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API);


### Optional improvements

- Adapt your interface to small screens.

- Use the [`restify`](http://restify.com/) module instead of
  `express`.

- It is very bad practice to store username and password in the local
  storage. Modify `/login` so that it returns a *session identifier*,
  and store this identifier in the local storage instead. When posting
  through `/post`, send the session identifier to authenticate the
  request.
  
  Given that all interaction is done through AJAX, the module
  `express-session` will not help you. You can either write your own
  session store (in memory or in the database), or use a library such
  as [Passport](http://www.passportjs.org/).

- Add the possibility to send *private messages* to users.

- Limit the number of messages returned by `/messages`, dynamically
  load more messages when the user scrolls to the bottom of the list
  (see the [`onscroll`
  event](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onscroll)).

- Automatically refresh the list of messages every 5 seconds.

- Dynamically update the list of messages using WebSockets (no
  polling). Show a notification when a user receives a private message
  (see [web
  notifications](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API)).

- Use a No-SQL database (e.g., MongoDB) instead of a SQL one.

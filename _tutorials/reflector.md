---
title: The reflector
---

This tutorial presents a classic exercise: the *reflector*. A
reflector is a simple web page that presents (reflects) all the data
it receives: query strings, form data, HTTP headers, ...

The references for this tutorial are

- The [JavaScript manual](https://developer.mozilla.org/docs/Web/JavaScript),
- The [Node.js reference](http://nodejs.org/api/),
- The [Express guide](http://expressjs.com/),
- The [Express reference](http://expressjs.com/4x/api.html),


## Prepare your project

This is going to be our first project with a server-side
component. Consequently, its skeleton is going to be different from
the one in the previous tutorials.  Indeed, it is customary for a
Node.js project to contain a file named `package.json`, describing the
project, its dependencies, and the way to run it.

Start by *remixing* the project
<https://glitch.com/~defeo-lu-aws-node>.

1. Execute the project by clicking the *"Show"* button. Explore the
   different urls.

2. Create a new file named `reflector.js`. Edit `package.json` so that
   Glitch starts your `reflector.js` instead of `example.js`.
   
   Following the examples in `example.js`, make it show the message
   
   ```
   Bonjour
   monde !
   ```
   
   for the URL `/`.
   
   The blank line is **important**. How to make sure that the browser
   shows it? (**Tip:** unless you tell it otherwise, the browser will
   interpret anything it receives as HTML code).
   
2. In the handler for `/`, replace the previous code with a
   `for ... in` loop, printing the contents of the object
   
   ~~~js
   var jours = { 'mon' : 'Lundi',
                 'tue' : 'Mardi',
                 'wed' : 'Mercredi',
                 'thu' : 'Jeudi',
                 'fri' : 'Vendredi',
                 'sat' : 'Samedi',
                 'sun' : 'Dimanche' };
   ~~~
   
   one key-value pair per line.
   
   **Warning:** a handler cannot **execute** `res.send()` more than
   once. We recall that string concatenation in JavaScript is
   performed by the *plus* operator (`+`).


## The reflector, GET parameters

1. We already saw in the first tutorial that web apps can accept
   parameters via URLs. It was the case, for example, for Google's
   search, that we queried via a URL like thus
   
   ~~~
   https://www.google.com/search?q=ma+recherche&hl=fr
   ~~~
   
   The part of the URL following the question mark (`?`) is called the
   *query string*. Its syntax is partly defined by
   [RFC 3986](http://tools.ietf.org/html/rfc3986#section-3.4), partly
   by common practices. Express automatically analyses it and makes
   its contents accessible to the handler via the
   [`req.query`](http://expressjs.com/3x/api.html#req.query) object.
   
   Create a new handler for the URL `/query_string` that shows the
   contents of the query string, one key-value pair per line. Test
   your handler by passing various query strings in the addres bar,
   such as
   
   ~~~
   https://shrouded-piccolo.glitch.me/query_string?user=toto&pwd=12345
   ~~~

2. The unparsed query string is accessible via the
   `req._parsedUrl.query` property. Modify your handler so that,
   besides the parsed parameters, it also shows the unparsed query
   string. Visit now this URL
   
   ~~~
   /query_string?A=B=3&C=%26&X Y=W+Z&X%20Y=W%2BZ
   ~~~
   
   What do you notice? To better understand how the ULR has been
   interpreted, you can read this [Wikipedia
   article](http://en.wikipedia.org/wiki/Percent-encoding).


## Intermezzo: serving static files

Using JavaScript strings and `res.send()` allowed us to dynamically
generate HTML. However, this is not efficient for large HTML files,
especially if they are purely *static* (i.e., no content is generated
on the fly).

The *middleware*
[`express.static`](http://expressjs.com/en/4x/api.html#express.static)
allows us to serve static files directly from a named folder. All you
have to do is to add the following line to the configuration of your
Express application.

```js
app.use('/s', express.static('<name-of-the-folder>'));
```

The static files will be then accessible via the URL `/s/<name-of-thefile>`.

1. Create a static file named, e.g., `static/form.html`. Add to it an
   HTML form that sends all its data to the `/query_string` URL (use
   the `action` attribute of `<form>`) using the *get* method (use the
   `method` attribute).
   
   Test the reflector via the form. In particular, test special
   charatecter, such as spaces, ampersands (`&`), etc.
   

## The reflector, POST parameters

We now move on to data sent via the POST HTTP method. While parsing of
the query string is automatically activated in Express, parsing of
POST requests must be activated via the *middleware*
`body-parser`. Add these lines to your configuration

```js
var bodyP = require('body-parser');
app.use(bodyP.urlencoded({ extended: false }));
```

or, equivalently,

```js
app.use(require('body-parser').urlencoded({ extended: false }));
```


1. Modify the form from the previous exercise so that it sends its
   data via POST (`method="POST"`) to a new URL `/form_data`.
   
   Create the handler for `/form_data`. The `body-parser` middleware
   makes the form data available in the `req.body` object. Present the
   form data one key-value pair per line, as done before.
   
   **Note:** your handler must handle POST requests, not GET
   requests. POST handlers are created by the call `app.post()`,
   instead of `app.get()`.
   
   Test your handler using the form. Compare the results with the data
   presented by your browser's dev tools *"Network"* tab (in Chrome or
   Firefox, open the dev tools with the F12 key).

## The reflector, Cookies and headers

Two more interesting objects are attached to the request:

- `req.headers` contains the HTTP headers of the request;
- `req.cookies` contains the cookies, only if the `cookie-parser`
  middleware has been activated.
  
The `cookie-parser` middleware is not a standard one, and it must be
**installed**. To install an Node.js package, go to `package.json`,
and click on the *"Add Package"* menu (top-left of the editor). Start
typing the name of the package you want to install, and then click on
it. You will see that it is added to the `dependencies` section (you
can also do this manually).

1. Install the `cookie-parser` package, then activate the middleware
   in your application with
   
   ```js
   var cookieP = require('cookie-parser');
   app.use(cookieP());
   ```

2. Create a new handler for the `/headers` URL, showing the contents
   of `req.headers` and `req.cookies`. Compare the results with the
   *"Network"* and *"Storage/Application"* tabs in the dev tools.
   
   **Note:** You can create a handler that anwers to all kinds of HTTP
   requests (GET, POST, etc.) by replacing `app.get()` with
   `app.all()`.
   
3. Now put everything together (you can copy-paste your code). Replace
   the handler for `/` with one that answers to all types of HTTP
   requests by showing:
   
   - the contents of the *query string*,
   - the request body, if it has one,
   - the HTTP headers,
   - the cookies.

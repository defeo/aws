---
title: Templates, data, state
---

In this tutorial we discover the Nunjucks template language, and apply
some techniques to keep the state. Create a new Glitch project, by
creating a new Node App, or by remixing one of your old projects; you
can delete all files in your new project, with the exception of
`package.json`.

The references for this tutorial are

- The [JavaScript manual on MDN](https://developer.mozilla.org/docs/Web/JavaScript),
- The [Node.js reference](https://nodejs.org/api/),
- The [Express guide](https://expressjs.com/guide/routing.html),
- The [Express API reference](https://expressjs.com/4x/api.html),
- The [Nunjucks docs](https://mozilla.github.io/nunjucks/templating.html).

## Static content and templates

In the [previous tutorial](reflector), we used two different
techniques to create pages:

- For dynamic URLs, like `/query_string`, etc., we defined handlers in
  a JavaScript file. We generated HTML outputs by concatenating
  strings.

- For the static form, we created a simple HTML file.

These are two radically different ways of coding, and it would be
disappointing if we couldn't mix them. In this section, we are going
to learn how Express can read and serve static files, then how the
Nunjucks template engine lets us transition smoothly from static to
dynamic pages.

### Serving files

1. Create a `form.html` file, containing a form like thus

   {::nomarkdown}
   <div style="border:solid thin black;border-radius:10px;padding:5px">
   <input type="text" placeholder="Choose a nickname">
   <p>Choose a color</p>
   <input type="radio">red<br>
   <input type="radio">yellow</br>
   <input type="button" value="Go">
   </div>
   {:/}
   
   **You won't be able to access your `form.html` right now in the preview,
   it is normal. See the next instructions to make this file accessible.**
   
   Strive for a complete and valid HTML page: use a `<!Doctype>`,
   `<head>`, `<body>`, etc. Do not set the `method` and `action`
   attribute on the form, for the moment.

2. Create a file named `app.js`, and initialize it with the following
   code:
   
   ```js
   var express = require('express');
   var bodyP = require('body-parser');
   var cookieP = require('cookie-parser');
   
   var app = express();
   app
	   .use(bodyP.urlencoded({ extended: false }))
	   .use(cookieP());
   
   // Your handlers go here
   
   
   app.listen(process.env.PORT);
   ```

3. Glitch will not run the code in `app.js` by default. For this, you
   must edit the `package.json` file: look for the block
   
   ```js
   "scripts": {
     "start": "node server.js"
   },
   ```
   
   and change it to
   
   ```js
   "scripts": {
     "start": "node app.js"
   },
   ```
   
   You must also tell Glitch what dependencies you want loaded in your
   project. For this, while still editing `package.json`, click on
   *"Add Package"* on top of the editor, and start typing the names of
   the packages you want to install: Glitch will add them to the
   `dependencies` section of `package.json` and install them
   automatically with `npm`.
   
   Install the dependencies needed for this tutorial: `body-parser`,
   `cookie-parser` and `nunjucks`.
   
   **Note:** If you're working on your local machine, you can create a
   `package.json` file by running the `npm init` command in a
   shell. Then you can run your project with the `npm start` command.

   To install packages, directly edit the `dependencies` section of
   your `package.json` file, then run the `npm install` command in a
   shell. When you modify the `dependencies` section, you must run
   `npm install` again.

4. Rename your file `form.html` to 
   `public/form.html`. Add the following line to `app.js`
   
   ~~~js
   app.use('/s', express.static('public'));
   ~~~
   
   This instructs Node.js to serve all files placed in the `public`
   folder from the URL `/s/...`. Run `app.js` and verify that your
   HTML form is served at the URL
   
   ~~~
   /s/form.html
   ~~~

5. Let's serve the same form at a different URL. In `app.js`, create a
   handler for the `/signin` URL, then use the `res.sendFile()` method
   to serve the form.
   
   **Note:** the `sendFile()` method takes only one argument, the
   absolute path to the file. Since the absolute path to your project
   may change depending on what server you are running it on, and in
   particular you do not know how Glitch's filesystem is set up, it is
   good practice to use the special `__dirname` variable, like thus:
   
   ```js
   res.sendFile(__dirname + '/public/file_name.html');
   ```
   
6. Create a second html page (complete and valid) containing the text
   *"Hello!"*. Serve this page from the `/hello` URL, using
   `sendFile()`. Modify the form at `/signin` so that it is submitted
   to `/hello` (use the `action` attribute).


### Nunjucks Templates

{% raw %}

HTML templates contain usual HTML code, with special syntax to specify
the dynamic parts of the document.

Here's a very simple one:

~~~jinja
<p>Hello {{ name }} !</p>
~~~

The special marking `{{ name }}` will be replaced by the value of the
`name` variable passed to the template.

Every template language defines its own syntax, more or less
rich. Node has support for tons of template languages, to get an idea,
have a look at the [list on the `npm`
server](https://www.npmjs.org/browse/keyword/template).

We are going to use a language, called Nunjucks, inspired from the
famous Django/Jinja templates of the Python web ecosystem. The full
reference on its syntax is available
[here](https://mozilla.github.io/nunjucks/templating.html). In this
tutorial we will stick to variable evaluation (the example above),
`if` and `for` blocks.

1. You have already installed the Nunjucks module before by editing
   the `package.json` file. Now you must load it in your application
   with
   
   ~~~js
   var nunjucks = require('nunjucks');
   ~~~
   
   Then configure it for express with
   
   ```js
   nunjucks.configure('views', {
       express: app,
       noCache: true
   });
   ```
   
   **Note:** All your templates must go in a folder named `views`. You can
   change the default folder, if you wish, with
   
   ```js
   app.set('views', 'name_of_some_other_folder');
   ```

2. Rename your "Hello" page to `views/hello.html`. Modify it so that
   it contains this code:
   
   ~~~jinja
   <p>Hello {{ name }} !</p>
   ~~~

3. In `app.js`, modify the handler for `/hello` by replacing
   `sendFile` with
       
   ~~~js
   res.render('hello.html', { 'name' : 'Toto' });
   ~~~
   
   Visit the `/hello` URL and see the result.

4. Modify again the handler for `/hello` so that, instead of showing
   *"Hello Toto"*, it shows the name sent by the form at `/signin`.
   
   **Note:** Remember you can access the contents of the query string
   via `req.query`. You can test directly your view by editing the
   query string in the address bar.

Here's an example of a template using a `for` loop:

~~~jinja
<ul>
 {% for en, fr in numbers %}
  <li>{{ fr }} means {{ en }}</li>
 {% endfor %}
</ul>
~~~

This template, evaluated with

~~~js
res.render('for_loop.html', { 'numbers' : {
	'One' : 'Un',
	'Two' : 'Deux',
	'Three' : 'Trois'
} });
~~~

produces the output

~~~html
<ul>
  <li>Un means One</li>
  <li>Deux means Two</li>
  <li>Trois means Three</li>
</ul>
~~~

For more `for` loop examples, see
<https://mozilla.github.io/nunjucks/templating.html#for>.

1. Insert in your handler code the following lists:

   ~~~js
   ['cherry', 'strawberry', 'blood']
   ['sun', 'lemon', 'banana']
   ~~~
   
   In the `/hello` template, using an `{% if %}` and a `{% for %}`
   block, output one list or another according to the color chosen in
   the form.

2. By adding a `<style>` block in the head of your template, color the
   text in yellow or in red, according to the color chosen in the
   form.
   
   **Hint:** It is cleaner and safer to use a purely static CSS code
   in `<style>` (no templating), and to change the color dynamically
   by setting a CSS class on the part you want to color.
{:start="5"}

## Persistence

We now move on to the various techniques for persisting the state. We
are going to persist the name inserted in the form through many HTTP
requests.

### Persistence by the *query string*

We start with *query string* persistence.

1. Create a new view at the URL `/bye` showing the text *"Bye bye,
   ..."*, where the dots are replaced by a name passed through the
   query string, similarly to what you have done in the `/hello` view.

2. With the help of the template engine, add a link to the `/hello`
   view pointing to `/bye`, and persisting the name passed by the
   form through the query string. 

Test the whole application, starting from `/signin` and ending in
`/bye`, and verify that the name is kept through each HTTP request.

### Persistence by hidden fields

We now move on to persistence through the POST HTTP method. This
technique can eventually be mixed with the previous one.

1. Modify `form.html` so that the data is sent through the POST method
   (`method` attribute).

2. Create a handler for POST requests at the `/hello` url. Show a
   message *"Hello, ..."* as done previously. Test by submitting the
   form.

3. Add to `/hello` a form containing a text field pre-filled with the
   user name, and a button for submitting. Let this form point to the
   `/bye` url via the POST method.

4. Create a handler for POST requests at the `/bye` url. Show a
   message *"Bye bye, ..."* as done previously. Test the whole
   application from `/signin` to `/bye`.

5. Modify the form in the `/hello` view so that the text field is
   hidden (`type=hidden`). Test again.

### Persistence by the URL

Last lightweight persistence technique: we keep the state in the
url. This is made possible by the Express router. To make things more
interesting, we will implement a counter.

1. Create a handler
   
   ~~~js
   app.get('/:name/counter/', ...);
   ~~~
   
   Using a template, show the message *"..., this is your first
   visit"*, where dots are replaced by the value of the `:name`
   component of the URL.

2. Create a handler for all URLs of the form
   `/:name/counter/:cnt`. The `:cnt` component will be an integer for
   counting the number of visits. Show the text *"..., you have
   visited this page ... times"*, where dots will be replaced by the
   values of the `:name` and `:cnt:` components.
   
   **Note:** you can restrict `:cnt` to take only integer values using
   a [regular](http://expressjs.com/en/4x/api.html#path-examples)
   [expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp).

3. Add a link inside the `/:name/counter/` view to `/:name/counter/1`.

4. Add a link to the `/:name/counter/:cnt` view to the same view, with
   the counter incremented by one. 
   
   **Warning:** values passed through `req.query`, `req.params`,
   `req.body` or `req.cookies` are always strings. Use the `parseInt`
   function to convert them to numbers.

If you implemented correctly the exercise, you now have a working
counter incrementing by one unit at each click. You can apply the same
technique to the query string or to hidden form fields. Try it.

1. Give a prize to the millionth visitor.

2. Without clicking a million times, win the prize.
{:start="5"}

## Cookies and Storage API (optional)

We get to the last two techniques for client-side state
keeping. Cookies are an extension of the HTTP protocol, they are
controlled by the server and stored by the client. The storage API is
a part of the (HTML5) DOM specification, entirely controlled by the
client through JavaScript.

### Cookies

Cookies are key-value pairs stored by the client. A Express handler
can ask the client to store a cookie by the using following command
before any `res.send` or `res.render` call.

~~~js
res.cookie('user', 'toto');
~~~

Once a cookie is stored, it is sent by the client along with any
following request for the same domain name (whatever the URL
path). They are read in the object `req.cookies` by the
`cookie-parser` middleware.

1. Create a page `/cookie-monster`, counting the number of visits to
   it. The number of visits must be stored in a cookie on the
   client. If the cookie is not set (e.g., on the first visit), the
   handler will initialize it to 1. If it is already set, it will
   increment it and send it again to the client.
   
   No need to add a link from the view to itself: simply reload the
   page to see the number of visits go up.

2. Give a prize to the millionth visitor.

3. Win the prize (**Hint:** have a look in the dev tools).

### Storage API

The storage API is handled entirely through JavaScript. This means
that you can in principle use it on a purely static web page, without
any Node server.

It is a simple JavaScript object, named `localStorage`, that is kept
through page reloads and closing the browser.

1. Create a static page counting the number of visits through the
   `localStorage` API. Reload the page and verify that the counter is
   incremented.

2. Give a prize to the millionth visitor.

3. Win the prize (**Hint:** use the JavaScript console).

{% endraw %}

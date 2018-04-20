---
title: User accounts
---

In this tutorial we are going to learn how to connect to and query a
(SQL) database, and how to store the extracted information in a
session. We will use these technologies to build a simple app for
managing user accounts.

We will use the module
[`express-session`](https://github.com/expressjs/session) for handling
sessions, and the database abstraction layer
[`knex`](http://knexjs.org/) for querying the database.

The references for this tutorial are

- The lessons on [sessions](../lessons/sessions) and on
  [DBALs](../lessons/sql),
- The `express-session` 
  [reference manual](https://github.com/expressjs/session),
- The Knex [reference manual](http://knexjs.org/),
- The [MDN documentation on using
  Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).


## Preparing your workspace

Create a new Node app on Glitch. Install the following packages
through `package.json`:

- `body-parser` for handling POST requests,
- `express-session` for creating sessions,
- `knex` for querying databases,
- `sqlite3` for the engine doing the real work.

**Note:** The `sqlite3` module won't work if you develop locally on
Windows. Fortunately, Knex is compatible with all flavors of SQL
(MySQL, Postgres, MariaDB, ...), so you can have your application talk
with any of these servers with very few code changes. Follow the
[instructions in the docs](http://knexjs.org/#Installation-client).


## Building the schema

For a starter, we need a database, and some tables in it. Glitch
supports SQLite natively, so that's what we're going to use. However,
we cannot create the tables at the moment we start the application, as
those instructions would be executed at every restart.

Instead, we are going to write a separate script to initialize the
database with the tables we need.

1. Create a script named `db_init.js`, containing the following code:
   
   ```js
   var knex = require('knex')({
       client: 'sqlite3',
       connection: {
           filename: ".data/db.sqlite3"
       },
       debug: true,
   });
   ```
   
This code creates a SQLite file named `db.sqlite3` in the folder
`.data` (a *hidden folder* on Unix systems, and a *special* folder on
Glitch), and initiates a connection. We can now query the connection
by operating on the `knex` object. For example, we can read the
contents of a table, using the `async/await` syntax (see the [lesson
on using databases](../lessons/sql)):

```js
async function foo() {
    ...
    var rows = await knex.raw('SELECT * FROM bar);
    ...
}
```

1. Using a raw `CREATE TABLE` statement in `db_init.js`, or using the
   [schema builder](../lessons/sql#create-tables), create a table
   named `users`, with the following columns:
   
   - `login`: type `varchar(255)`, primary key,
   - `pass`: type `varchar(255) NOT NULL`.
   
2. To be sure to terminate the program, add a call to `knex.destroy()`
   after the table creation.
{: start="2" }

Of course, nothing is going to happen if you don't run the script. We
will use Glitch's Linux console to do the sysadmin magic. From the
main menu (top left, click on the name of your project), select
*"Advanced Options"*, then *"Open Console"*.

A Linux terminal opens in a new window. Run your script by typing

```bash
node db_init.js
```

Some debug messages will appear. If things have gone well, you can
check that your database was created and populated by issuing the
command

```bash
sqlite3 .data/db.sqlite3 .schema
```

## Damn! I need to update the schema

The schema we chose for our `users` table was too minimalist: we need
to add more columns. SQL offers a `ALTER TABLE` command to modify a
table, and we could in principle run it from a Node script, or
directly from the SQLite command line. However, this does not play
very well with the idea of having a script to run just once to
initialize the database. Instead, we are going to modify `db_init.js`
so that it erases the database and recreates the table. This way, we
can easily update the script and rerun it whenever we need a fresh
state.

1. Modify `db_init.js` to:
   
   - first drop the table `users` (use `DROP TABLE IF EXISTS` to avoid errors),
   - then (re)-create the table users with the following columns:
     - `login`: type `varchar(255)`, primary key,
     - `pass`: type `varchar(255) NOT NULL`,
     - `name`: type `varchar(255)`,
     - `color1`: type `varchar(10)`,
     - `color2`: type `varchar(10)`.
 
   Rerun `db_init.js` via the console and verify that the table
   `users` is recreated correctly.
   
2. The (asynchronous) function `knex('users').columnInfo()` returns a
   description of the columns of the `users` table.  Add a call to
   `.columnInfo()` to `db_init.js` to show the structure of the
   `users` table after it has been created.

3. Add some default users to the table by using a `INSERT INTO`
   statement.

4. Print the contents of the table on the console by using a `SELECT`
   statement (**Note:** the rows returned by `SELECT` are passed as a
   list to the callback in `.then()`).


## The Web app

We are now ready to write our web application.  We keep it very
simple: we want to be able to create a new user, log in, and show the
list of users.

1. Initialize the server with the usual Express skeleton (with
   `body-parser` and `nunjucks` configured). Add a Knex configuration
   section as done in `db_init.js`. Add (emtpy) routes for the URLs
   `/`, `/signin`, `/logout` and `/userlist`.

2. Write the handler for `/userlist`. It must select all rows from the
   `users` table, and show them in a HTML table.

3. Replace the text of the `color1` column with a rectangle colored in
   the same color. If `color1` is `NULL` use a default color. The
   result may look something like this:
   
   | Login | Name | Color |
   |--
   | kasparov | Garry Kasparov | <span class="r"></span> |
   | karpov | Anatoly Karpov | <span class="g"></span> |
   {: #table-joueurs .centered}
   
   **Hint:** for the colored rectangle you can use a `<span`> with
   fixed height and width and the `display: inline-block` property.

<style scoped>
#table-joueurs td:not(:first-child),
#table-joueurs th:not(:first-child)
{ border-left: solid thin gray }
#table-joueurs span {
  display: inline-block;
  width: 3em;
  height: 1em;
}
#table-joueurs .r { background-color: red; }
#table-joueurs .g { background-color: green; }
</style>


## Creating users

The `/signin` route will let us create a new user. For this we use a
HTML form, and a POST request. In the handler for the POST request we
will need to send a `INSERT INTO` query with user supplied
parameters. We recall that the `knex.raw()` method takes an optional
second argument, which is a list of replacement values for *prepared
statements*, like thus:

```js
await knex.raw('INSERT INTO users VALUES (?, ?, ?, ?, ?)',
               [ 'karpov', 'checkmate', 'Anatoly Karpov', 'green', 'black' ]);
```

Alternatively, you can use the [query](../lessons/sql#query-builder)
[builder](http://knexjs.org/#Builder).

1. Create a Nunjucks template for a web form for creating a new user,
   and serve it at the `/signin` URL. It must contain a login field, a
   password field, a name field, a *favorite color* and a *secondary
   color* (try `type=color` for the color fields!). The form must use
   the POST method (`method` attribute) and it must send the data back
   to `/signin` (it is enough to leave the `action` attributed empty).
   
2. Create a POST handler for `/signin` where you take the values sent
   in the form and insert then in the `users` table, only if the login
   and the password field are non-empty (an empty field in a form is
   read as an empty string `''` in `req.body`). After the insertion
   has succeeded, redirect to `/` (using `res.redirect()`).
   
   If one of the fields is empty, do not insert in the database, and
   send instead the same form template, with a message explaining what
   error happened (use the template engine to show the message). Using
   the template engine, you can also pre-fill the fields with the
   values that had been sent.
   
   Test with the *"Network"* tool of the browser's developer tools.

Errors may happen when you do SQL queries, and we cannot let them
crash our application. For example, a user may try to create an
account for a login that already exists (violating the `PRIMARY KEY`
constraint). To handle errors, you can use a `try ... catch`:

```js
try {
    await knex.raw('INSERT INTO ...');
} catch (error) {
    console.error(error);
}
```

3. Handle errors in your code. If the error is a violation of the
   primary key constraint (inspect the error in the console, and find
   out the error code for this violation), send back the form with an
   explanatory message. For any other error, send back the form with a
   generic message.
{: start="3" }


## Login and sessions

We come to the last part: handling logins. We will show a login form
at the `/` URL, and redirect to `/userlist` upon successful login.

Since we are moving between different handlers, we need a way to keep
the information that the user is logged in across many requests. We
cannot, and do not want to, transfer the username and password with
every request, hence we will use a *session mechanism*.

As seen in the [sessions](../lessons/sessions) lesson, we must start
by configuring the Express app with

```js
var session = require('express-session');

app.use(session({
    secret: '12345',
    resave: false,
    saveUninitialized: false,
}));
```

Then the session will be available in every handler at `req.session`.

1. Write a handler for `/` that shows a form similar to this one:

   | **login:** | <input type="text" size="10" /> | **password:** | <input type="password" size="10" />

2. Like you did for `/signin`, write a second handler for POST
   requests to `/`.  The handler checks whether the pair
   login-password corresponds to a user in the database, then:
   
   - if login and password are wrong, it shows again the form with an
     error message;
   
   - if they are correct, it saves the login, the name and the colors
     in the session, and redirects to `/userlist`.

3. Modify `/` so that it immediately redirects to `/userlist` if the
   user is already logged in.

3. Modify `/userlist` so that it redirects to `/` when the user is not
   logged in, and so that it shows in bold the current user.

4. Write the `/logout` route to log the user out. For that, it is
   enough to put a special value in the session (for example, set the
   login to `null`); when a handler detects this special value, it
   treats the request as an unauthenticated one.

1. Add a link to `/logout` in the `/userlist` view.


## Advanced stuff (optional)

Here are some optional questions to better master Knex and 
sessions.

1. In `/signin`, ask for the password twice, and only accept the new
   user if the two password fields match.

1. We have mostly used `knex.raw()` in this tutorial, however `knex` has
   a very convenient *query builder* to construct SQL statements with
   a more object-oriented syntax. [Read the
   docs](http://knexjs.org/#Builder) and replace your raw queries with
   built ones. You can also try [Schema
   building](http://knexjs.org/#Schema) in `db_init.js`.
   
1. It is very bad practice to store cleartext passwords in the
   database: what you if suffer a data breach and your database is
   divulged?
   
   Instead, it is preferable to store *hashed* passwords: an
   irreversible transformation of the cleartext password, so that the
   cleartext is only seen in transit, but never stored.  The hash
   computation must happen on the server, and must be *salted* with a
   secret, otherwise the technique is no safer than storing cleartext
   passwords.
   
   If this is done properly, not even the administrator will be able
   to recover the cleartext passwords. A misunderstanding of this
   technique was at the origin of the [famous
   leak](http://www.theguardian.com/technology/2013/nov/07/adobe-password-leak-can-check)
   of 150M Adobe passwords in 2013 : <http://zed0.co.uk/crossword/>.
   
   It's best not to *roll your own crypto*, as it is easy to make
   mistakes. Use instead trusted ready-made solutions, such as the 
   [bcrypt](https://www.npmjs.com/package/bcrypt) module.

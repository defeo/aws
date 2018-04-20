---
layout: lesson
title: Persistent storage
subtitle: SQL queries with Knex
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/sql.webm
    quizzes:
      - 58a4d0ff6e24fc1857e29115
      - 58a4d0ff6e24fc1857e29122
---

<section>

## Persistent storage

Every web app needs to store data **permanently** on the **server**.

- In the file system: **SQLite**, ...
- In a SQL DB: **MySQL**, **MariaDB**, **PostgreSQL**, ...
- In a NoSQL DB: **MongoDB**, **Couchbase**, **CouchDB**, **Redis**,
  ...

### Abstractions

All web frameworks offer modules to smooth interactions with
databases:

- **DBAL (Database Abstraction Layer):** unique API to access several
  DB systems (e.g., MySQL, SQLite, ...).
- **ORM (Object Relational Mapping):** translations between *objects*
  in the host language and **entities** in the DB system.

</section>
<section>

## Storage in Node.js

### SQL

Several modules to interact with SQL DBs available in `npm`:

- [`mysql`](https://www.npmjs.com/package/mysql),
- [`sqlite3`](https://www.npmjs.com/package/sqlite3) (Unix only),
- [`pg`](https://www.npmjs.com/package/pg) (Postgres),
- [`oracledb`](https://www.npmjs.com/package/oracledb),
- ...

Plus several abstraction modules built on top.

### NoSQL

- [`mongoose`](https://www.npmjs.com/package/mongoose) by far the most
  popular DBAL for Mongo,
- [`couchbase`](https://www.npmjs.com/package/couchbase),
- ...

</section>
<section class="compact">

## MySQL in Node.js

Install [`mysql`](https://www.npmjs.com/package/mysql)

```
npm install mysql
```

Configure

```js
var mysql = require('mysql');
var db    = mysql.createConnection({
  host     : 'localhost',
  user     : 'foo',
  password : '12345',
  database : 'mydb',
});
```

Use (asynchronous call semantics only)

```js
db.query('SELECT * FROM users',  function(error, rows) {
    // Handle data in the callback asynchronously
});
```

Read more: <https://www.npmjs.com/package/mysql>

</section>
<section>

## SQL abstraction through Knex

[Knex](http://knexjs.org/) is a Node DBAL for SQL:

- Compatible with: Postgres, MSSQL, MySQL, MariaDB, SQLite3, and
  Oracle.
- *Query builder*: construct SQL queries through method calls.
- *Schema builder*: construct SQL tables through method calls.
- Asynchronous APIs: *Promises* (preferred, compatible with
  `async/await`), *callbacks* and *streams*.
- More features: *transactions*, *migrations*, connection *pooling*.

Install with

```
npm install knex
```

Also install the low-level module for your database(s), e.g:

```
npm install sqlite3 mysql
```

Advantages over low-level modules:

- Write once, use with many DBs (dev, testing, production, ...),
- Safer queries with the query builder.

</section>
<section>

## Using Knex

### Configure (e.g., with `mysql`)

```js
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : 'localhost',
    user     : 'foo',
    password : '12345',
    database : 'mydb',
  }
});
```

</section>
<section class="compact">

### Raw SQL

Inside an `async` function (preferred):

```js
try {
  var rows = await knex.raw('SELECT * FROM users');
} catch (error) {
  ...
}
```

Using raw promises (for advanced parallelism):

```js
knex.raw('SELECT * from users')
  .then(function (rows) {
    ...
  })
  .catch(function (error) {
    ...
  });
```

Using an old-style callback (not chainable):

```js
knex.raw('SELECT * from users')
  .asCallback(function (error, rows) {
    ...
  });
```

</section>
<section>

### Query builder

<div class="two-cols">

```js
await knex.select('*').from('users');
```

```sql
SELECT * FROM `users`
```

```js
await knex('users').select('*');
```

```sql
SELECT * FROM `users`
```

```js
await knex('users');
```

```sql
SELECT * FROM `users`
```

```js
await knex('users')
  .select('name', 'surname')
  .where('town', 'Paris')
  .andWhere('age', '<', 18);
```

```sql
SELECT 'name', 'surname'
FROM users
WHERE `town` = 'Paris'
AND `age` < 18
```

</div>

To test the query builder, use `toString()` (not asynchronous)

```js
console.log(knex('user').where('name', 'foo').toString())
// Outputs: select * from `user` where `name` = 'foo'
```

- Also available: *inserts*, *unions*, *joins*, *groupbys*, ordering, ...
- Read more at <http://knexjs.org/#Builder>.
- Interactively try out queries at
  <http://michaelavila.com/knex-querylab/>.

</section>
<section>

### Create tables

Using raw SQL

```js
await knex.raw(`CREATE TABLE users (
  login VARCHAR(255) PRIMARY KEY,
  password VARCHAR(30) NOT NULL
)`);
```

Using the *schema builder*

```js
await knex.schema.createTable('users', function (table) {
  table.string('login').primary();
  table.string('password', 30).notNullable();
});
```

- Dropping, modifying, done similarly.
- Read more on the *schema builder* at <http://knexjs.org/#Schema>.

</section>
<section class="compact">

## WARNING! Asynchronous calls ahead

This does nothing (`x` is only a *promise*)

```js
var x = knex('users').select('*');
```

This prints out of order (control jumps to `'Done'` before the
callback is executed)

<div class="two-cols">

```js
knex('users').then(function (rows) {
  for (var r of rows) {
    console.log('User:', r.name);
  }
});
console.log('Done');
```

```
Done
User: foo
User: bar
```

</div>

Always prefer `await` (unless you need complex parallelism)

<div class="two-cols">

```js
var rows = await knex('users');
for (var r of rows) {
  console.log('User:', r.name);
}
console.log('Done');
```

```
User: foo
User: bar
Done
```

</div>

</section>
<section class="compact">

## A full example

```js
app.post('/login', async function(req, res) {
  var login = req.body.login;                  // Get data from request body
  var pass = req.body.pass;
  
  try {
    var users = await knex('users').where({    // Query database:
      'login'   : login,                       // SELECT * FROM users
      'password': pass,                        // WHERE login = ? AND password = ?
    });

    if (users.length == 1) {                   // Check if credentials matched
      res.send(`Hello, ${users[0].name}`);
    } else {
      res.status(401).send('Unknown user');
    }
  } catch (err) {                              // Handle errors
    console.error('Database error:', err);     // (log and send generic 500 code)
    res.status(500).send('Error');
  }
});
```

</section>
<section>

## SQL Escaping

We have with SQL the same problem we found when [generating HTML code](templates)

```js
app.get('/login', async function(req, res) {
  await knex.raw(`SELECT * FROM users WHERE login = ${req.query.user}`);
  ...
});
```

What if we sent this request?

```
https://www.example.com/login?user=le_ch'ti
```

```sql
SELECT * FROM users WHERE login = 'le_ch'ti'
```

- Special SQL characters `` ` ``, `'`, `"`, `;` must be **escaped**.
- Escaping syntax depends on the database engine (MySQL, Postgres,
  ...)

**Do not escape manually**, rely on your DBAL:

- Use the *query builder*,
- Use *prepared queries*.

</section>
<section>

### Escaping in the query builder

```js
await knex('users').where('login', req.query.user);
```

### Escaping raw queries

```js
await knex.raw('SELECT * FROM users WHERE login = ?', [req.query.user]);
```

or

```js
await knex.raw('SELECT * FROM users WHERE login = :user', {
  'user': req.query.user,
});
```

Read more at <http://knexjs.org/#Raw>.

### Output

Passing `req.query.user = "le_ch'ti"` gives in all cases

~~~sql
SELECT * FROM users WHERE login='le_ch''ti'
~~~

</section>
<section>

## References

- The [Knex docs](http://knexjs.org/),
- The [lesson on asynchronous JavaScript](async-js),
- MDN docs on
  [`async/await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function),
- MDN docs on [using
  Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).

</section>

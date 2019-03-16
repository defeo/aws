---
layout: lesson
title: SQL injections
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/sql-injection.webm
    quizzes:
      - 58a4d0ff6e24fc1857e2914e
---

<section>

## Never trust the client

Every data coming from the client:

- HTTP headers,
- URL parameters, query string,
- Request body, form data,
- Cookies, Storage API,

may contain **invalid** data, for many reasons:

- Error by the user;
- Old browser / JavaScript switched off;
- The client is a robot;
- The user is intentionally trying to hack your web app.

For these reasons, server-side code **must always verify** data sent
by the client.

</section>
<section>

## SQL Injections 

Consider this code, verifying user credentials.

```js
var user = req.body.user;
var pass = req.body.pass;
var sql = `SELECT * FROM users WHERE login='${user}' AND password='${pass}'`;
var rows = await knex.raw(sql);
if (rows.length > 0) {
  // user verified
}
```

The user sends these data in the request body:

```
user=root
pass=' OR '1'='1
```

The generated SQL query will be:

```sql
SELECT * FROM users WHERE login='root' AND password='' OR '1'='1'
```

The `WHERE` condition is always true! **The hacker connects to your
database as root!**.


</section>
<section>

<figure>
<video src="https://sourcesup.renater.fr/aws-media/sql-injection.webm" width="100%" controls></video>
</figure>

</section>
<section>

### What are the risks associated to an SQL injection?

- Rights escalation (connect as *root*),
- Data theft (dump the database),
- Data compromise (destroy/modify the data).


![](http://imgs.xkcd.com/comics/exploits_of_a_mom.png) <small style="display:inline-block;transform:rotate(-90deg);transform-origin:top left"><https://xkcd.com></small>
{:.centered style="max-width:100%"}

Here's a [list of some documented SQL injection
attacks](http://en.wikipedia.org/wiki/SQL_injection#Examples).

**Note:** although realistic, the attack suggested by XKCD is
unlikely: most SQL engines nowadays forbid *multiple statements*,
i.e. statements separated by a semi-colon (`;`).

</section>
<section>

## Countermeasures

We [already saw](sql) the solution: **escape special characters** `'`,
`"`, `;`

- Using a *Query builder*,
  
  ```js
  await knex('users').where({
      'login': user,
      'password': pass,
  });
  ```

- Using *prepared statements*.
  
  ```js
  await knex.raw('SELECT * FROM users WHERE login=? AND password=?', 
                 [user, pass]);
  ```

Result (in both cases)

```sql
SELECT * FROM users WHERE login='root' AND password=''' OR ''1''=''1'
```

</section>
<section>

## References

- [Source code of the example](https://github.com/defeo/aws-security/blob/master/sql-injection.js),
- [Port of the same example to Knex](https://glitch.com/edit/#!/defeo-lu-aws-injection-sql)
- OWASP on [SQL injections](https://www.owasp.org/index.php/SQL_Injection),
- The [PHP manual on SQL
  injections](http://php.net/manual/en/security.database.sql-injection.php).

</section>

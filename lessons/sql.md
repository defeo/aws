---
layout: lesson
title: Stockage Persistant
subtitle: Interface avec bases de données SQL
---

<section>

## Stockage persistant

Toute application web nécessite de stocker des données de façon
**permanente** sur le **server**.

- Système de fichiers : **SQLite**, ...
- BDs SQL : **MySQL**, **PostgreSQL**, ...
- BDs NoSQL : **MongoDB**, **Couchbase**, **CouchDB**, ...

### Abstractions

Tous les frameworks offrent des modules pour faciliter l'interaction
avec les bases de données :

- **DBAL (Database Abstraction Layer) :** accès à plusieurs systèmes
  de BD (par ex., MySQL, SQLite, ...)  avec une API unique.
- **ORM (Object Relational Mapping) :** traduction entre objets du
  langage du framework et entités de la BD.

</section>
<section>

## Rappels sur MySQL

Lire une table

~~~
SELECT * FROM users WHERE id = 'toto';
~~~

Écrire dans une table

~~~
UPDATE users SET pwd = 'SHA1(12345)'
WHERE id = 'toto';
~~~

### Resources

La référence MySQL complète

> <http://dev.mysql.com/doc/refman/5.0/en/>

Un tutoriel rapide et complet, avec exemples

> <http://www.w3schools.com/sql/>

</section>
<section>

## Silex et MySQL

PHP fournit deux modules pour l'accès aux bases MySQL :

- [mysqli](http://www.php.net/manual/book.mysqli.php) (spécifique pour MySQL),
- [PDO](http://www.php.net/manual/book.pdo.php) (DBAL générique).

Silex ajoute son propre DBAL par dessus PDO :
[Doctrine](http://www.doctrine-project.org/projects/dbal.html).

### Fonctionnalités

- Connexion à une base de donnée (distante),
- Interrogations SQL, parcours des résultats,
- *Requêtes préparées*,
- *Query builder*,
- Transactions,
- ...

</section>
<section>

## Doctrine

Activer Doctrine et se connecter à la base

~~~
use Silex\Provider\DoctrineServiceProvider;

$app->register(new DoctrineServiceProvider(),
  array('db.options' => array(
            'driver'   => 'pdo_mysql',
            'host'     => 'localhost',
			'user'     => 'toto',
			'password' => '12345'
    ),
));
~~~

Plus sur la configuration:

- [Dans le manuel de Silex](http://silex.sensiolabs.org/doc/providers/doctrine.html),
- [Dans le manuel de Doctrine](http://docs.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/configuration.html).

</section>
<section>

Faire une requête

~~~
$q = $app['db']->executeQuery('SELECT * FROM users');
~~~
{:.php}

Parcourir le résultat (en le copiant dans un tableau PHP)

~~~
$results = $q->fetchAll();
foreach ($results as $row) {
  $row['name'];
}
~~~

ou (ligne par ligne)

~~~
while ($row = $q->fetch()) {
  $row['name'];
}
~~~
{:.php}

Tout en un

~~~
$app['db']->fetchAll('SELECT * FROM users');
~~~
{:.php}

Plus de fonctions dans le
[manuel](http://docs.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/data-retrieval-and-manipulation.html).


</section>
<section>

## MySQL pour Node.js

Installer le module [mysql](https://github.com/felixge/node-mysql)

~~~
npm install mysql
~~~

Configurer

~~~
var mysql = require('mysql');
var db    = mysql.createConnection({
  host     : 'localhost',
  user     : 'toto',
  password : '12345'
});
~~~

Plus d'options : <https://github.com/felixge/node-mysql>

</section>
<section>

Faire une requête

~~~
db.query('SELECT * FROM users',
  // callback
  function(err, rows) {
    if (!err) {
      for (var i = 0 ; i < rows.length ; i++) {
        console.log(rows[i]);
      }
	}
  });
~~~

**Attention :** Node.js a un modèle d'exécution **asyncrhone**. Le
résultat de la requête est passé à une **callback**.

#### Autres interfaces de BD pour Node.js

- **SQLite :** [`sqlite3`](https://npmjs.org/package/sqlite3) ;
- **Postgres :** [`pg`](https://npmjs.org/package/pg) ;
- **MongoDB :** [`mongoose`](http://mongoosejs.com/) ;
- **Autres**
  [`connect-sqlite3`](https://npmjs.org/package/connect-sqlite3)
  (mécanisme de sessions), ...


</section>
<section>

# Échappement

</section>
<section>

## Échappement SQL

On a avec SQL le même problème déjà vu avec HTML

~~~
function (Application $app, Request $req) {
  $app['db']->query(
    'SELECT * FROM users WHERE id = \''
    . $req->query->get('nom') . '\';' );
}
~~~

Les caractères spéciaux SQL `` ` ``, `'`, `"`, `;` doivent être
**échappés**.

La syntaxe de l'échappement dépend de la base de données (MySQL,
PostgreSQL, ...)

Fonctions d'échappement:

- PHP : `mysqli::real_escape_string`,
- PDO/Doctrine : `PDO::quote`, `Doctrine::quote`,
- Échappement automatique : **requêtes préparées**.

</section>
<section>

## Requêtes préparées

En Silex

~~~
$app['db']->fetchAssoc(
  "SELECT * FROM users WHERE id = ?",
  array($req->query->get("nom")));
~~~

~~~
$app['db']->fetchAssoc(
  "SELECT * FROM users WHERE id = :name",
  array(':name' => $req->query->get("nom")));
~~~

En Node.js avec `mysql`

~~~
db.query('SELECT * FROM users WHERE id = ?',
         [ req.query.nom ],
		 function() {
           ...
         });
~~~

</section>
<section>

## Lectures

#### DBAL pour PHP

- [Manuel de mysqli](http://www.php.net/manual/book.mysqli.php),
- [Manuel de PDO](http://www.php.net/manual/book.pdo.php),
- [Manuel de Doctrine](http://docs.doctrine-project.org/projects/doctrine-dbal/) (en anglais).

#### MySQL pour Node.js

- [Manuel de `mysql`](https://github.com/felixge/node-mysql) (en anglais).

</section>

---
layout: lesson
title: Injections SQL
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/sql-injection.webm
    quizzes:
      - 56b7edfd87b68f1300ba925a
---

<section>

## Ne jamais se fier au client

Toutes les données en provenance du client :

- Entêtes HTTP,
- Paramètres de l'URL, *query string*
- Corps de la requête, données des formulaires,
- Cookies, Storage API,

peuvent contenir des valeurs **non valides**, pour plusieurs raisons :

- L'utilisateur a fait une erreur de saisie ;
- Le client n'utilise pas JavaScript ;
- Le client est un robot ;
- L'utilisateur est un hacker qui cible votre site.

Pour toutes ces raisons, le code du serveur **doit toujours vérifier**
les données envoyées par le client.

</section>
<section>

## Injections SQL

Considérez le code suivant, qui vérifie la connexion d'un utilisateur.

~~~
$user = $req->request->get('user');
$pass = $req->request->get('pass');
$sql = "SELECT * FROM users WHERE login='$user' AND password='$pass'";
if ($app['db']->fetchAssoc($sql)) {
  // utilisateur connecté
}
~~~
{:.php}

L'utilisateur envoie les paramètres suivants dans le corps de la requête :

~~~
user=root
pass=' OR '1'='1
~~~
{:.bash}

La chaîne `$sql` vaudra alors

~~~
SELECT * FROM users WHERE login='root' AND password='' OR '1'='1'
~~~

La condition est toujours vérifiée : **le hacker est connecté en tant
que root!**

</section>
<section>

<figure>
<video src="https://sourcesup.renater.fr/aws-media/sql-injection.webm" width="100%" controls></video>
</figure>

</section>
<section>

### Que peut-on faire avec les injections SQL ?

- Escalade de droits (se faire passer pour *root*),
- Vol de données (lire la base),
- Compromission de la base de données (effacer/modifier les données).


![](http://imgs.xkcd.com/comics/exploits_of_a_mom.png)
{:.centered style="max-width:100%"}

Et voici une
[liste de attaques par injection SQL documentées](http://en.wikipedia.org/wiki/SQL_injection#Examples).

</section>
<section>

## Contrer les injections SQL

On connaît la solution : **échapper les caractères spéciaux** `'`,  `"`,  `;`

- PHP : `mysqli::real_escape_string`,
- PDO/Doctrine : `PDO::quote`, `Doctrine::quote`,
- Échappement automatique : **requêtes préparées**.

Exemple

~~~
$app['db']->fetchAssoc("SELECT * FROM users WHERE login=? AND password=?",
                       array($user, $pass));
~~~
{:.php}

Résultat

~~~
SELECT * FROM users WHERE login='root' AND password=''' OR ''1''=''1'
~~~

</section>
<section>

## Lectures

- [Code source de l'exemple](https://github.com/defeo/aws-security/blob/master/sql-injection.js),
- OWASP sur l'[injection SQL](https://www.owasp.org/index.php/SQL_Injection),
- Le
  [manuel de php sur l'injection SQL](http://php.net/manual/en/security.database.sql-injection.php).

</section>

---
layout: tutorial
title: Comptes utilisateur
styles: ["../css/cloud9.css"]
---

Dans ce TD nous allons ajouter des comptes d'utilisateur au jeu de
puissance 4 que nous avons commencé à développer aux TDs
précédents. Nous allons nous servir de la base de données MySQL
fournie par Cloud 9 pour le stockage des données côté server, et du
système de sessions de Silex pour garder l'état de la connexion.

Les références pour ce TD sont :

- Le [cours](../classes/class5),
- La doc de Silex sur les
  [sessions](http://silex.sensiolabs.org/doc/providers/session.html)
  et sur
  [Doctrine](http://silex.sensiolabs.org/doc/providers/doctrine.html),
- La [doc de Doctrine](http://docs.doctrine-project.org/projects/doctrine-dbal/en/latest/),
- L'[API de Doctrine](http://www.doctrine-project.org/api/dbal/2.4/index.html),
- La [référence MySQL](http://dev.mysql.com/doc/).

Des références optionnelles, si vous décidez d'utiliser un autre DBAL que Doctrine :

- La [doc du module `PDO`](http://php.net/manual/en/book.pdo.php),
- La [doc du module `mysqli`](http://php.net/manual/en/book.mysqli.php).


## Préparer son espace de travail

Comme d'habitude, commencez par taper dans le terminal

~~~
git pull
mysql-ctl start
~~~
{:.bash}

La première commande met à jour l'espace de travail, la seconde lance
le server MySQL. Vous pouvez arrêter à tout moment le server MySQL
avec

~~~
mysql-ctl stop
~~~

et le relancer avec

~~~
mysql-ctl restart
~~~

Si vous n'arrêtez pas le serveur à la fin de la session, il sera
encore actif lors de votre prochaine connexion à l'espace de travail.

Un dossier nommé `sqlbuddy` est présent dans votre espace de travail,
il s'agit d'un gestionnaire graphique de bases de donnés,
[SQL Buddy](http://sqlbuddy.com/), similaire à
[PHPMyAdmin](http://www.phpmyadmin.net/).

Pour exécuter l'application, ouvrez le fichier `sqlbuddy/index.php` et
cliquez sur le bouton *« Run »*.

**Note :** Pour lancer plus rapidement SQL Buddy, vous pouvez créer un
*profil d'exécution*. Avec le fichier `sqlbuddy/index.php` ouvert,
allez dans l'onglet *« Run & Debug »* (icône <span class="c9-icon
rundebug"></span>), ajoutez un nouveau profil (bouton +), et
remplissez les champs comme suit :

- *« Name »* : choisissez le nom que vous voulez, par exemple SQL Buddy,
- *« File path »* : `/sqlbuddy/index.php` (cela devrait être déjà rempli),
- *« Runtime »* : Apache+PHP.

Maintenant vous pouvez lancer SQL Buddy simplement en ouvrant le menu
*dropdown* à côté du bouton *« Run »*, sans besoin d'ouvrir le fichier
`index.php`.

1. Lancez SQL Buddy (il n'y a pas besoin de mot de passe). Créez un
   nouveau database, et dans ce database une table nommée `users`. La
   table doit contenir les champs suivants :
   
   - `login` : type `varchar(255)`, clef primaire,
   - `pass` : type `varchar(255) NOT NULL`,
   - `couleur1` : type `varchar(255)`,
   - `couleur2` : type `varchar(255)`,
   - `parties` : type `int`, non signé,
   - `gagnees` : type `int`, non signé.

2. Ajoutez deux utilisateurs à la table, avec les valeurs que vous
   voudrez.

Nous sommes maintenant prêts à étendre notre jeu de Puissace 4.
Chacune des sections qui suivantes est consacrée à une page de
l'application (une *vue*, en jargon).

Le point d'entrée de l'application va encore être le fichier
`index.php`. Vous êtes cependant libres de distribuer votre logique
sur plusieurs fichiers, importés dans `index.php` avec la directive
`require` (ou `require_once`).


## Liste des utilisateurs

Cette vue est la plus simple : elle permet d'afficher la liste de tous
les utilisateurs. On rappelle que, avant de pouvoir accéder à la base
de données, il est nécessaire de configurer Silex et Doctrine. Le code
suivant permet de configurer votre application avec les paramètres de C9.

~~~
$app->register(new Silex\Provider\DoctrineServiceProvider(),
  array('db.options' => array(
		'driver'   => 'pdo_mysql',
        'host'     => getenv('IP'),  // pas touche à ça : spécifique pour C9 !
		'user'     => getenv('C9_USER'),  // vous pouvez mettre votre login à la place
		'password' => '',
		'dbname' => 'c9'  // mettez ici le nom de la base de données
  )));
~~~

Ensuite le DBAL sera accessible via l'objet `$app['db']`.

1. Dans `index.php` ajoutez une route pour l'URL `/userlist`. Elle
   doit récupérer l'ensemble des lignes de la table `users`, et en
   afficher les colonnes `login`, `parties`, `gagnees` et `couleur1`
   sous forme de tableau HTML. On rappelle que vous pouvez utiliser la
   méthode `fetchAll()` pour récupérer tout le résultat de la requête
   dans un tableau PHP.

2. Remplacez le texte de la case correspondante à `couleur1` par un
   rectangle coloré de cette même couleur. Si la couleur vaut `NULL`,
   utilisez une couleur par défaut. Le résultat pourrait ressembler à
   cela.
   
   | Joueur | Parties | Gagnées | Colueur préférée |
   |--
   | Kasparov | 10 | 3 | <span class="r"></span> |
   | Karpov | 100 | 99 | <span class="g"></span> |
   {: #table-joueurs .centered}

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



## Création des utilisateurs

Nous passons maintenant à une vue qui permet d'ajouter des
utilisateurs à la table. Ceci va nous permettre de nous familiariser
avec des fonctionnalités avancées de la DBAL.

1. Ajoutez une route de type GET pour l'URL `/signup`. Elle doit
   présenter un formulaire d'enregistrement permettant de renseigner
   un login, un mot de passe, une couleur préférée et une couleur
   secondaire. Le formulaire doit utiliser la méthode POST et renvoyer
   sur cette même URL (laisser le champs `action` vide suffit).

2. Modifiez la route `/signup` pour accepter aussi des requêtes de
   type POST (rappel : utiliser `$app->match()`).  Vous pouvez tester
   le type de la requête avec `$req->getMethod()`.
   
   Lorsque la requête est de type POST, récupérez les valeurs du
   formulaire et insérez une nouvelle ligne dans la table `users`,
   seulement si le login et le mot de passe ne sont pas vides (les
   colonnes `parties` et `gagnees` doivent démarrer à zéro).
   
   Pour réaliser une insertion avec Doctrine, le plus simple est
   d'utiliser la méthode `executeUpdate`.
   
   ~~~
   $num = $app['db']->executeUpdate('INSERT INTO users VALUES (?, ?, ...)',
                                    array(...));
   ~~~
   
   Si l'insertion réussit, la variable `$num` vaut le nombre de lignes
   insérées (une, en général).
   
   - Si l'insertion de l'utilisateur a réussi, rédirigez vers l'URL
   `/userlist` (avec `$app->redirect`). 
   - Si l'insertion a raté, présentez à nouveau le formulaire, avec un
     message d'erreur. Ne faites pas de rédirection dans ce cas ; un
     template vous permettra d'afficher le message d'erreur seulement
     si nécessaire.
   
   Testez et observez les échanges de requêtes avec l'outil
   *« Réseau »* de votre browser.

3. La méthode `executeUpdate` n'est pas assez flexible. Essayez, par
   exemple, d'insérer un utilisateur qui existe déjà, et observez
   l'erreur qui se produit.
   
   Pour pouvoir correctement gérer les exceptions de Doctrine, il faut
   faire la requête en plusieurs étapes. Voici un exemple : la requête
   est d'abord préparée, ensuite elle est envoyée à la BD dans un bloc
   `try`.
   
   ~~~
   // Préparer la requête
   $q = $app['db']->prepare('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)');
   try {
	   // Envoyer la requête
	   $rows = $q->execute(array('toto', 1234, 'red', 'green', 0, 0));
   } catch (Doctrine\DBAL\DBALException $e) {
	   // En cas d'erreur, afficher les informations dans le browser
	   // et terminer (Beurk ! Pour debug uniquement)
	   print_r( $e->errorInfo() );
	   print_r( $e->errorCode() );
	   return;
   }
   ~~~
   
   En utilisant un code similaire, repérez le code d'erreur MySQL qui
   correspond à un login dupliqué. Faites en sorte que votre
   gestionnaire affiche un message d'erreur significatif lorsque
   l'utilisateur demande un login déjà existant.


## Connexion et jeu

Maintenant nous pouvons passer à l'authentification. On peut voir cela
comme une seule vue (le jeu à proprement parler) utilisant deux URLs :
`/` et `/play`.

À ce stade il devient nécessaire de garder chez le server
l'information que les utilisateurs se sont correctement identifiés :
en effet, on veut que le mot de passe soit saisi une seule fois au
début d'une série de parties. C'est pourquoi entrent en jeu les
sessions.

Comme on a déjà [vu en cours](../classes/class5#sessions-en-silex),
avant de pouvoir utiliser les sessions il faut configurer
l'application avec

~~~
$app->register(new Silex\Provider\SessionServiceProvider());
~~~

Ensuite la session sera disponible dans l'objet `$app['session']` via
ses méthodes `get()` et `set()`.

1. Modifiez le gestionnaire de l'URL `/` pour qu'il affiche un
   formulaire similaire à celui ci
   
   | **Joueur 1 :** | <input type="text" size="10" /> | **mot de passe :** | <input type="password" size="10" />
   | **Joueur 2 :** | <input type="text" size="10" /> | **mot de passe :** | <input type="password" size="10" />

2. Comme pour l'URL `/signup`, le gestionnaire pour `/` se comportera
   différemment selon si la requête est de type GET ou POST. Dans le
   deuxième cas, il doit vérifier avec la BD que les deux couples
   login/password sont corrects, et, en cas affirmatif,
   
   - Stocker dans la session les logins des deux utilisateurs, leur
     scores et leurs couleurs préférées ;
   - Rédiriger vers `/play`.

3. Modifiez le gestionnaire de `/play` pour qu'il récupère les noms
   des joueurs, leurs scores et leurs couleurs dans la session. Si les
   deux joueurs ont la même couleur préférée, l'un des deux se verra
   attribuer sa couleur secondaire.

4. Modifiez le gestionnaire de `/play` pour que, à la fin de chaque
   partie, il envoie l'information sur le gagnant au server. Le server
   stocke cette information dans la table (incrémente `parties` pour
   chaque joueur, et `gagnees` uniquement pour le gagnant).

## Améliorations (optionnel)

1. Ajoutez une route `/logout` permettant de terminer une série de
   parties. Pour cela, il suffit de mettre une valeur spéciale dans la
   session (par exemple, les logins des joueurs à `null`), et tester
   cette valeur dans `/play`.

1. Dans `/signup`, demandez deux fois le mot de passe, et inscrivez le
   nouveau joueur seulement si les mots de passe coïncident.

1. Une mesure de sécurité souvent appliquée consiste à ne jamais
   stocker les mots de passe en clair dans la base de données. À la
   place, on stocke le *haché* (par exemple le SHA1) de la
   concaténation du mot de passe et d'une *graine* aléatoire propre à
   l'application.
   
   Tout le calcul doit se faire côté server. En effet, premièrement la
   graine ne doit être connue que par le server, deuxièmement, si
   c'est le client qui fait le calcul, le haché devient effectivement
   le mot de passe à la place de l'original.
   
   De cette façon, même l'administrateur ne peut pas connaître les
   mots de passe d'origine. En cas d'oubli du mot de passe, la seule
   solution est de ré-initialiser l'utilisateur. Un méprise de ce
   principe est à la base du
   [fameux *leak*](http://www.theguardian.com/technology/2013/nov/07/adobe-password-leak-can-check)
   de 150M de mots de passe de Adobe en 2013 :
   <http://zed0.co.uk/crossword/>.
   
   Implantez (correctement) ce principe dans votre application. La
   fonction de hachage SHA1 est disponible sous le nom `sha1()` en PHP
   et sous le nom `SHA1()` en MySQL.

1. Dans la page d'accueil, faites en sorte que les identifiants des
   joueurs soient auto-complétés. Voir
   <https://developer.mozilla.org/docs/Web/HTML/Element/datalist>.

1. Enrichissez les données sur les utilisateurs. Au minimum, cela
   pourrait se limiter au nom et prénom des joueurs. Vous pouvez
   pousser cela jusqu'à avoir un profil d'utilisateur complet de
   photos, etc.


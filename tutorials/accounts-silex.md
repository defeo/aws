---
layout: tutorial
title: Comptes utilisateur et AJAX
subtitle: (PHP+Silex)
---

Dans ce TD nous allons inclure le jeu de Puissance 4 que nous avons
[développé précédemment](tutorial2) dans une application complète,
avec des comptes utilisateur et un suivi des parties. Nous allons nous
servir de la base de données MySQL fournie par Cloud 9 pour le
stockage des données côté server, et du système de sessions de Silex
pour garder l'état de la connexion.

Les références pour ce TD sont :

- Les leçons sur les [sessions](../lessons/sessions) et sur les
  [DBAL](../lessons/sql),
- La doc de Silex sur les
  [sessions](http://silex.sensiolabs.org/doc/providers/session.html)
  et sur
  [Doctrine](http://silex.sensiolabs.org/doc/providers/doctrine.html),
- La [doc de Doctrine](http://docs.doctrine-project.org/projects/doctrine-dbal/en/latest/),
- L'[API de Doctrine](http://www.doctrine-project.org/api/dbal/2.4/index.html),
- La [référence MySQL](http://dev.mysql.com/doc/).
- La [page du MDN sur XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest),
- Les [pages du MDN sur AJAX](https://developer.mozilla.org/docs/AJAX),

Des références optionnelles, si vous décidez d'utiliser un autre DBAL que Doctrine :

- La [doc du module `PDO`](http://php.net/manual/en/book.pdo.php),
- La [doc du module `mysqli`](http://php.net/manual/en/book.mysqli.php).


## Préparer son espace de travail

Vous pouvez continuer à travailler dans le même espace que les TDs
précédents, ou en créer un nouveau, toujours en clonant
<http://github.com/defeo/aws-project>. Commencez par démarrer le
serveur MySQL en tapant dans un terminal la commande

~~~
mysql-ctl start
~~~
{:.bash}

Vous pouvez arrêter à tout moment le server MySQL avec

~~~
mysql-ctl stop
~~~

et le relancer avec

~~~
mysql-ctl restart
~~~

Si vous n'arrêtez pas le serveur à la fin de la session, il sera
encore actif lors de votre prochaine connexion à l'espace de travail.

L'interface d'administration de bases de données
[PHPMyAdmin](http://www.phpmyadmin.net/) est également disponible dans
Cloud9. Installez-la avec la commande

~~~
phpmyadmin-ctl install
~~~

Elle sera accessible à l'adresse

~~~
https://....c9.io/phpmyadmin
~~~
{:.no-highlight}

Le nom d'utilisateur est votre identifiant Cloud9 (tronqué à 16
caractères), votre mot de passe est vide. Une base de données nommée
`c9` a été automatiquement créé pour vous. Vous pouvez l'utiliser pour
vos applications, ou vous pouvez créer d'autres bases de données.

**Note:** PHPMyAdmin est exécuté par le même serveur apache que vos
applications Silex. Lorsque vous arrêtez une application Silex avec le
bouton *« Stop »*, vous arrêtez aussi PHPMyAdmin. Pour le relancer,
exécutez n'importe quelle application Silex.

1. Connectez-vous à PHPMyAdmin. Dans le database `c9` (ou dans un
   nouveau database), créez une table nommée `users`. La table doit
   contenir les champs suivants :
   
   - `login` : type `varchar(255)`, clef primaire,
   - `pass` : type `varchar(255) NOT NULL`,
   - `couleur1` : type `varchar(255)`,
   - `couleur2` : type `varchar(255)`,
   - `parties` : type `int NOT NULL`, non signé,
   - `gagnees` : type `int NOT NULL`, non signé.
   - `enligne` : type `int NOT NULL`, non signé.

2. Ajoutez deux utilisateurs à la table, avec les valeurs que vous
   voudrez.

Nous sommes maintenant prêts à étendre notre jeu de Puissace 4.
Chacune des sections qui suivantes est consacrée à une page de
l'application (une *vue*, en jargon).

Le point d'entrée de l'application va être le fichier
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
		'user'     => substr(getenv('C9_USER'), 0, 16),  // laissez comme ça, ou mettez
		                                                 // votre login à la place
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

   **Suggestion :** pour le rectangle coloré, vous pouvez utiliser un
   `<span>` avec une hauteur et une largeur fixes et la propriété
   `display: inline-block`.

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
     message d'erreur. Ne faites pas de redirection dans ce cas ; un
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
   $q = $app['db']->prepare('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?)');
   try {
	   // Envoyer la requête
	   $rows = $q->execute(array('toto', 1234, 'red', 'green', 0, 0, 0));
   } catch (Doctrine\DBAL\DBALException $e) {
	   // En cas d'erreur, afficher les informations dans le browser
	   // et terminer (Beurk ! Pour debug uniquement)
	   print_r( $q->errorInfo() );
	   print_r( $q->errorCode() );
	   return;
   }
   ~~~
   
   En utilisant un code similaire, repérez le code d'erreur MySQL qui
   correspond à un login dupliqué. Faites en sorte que votre
   gestionnaire affiche un message d'erreur significatif lorsque
   l'utilisateur demande un login déjà existant.


## Connexion et jeu

Maintenant nous pouvons passer à l'authentification. Puisqu'il s'agit
du point d'entrée de l'application, elle sera servie à l'URL
`/`. Après une connexion réussie, l'utilisateur sera redirigé vers une
page `/play`, servant le jeu de Puissance 4.

À ce stade il devient nécessaire de garder chez le serveur
l'information que les utilisateurs se sont correctement identifiés :
en effet, on veut que le mot de passe soit saisi une seule fois au
début d'une série de parties. C'est pourquoi entrent en jeu les
sessions.

Comme déjà vu dans la leçon sur les
[sessions](../lessons/sessions#exemple-en-silex), avant de pouvoir
utiliser les sessions il faut configurer l'application avec

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
   
   - Stocker dans la session les logins des deux utilisateurs, leurs
     scores et leurs couleurs préférées ;
   - Rédiriger vers `/play`.

3. Écrivez le gestionnaire de `/play` :
   
   - Si les utilisateurs se sont correctement identifiés (information
	 contenue dans la session), il affiche le plateau de Puissance 4
	 que vous avez écrit au [deuxième TD](tutorial2).
 
   - Si les utilisateurs ne sont pas correctement identifiés, il
     redirge vers l'url `/`.

4. Modifiez le gestionnaire de `/play` et son template pour que les
   noms des joueurs en jeu (encore une information contenue dans la
   session) soient affichés à côté du plateau.

5. Modifiez `/play` pour qu'un rectangle de la couleur préférée du
   joueur soit affiché à côté de son nom.  Si les deux joueurs ont la
   même couleur préférée, l'un des deux se verra attribuer sa couleur
   secondaire.

6. Modifiez `/play` pour que les couleurs des pions correspondent aux
   couleurs choisies par les joueurs.
   
   **Suggestion :** on pourrait générer le fichier CSS à l'aide d'un
   template, mais ce n’est pas l’option la plus simple. Il est plus
   intéressant d’utiliser une balise `<style>`, dans le `<head>` du
   template HTML, définissant uniquement les deux classes `.joueur1`
   et `.joueur2`, alors que tout le reste du CSS est gardé dans un
   fichier séparé servi statiquement par le serveur apache.

7. Modifiez votre code pour que, lorsque l’un des deux joueurs gagne,
   il affiche « ... a gagné » (remplacer ... par le nom du joueur).
   
   **Suggestion :** il y a énormément de façons de réaliser
   ceci. Comme au point précédent, une des possibilités consiste à
   définir deux variables JavaScript dans une balise `<script>`, dans
   le `<head>` du document. Ces variables seront ensuite accessibles
   depuis le code JavaScript afin de réaliser un affichage dynamique.


## Transmission du résultat par AJAX

Lorsque la partie se termine, il faut communiquer au serveur les
informations sur le gagnant, afin de mettre à jour la base de
données. Puisque le test du gagnant est réalisé par JavaScript, il est
naturel d'utiliser AJAX pour transmettre cette information.

Nous allons créer une simple route `/winner`, qui ne renvoie pas de
page HTML, mais une réponse au format textuel confirmant le succès de
l'opération. Cette route sera interrogée par JavaScript à la fin de
chaque partie.

1. Créer un gestionnaire pour la route `/winner/{resultat}`. La partie
   dynamique `resultat` va pouvoir prendre les valeurs suivantes :
   
   - `0` : partie nulle,
   - `1` : joueur 1 gagne,
   - `2` : joueur 2 gagne.
   
   Toute autre valeur est illégale et doit être refusée avec une code
   d'erreur 400 (*Bad Request*).
   
   **Rappel :** Pour envoyer une réponse avec un code d'état autre que
   200, vous devez utiliser le code Silex suivant, comme décrit
   [dans la documentation](http://silex.sensiolabs.org/doc/usage.html#dynamic-routing) :
   
   ~~~
   $app->abort(400, "Votre message d'erreur.")
   ~~~
   
   Testez votre gestionnaire dans le navigateur, et à l'aide des
   *DevTools*, en saisissant l'url `/winner/...` à la main.

2. La route `/winner` ne doit être accessible que aux utilisateurs
   connectés (comment savoir quelles entrées modifier dans la base de
   données, sinon ?).
   
   Testez dans la session que les utilisateurs sont
   bien connectés, et si cela n'est pas le cas renvoyez un code
   d'erreur 403 (*Forbidden*).
   
   Testez dans votre navigateur, en saisissant l'url `/winner/...` à
   la main. **Suggestion :** pour avoir une session fraîche, sans
   cookies de session, vous pouvez utiliser la modalité *navigation
   privée* (`Shift+Ctrl+P` sous Firefox, `Shift+Ctrl+N` sous Chrome).

3. Lorsque les préconditions des points précédents sont satisfaites,
   la route `/winner` augmente de 1 la colonne `parties` des deux
   joueurs, et de 1 la colonne `gagnees` du gagnant, s'il y en a un.
   
   Si tout s'est bien passé, le gestionnaire renvoie une réponse
   normale (code 200), contenant simplement le texte `OK`. Si une
   erreur s'est produite, il renvoie une réponse contenant le texte
   `ERROR`.
   
   Testez avec votre navigateur, en saisissant l'url `/winner/...` à
   la main.

4. Modifiez maintenant le code du client JavaScript (notamment la
   fonction `play()`) pour que à la fin de la partie il envoie une
   requête de type AJAX (via l'objet `XMLHttpRequest`) à l'url
   `/winner/0`, `/winner/1`, ou `/winner/2`, selon le résultat de la
   partie.
   
   Après l'envoi de la de la requête AJAX, les joueurs peuvent choisir
   de démarrer une nouvelle partie en cliquant à nouveau sur le
   plateau.


## Polling AJAX

Pour terminer, nous allons ajouter dans nos pages un composant qui
montre en temps réel la liste des utilisateurs connectés. Ce composant
sera codé en JavaScript pour la partie client, et du côté serveur par
un simple gestionnaire Silex renvoyant une réponse au format JSON. En
utilisant le principe du *unobtrusive JavaScript* déjà vu dans le
[deuxième TD](tutorial2), ce composant va pouvoir être intégré à
toutes les vues de l'application.

1. Modifiez la route `/` pour qu'elle redirige automatiquement sur
   `/play` lorsque les utilisateurs sont déjà connectés (information
   contenue dans la session).
   
   Si ce n'est pas déjà fait, modifiez cette route pour que, en plus
   de mettre dans la session les informations sur les joueurs
   connectés, elle modifie la colonne `enligne` dans la base de
   données.

1. Ajoutez une route `/logout` permettant de se déconnecter. Pour
   cela, il suffit de mettre une valeur spéciale dans la session (par
   exemple, les logins des joueurs à `null`). Lorsque les
   gestionnaires détecteront cette valeur spéciale, il traiteront la
   requête comme si le client ne s'était jamais identifié.
   
   Après une déconnexion réussi, le gestionnaire redirige sur `/`. Ce
   gestionnaire doit aussi remettre à 0 la colonne `enligne`
   correspondante aux joueurs dans la base de données.

1. Ajoutez un lien vers `/logout` dans la vue `/play`.

1. Créez une route `/connectes` qui renvoie la liste des utilisateurs
   connectés au format JSON.
   
   **Rappel :** Silex offre une fonctionnalité de conversion de
   tableau associatif PHP vers objet JSON. Il s'agit de la méthode
   `$app->json`. Par exemple, le gestionnaire
   
   ~~~
   $app->get('/api/fruits', function(Application $app) {
     $data = array('fruits' => array('banana', 'apple'),
                   'how_many' => 2);
     return $app->json($data);
   });
   ~~~
   
   renvoie la réponse JSON
   
   ~~~
   {
     "fruits": ["banana", "apple"],
     "how_many": 2
   }
   ~~~
   
   Testez le gestionnaire avec le browser. Analysez les entêtes HTTP
   envoyées par le serveur, en particulier le `Content-Type` avec les
   *dev tools*.


1. Dans le template de `/play`, ajoutez une balise
   
   ~~~
   <ul id="userlist"></ul>
   ~~~
   
   Avec JavaScript, au chargement de la page :
   
   - Faites une requête de type AJAX vers `/connectes`, récupérez dans
	 un objet JavaScript le code JSON renvoyé.
   
   - En modifiant le DOM comme vous avez fait pour le plateau de
     Puissance 4, remplissez la balise `userlist` avec la liste des
     utilisateurs connectés.
	 
   Utilisez un peu de CSS pour rendre cet affichage agréable.
   
   **Rappel :** puisque vous vous attendez à une réponse au format
   JSON, vous pouvez initialiser l'objet `XMLHttpRequest` avec
   `xhr.responseType = 'json'`. En continuant l'exemple précédent, le
   code
   
   ~~~
   xhr.responseType = 'json';
   xhr.onload = function() {
     for (f in xhr.response.fruits) {
       console.log(f);
     }
   }
   ~~~
   
   afficherait dans la console
   
   ~~~
   banana
   apple
   ~~~

1. Ajouter un bouton *« Mettre à jour »*. Lorsque le bouton est
   cliqué, il envoie une nouvelle requête AJAX à `/winner`. Lorsque la
   réponse est reçue, la liste des utilisateurs en ligne est mise à
   jour avec le contenu de la réponse JSON.

3. Remplacer le bouton *« Mettre à jour »* avec une minuterie qui met
   à jour la liste toutes les 2 secondes (utiliser la fonction
   [`setInterval`](https://developer.mozilla.org/docs/Web/API/window.setInterval)).



## Pour aller plus loin (optionnel)

On donne ici quelques idées pour développer davantage votre
application. Rien n'est obligatoire, mais cela vous permettra
d'approfondir votre connaissance des applications web.

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

1. Le *short polling* utilsé dans la dernière partie du TD est très
   inefficace comme méthode de *server push*. Malheureusement le
   modèle d'exécution de Apache+PHP est incompatible avec des
   connexions de longue durée : pendant qu'une connexion à un
   gestionnaire reste ouverte, tout le server est bloqué et aucune
   autre connexion ne peut être reçue.
   
   Un server multi-threads permettrait d'éviter ce problème, mais les
   threads ont on surcoût important, ce qui rend difficile le passage
   à l'échelle.
   
   Node.js propose un modèle différent : plutôt que lancer un thread à
   chaque nouvelle connexion, une application Node.js est une boucle
   infinie qui répond à des évènements de type connexion ou
   autre. Ceci permet d'avoir un server asynchrone avec capacité de
   *server push* sans besoin de multi-threading.
   
   La version de ce TD [pour Node.js](accounts-node) vous propose une
   implantation alternative basée sur l'API `EventSource`, et qui va
   jusqu'à réaliser des parties entre utilisateurs distants.

1. Permettez à un utilisateur de jouer plusieurs parties en même temps
   contre des adversaires différents.

1. Pourquoi ne pas mettre votre travail en ligne ? Tout hébergeur
   supportant PHP >=5.3 est capable de faire tourner Silex (je
   conseille [OpenShift](https://www.openshift.com/)). C'est la
   vitrine idéale pour montrer votre travail à un futur employeur.
   
   N'oubliez pas de mettre le code source sur
   [GitHub](https://github.com)... les employeurs adorent ça ! (Moi
   aussi, n'hésitez pas à m'envoyer un mail).

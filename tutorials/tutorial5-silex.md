---
layout: tutorial
title: Un jeu multi-utilisateurs
subtitle: (PHP+Silex)
scripts: ['../js/snap.svg-min.js',
          'http://coffeescript.org/extras/coffee-script.js']
---

Dans ce TD nous allons transformer notre jeu de Puissance 4 en un jeu
en ligne multi-utilisateurs. Pour réaliser une interface fluide et
*responsive*, l'utilisation de AJAX s'impose.

Dans une application web de ce type, il n'est pas suffisant d'avoir
des requêtes asynchrones : il est aussi nécessaire d'avoir des
événements asynchrones générés par le server. À cause des limitations
de PHP, nous allons utiliser du *short polling* pour simuler le
*server push*. Allez voir la [version pour Node.js](tutorial5-node)
pour un exemple d'application utilisant l'API de *server push*
`EventSource`.

Les références pour ce TD sont

- Le [cours](../classes/class6),
- La [page du MDN sur XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest),
- Les [pages du MDN sur AJAX](https://developer.mozilla.org/docs/AJAX).


## Utilisateurs en ligne

Pour pouvoir jouer contre un autre utilisateur, il faut que celui-ci
soit connecté. Nous allons commencer par gérer cette information et
l'afficher dans la liste des utilisateurs.

1. À l'aide de SQL Buddy, ajoutez à la table `users` les colonnes :
   - `connecte` : de type `tinyint`,
   - `joue` : de type `int`.

2. Modifiez le gestionnaire de `/userlist` pour qu'il affiche
   uniquement les utilisateurs dont le champ `connecte` vaut `TRUE`
   (utiliser la clause `WHERE`).

3. Modifiez le gestionnaire de `/` pour qu'il affiche un formulaire de
   login pour un seul utilisateur :
   
   | **Joueur :** | <input type="text" size="10" /> | **mot de passe :** | <input type="password" size="10" />
   
   lorsque le joueur s'identifie avec succès, son champ `connecte` est
   mis à `TRUE` et le browser est rédirigé vers `/userlist`.

4. Si ce n'est pas déjà fait, ajoutez un gestionnaire pour l'url
   `/logout`, qui met le champs `connecte` à `FALSE` et qui vide la
   session de l'utilisateur. Lorsque la déconnexion est réussie, le
   browser est rédirigé vers `/`. Ajoutez un lien vers `/logout` dans
   la liste des utilisateurs.

Testez votre application avec plusieurs browsers (au moins deux, il
est aussi possible d'utiliser le mode *navigation privée* de Firefox
ou Chrome pour avoir plusieurs fenêtres avec des sessions
différentes) ; vérifiez que la liste des utilisateurs correspond bien
aux utilisateurs connectés.


## Mise à jour dynamique de la liste des utilisateurs

Il est maintenant temps de faire entrer AJAX dans notre
application. Nous allons nous en servir pour mettre à jour
dynamiquement la liste des utilisateurs.

1. Créez un gestionnaire pour l'URL `/api/userlist`. Il doit récupérer
   la liste des utilisateurs connectés de la base de données, et
   l'envoyer au format JSON. Pour cela vous pouvez utiliser la méthode
   `$app->json` qui prend en paramètre un tableau associatif PHP et
   qui crée une réponse JSON à partir de celui-ci. Par exemple, le
   gestionnaire
   
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

2. Ajoutez dans la page `/userlist` un bouton *« Mettre à
   jour »*. Lorsque le bouton est cliqué, une requête AJAX est envoyée
   vers `/api/urserlist`. Lorsque la réponse est reçue, le tableau des
   utilisateurs en ligne est mis à jour avec le contenu de la réponse
   JSON.
   
   Puisque vous vous attendez à une réponse au format JSON, vous
   pouvez initialiser l'objet `XMLHttpRequest` avec
   `xhr.responseType = 'json'`. Dans l'exemple précédent, le code
   
   ~~~
   xhr.responseType = 'json';
   xhr.onload = function() {
     for (f in xhr.response.fruits) {
       console.log(f);
     }
   }
   ~~~
   
   Écrit dans la console
   
   ~~~
   banana
   apple
   ~~~

   La même chose en JQuery

   ~~~
   $.ajax({
     ...
     dataType: 'json',
     success: function(data) {
       for (f in data.fruits) {
         console.log(f);
       }
     },
   });
   ~~~

3. Remplacer le bouton *« Mettre à jour »* avec une minuterie qui met
   à jour la liste toutes les 2 secondes (utiliser la fonction
   [`setInterval`](https://developer.mozilla.org/docs/Web/API/window.setInterval)).

Vous avez maintenant une application simulant le *server push* avec du
*short polling*.


## Commencer une série de parties

Les choses se font intéressantes : nous allons permettre aux
utilisateurs de se mettre d'accord pour jouer une partie de
Puissance 4. La logique de cette partie est complexe, il est conseillé
de lire et comprendre l'intégralité de la section avant d'attaquer les
points individuels. Pour vous aider dans la compréhension (on
l'espère), on donne ici un diagramme interactif présentant l'ensemble
des requêtes et réponses du protocole d'invitation.

<div id="app-logic"></div>
<script type="text/coffeescript" src="../assets/app-logic.coffee"></script>

1. Avec SQL Buddy, créer une table `parties` avec les champs
   suivants :
   
   - `id` : type `int`, clef primaire, auto incrémentation,
   - `challenger`: type `varchar(255)`, non nul,
   - `challenged`: type `varchar(255)`, non nul,
   - `etat` : type `enum('demande', 'accepte', 'refuse', 'joueur1', 'joueur2')`,
   - `plateau` : type `varchar(42)`,

2. Créer un gestionnaire pour `/api/challenge` qui permet à
   l'utilisateur connecté d'inviter un adversaire à jouer une
   partie. Dans la suite on va appeler ces deux utilisateurs le
   *challenger* et le *challengé*.
   
   Le gestionnaire connaît le login du *challenger* par la session
   courante. Pour le *challengé*, il doit prendre en paramètre son
   login. Vous avez trois possibilités pour passer ce paramètre au
   gestionnaire :
   
   - À travers l'URL, en utilisant une route dynamique :
   
	 ~~~
     $app->get('/api/challenge/{login}', function() {...});
	 ~~~
	 
   - À travers un paramètre dans le *query string*, par exemple
     `/api/challenge?login=...`,
	 
   - À travers le corps d'une requête POST (probablement le moins
     pratique).
   
   Lorsqu'il est exécuté, le gestionnaire vérifie le champ `joue` des
   deux utilisateurs
   
   - Si l'un des deux est déjà invité ou en train de jouer une partie,
     le gestionnaire renvoie une erreur `412 Precondition Failed`. On
     rappelle que pour envoyer un code d'erreur arbitraire on fait
	 
	 ~~~
	 return new Response('Message d'erreur', 412);
	 ~~~
	 
   - Si les deux utilisateurs sont libres (champ `joue` vaut `NULL`),
     le gestionnaire crée une nouvelle entrée dans la table `parties`,
     avec `etat` égal à `'demande'`, et `challenger` et `challenged`
     remplis avec les logins respectifs. Ensuite il met le champ
     `joue` des deux utilisateurs à l'`id` de la nouvelle partie, et
     renvoie un message de succès (du texte simple suffit, par exemple
     l'id de la partie).
	 
	 Pour récupérer l'id de la dernière insertion dans la base de
     données, Doctrine vous offre la fonction très pratique
	 `app['db']->lastInsertId()`.

3. Dans la page `/userlist`, ajoutez un lien sur chacun des logins (à
   l'exception du login de l'utilisateur courant) qui permet d'inviter
   le joueur à jouer. Le lien doit être affiché en bleu si
   l'utilisateur est disponible, en rouge et pas clicable si
   l'utilisateur est occupé dans une autre partie.
   
   Lorsque le lien est cliqué, vous devez déclencher une requête AJAX
   vers l'URL `/api/challenge...`, qui permet de défier le joueur
   cliqué. Pour intercepter un clic sur un lien, et éviter que le
   navigateur suive le lien, il faut utiliser le gestionnaire de
   l'événement `click`, et utiliser `.preventDefault()`, comme ceci
   
   ~~~
   a.addEventListener('click', function(e) {
     // Envoyer la requête AJAX
	 ...
	 e.preventDefault();
   });
   ~~~
   
   Prévoyez une zone d'affichage pour notifier que l'invitation a été
   envoyée. Mettez cette zone à jour après l'envoi de la requête AJAX.

4. Modifiez le gestionnaire de `/api/userlist` pour qu'il envoie, à
   côté de la liste des utilisateurs, des données indiquant si
   l'utilisateur est invité à une partie et par qui. Ces données
   doivent être récupérées des tables `users` et `parties`.

5. Modifiez la page `/userlist` pour qu'elle notifie l'utilisateur
   lorsqu'il a été invité à une partie et qu'elle lui propose
   d'accepter ou de refuser. Si l'utilisateur accepte, une requête
   AJAX est envoyée à l'URL `/api/accept`, sinon à `/api/reject`. Pour
   éviter des conflits, il peut être utile de passer en paramètre le
   login de l'adversaire ou l'id de la partie.
   
   Lorsque `/api/accept` renvoie un code de succès, JavaScript
   rédirige le browser vers l'URL `/play` (utiliser
   [`window.location`](https://developer.mozilla.org/docs/Web/API/Window.location)
   pour effectuer une rédirection côté client).

6. Écrivez les gestionnaires de `/api/accept` et `/api/reject`. Ils
   doivent modifier l'`etat` de la partie dans la table `parties` et
   renvoyer un code de succès ou d'erreur. `/api/reject` remet le
   champ `joue` du challengé à `NULL`.

7. Modifiez la page `/userlist`. Lorsque une invitation en attente de
   confirmation reçoit une acceptation, elle rédirige vers
   `/play`. Lorsque elle reçoit un refus, elle affiche un message et
   revient à l'état initial.

8. Modifiez le gestionnaire de `/api/userlist`. Lorsque une invitation
   en attente de confirmation reçoit un refus, elle élimine la ligne
   correspondante de la table `parties` et remet le champ `joue` du
   challenger à `NULL`.

Vérifiez que votre application se comporte comme attendu : les
utilisateur sont bien notifiés des invitations, acceptations, refus,
l'état des tables reste cohérent, aucun utilisateur reste bloqué dans
un état inconsistant.


## Jouer une série de parties

Nous arrivons à dernière partie de notre application : le jeu. Les
indications vont devenir plus sommaires pour vous permettre d'explorer
en détail AJAX.

1. Modifiez le gestionnaire de l'URL `/play` pour qu'il affiche bien
   les deux joueurs participant à la partie. Ces informations se
   trouvent dans la session et dans les tables `users` et `parties`.
   
   En plus, la page doit afficher à quel joueur c'est le tour de
   jouer. Normalement, c'est le joueur challengé qui commence.
   
   Pour une meilleure gestion des conflits, vous pouvez faire en sorte
   que le gestionnaire prenne en paramètre l'id de la partie (à
   travers l'URL, ou la query string ou un paramètre POST).

2. Modifiez la page `/play`. Lorsque le joueur clique sur une case,
   elle exécute l'une de ces deux actions :
   
   - Si c'est le tour du joueur et le coup est valide, une requête
     AJAX est envoyée à l'URL `/api/play`, avec le détails sur le coup
     joué. Lorsque la requête retourne avec succès, le plateau est mis
     à jour et le tour passe à l'adversaire.
   - Sinon, elle affiche un message d'erreur.

3. Créez le gestionnaire de l'URL `/api/play`. Si le coup joué n'est
   pas valide, il renvoie un code d'erreur. Sinon
   
   - Il met à jour la représentation du plateau sur le serveur (champ
     `plateau`, vous pouvez utiliser un caractère par case pour
     représenter le plateau) ;
   - Il met à jour le tour (champ `etat`) ;
   - Il renvoie un code de succès avec une représentation JSON du
     plateau.

4. Créez un gestionnaire pour l'URL `/api/play_event`. Par *short
   polling*, envoyez au joueur en attente les informations sur le coup
   de son adversaire.

5. Les vérifications de fin de partie ne peuvent pas être la
   responsabilité de l'un ou de l'autre joueur. Ce doit être le server
   qui vérifie après chaque coup si la partie est terminée, et notifie
   les joueurs en conséquence.
   
   Récrivez la logique qui teste la fin de la partie du côté
   server. Lorsque une partie est terminée, mettez à jour les champs
   `parties` et `gagnees` des utilisateurs.

6. Lorsque une partie est terminée, donnez à chacun des joueurs la
   possibilité d'arrêter ou de faire une nouvelle partie.
   
   Lorsque on démarre une nouvelle partie, c'est le joueur qui n'a pas
   commencé la partie précédente qui démarre.
   
   Lorsque on arrête, la partie est effacée de la table `parties` et
   les champs `joue` sont mis à `NULL`.

Vérifiez que la logique de l'application fonctionne correctement :
chaque utilisateur peut jouer uniquement à son tour, aucun utilisateur
peut se trouver dans un état inconsistant, l'état des plateaux
affichés au joueurs correspond à l'état du plateau dans la base de
données.


## Pour aller plus loin

On donne ici quelques idées pour développer davantage votre
application. Rien n'est obligatoire, mais cela vous permettra
d'approfondir votre connaissance des applications web.

- Le *short polling* est très inefficace comme méthode de *server
  push*. Malheureusement le modèle d'exécution de Apache+PHP est
  incompatible avec des connexions de longue durée : pendant qu'une
  connexion à un gestionnaire reste ouverte, tout le server est bloqué
  et aucune autre connexion ne peut être reçue.
  
  Un server multi-threads permettrait d'éviter ce problème, mais les
  threads ont on surcoût important, ce qui rend difficile le passage à
  l'échelle.
  
  Node.js propose un modèle différent : plutôt que lancer un thread à
  chaque nouvelle connexion, une application Node.js est une boucle
  infinie qui répond à des évènements de type connexion ou autre. Ceci
  permet d'avoir un server asynchrone avec capacité de *server push*
  sans besoin de multi-threading.
  
  La version de ce TD [pour Node.js](tutorial5-node) vous propose une
  implantation alternative basée sur l'API `EventSource`.

- À défaut de vouloir utiliser Node.js, on peut essayer de réduire la
  quantité de données qui transite à chaque requête. Pour la liste des
  utilisateurs, par exemple, on pourrait vouloir n'envoyer des données
  que lorsque quelque chose a changé. Lorsque rien n'a changé, on peut
  se contenter d'envoyer une réponse `304 Not Modified`.
  
  Les entêtes dédiées au *chaching* permettent de réaliser
  cela. Lorsque le server envoye des données, il inclut une balise
  `ETag`, contenant un numéro de version de la ressource ; par exemple
  
  ~~~
  ETag: "version-11"
  ~~~
  
  Avec la balise `If-None-Match`, le client peut demander de n'envoyer
  les données que si l'état de la ressource ne correspond pas à la
  version indiquée :
  
  ~~~
  If-None-Match: "version-11"
  ~~~
  
  À vous d'imaginer un mécanisme qui permette d'attacher un numéro de
  version à l'état du server.

- Ajoutez un mécanisme permettant de détecter le fait qu'un
  utilisateur est allé hors ligne (par ex. : il n'a pas envoyé de poll
  depuis un certain temps). Notifiez ses adversaires lorsqu'il est
  devenu hors ligne.

- Permettez à un utilisateur de jouer plusieurs parties en même temps
  contre des adversaires différents.

- L'utilisation d'une base de données MySQL pour garder l'état des
  parties peut se révéler lourd. Pour des gros débits de données, il
  est souvent plus efficace de passer par un système de stockage en
  mémoire vive, comme Redis. Remplacez la table `parties` et toutes
  les données relatives aux parties en cours par des objets stockés
  dans une base Redis. Il vous faudra lire et comprendre les
  [manuels de Redis](http://redis.io/documentation).
  
  Pour installer et démarrer Redis dans C9, il faut exécuter dans la
  console
  
  ~~~
  nada-nix install redis
  php composer.phar require predis/predis ~0.8
  php composer.phar require predis/service-provider ~0.4
  redis-server --port 16379 --bind $IP
  ~~~
  {:.bash}
  
  Ensuite il faut configurer l'application avec
  
  ~~~
  $app->register(new Predis\Silex\PredisServiceProvider(), array(
      'predis.parameters' => 'tcp://' . getenv('IP') . ':16379'
  ));
  ~~~
  
  À partir de ce moment vous avez un objet `$app['predis']` dans votre
  application, qui vous donne accès à toutes le fonctionnalités de la
  bibliothèque [predis](https://github.com/nrk/predis).

- Pourquoi ne pas mettre votre travail en ligne ? Tout hébergeur
  supportant PHP >=5.3 est capable de faire tourner Silex (je
  conseille [OpenShift](https://www.openshift.com/)). C'est la vitrine
  idéale pour montrer votre travail à un futur employeur.
  
  N'oubliez pas de mettre le code source sur
  [GitHub](https://github.com)... les employeurs adorent ça ! (Moi
  aussi, n'hésitez pas à m'envoyer un mail).
  

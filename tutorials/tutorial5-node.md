---
layout: tutorial
title: Un jeu multi-utilisateurs
subtitle: (Node.js+Express)
scripts: ['../js/snap.svg-min.js',
          'http://coffeescript.org/extras/coffee-script.js']
---

Dans ce TD nous allons transformer notre jeu de Puissance 4 en un jeu
en ligne multi-utilisateurs. Pour réaliser une interface fluide et
*responsive*, l'utilisation de AJAX s'impose.

Dans une application web de ce type, il n'est pas suffisant d'avoir
des requêtes asynchrones : il est aussi nécessaire d'avoir des
événements asynchrones générés par le server. Nous allons utiliser
l'API `EventSource` pour réaliser ce *server push*. Allez voir la
[version pour Silex](tutorial5-silex) pour un exemple d'application
simulant le *server push* avec du *short polling*.

Les références pour ce TD sont

- Le [cours](../classes/class6),
- La [page du MDN sur XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest),
- Les [pages du MDN sur AJAX](https://developer.mozilla.org/docs/AJAX),
- Ce
  [tutoriel sur l'utilisation de `EventSource` avec Node.js](http://tomkersten.com/articles/server-sent-events-with-node/),
- Ce
  [tutoriel sur l'utilisation de `EventEmitter`](http://www.sitepoint.com/nodejs-events-and-eventemitter/).


## Utilisateurs en ligne

Pour pouvoir jouer contre un autre utilisateur, il faut que celui-ci
soit connecté. Nous allons commencer par gérer cette information et
l'afficher dans la liste des utilisateurs.

1. Dans votre application, créez une variable globale (en dehors de
   tout gestionnaire) `connectes`. Cette variable va contenir la liste
   des utilisateurs connectés.

2. Modifiez le gestionnaire de `/userlist` pour qu'il affiche
   uniquement les utilisateurs connectés.

3. Modifiez le gestionnaire de `/` pour qu'il affiche un formulaire de
   login pour un seul utilisateur :
   
   | **Joueur :** | <input type="text" size="10" /> | **mot de passe :** | <input type="password" size="10" />
   
   lorsque le joueur s'identifie avec succès, il est ajouté à la liste
   `connectes`.

4. Si ce n'est pas déjà fait, ajoutez un gestionnaire pour l'url
   `/logout`, qui éliminé l'utilisateur de la liste `connectes` et qui
   vide sa session. Lorsque la déconnexion est réussie, le browser est
   rédirigé vers `/`. Ajoutez un lien vers `/logout` dans la liste des
   utilisateurs.

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
   `res.json` qui prend en paramètre un objet JavaScript et qui crée
   une réponse JSON à partir de celui-ci. Par exemple, le gestionnaire
   
   ~~~
   app.get('/api/fruits', function(req, res) {
     var data = { fruits: ['banana', 'apple'],
                  how_many: 2
                };
     res.json(data);
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


## Du *short polling* à `EventSource`

Comme annoncé, nous allons utiliser l'API `EventSource` pour réaliser
le *server push*. Dans cette section nous allons voir comment
remplacer les requêtes AJAX de la section précédente par cette API.

On rappelle le fonctionnement de `EventSource`. Il s'agit d'une
connexion persistante entre le client et le server, sur laquelle le
server émet des données textuelles à tout moment. Dans la suite on va
appeler *event source* le gestionnaire de la connexion du côté
server ; il sera attaché à une URL par le router, comme un quelconque
gestionnaire. L'API `EventSource` permet au client de déclencher un
événement JavaScript à chaque fois que des nouvelles données sont
envoyées par le server.

Une réponse HTTP typique d'une *event source* ressemble à cela :

~~~
HTTP/1.1 200 OK
Cache-Control: no-cache
Content-Type: text/event-stream
X-Powered-By: Express
transfer-encoding: chunked
Connection: keep-alive

data: Un message anonyme

event: toto
data: Un message de type 'toto'

id: 2
event: toto
data: Un message avec un identifiant
data: sur plusieurs lignes
~~~

On voit que les messages sont précédés par le mot clef `data:` et
terminés par un double retour à la ligne. Les messages peuvent
optionnellement être précédés par un champs `event:` et/ou un champs
`id:`, permettant respectivement d'assigner un *nom* et un
*identifiant* au message (ce n'est pas très différent des concepts de
*classe* et *id* en CSS, respectivement).

Du côté client, c'est très simple d'initialiser une connexion de ce
type : il suffit de créer un objet de type `EventSource` en lui
passant l'URL de l'*event source*.

~~~
var evt = new EventSource('/api/notifications');
~~~

Pour réagir aux messages du server, il suffit d'enregistrer un
gestionnaire d'événements. Il y a deux types d'événements : les
messages anonymes, qui engendrent un événement de type `'message'`

~~~
evt.addEventListener('message', function(e) {
  console.log(e.data);
});
~~~

et les messages avec nom, qui engendrent un événement du même type que
le nom du message

~~~
evt.addEventListener('toto', function(e) {
  console.log(e.data);
});
~~~

Dans les deux cas, le corps du message est disponible dans le champ
`.data` de l'objet `Event`.

Du côté server, cela ne prend que quelques lignes de Node.js pour
créer une *event source*. Voici un exemple qui écrit l'heure courante
toutes les secondes.

~~~
app.get('/my-event-source', function(req, res) {
  // On initialise les entêtes HTTP
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  // On envoye les entêtes
  res.writeHead(200);

  // Toutes les secondes, on envoie l'heure.
  // On garde une référence au timer pour pouvoir l'arrêter.
  var timer = setInterval(function() {
    var date = Date();
	console.log(date);
    res.write('event: date\n');
	res.write('data: ' + date + '\n\n');
  }, 1000);
  
  // Lorsque le client ferme la connexion, on arrête le timer
  // (pour éviter d'encombrer la mémoire de l'application)
  req.on('close', function() {
    clearInterval(timer);
  });
});
~~~

1. Transformez le gestionnaire `/api/userlist` en un *event
   source*. Toutes les 2 secondes, il écrit sur sa sortie la liste des
   utilisateurs au format JSON.
   
   **Note :** Vous ne pouvez plus utiliser `app.json` pour écrire les
   données, car cela fermerait la connexion. À la place, vous pouvez
   utiliser la fonction
   [`JSON.stringify()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
   qui transforme un objet JavaScript en une chaîne de caractères au
   format JSON.

2. Modifiez la page `/userlist` pour utiliser `EventSource` à la place
   du *short polling*. Pour transformer les messages du server en des
   données JavaScript, vous pouvez utiliser la fonction
   [`JSON.parse`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse).


## Utiliser les événements dans Node.js

À ce stade, notre application ne fait plus du *short polling* par le
client, mais elle reste très inefficace : le polling a été déplacé
dans le server, ce qui ne diminue que marginalement le surcoût de
communication.

Heureusement, le noyau de Node.js est basé sur les événements. Ceci
nous permet de n'écrire sur la sortie du *event source* que lorsque il
est nécessaire : à chaque login ou logout.

L'objet qui permet de générer des événements en Node.js est
[`events.EventEmitter`](http://nodejs.org/api/events.html#events_events). Comme
le nom l'indique, un `EventEmitter` est un objet capable d'émettre des
événements : on peut lui attacher autant de gestionnaires
d'événements que l'on souhaite, ceux-ci seront exécutés à chaque fois
que le `EventEmitter` émet un événement.

On crée un objet de type `EventEmitter` par un `new`, comme tout autre
objet. Ses deux méthodes principales sont `.emit()` qui permet
d'émettre un événement, `.on()` qui permet d'ajouter un gestionnaire
d'événements, et `.removeListener()` qui permet d'en supprimer
un.

Dans l'exemple qui suit, on émet un événement de type `'pinged'` à
chaque fois que l'URL `/ping` est visitée. Un gestionnaires très
simple est attachés à l'événement, et d'autres gestionnaires peuvent être

~~~
var evt = require('events');

// On crée l'émetteur d'événements
var an_emitter = new evt.EventEmitter();

// On attache un gestionnaire d'événements très simple
an_emitter.on('pinged', function() {
  console.log('pinged');
});

app.get('/ping', function(req, res) {
  // On émet un événement 'pinged'
  an_emitter.emit('pinged');
});

// On ajoute un gestionnaire de plus pour
// l'événement 'pinged'.
app.get('/logger/:id', function(req, res) {
  an_emitter.on('pinged', function() {
    // remarquez l'utilisation d'une clôture pour
	// accéder au paramètre `req` de la portée externe.
    console.log(req.params.id + ': pinged');
  });
  res.send(200);
});
~~~

3. Testez ce code en visitant les urls `/ping` et `/logger/...`.

4. Créez un `EventEmitter` global pour votre application, qui va
   émettre des événements à chaque fois qu'un utilisateur se connecte
   ou se déconnecte.
   
   Modifiez les gestionnaires de `/login` et `/logout` pour émettre un
   événement lorsque un utilisateur s'est connecté ou déconnecté avec
   succès.

5. Modifiez l'*event source* à l'URL `/api/userlist`. Il ne doit
   écrire sur sa sortie que lorsque le `EventEmitter` émet un
   événement de login ou de logout.

Bravo, vous avez réussi à écrire votre première application web
totalement asynchrone. Pour une utilisation intensive de
`EventSource`, il peut être intéressant d'utiliser des modules pour
Node.js qui encapsulent la logique d'un *event source* et qui
fournissent une API simplifiée, comme, par exemple
[`express-eventsource`](https://www.npmjs.org/package/express-eventsource).


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


1. À chaque utilisateur de la liste `connectes`, ajoutez un champ
   `partie` qui va pointer vers la partie à laquelle le jouer
   participe, ou `null` si le jouer n'est occupé dans aucune partie.

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
     app.get('/api/challenge/:login', function() {...});
	 ~~~
	 
   - À travers un paramètre dans le *query string*, par exemple
     `/api/challenge?login=...`,
	 
   - À travers le corps d'une requête POST (probablement le moins
     pratique).
   
   Lorsqu'il est exécuté, le gestionnaire vérifie les champs `partie`
   des deux joueurs.
   
   - Si l'un des deux est déjà invité ou en train de jouer une partie,
     le gestionnaire renvoie une erreur `412 Precondition Failed`. On
     rappelle que pour envoyer un code d'erreur arbitraire on fait
	 
	 ~~~
	 res.send(412, 'Message d'erreur');
	 ~~~
	 
   - Si les deux utilisateurs sont libres, le gestionnaire assigne un
     nouvel objet aux champs `partie` des deux joueurs. L'objet doit
     tenir trace de l'état de la partie (invité, accepté, refusé,
     etc.), des deux participants et du déroulement de la partie
     (plateau de jeu).
	 
	 Enfin le gestionnaire renvoie un message de succès (du texte
     simple suffit, par exemple un id de la partie).

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

4. Modifiez le *event source* `/api/userlist` pour qu'il envoie un
   événement de type `invitation`, lorsque un utilisateur est invité à
   une partie.

5. Modifiez la page `/userlist` pour qu'elle notifie l'utilisateur
   lorsqu'il a été invité à une partie et pour qu'elle lui propose
   d'accepter ou de refuser. Si l'utilisateur accepte, une requête
   AJAX est envoyée à l'URL `/api/accept`, sinon à `/api/reject`. Pour
   éviter des conflits, il peut être utile de passer en paramètre le
   login de l'adversaire ou l'id de la partie.
   
   Lorsque `/api/accept` renvoie un code de succès, JavaScript
   rédirige le browser vers l'URL `/play` (utiliser
   [`window.location`](https://developer.mozilla.org/docs/Web/API/Window.location)
   pour effectuer une rédirection côté client).

6. Écrivez les gestionnaires de `/api/accept` et `/api/reject`. Ils
   doivent
   
   - modifier l'état de la partie ou bien mettre les champs `partie`
     des joueurs concernés à `null`,
   - notifier l'adversaire à travers un événement de `/api/userlist`,
   - renvoyer un code de succès ou d'erreur.

7. Modifiez la page `/userlist`. Lorsque une invitation en attente de
   confirmation reçoit une acceptation, elle rédirige vers
   `/play`. Lorsque elle reçoit un refus, elle affiche un message et
   revient à l'état initial.

Vérifiez que votre application se comporte comme attendu : les
utilisateur sont bien notifiés des invitations, acceptations, refus,
l'état des tables reste cohérent, aucun utilisateur reste bloqué dans
un état inconsistant.


## Jouer une série de parties

Nous arrivons à dernière partie de notre application : le jeu. Les
indications vont devenir plus sommaires pour vous permettre d'explorer
en détail AJAX et le *server push*.

1. Modifiez le gestionnaire de l'URL `/play` pour qu'il affiche bien
   les deux joueurs participant à la partie. Ces informations se
   trouvent dans la session et dans les variables globales.
   
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
   
   - Il met à jour la représentation du plateau sur le serveur ;
   - Il met à jour le tour ;
   - Il renvoie un code de succès avec une représentation JSON du
     plateau.

4. Créez une *event source* à l'URL `/api/play_event`. Lorsque
   l'adversaire joue, envoyez un événement au joueur en attente.

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
   
   Lorsque on arrête, les champs `partie` des deux joueurs sont mis à
   `null`.

Vérifiez que la logique de l'application fonctionne correctement :
chaque utilisateur peut jouer uniquement à son tour, aucun utilisateur
peut se trouver dans un état inconsistant, l'état des plateaux
affichés au joueurs correspond à l'état du plateau dans la base de
données.


## Pour aller plus loin

On donne ici quelques idées pour développer davantage votre
application. Rien n'est obligatoire, mais cela vous permettra
d'approfondir votre connaissance des applications web.

- Gérez correctement le fait qu'un utilisateur est allé hors ligne
  (événement `close` de `req`). Notifiez ses adversaires lorsqu'il est
  devenu hors ligne.

- L'API `EventSource` a l'avantage d'être simple à comprendre et à
  utiliser. Cependant, pour chaque échange asynchrone entre le client
  et le server, il a fallu créer une *route montante* (pour les envois
  client → server, via AJAX) et une *route descendante* (pour les
  envois server → client, via *server push*).
  
  Les web sockets, grâce à leur canal bidirectionnel, permettent de
  simplifier la logique et peuvent rendre l'application plus rapide.
  Récrivez la partie `/play` de votre application à l'aide d'une
  bibliothèque de web sockets, telle <http://socket.io/>.

- Permettez à un utilisateur de jouer plusieurs parties en même temps
  contre des adversaires différents.

- L'utilisation de variables globales est pratique pour des simples
  applications *mono-thread*. Mais Node.js n'est pas uniquement
  destiné aux petites applications web : son noyau supporte du
  *multi-processing* et du *load balancing*, permettant de distribuer
  une application web sur plusieurs *cores* (voir le module
  [Cluster](http://nodejs.org/api/cluster.html) de Node.js).
  
  Dans un environnement *multi-process*, la mémoire globale n'est pas
  partagée avec les autres processus, il devient donc impossible
  d'utiliser les variables globales pour maintenir l'état. Il est
  alors nécessaire d'utiliser une base de données externe pour stocker
  l'état, avec en plus des garanties d'*atomicité* (transactions).
  
  On pourrait, bien sûr, utiliser la base MySQL, comme cela est fait
  dans le [TD en Silex](tutorial5-silex). Cependant il est souvent
  plus simple et efficace d'utiliser un système NoSQL en mémoire vive,
  comme par exemple Redis. De plus le système
  [pub/sub de Redis](http://redis.io/topics/pubsub) est parfaitement
  adapté au modèle à événements de Node.js et au *server push*.
  
  Remplacez les variables globales par des objets stockés dans une
  base Redis. Il vous faudra lire et comprendre les
  [manuels de Redis](http://redis.io/documentation).
  
  Pour installer et démarrer Redis dans C9, il faut exécuter dans la
  console
  
  ~~~
  nada-nix install redis
  npm install redis
  redis-server --port 16379 --bind $IP
  ~~~
  {:.bash}
  
  Lisez la documentation du module
  [`node_redis`](https://github.com/mranney/node_redis) pour apprendre
  à vous servir de Redis dans Node.js.
  
  Le
  [tutoriel sur l'utilisation de `EventSource` avec Node.js](http://tomkersten.com/articles/server-sent-events-with-node/)
  est une excellente introduction à l'utilisation du pub/sub de Redis
  dans une application asynchrone.

- Pourquoi ne pas mettre votre travail en ligne ? Aussi bien
  [OpenShift](https://www.openshift.com/) que
  [Heroku](https://www.heroku.com/) offrent un plan d'hébergement
  gratuit pour applications en Node.js (une liste plus longue
  d'hébergeurs supportant Node.js est disponible
  [ici](https://github.com/joyent/node/wiki/node-hosting)). C'est la
  vitrine idéale pour montrer votre travail à un futur employeur.
  
  N'oubliez pas de mettre le code source sur
  [GitHub](https://github.com)... les employeurs adorent ça ! (Moi
  aussi, n'hésitez pas à m'envoyer un mail).
  

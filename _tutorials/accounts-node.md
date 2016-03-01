---
title: Comptes utilisateur, AJAX, Server push
subtitle: (Node+Express)
---

Dans ce TD nous allons inclure le jeu de Puissance 4 que nous avons
[développé précédemment](tutorial2) dans une application
multi-utilisateurs, permettant de jouer des parties avec des
adversaires distants. Nous allons nous servir de la base de données
MySQL fournie par Cloud 9 pour le stockage des données côté server, et
du système de sessions de Silex pour garder l'état de la connexion.

Pour réaliser une interface fluide et *responsive*, l'utilisation de
AJAX s'impose. Mais, dans une application web de ce type, il n'est pas
suffisant d'avoir des requêtes asynchrones : il est aussi nécessaire
d'avoir des événements asynchrones **générés par le serveur**. Nous
allons utiliser l'API `EventSource` pour réaliser ce *server
push*. Allez voir la [version pour Silex](accounts-silex) pour un
exemple d'application simulant le *server push* avec du *short
polling*.

Les références pour ce TD sont :

- Les leçons sur les [sessions](../lessons/sessions) et sur les
  [DBAL](../lessons/sql),
- La doc de `express-session` sur les
  [sessions](https://github.com/expressjs/session),
- La [doc de `mysql`](https://github.com/felixge/node-mysql),
- La [référence MySQL](http://dev.mysql.com/doc/).
- La [page du MDN sur XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest),
- Les [pages du MDN sur AJAX](https://developer.mozilla.org/docs/AJAX),
- Ce
  [tutoriel sur l'utilisation de `EventSource` avec Node.js](http://tomkersten.com/articles/server-sent-events-with-node/),
- Ce
  [tutoriel sur l'utilisation de `EventEmitter`](http://www.sitepoint.com/nodejs-events-and-eventemitter/).

Des références optionnelles, si vous décidez d'utiliser un autre DBAL que Doctrine :

- La [doc du module `PDO`](http://php.net/manual/en/book.pdo.php),
- La [doc du module `mysqli`](http://php.net/manual/en/book.mysqli.php).


## Préparer son espace de travail

Comme d'habitude, on va partir d'un clone de
<http://github.com/defeo/aws-project>.  Commencez par démarrer le
serveur MySQL en tapant la commande

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
https://....c9users.io/phpmyadmin
~~~
{:.no-highlight}

Le nom d'utilisateur est votre identifiant Cloud9 (tronqué à 16
caractères), votre mot de passe est vide. Une base de données nommée
`c9` a été automatiquement créé pour vous. Vous pouvez l'utiliser pour
vos applications, ou vous pouvez créer d'autres bases de données.

**Note:** PHPMyAdmin est exécuté par le même serveur apache qui
exécute les applications PHP. Lorsque vous lancez une application
Node.js, le serveur Apache est arrêté et PHPMyAdmin devient
indisponible.

Pour lancer à nouveau PHPMyAdmin, arrêtez votre serveur Node.js, et
lancez à nouveau le serveur Apache en exécutant n'importe quelle
application PHP (par exemple, `example.php`). Pour faciliter le
lancement de PHPMyAdmin, vous pouvez créer une *run configuration* :
menu *« Run → Run configurations → New run configuration »*, puis
sélectionnez *« Runner: Apache httpd »* et donnez un nom à la
configuration. À partir de maintenant, cette configuration sera
disponible avec un clic droit sur le bouton *« Run »*, depuis
n'importe quel fichier.

Alternativement, Cloud9 supporte une
[autre technique](https://docs.c9.io/docs/multiple-ports#section-how-to-run-phpmyadmin-at-the-same-time-as-your-nodejs-ruby-on-rails-or-other-application),
à la mise en place assez simple, permettant de faire tourner un
serveur Node en même temps qu'un serveur Apache.

1. Connectez-vous à PHPMyAdmin. Dans le database `c9` (ou dans un
   nouveau database), créez une table nommée `users`. La table doit
   contenir les champs suivants :
   
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

Le point d'entrée de l'application va être un fichier `app.js`. Vous
êtes cependant libres de distribuer votre logique sur plusieurs
fichiers, importés dans `app.js` avec la directive `require` (voir la
doc de Node.js sur les [modules](http://nodejs.org/api/modules.html)).


## Liste des utilisateurs

Commencez par installer le module `mysql` avec la commande

~~~
npm install mysql
~~~

Cette vue est la plus simple : elle permet d'afficher la liste de tous
les utilisateurs. On rappelle que, avant de pouvoir accéder à la base
de données, il est nécessaire de configurer le module `mysql`. Le code
suivant permet de configurer votre application avec les paramètres de
C9.

~~~
var mysql = require('mysql');
var db    = mysql.createConnection({
  host     : process.env.IP,  // pas touche à ça : spécifique pour C9 !
  user     : process.env.C9_USER.substr(0,16),  // laissez comme ça, ou mettez
                                                // votre login à la place
  password : '',
  database : 'c9'  // mettez ici le nom de la base de données
});
~~~

Ensuite le DBAL sera accessible via l'objet `db`.

1. Dans `app.js` ajoutez une route pour l'URL `/userlist`. Elle doit
   récupérer l'ensemble des lignes de la table `users`, et en afficher
   les colonnes `login`, `parties`, `gagnees` et `couleur1` sous forme
   de tableau HTML.  On rappelle que le résultat de la requête est
   passé à la *callback* de la méthode `query`.

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
   type POST (rappel : utiliser `app.all()`).  Vous pouvez tester
   le type de la requête avec `req.method`.
   
   Lorsque la requête est de type POST, récupérez les valeurs du
   formulaire et insérez une nouvelle ligne dans la table `users`,
   seulement si le login et le mot de passe ne sont pas vides (les
   colonnes `parties` et `gagnees` doivent démarrer à zéro).
   
   Pour réaliser une insertion on utilise la méthode `query` comme
   pour toute autre requête
   
   ~~~
   db.query('INSERT INTO users VALUES (?, ?, ...)', [...],
            function(err, result) {
				...
			});
   ~~~
   
   Si l'insertion réussit, le paramètre `result` contient des
   informations sur la requête (nombre de lignes insérés, etc., vous
   pouvez l'examiner avec `console.log`), et `err` vaut `false`. Si
   l'insertion échoue, `err` contient un objet décrivant l'erreur,
   alors que `result` est `undefined`.
   
   - Si l'insertion de l'utilisateur a réussi, rédirigez vers l'URL
   `/userlist` (avec `res.redirect`). 
   - Si l'insertion a raté, présentez à nouveau le formulaire, avec un
     message d'erreur. Ne faites pas de redirection dans ce cas ; un
     template vous permettra d'afficher le message d'erreur seulement
     si nécessaire.
   
   Testez et observez les échanges de requêtes avec l'outil
   *« Réseau »* de votre browser.

3. Tester uniquement `result` ne donne pas assez d'information.
   Essayez, par exemple, d'insérer un utilisateur qui existe déjà, et
   observez les valeurs de `err` et `result` (dans la console).
   
   Repérez le code d'erreur MySQL qui correspond à un login
   dupliqué. Faites en sorte que votre gestionnaire affiche un message
   d'erreur significatif lorsque l'utilisateur demande un login déjà
   existant.


## Connexion

Maintenant nous pouvons passer à l'authentification. Puisqu'il s'agit
du point d'entrée de l'application, elle sera servie à l'URL
`/`. Après une connexion réussie, l'utilisateur sera redirigé vers
`/userlist`.

À ce stade il devient nécessaire de garder chez le serveur
l'information que l'utilisateur s'est correctement identifié : en
effet, on veut que le mot de passe soit saisi une seule fois au début
d'une session. C'est pourquoi entrent en jeu les sessions.

Comme déjà vu dans la leçon sur les
[sessions](../lessons/sessions#exemple-en-silex), avant de pouvoir
utiliser les sessions il faut configurer l'application avec

~~~
var session = require('express-session');

app.use(session({ secret: '12345' }))
~~~

Ensuite la session sera disponible dans l'objet `req.session`.

1. Modifiez le gestionnaire de l'URL `/` pour qu'il affiche un
   formulaire similaire à celui ci
   
   | **Joueur :** | <input type="text" size="10" /> | **mot de passe :** | <input type="password" size="10" />

2. Comme pour l'URL `/signup`, le gestionnaire pour `/` se comportera
   différemment selon si la requête est de type GET ou POST. Dans le
   deuxième cas, il doit vérifier avec la BD que le couple
   login/password est correct, et, en cas affirmatif,
   
   - Stocker dans la session le login de l'utilisateur, son score et
     ses couleurs préférées ;
   - Rédiriger vers `/userlist`.

3. Modifier `/userlist` pour qu'il redirige sur `/` lorsque
   l'utilisateur n'est pas authentifié.

4. Ajoutez une route `/logout` permettant de se déconnecter. Pour
   cela, il suffit de mettre une valeur spéciale dans la session (par
   exemple, le login du joueur à `null`). Lorsque les gestionnaires
   détecteront cette valeur spéciale, il traiteront la requête comme
   si le client ne s'était jamais identifié.

1. Ajoutez un lien vers `/logout` dans la vue `/userlist`.


## Utilisateurs en ligne

Contrairement à PHP et à d'autres langages exécutés par un serveur web
(CGI), Node.js est un serveur indépendant. Ceci implique que la
mémoire globale d'une application Node est partagée par toutes les
requêtes, ce qui fournit un mécanisme autre que les sessions pour le
stockage de valeurs entre une requête et une autre.

Contrairement aux sessions, ce stockage ne sera pas attaché à un seul
client, mais à toute l'application. Le modèle mono-thread à boucle
d'évènements de Node.js garantit qu'il n'y aura pas de *race
conditions* lorsque deux gestionnaires de requête veulent accéder à la
même zone de mémoire.

Nous allons utiliser cette spécificité de Node pour garder en mémoire
une liste des utilisateurs connectés. Cette information sera ensuite
transmise aux clients via AJAX.

1. Dans votre application, créez une variable globale (en dehors de
   tout gestionnaire) `connectes`. Cette variable va contenir la liste
   des utilisateurs connectés.

2. Modifiez le gestionnaire de `/userlist` pour qu'il affiche
   uniquement les utilisateurs connectés.

3. Modifiez les gestionnaires de `/` et `/logout` pour qu'ils mettent
   à jour la variable `connectes` lorsque un utilisateur se connecte
   ou se déconnecte.

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
serveur ; il sera attaché à une URL par le router, comme un quelconque
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
simple est attachés à l'événement, et d'autres gestionnaires peuvent
être ajoutés par la route `/logger/...`.

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
   
   Modifiez les gestionnaires de `/` et `/logout` pour émettre un
   événement lorsque un utilisateur s'est connecté ou déconnecté avec
   succès.

5. Modifiez l'*event source* à l'URL `/api/userlist`. Il ne doit
   écrire sur sa sortie que lorsque le `EventEmitter` émet un
   événement de login ou de logout.

Bravo, vous avez réussi à écrire votre première application web
totalement asynchrone. Pour une utilisation intensive de
`EventSource`, il peut être intéressant d'utiliser des modules pour
Node.js qui encapsulent la logique d'un *event source* et qui
fournissent une API simplifiée. Aucun module n'a atteint suffisamment
de popularité sur NPM pour éclipser les autres, mais celui qui nous
semble le plus intéressant est
[sse-nodejs](https://www.npmjs.com/package/sse-nodejs).


## Commencer une partie

Enfin nous arrivons à la partie de Puissance 4. Pour pouvoir
rencontrer un adversaire, il va falloir définir un protocole
d'invitation à faire une partie. Le même canal `EventSource` utilisez
dans la partie précédente va nous permettre d'échanger ces messages,
l'entête `event:` va nous permettre de distinguer les mises à jour sur
la liste des utilisateurs des autres messages.

Le protocole d'invitation va se dérouler comme suit :

1. Le joueur 1 clique sur l'adversaire qu'il souhaite défier. Une
   requête est envoyée à l'url `/api/challenge/...`.

2. Le joueur 2 est notifié de l'invitation par le
   `EventSource`. L'interface lui propose d'accepter ou de décliner
   l'invitation. Le choix de l'utilisateur est envoyé à l'url
   `/api/respond/...`.

3. Si le joueur 2 a refusé la partie, le joueur 1 est notifié par le
   `EventSource`, et tout revient comme avant l'invitation.

   Sinon, le joueur 1 et le joueur 2 sont notifiés du début de la
   partie par le `EventSource`, un identifiant de la partie leur est
   transmis par ce canal. L'interface JavaScript charge le plateau de
   jeu et la partie commence.

Nous donnons maintenant dans les détails de l'application.

1. À chaque objet utilisateur de la liste `connectes`, ajoutez
   
   - un champ `emitter` qui va contenir un pointeur vers un
	 `EventEmitter`, servant à notifier l'utilisateur.
   
   - un champ `partie` qui va pointer vers un objet partie si le jouer
	 participe à une partie, ou `null` si le jouer n'est occupé dans
	 aucune partie.
 
   Dans le gestionnaire `/`, remplissez le champ emitter avec un
   nouveau `EventEmitter` créé pour cette session. Dans le
   gestionnaire `/logout` détruisez l'objet pointé par
   `emitter`. **Rappel :** le mot clef `del` sert à détruire des
   objets en JavaScript.

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
	 
	 Il notifie ensuite le *challengé* en émettant un évènement sur
     son `emitter`, décrivant l'invitation (nom du *challenger*)
	 
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
   événement de type `invitation`, lorsque une invitation a été
   notifiée sur son `emitter`.

5. Modifiez la page `/userlist` pour qu'elle notifie l'utilisateur
   lorsqu'il a été invité à une partie et pour qu'elle lui propose
   d'accepter ou de refuser. Le choix de l'utilisateur est envoyé par
   une requête AJAX à l'URL `/api/respond`. Pour éviter des conflits,
   il peut être utile de passer en paramètre le login de l'adversaire
   ou l'id de la partie.
   
6. Écrivez le gestionnaire de `/api/respond`. Il doit
   
   - Modifier l'état de la partie ou bien mettre les champs `partie`
	 des joueurs concernés à `null`, selon le choix du *challengé*.
   - Émettre un évènement de *refus* ou de *début partie* sur les
     `emitter` des deux joueurs, selon le choix du *challengé*.
   - Renvoyer un code de succès ou d'erreur.

7. Modifiez le *event source* `/api/userlist` pour qu'il transmette
   les évènements de refus ou de début partie qui lui ont été notifiés
   par le `emitter`.
   
   Pour une meilleure gestion des conflits, vous pouvez passer un id
   de la partie dans l'évènement début de partie.

8. Modifiez la page `/userlist` :
   
   - Lorsque elle reçoit un événement de refus, elle affiche un
	 message de notification et vient à l'état initial.
   - Lorsque elle reçoit un événement de début partie, elle cache la
     liste des utilisateurs et charge le plateau de jeu de
     puissance 4.

Vérifiez que votre application se comporte comme attendu : les
utilisateur sont bien notifiés des invitations, acceptations, refus,
l'état des tables reste cohérent, aucun utilisateur reste bloqué dans
un état inconsistant.


## Jouer une série de parties

Nous arrivons à dernière partie de notre application : le jeu. Les
indications vont devenir plus sommaires pour vous permettre d'explorer
en détail AJAX et le *server push*.

1. Modifiez le plateau de jeu pour qu'il affiche les noms des deux
   joueurs participant à la partie, et qu'il utilise leurs couleurs
   préférées pour représenter les pions. Ces informations se trouvent
   dans la session et dans les variables globales.
   
   En plus, la page doit afficher à quel joueur c'est le tour de
   jouer. Normalement, c'est le joueur *challengé* qui commence.

2. Modifiez votre jeu de Puissance 4. Lorsque le joueur clique sur une
   case, elle exécute l'une de ces deux actions :
   
   - Si c'est le tour du joueur et le coup est valide, une requête
     AJAX est envoyée à l'URL `/api/play`, avec le détails sur le coup
     joué. Lorsque la requête retourne avec succès, le plateau est mis
     à jour et le tour passe à l'adversaire.
   - Sinon, elle affiche un message d'erreur.

3. Créez le gestionnaire de l'URL `/api/play`. Si le coup joué n'est
   pas valide, il renvoie un code d'erreur. Sinon
   
   - Il met à jour la représentation du plateau sur le serveur ;
   - Il met à jour le tour ;
   - Il émet un événement sur le `emitter` de l'adversaire ;
   - Il renvoie un code de succès avec une représentation JSON du
     plateau.

4. Les vérifications de fin de partie ne peuvent pas être la
   responsabilité de l'un ou de l'autre joueur. Ce doit être le
   serveur qui vérifie après chaque coup si la partie est terminée, et
   notifie les joueurs en conséquence.
   
   Récrivez la logique qui teste la fin de la partie du côté
   serveur. Lorsque une partie est terminée, mettez à jour les champs
   `parties` et `gagnees` des utilisateurs.

5. Lorsque une partie est terminée, donnez à chacun des joueurs la
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


## Pour aller plus loin (optionnel)

On donne ici quelques idées pour développer davantage votre
application. Rien n'est obligatoire, mais cela vous permettra
d'approfondir votre connaissance des applications web.

1. Dans `/signup`, demandez deux fois le mot de passe, et inscrivez le
   nouveau joueur seulement si les mots de passe coïncident.

1. Implantez une gestion des mots de passe sécurisée:
   une mesure de sécurité souvent appliquée consiste à ne jamais
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
   
   C'est en général une mauvaise idée de vouloir implanter ce système soi
   même dans une application : il y a beaucoup de pièges dans lesquels il
   est facile de tomber. Il vaut mieux utiliser les solutions déjà
   faites, prévues par le langage ou le framework. Voir par exemple 
   [la documentation de PHP sur le sujet](http://php.net/manual/fr/faq.passwords.php)
   ou le module [bcrypt pour Node.js](https://www.npmjs.com/package/bcrypt)

1. Dans la page d'accueil, faites en sorte que les identifiants des
   joueurs soient auto-complétés. Voir
   <https://developer.mozilla.org/docs/Web/HTML/Element/datalist>.

1. Enrichissez les données sur les utilisateurs. Au minimum, cela
   pourrait se limiter au nom et prénom des joueurs. Vous pouvez
   pousser cela jusqu'à avoir un profil d'utilisateur complet de
   photos, etc.

1. Gérez correctement le fait qu'un utilisateur est allé hors ligne
  (événement `close` de `req`). Notifiez ses adversaires lorsqu'il est
  devenu hors ligne.

1. L'API `EventSource` a l'avantage d'être simple à comprendre et à
   utiliser. Cependant, pour chaque échange asynchrone entre le client
   et le server, il a fallu créer une *route montante* (pour les
   envois client → server, via AJAX) et une *route descendante* (pour
   les envois server → client, via *server push*).
   
   Les web sockets, grâce à leur canal bidirectionnel, permettent de
   simplifier la logique et peuvent rendre l'application plus rapide.
   Récrivez la partie `/play` de votre application à l'aide d'une
   bibliothèque de web sockets, telle <http://socket.io/>.

1. Permettez à un utilisateur de jouer plusieurs parties en même temps
   contre des adversaires différents.

1. L'utilisation de variables globales est pratique pour des simples
   applications *mono-thread*. Mais Node.js n'est pas uniquement
   destiné aux petites applications web : son noyau supporte du
   *multi-processing* et du *load balancing*, permettant de distribuer
   une application web sur plusieurs *cores* (voir le module
   [Cluster](http://nodejs.org/api/cluster.html) de Node.js).
   
   Dans un environnement *multi-process*, la mémoire globale n'est pas
   partagée avec les autres processus, il devient donc impossible
   d'utiliser les variables globales pour maintenir l'état. Il est
   alors nécessaire d'utiliser une base de données externe pour
   stocker l'état, avec en plus des garanties d'*atomicité*
   (transactions).
   
   On pourrait, bien sûr, utiliser la base MySQL, comme cela est fait
   dans le [TD en Silex](tutorial5-silex). Cependant il est souvent
   plus simple et efficace d'utiliser un système NoSQL en mémoire
   vive, comme par exemple Redis. De plus le système
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

1. Pourquoi ne pas mettre votre travail en ligne ? Aussi bien
   [OpenShift](https://www.openshift.com/) que
   [Heroku](https://www.heroku.com/) offrent un plan d'hébergement
   gratuit pour applications en Node.js (une liste plus longue
   d'hébergeurs supportant Node.js est disponible
   [ici](https://github.com/joyent/node/wiki/node-hosting)). C'est la
   vitrine idéale pour montrer votre travail à un futur employeur.
   
   N'oubliez pas de mettre le code source sur
   [GitHub](https://github.com)... les employeurs adorent ça ! (Moi
   aussi, n'hésitez pas à m'envoyer un mail).

  

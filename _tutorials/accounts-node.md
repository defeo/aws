---
title: Comptes utilisateur, AJAX, Server push
subtitle: (Node+Express)
---

Dans ce TD nous allons inclure le jeu de Puissance 4 que nous avons
[développé précédemment](tutorial2) dans une application
multi-utilisateurs, permettant de jouer des parties avec des
adversaires distants. Nous allons nous servir de la base de données
MySQL fournie par Cloud 9 pour le stockage des données côté serveur, et
du système de sessions de Silex pour garder l'état de la connexion.

Pour réaliser une interface fluide et *responsive*, l'utilisation de
AJAX s'impose. Mais, dans une application web de ce type, il n'est pas
suffisant d'avoir des requêtes asynchrones : il est aussi nécessaire
d'avoir des événements asynchrones **générés par le serveur**. Nous
allons utiliser deux techniques pour cela :

- L'API `EventSource`, qui permet une communication uni-directionnelle
  du serveur vers le navigateur (allez voir la
  [version pour Silex](accounts-silex) pour un exemple d'application
  simulant le *server push* avec du *short polling*);
- Les Web Sockets, qui fournissent un canal bi-directionnel entre les
  deux.

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
- La documentation du [paquet `ws`](https://github.com/websockets/ws) pour les Web Sockets.
- Ce
  [tutoriel MDN sur l'utilisation des Web Sockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications).


## Préparer son espace de travail

Comme d'habitude, on va partir d'un clone de
<https://github.com/defeo/aws-project>.  Commencez par démarrer le
serveur MySQL en tapant la commande

~~~
mysql-ctl start
~~~
{:.bash}

Vous pouvez arrêter à tout moment le serveur MySQL avec

~~~
mysql-ctl stop
~~~

et le relancer avec

~~~
mysql-ctl restart
~~~

Si vous n'arrêtez pas le serveur à la fin de la session, il sera
encore actif lors de votre prochaine connexion à l'espace de travail.


Si vous êtes à l'aise avec la gestion d'une base MySQL par la ligne de
commande, l'utilitaire `mysql` est déjà installé dans
Cloud9. Alternativement, l'interface d'administration de bases de
données [PHPMyAdmin](http://www.phpmyadmin.net/) est également
disponible. Installez-la avec la commande

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

Pour arrêter PHPMyAdmin, tapez

~~~
sudo service apache2 stop
~~~

**Note:** PHPMyAdmin est exécuté par le même serveur Apache qui
exécute les applications PHP, et qui écoute sur le port 8080. Pour
cette raison, vous ne pouvez faire tourner en même temps PHPMyAdmin et
une application Node.js. Pensez donc à arrêter PHPMyAdmin avant de
lancer vos applications Node.

Pour lancer à nouveau PHPMyAdmin, arrêtez votre serveur Node.js, et
lancez à nouveau le serveur Apache, soit en exécutant n'importe quelle
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
Chacune des sections qui suivent est consacrée à une page de
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
  user     : process.env.C9_USER.substr(0,16),  // laissez comme ça
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
   
   | Joueur | Parties | Gagnées | Couleur préférée |
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
   seulement si le login et le mot de passe ne sont pas vides (un
   champ vide dans un formulaire est traduit en la chaîne vide `''`
   par Node). Les colonnes `parties` et `gagnees` doivent démarrer à
   zéro.
   
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

app.use(session({
    secret: '12345',
    resave: false,
    saveUninitialized: false,
}));
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
   tout gestionnaire) `connectes`, de type *objet* :
   
   ```
   var connectes = {};
   ```
   
2. Modifiez les gestionnaires de `/` et `/logout` pour qu'ils mettent
   à jour la variable `connectes` lorsque un utilisateur se connecte
   ou se déconnecte.  Utilisez les logins des utilisateurs comme
   clefs, et des objets contenant l'heure de connexion comme valeurs :
   
   ```
   connectes['toto'] = { time: new Date() });
   ```
   
   On rappelle qu'on peut éliminer une clef d'un objet JavaScript
   avec le mot clef `delete` :
   
   ```javascript
   delete connectes['toto'];
   // ou aussi : delete connectes.toto
   ```

3. Modifiez le gestionnaire de `/userlist` pour qu'il affiche
   uniquement les utilisateurs connectés.
   
   On rappelle qu'on peut tester la présence d'une clef dans un objet
   JavaScript avec le mot clef `in` :
   
   ```
   'toto' in connectes
   ```

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
                  how_many: 2,
                  random_stuff: Math.random()
                };
     res.json(data);
   });
   ~~~
   
   renvoie une réponse JSON similaire à
   
   ~~~
   {
     "fruits": ["banana", "apple"],
     "how_many": 2,
     "random_stuff": 0.5873763888835787
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
     for (var i = 0; i < xhr.response.fruits.length; i++) {
       console.log(xhr.response.fruits[i]);
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
connexion persistante entre le client et le serveur, sur laquelle le
serveur émet des données textuelles à tout moment. Dans la suite on va
appeler *event source* le gestionnaire de la connexion du côté
serveur ; il sera attaché à une URL par le router, comme un quelconque
gestionnaire. L'API `EventSource` permet au client de déclencher un
événement JavaScript à chaque fois que des nouvelles données sont
envoyées par le serveur.

Une réponse HTTP typique d'une *event source* simple ressemble à cela :

~~~
HTTP/1.1 200 OK
Cache-Control: no-cache
Content-Type: text/event-stream
X-Powered-By: Express
transfer-encoding: chunked
Connection: keep-alive

data: Un message 

data: Un deuxième message

data: Un message plus long
data: sur plusieurs lignes
~~~

On voit que les messages sont précédés par le mot clef `data:` et
terminés par un double retour à la ligne (voir
[le cours](../lessons/server-push) pour plus de possibilités).

Du côté client, c'est très simple d'initialiser une connexion de ce
type : il suffit de créer un objet de type `EventSource` en lui
passant l'URL de l'*event source*.

~~~
var evt = new EventSource('/api/notifications');
~~~

Pour réagir aux messages du serveur, il suffit d'enregistrer un
gestionnaire d'événements, comme ceci :

~~~
evt.addEventListener('message', function(e) {
  console.log(e.data);
});
~~~

Le corps du message est disponible dans le champ `.data` de l'objet de
type `Event`.

Du côté serveur, cela ne prend que quelques lignes de Node.js pour
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
   
   **Note :** Vous ne pouvez plus utiliser `res.json` pour écrire les
   données, car cela fermerait la connexion. À la place, vous pouvez
   utiliser la fonction
   [`JSON.stringify()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
   qui transforme un objet JavaScript en une chaîne de caractères au
   format JSON.

2. Modifiez la page `/userlist` pour utiliser `EventSource` à la place
   du *short polling*. Pour transformer les messages du serveur en des
   données JavaScript, vous pouvez utiliser la fonction
   [`JSON.parse`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse).


## Utiliser les événements dans Node.js

À ce stade, notre application ne fait plus du *short polling* par le
client, mais elle reste très inefficace : le polling a été déplacé
dans le serveur, ce qui ne diminue que marginalement le surcoût de
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
  res.send('Ping envoyé');
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
totalement asynchrone.  Ceci a été rendu possible par la technologie
`EventSource`, très simple à mettre en place, mais pas encore
supportée par tous les navigateurs (notamment les navigateurs
Microsoft). Dans la suite nous allons passer à une technologie
beaucoup plus populaire pour réaliser une communication complètement
asynchrone régie par les évènements.

## Jouer une partie avec les Web Sockets

Enfin nous arrivons à la partie de Puissance 4 à proprement parler.
Pour mettre en place la communication entre le serveur et les clients,
on pourrait continuer à utiliser du AJAX en conjonction avec
`EventSource`, comme nous l'avons fait jusqu'ici, mais ceci se révèle
souvent peu élégant et difficile à coder. À la place nous allons
utiliser la technologie des Web Sockets, qui, grâce à son canal
bi-directionnel, nous permet de maîtriser aisément des applications
parallèles complexes.

Nous commençons par définir le protocole par lequel les joueurs vont
s'inviter à participer à une partie.  Chaque joueur aura l'un de ces
quatre statuts :

- **LIBRE :** le jouer n'est occupé dans aucune partie ni invitation ;
- **EN ATTENTE :** le joueur a invité un autre joueur à rejoindre une partie ;
- **INVITÉ :** le joueur a été invité à rejoindre une partie ;
- **EN JEU :** le joueur participe à une partie.

Les joueurs peuvent s'envoyer les *signaux* suivants :

- ***invite :*** un joueur **LIBRE** invite un autre joueur
  **LIBRE** ; le premier devient **EN ATTENTE**, le deuxième devient
  **INVITÉ** ;
- ***accepte :*** un joueur **INVITÉ** accepte l'invitation du joueur
  **EN ATTENTE** ; les deux deviennent **EN JEU** ;
- ***refuse :*** un joueur **INVITÉ** refuse l'invitation du joueur
  **EN ATTENTE** ; les deux deviennent **LIBRE** ;
- ***quitte :*** un joueur **EN JEU** quitte la partie ; les deux
  joueurs deviennent **LIBRE**.

Voici un tableau qui résume ces messages.

| message | expéditeur (avant) | destinataire (avant) | expéditeur (après) | destinataire (après)
|--
| *invite* | LIBRE | LIBRE | EN ATTENTE | INVITÉ
| *accepte* | EN ATTENTE | INVITÉ | EN JEU | EN JEU
| *refuse* | EN ATTENTE | INVITÉ | LIBRE | LIBRE
| *quitte* | EN JEU | EN JEU | LIBRE | LIBRE
{:.pretty}

Toute autre interaction est interdite et donnera lieu à une erreur.
Nous sommes ici confrontés à un problème classique de programmation
concurrente : comment éviter les *race conditions*, c'est à dire les
cas où des messages envoyés à des intervalles très courts se
chevauchent ? Par exemple, que se passe-t-il si deux joueurs
s'invitent mutuellement en même temps ? Qui devient **INVITÉ**, qui
**EN ATTENTE** ?

Ces problèmes de programmation concurrente sont notamment difficiles à
résoudre, mais nous avons ici un serveur Node.js qui s'exécute dans un
seul *thread*, sans aucun parallélisme.  Par conséquent, nous allons
garder tout l'état de l'application dans le serveur ; à chaque fois
que l'état interne du serveur change, celui-ci notifiera les clients
concernés en leur transmettant l'intégralité de leur état.  Si cette
technique n'est pas aussi économe en bande passante qu'on pourrait
l'espérer, elle a l'avantage d'être simple à coder et de minimiser les
risques de *race conditions*.

Passons à la mise en œuvre. Pour pouvoir utiliser les Web Socket dans
Node.js, vous devez installer un module adapté. Nous allons utiliser
le module `ws`, tapez dans une console

```bash
npm install ws
```

Maintenant, pour intégrer le serveur des Web Sockets avec Express et
`express-session`, modifiez votre application ainsi :

```javascript
var http = require('http');
var ws = require('ws');
var express = require('express');
var session = require('express-session');
// etc...

var app = express();
var sess_storage = session({ 
    secret: "12345",
    resave: false,
    saveUninitialized: false,
});
app.use(sess_storage);

// Ici le reste de votre configuration Express, et vos routes
// ...

// On attache le serveur Web Socket au même serveur qu'Express
var server = http.createServer(app);
var wsserver = new ws.Server({ 
	server: server,
	// Ceci permet d'importer la session dans le serveur WS, qui
	// la mettra à disposition dans wsconn.upgradeReq.session, voir
	// https://github.com/websockets/ws/blob/master/examples/express-session-parse/index.js
    verifyClient: function(info, callback) {
        sess_storage(info.req, {}, callback);
    },
});

// On définit la logique de la partie Web Socket
wsserver.on('connection', function(wsconn) {
    console.log('WS connection by', wsconn.upgradeReq.session);
    wsconn.send('Hello world!');
	wsconn.on('message', function(data) {
		console.log(data);
	});
	// ...
});

// On lance le serveur HTTP/Web Socket
server.listen(process.env.PORT);
```

Du côté client, l'utilisation dans le navigateur est très simple :

```
var ws = new WebSocket('wss://' + window.location.host)

ws.addEventListener('open', function(e) {
	ws.send('Hi world!');
	ws.addEventListener('message', function(e) {
		console.log(e.data);
	});
});
```

**Note :** le schéma `wss:` indique les Web Sockets chiffrés par TLS ;
utilisez ce schéma en conjonction avec HTTPS dans Cloud 9. Si vous
développez en local, vous n'aurez pas de serveur HTTPS, vous
utiliserez, alors, le schéma `ws://`.

On commence par le serveur.

1. Modifiez le gestionnaire de `/` pour qu'il stocke dans le
   dictionnaire `connectes`, à côté de l'heure de connexion, le
   *statut* de l'utilisateur (`'LIBRE'` par défaut), son *adversaire
   courant* (`null` par défaut), et les autres informations utiles
   (couleurs, scores, ...).

2. Codez la logique du gestionnaire `.on('message', ...)` du serveur
   Web Socket. Il s'attend à recevoir quatre types de messages :
   `'invite'`, `'accepte'`, `'refuse'`, `'quitte'`. Vous coderez ces
   messages au format JSON (utilisez `JSON.stringify` et
   `JSON.parse`) ; seul le message `invite` est accompagné de
   l'identifiant de l'utilisateur à inviter.
   
   Référez-vous au tableau plus haut pour décider en quelles occasion
   les messages sont acceptés ou rejetés. Par exemple les message
   `'invite'` n'est accepté que lorsque l'utilisateur qui envoie le
   message et l'utilisateur invité sont tous les deux `'LIBRE'`. Leurs
   statuts sont alors modifiés, respectivement, en `'EN ATTENTE'` et
   `'INVITE'`.
   
   Mettez à jour les champs `adversaire` dans le dictionnaire
   `connectes` en conséquence : en cas d'*invitation*, le champ
   `adversaire` de chaque joueur pointe sur l'autre ; en cas de
   *refus* ou d'abandon les deux valent `null`.
   
3. Pour chacun de ces messages, après l'avoir traité, notifiez les
   deux utilisateurs avec un message contenant l'intégralité de son
   état : statut, couleurs, scores, adversaire, ...

On passe maintenant au client.

4. Modifiez l'affichage de `/userlist` en ajoutant à côté de chaque
   joueur connecté un bouton *"inviter"*. Ouvrez une connexion Web
   Socket vers le serveur au chargement de la page.

5. Attachez un gestionnaire JavaScript aux clics des boutons, qui va
   envoyer un message de type `'invite'` pour le joueur choisi.

6. Codez le gestionnaire `.addEventListener('message', ...)` du Web
   Socket : à chaque fois qu'une mise à jour de l'état est reçue sur
   la connexion, l'interface utilisateur est mise à jour :
   
   - Si le joueur est `'LIBRE'`, on affiche la liste des joueurs
	 connectés, avec les boutons pour les invitations ;
   - Si `'EN ATTENTE'`, tous les boutons d'invitation sont désactivés,
	 et un message est affiché ;
   - Si `'INVITE'`, tous les boutons d'invitation sont désactivés, et
     un message demandant si l'utilisateur accepte l'invitation ou pas
     est affiché ; en fonction du choix de l'utilisateur, un message
     de type `accepte` ou `refuse` est envoyé au serveur ;
   - Si `'EN JEU'` la liste des joueurs est cachés, et l'interface de
     jeu de Puissance 4 est dévoilée.


## La partie

Nous arrivons à dernière partie de notre application : le jeu. Les
indications vont devenir plus sommaires pour vous permettre d'explorer
en détail les Web Sockets.

1. Modifiez le plateau de jeu pour qu'il affiche les noms des deux
   joueurs participant à la partie, et qu'il utilise leurs couleurs
   préférées pour représenter les pions.
   
   En plus, la page doit afficher à quel joueur c'est le tour de
   jouer. Normalement, c'est le joueur invité qui commence.

2. Modifiez votre jeu de Puissance 4. Lorsque le joueur clique sur une
   case, elle exécute l'une de ces deux actions :
   
   - Si c'est le tour du joueur et le coup est valide, un message est
     envoyée sur le Web Socket, avec les coordonnées du coup joué. Le
     serveur répond avec l'état du plateau mis à jour, l'interface est
     mise à jour en conséquence, et le tour passe à l'adversaire.
   - Sinon, elle affiche un message d'erreur (pas besoin de contacter
     le serveur).

3. Codez la logique du serveur qui répond à ce message :
   
   - Elle met à jour la représentation du plateau sur le serveur ;
   - Elle met à jour le tour ;
   - Elle envoie un message aux deux clients contenant le nouvel état
     du plateau.

4. Les vérifications de fin de partie ne peuvent pas être la
   responsabilité de l'un ou de l'autre joueur. Ce doit être le
   serveur qui vérifie après chaque coup si la partie est terminée, et
   notifie les joueurs en conséquence.
   
   Récrivez la logique qui teste la fin de la partie du côté
   serveur.

5. Donnez aux joueurs la possibilité d'abandonner une partie. Dans ce
   cas, un message de type `quitte` est envoyé au serveur, et
   l'adversaire gagne la partie.

5. Lorsque une partie est terminée (par victoire, match nul, ou
   abandon) mettre à jour les champs `parties` et `gagnees` des
   utilisateurs, remettre leur statut à `'LIBRE'`, et mettre à jour
   l'affichage.

Vérifiez que la logique de l'application fonctionne correctement :
chaque utilisateur peut jouer uniquement à son tour, aucun utilisateur
peut se trouver dans un état inconsistant, l'état des plateaux
affichés aux joueurs correspond à l'état du plateau dans la base de
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
   place, on stocke le *haché* (par exemple le SHA256) de la
   concaténation du mot de passe et d'une *graine* aléatoire propre à
   l'application.
   
   Tout le calcul doit se faire côté serveur. En effet, premièrement la
   graine ne doit être connue que par le serveur, deuxièmement, si
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
  (événement `close` des Web Sockets). Essayez de rétablir une
  connexion, ou notifiez son adversaire si cela ne réussit pas.

1. Enrichissez les types de signaux : permettez à un joueur d'inviter
   plusieurs autres joueurs, d'annuler une invitation, etc.

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

1. Pourquoi ne pas mettre votre travail en ligne ? 
   [Heroku](https://www.heroku.com/) offre un plan d'hébergement
   gratuit pour applications en Node.js (une liste plus longue
   d'hébergeurs supportant Node.js est disponible
   [ici](https://github.com/joyent/node/wiki/node-hosting)). C'est la
   vitrine idéale pour montrer votre travail à un futur employeur.
   
   N'oubliez pas de mettre le code source sur
   [GitHub](https://github.com)... les employeurs adorent ça ! (Moi
   aussi, n'hésitez pas à m'envoyer un mail).

  

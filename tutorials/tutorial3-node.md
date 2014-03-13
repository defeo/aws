---
layout: tutorial
title: Ma première application web
subtitle: (Node.js+Express)
---

Dans ce TD nous allons continuer le développement de notre jeu de
Puissance 4, commencé au [TD précédent](tutorial2).

Nous allons déléguer au server une partie du travail, ce qui nous
permettra d'apprendre les bases de Node.js et du framework
[Express](http://expressjs.com/). Remarquez, cependant, que tout ce
que nous allons développer dans ce TD pourrait être traité
intégralement du côté client ; ce n'est qu'aux prochains TD que notre
code va évoluer vers une vraie application client-server.

Les références pour ce TD sont

- Le [manuel de JavaScript](https://developer.mozilla.org/docs/Web/JavaScript),
- La [référence de Node.js](http://nodejs.org/api/),
- Les [aides de NodeJitsu](http://docs.nodejitsu.com/),
- Le [guide de Express](http://expressjs.com/guide.html),
- La [référence de Express](http://expressjs.com/3x/api.html),
- Ce [tutoriel sur Twig](http://symfony.com/fr/doc/current/book/templating.html),
- La [documentation de Twig](http://twig.sensiolabs.org/documentation).


## Préparer son espace de travail

Avant de pouvoir commencer le développement, il nous faut installer
Express et ses composants. Assurez-vous d'avoir correctement créé votre
espace de travail à partir de
<https://github.com/defeo/aws-project.git>, comme décrit
[au TD précédent](tutoriel2#prparer-son-espace-de-travail).

Dans le terminal (en bas dans l'espace de travail, tapez `F6` s'il
n'est pas déjà ouvert), tapez les commandes

	git pull
	npm install express twig
{:.bash}

La première commande va mettre à jour certains fichiers de
configuration, la seconde va télécharger et installer les composants
de Express et le moteur de templates Twig dans votre espace de travail
(à l'intérieur d'un dossier nommé `node_modules`). Cette opération
peut prendre quelques minutes.

Pour vérifier que Express a été correctement installé, ouvrez le fichier
`exemple.js` dans l'éditeur et cliquez sur le bouton *« Run »*. Dans
le terminal s'affiche un lien. Cliquez et observez la page affichée,
elle devrait contenir le texte *« Hello world ! »*. Dans la barre
d'adresse interne à C9 (ou dans un autre onglet), ajoutez `/toto` à la
fin de l'URL, l'onglet de Preview devrait maintenant afficher *« Hello
toto »*. N'hésitez pas à étudier le code de `exmple.js` et
`exemple.twig` pour en comprendre le fonctionnement.


## Le réflecteur

Nous allons commencer par un exercice classique, sans lien avec le jeu
de Puissance 4. Un réflecteur est une simple page web qui affiche le
contenu des paramètres (*query string*, formulaires, entêtes HTTP,
...) envoyés à la page.

Créez un fichier nommé `reflector.js`, et initialisez-le avec le code
suivant (qui s'occupe de charger Express, créer et exécuter une
application web vide).

~~~
var express = require('express');

var app = express();

// Configuration des middlewares
app
	.use(express.query())
	.use(express.bodyParser());

// Votre code va ici


app.listen(8080);
~~~

1. En suivant l'exemple de `exemple.js`, créez un gestionnaire pour
   l'URL `/query_string` qui affiche le texte
   
   ~~~
   Hello
   world !
   ~~~

   Le retour à la ligne est important. Comment faire en sorte qu'il
   soit affiché par le browser ? (**Rappel :** à moins d'être instruit
   autrement, le browser interprète par défaut tout contenu comme étant
   du code HTML).

2. Dans votre gestionnaire, avec une boucle `for`, affichez le
   contenu de l'objet
   
   ~~~
   var jours = { 'mon' : 'Lundi',
                 'tue' : 'Mardi',
                 'wed' : 'Mercredi',
                 'thu' : 'Jeudi',
                 'fri' : 'Vendredi',
                 'sat' : 'Samedi',
                 'sun' : 'Dimanche' };
   ~~~
   
   un couple clé-valeur par ligne. On rappelle que l'opérateur de
   concaténation en JavaScript est le plus (`+`).

3. Nous avons déjà vu au [premier TD](tutorial1#formulaires) que les
   applications web peuvent accepter des paramètres contenus dans
   l'URL. C'est le cas, par exemple, de la recherche Google, que nous
   avons interrogée par une URL de la forme
   
   ~~~
   https://www.google.com/search?q=ma+recherche&hl=fr
   ~~~
   {:.bash}
   
   Cette portion de l'URL à la suite du point d'interrogation (`?`)
   est appelée *query string*. Sa syntaxe est définie en partie par la
   [RFC 3986](http://tools.ietf.org/html/rfc3986#section-3.4), en
   partie par les pratiques communes.
   
   Lorsqu'il est configuré avec le *middleware* `express.query()`,
   Express analyse automatiquement la *query string*. Son contenu est
   alors accessible dans l'objet
   [`req.query`](http://expressjs.com/3x/api.html#req.query) du
   gestionnaire.
   
   Modifiez le gestionnaire écrit au point précédent pour qu'il
   affiche le contenu de la *query string*, un couple clé-valeur par
   ligne. Testez votre gestionnaire en saisissant des *query strings*
   dans la barre d'adresse, comme par exemple
   
   ~~~
   http://...c9.io/reflector.php/query_string?user=toto&pwd=12345
   ~~~
   {:.http}

4. Le *query string* non analysé est accessible grâce à la propriété
   `req._parsedUrl.query`. Modifiez votre gestionnaire pour qu'il
   affiche, en plus, le *query string* non analysé. Visitez maintenant
   l'URL
   
   ~~~
   /query_string?A=B=3&C=%26&X Y=W+Z&X%20Y=W%2BZ
   ~~~
   {:.bash}
   
   Qu'observez-vous ? Pour comprendre en détail comment l'URL a été
   transformée, vous pouvez lire cette
   [page Wikipedia](http://en.wikipedia.org/wiki/Percent-encoding).

4. Dans un autre fichier, créez un formulaire HTML qui renvoie à l'URL
   `/query_string` (attribut `action`) en passant son contenu par le
   *query string* (attribut `method`). Testez le réflecteur à travers
   le formulaire ; testez notamment les caractères spéciaux, tels les
   espaces, les ampersands (`&`), etc.
   
5. Reprenez le formulaire du point précédent, en envoyant les données
   dans le corps d'une requête de type POST (`method="POST"`).
   
   **Note :** pour créer un gestionnaire de type POST en Express, on
   remplace `app.get()` par `app.post()`.
   
   Au lieu de transiter par le *query string*, les données passent
   maintenant directement dans le corps de la requête.  Lorsqu'il est
   configuré avec le *middleware* `express.bodyParser()`, Express
   analyse automatiquement le corps de la requête et remplit l'objet
   `req.body` avec son contenu.
   
   Créez un nouveau gestionnaire pour des requêtes de type POST à
   l'URL `/form_data`. Faites en sorte qu'il affiche le corps de la
   requête, un couple clé-valeur par ligne. Faites-lui afficher aussi
   la requête brute. Testez avec le formulaire du point
   précédent. Comparez les affichages avec l'onglet *« Réseau »* des
   *dev tools* de Chrome ou Firefox (une version récente).
   
7. Deux autres tableaux compilés par Express contiennent des données
   utiles :
   
   - `req.headers` contient les entêtes HTTP de la requête ;
   - `req.cookies` contient les *cookies* (remarquez que cette
     information est aussi contenue dans les entêtes au format brut).
   
   Créez un nouveau gestionnaire à l'URL `/headers` qui affiche le
   contenu de ces deux tableaux. Comparez avec les informations
   affichées par l'outil *« Réseau »* des *dev tools*.
   
   **Note :** vous pouvez créer un gestionnaire qui répond à tous les
   types de requête (GET, POST, etc.) en remplaçant `app.get()` par
   `app.use()`.
   
8. Mettez maintenant tous les composants ensemble. Créez un
   gestionnaire pour l'URL `/` qui répond à tous les types de requêtes
   et qui affiche
   
   - la *query string*,
   - le contenu de la requête, s'il y en a un,
   - les entêtes HTTP,
   - les cookies.



## Contenu statique et templates

Maintenant que nous maîtrisons le routage et l'API de la requête en
Express, nous allons appliquer nos connaissances au jeu de Puissance 4.

Dans la section précédente, nous avons utilisé deux techniques très
différentes pour créer nos pages :

- Pour les URL dynamiques, comme `/query_string`, etc., nous avons
  défini des gestionnaires dans un fichier JavaScript. La sortie HTML a été
  obtenue à coups de concaténations de chaînes de caractères.
- Pour le formulaire statique, nous avons créé un simple fichier HTML.

Ce sont deux manières de coder opposées, et il serait dommage d'être
limités à cela et de ne pas pouvoir les mélanger. Dans cette section
nous allons apprendre comment Express permet de lire et servir des
fichiers statiques, puis comment les moteurs de templates permettent de
réaliser une transition douce entre les pages statiques et les pages
dynamiques.

Dans la suite on va supposer que le jeu de Puissance 4 développé au TD
précédent est contenu dans les trois fichiers `puissance4.html`,
`puissance4.css` et `puissance4.js`.

### Servir des fichiers

1. Créez un fichier `app.js`, et initialisez-le avec le squelette
   habituel de Express.

1. Créez un dossier `static` et déplacez-y les fichiers
   `puissance4.html`, `puissance4.css` et `puissance4.js`. Ajoutez à
   la configuration de `app.js` la ligne
   
   ~~~
   app.use('/s', express.static('static'));
   ~~~
   
   Ceci permet à Node.js de servir les fichiers contenus dans le
   dossier `static` à l'URL `/s/...`. Exécutez `app.js` et vérifiez
   que le jeu marche bien à l'URL
   
   ~~~
   /s/puissance4.html
   ~~~
   {:.bash}


2. Créez un gestionnaire pour l'URL `/play`.  La méthode
   [`res.sendFile()`](http://expressjs.com/3x/api.html#res.sendfile)
   crée une réponse constituée du contenu d'un fichier.  Écrivez le
   gestionnaire en sorte que le jeu de Puissance 4 soit accessible à
   l'URL `/play`.
   
3. Dans un nouveau fichier, créez un formulaire similaire à celui-ci
   
   <div style="border:solid thin #aaa;border-radius:5px;box-shadow:1px 1px 2px #ccc;padding: 0 2em;display:inline-block">
   **Joueur 1**
   
   <input type="text" placeholder="nom du joueur"/>
   <select>
   <option>Rouge</option>
   <option>Jaune</option>
   <option>Vert</option>
   </select>

   **Joueur 2**
   
   <input type="text" placeholder="nom du joueur"/>
   <select>
   <option>Rouge</option>
   <option>Jaune</option>
   <option>Vert</option>
   </select>
   
   <input type="submit" value="Jouer"/>
   
   </div>
   
   Servez le formulaire à l'URL `/` ; il doit envoyer ses données à
   l'URL `/play` (par GET ou POST, au choix).


### Templates Twig

{% raw %}

Maintenant, on veut faire en sorte que le nom et la couleur des
joueurs dépende des valeurs renseignées dans le formulaire. Pour cela,
il serait dommage si on était obligés de prendre tout le code de
`puissance4.html` et le mettre dans `app.js`.

Les *templates* nous viennent en aide. Un template est un modèle d'un
document (usuellement un document HTML, mais ce n'est pas obligatoire)
avec du marquage spécial qui indique les parties dynamiques du
document.

Voici un template très simple :

~~~
<p>Hello {{ nom }} !</p>
~~~

Le marquage spécial `{{ nom }}` indique qu'il faudra remplacer à cet
endroit la valeur de la variable nom.

Chaque *langage de templating* définit sa propre syntaxe, plus ou
moins riche. Node dispose d'une pléthore de moteurs de templating ;
pour s'en faire une idée, il suffit de regarder la
[liste disponible sur le serveur de paquets de Node](https://www.npmjs.org/browse/keyword/template).

Pour rester compatibles avec la partie du cours faites en PHP, ce TD
va utiliser langage de templating Twig, voici un
[tour rapide de sa syntaxe](http://twig.sensiolabs.org/doc/templates.html). Les
seuls composants dont nous allons nous servir dans ce TD sont le
remplacement de variables, montré dans l'exemple précédent, et
(éventuellement) la boucle `for`.

Saches, cependant, que le module Twig pour Node.js est encore en phase
expérimentale. Vous êtes encouragés à explorer d'autres langages de
templating populaires : le plus proche de Twig est
[Swig](http://paularmstrong.github.io/swig/), mais peut-être
trouverez-vous votre bonheur avec
[Hogan (Mustache)](http://twitter.github.io/hogan.js/),
[Nunjucks](https://www.npmjs.org/package/nunjucks),
[Jade](https://github.com/visionmedia/jade), ...

**Important :** avant d'utiliser Twig (ou tout autre moteur de
templating), il faut l'importer avec le mot clef `require`.

~~~
var twig = require('twig');
~~~

À ce moment, le moteur est chargé dans Express, mais pas encore
configuré. Il faut dire à Express où se trouvent les fichiers de
templates. Par exemple, la configuration

~~~
app.set('views', 'templates');
~~~

dit à Express de chercher les fichiers de templates dans le dossier
`templates`. Seuls les fichiers avec extension `.twig` seront passés
au moteur Twig. Si l'on souhaite ajouter, par exemple, les fichiers
avec extension `.html` à la liste des fichiers traités par Twig, il
faudra ajouter ces lignes de configuration.

~~~
app.set('view engine', 'html');
app.engine('html', twig.__express);
~~~

Ensuite, en supposant que le template montré plus haut soit dans le
fichier `templates/hello.html`, il serait exécuté ainsi

~~~
res.render('hello.html', { 'nom' : 'Toto' });
~~~

ce qui produirait la sortie

~~~
<p>Hello Toto !</p>
~~~

Voici maintenant un exemple utilisant la boucle `for`.

~~~
<ul>
 {% for en, fr in nombres %}
  <li>{{ en }} = {{ fr }}</li>
 {% endfor %}
</ul>
~~~

Cet exemple, exécuté par l'appel

~~~
res.render('boucle_for.html', { 'num' : [
	'One' => 'Un',
	'Two' => 'Deux',
	'Three' => 'Trois'
] });
~~~

produit le code

~~~
<ul>
  <li>One = Un</li>
  <li>Two = Deux</li>
  <li>Three = Trois</li>
</ul>
~~~

**Attention :** il n'y a pas de `foreach` dans Twig. Pour plus
d'exemples d'utilisation de la boucle `for`, voir
<http://twig.sensiolabs.org/doc/tags/for.html>.

1. Essayez les exemples précédents et comprenez-les.

1. Modifiez le gestionnaire de l'URL `/play` pour qu'il passe le
   fichier `puissance4.html` par le moteur de templates.

2. Modifiez `puissance4.html` pour qu'il affiche le nom des deux
   joueurs à côté du plateau.

3. Modifiez `puissance4.html` (et éventuellement `puissance4.css`)
   pour qu'il affiche à côté du nom du joueur un rectangle de la
   couleur du joueur.
   
   **Suggestion :** vous pouvez utiliser un `<span>` avec une hauteur
   et une largeur fixes et la propriété `display: inline-block`.

4. Modifiez `puissance4.html` et `puissance4.css` pour que la couleur
   des pions corresponde à la couleur choisie par le joueur.
   
   **Suggestion :** on pourrait générer aussi `puissance4.css` par un
   template, mais ce n'est pas l'option la plus simple. Il est plus
   intéressant d'utiliser une balise `<style>`, dans le `<head>` de
   `puissance4.html`, définissant uniquement les deux classes
   `.joueur1` et `.joueur2`, alors que tout le reste du CSS est gardé
   dans un fichier purement statique.

5. Modifiez votre code pour que, lorsque l'un des deux joueurs gagne,
   il affiche « ... a gagné » (remplacer ... par le nom du joueur).
   
   **Suggestion :** il y a énormément de façon de réaliser ceci. Comme
   auparavant, une des possibilités consiste à définir deux variables
   JavaScript dans une balise `<script>`, dans le `<head>` du
   document. Ces variables seront ensuite accessibles depuis
   `puissance4.js` pour réaliser un affichage dynamique.

6. Pour terminer, un exercice assez tordu, mais très
   instructif. Affichez à côté de chaque joueur son score. Lorsque un
   joueur gagne, son score est incrémenté de un, et un lien (ou un
   bouton) proposant de jouer à nouveau est affiché. Cliquer sur le
   lien/bouton renvoie vers la même page, avec tous les paramètres
   (noms des joueurs, couleurs et scores courants) passés par GET ou
   POST. Notamment, lorsque le serveur renvoie la nouvelle page, les
   scores restent aux dernières valeurs.
   
   **Suggestion :** si vous utilisez un lien et la méthode GET, il
   faudra composer l'URL de façon dynamique : JavaScript peut faire
   cela en modifiant l'attribut `href`. Si vous utilisez un bouton et
   la méthode POST (ou GET), il vaudra mieux utiliser des
   `<input type="hidden">` pour stocker les scores des joueurs ;
   JavaScript pourra les modifier à travers la propriété `value`.
   
   Il est aussi possible de charger directement une page via
   JavaScript en modifiant la propriété `window.location.href`, ou
   bien de soumettre un formulaire sans interaction de l'utilisateur à
   travers la méthode `.submit()` de `HTMLFormElement`.
   
{% endraw %}

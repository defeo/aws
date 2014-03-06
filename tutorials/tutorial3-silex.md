---
layout: tutorial
title: Ma première application web
subtitle: (PHP+Silex)
---

Dans ce TD nous allons continuer le développement de notre jeu de
Puissance 4, commencé au [TD précédent](tutorial2).

Nous allons déléguer au server une partie du travail, ce qui nous
permettra d'apprendre les bases de PHP et du framework
Silex. Remarquez, cependant, que tout ce que nous allons développer
dans ce TD pourrait être traité intégralement du côté client ; ce
n'est qu'aux prochains TD que notre code va évoluer vers une vraie
application client-server.

Les références pour ce TD sont

- Le [manuel de PHP](http://www.php.net/manual/),
- Le [manuel de Silex](http://silex.sensiolabs.org/documentation) (en anglais uniquement),
- Le
  [*Book* de Symfony](http://symfony.com/fr/doc/current/book/index.html)
  (disponible aussi
  [en anglais](http://symfony.com/doc/current/book/index.html)),
- La [référence de Symfony](http://api.symfony.com/master/) (en anglais uniquement),
- Ce [tutoriel sur Twig](http://symfony.com/fr/doc/current/book/templating.html),
- La [documentation de Twig](http://twig.sensiolabs.org/documentation) (en anglais uniquement).


## Préparer son espace de travail

Avant de pouvoir commencer le développement, il nous faut installer
Silex et ses composants. Assurez-vous d'avoir correctement créé votre
espace de travail à partir de
<https://github.com/defeo/aws-project.git>, comme décrit
[au TD précédent](tutoriel2#prparer-son-espace-de-travail). Notamment
la racine de votre espace de travail doit contenir les fichiers
`composer.json` et `install.sh`.

Dans le terminal (en bas dans l'espace de travail, tapez `F6` s'il
n'est pas déjà ouvert), tapez les commandes

	git pull
	./install.sh

La première commande va mettre à jour certains fichiers de
configuration, la seconde va télécharger et installer les composants
de Silex dans votre espace de travail (à l'intérieur d'un dossier
nommé `vendor`). Cette opération peut prendre quelques minutes.

Pour vérifier que Silex a été correctement installé, ouvrez le fichier
`exemple.php` dans l'éditeur et cliquez sur le bouton *« Run »*. Dans
le terminal s'affiche un lien. Cliquez et observez la page affichée,
elle devrait contenir le texte *« Hello world ! »*. Dans la barre
d'adresse interne à C9 (ou dans un autre onglet), ajoutez `/toto` à la
fin de l'URL, l'onglet de Preview devrait maintenant afficher *« Hello
toto »*. N'hésitez pas à étudier le code de `exmple.php` et
`exemple.twig` pour en comprendre le fonctionnement.


## Le réflecteur

Nous allons commencer par un exercice classique, sans lien avec le jeu
de Puissance 4. Un réflecteur est une simple page web qui affiche le
contenu des paramètres (*query string*, formulaires, entêtes HTTP,
...) envoyés à la page.

Créez un fichier nommé `reflector.php`, et initialisez-le avec le code
suivant (qui s'occupe de charger Silex, créer et exécuter une
application web vide).

~~~
<?php
require_once 'vendor/autoload.php';
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;

$app = new Application();

// Configuration
$app['debug'] = true;

// Votre code va ici


$app->run();
?>
~~~

1. En suivant l'exemple de `exemple.php`, créez un gestionnaire pour
   l'URL `/query_string` qui affiche le texte
   
   ~~~
   Hello
   world !
   ~~~

   Le retour à la ligne est important. Comment faire en sorte qu'il
   soit affiché par le browser ? (**Rappel :** à moins d'être instruit
   autrement, le browser interprète par défaut tout contenu comme étant
   du code HTML).

   **Attention :** ce gestionnaire répondra à l'adresse
   
	   http://.../reflector.php/query_string
   {:.bash}
   
   Vous devez modifier l'URL à la main dans la barre d'adresse pour
   visualiser la page.

2. Dans votre gestionnaire, avec une boucle `foreach`, affichez le
   contenu du tableau
   
   ~~~
   $jours = array('mon' => 'Lundi',
                  'tue' => 'Mardi',
                  'wed' => 'Mercredi',
                  'thu' => 'Jeudi',
                  'fri' => 'Vendredi',
                  'sat' => 'Samedi',
                  'sun' => 'Dimanche');
   ~~~
   
   un couple clé-valeur par ligne. On rappelle que l'opérateur de
   concaténation en PHP est le point (`.`).

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
   
   Silex analyse automatiquement la *query string*. Son contenu est
   accessible dans l'objet
   [`Request`](http://api.symfony.com/master/Symfony/Component/HttpFoundation/Request.html)
   du gestionnaire. Pour pouvoir le manipuler, il est nécessaire de
   définir le gestionnaire comme dans cet exemple :
   
   ~~~
   $app->get(..., function(Request $requete) {
	   ...
   });
   ~~~
   
   le contenu de la *query string* sera alors disponible dans le
   tableau associatif `$requete->query`.
   
   Modifiez le gestionnaire écrit au point précédent pour qu'il
   affiche le contenu de la *query string*, un couple clé-valeur par
   ligne. Testez votre gestionnaire en saisissant des *query strings*
   dans la barre d'adresse.

4. Le *query string* non analysé est accessible grâce à la méthode
   `$requete->getQueryString()`. Modifiez votre gestionnaire pour qu'il
   affiche, en plus, le *query string* non analysé. Visitez maintenant
   l'URL
   
   ~~~
   https://.../reflector.php/query_string?A=B=3&C=%26&X Y=W+Z&X%20Y=W%2BZ
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
   
   **Rappel :** pour créer un gestionnaire de type POST en Silex, on
   remplace `$app->get()` par `$app->post()`.
   
   Au lieu de transiter par le *query string*, les données passent
   maintenant directement dans le corps de la requête. Ces données
   sont analysées par Silex et insérées dans le tableau
   `$requete->request`. Quant au corps brut de la requête, il est
   accessible via la méthode `$requete->getContent()`.
   
   Créez un nouveau gestionnaire pour des requêtes de type POST à
   l'URL `/form_data`. Faites en sorte qu'il affiche le corps de la
   requête, un couple clé-valeur par ligne. Faites-lui afficher aussi
   la requête brute. Testez avec le formulaire du point
   précédent. Comparez les affichages avec l'onglet *« Réseau »* des
   *dev tools* de Chrome ou Firefox (une version récente).

7. Deux autres tableaux compilés par Silex contiennent des données
   utiles :
   
   - `$requete->headers` contient les entêtes HTTP de la requête ;
   - `$requete->cookies` contient les *cookies* (remarquez que cette
     information est aussi contenue dans les entêtes au format brut).
   
   Créez un nouveau gestionnaire à l'URL `/headers` qui affiche le
   contenu de ces deux tableaux. Comparez avec les informations
   affichées par l'outil *« Réseau »* des *dev tools*.
   
   **Note :** vous pouvez créer un gestionnaire qui répond à tous les
   types de requête (GET, POST, etc.) en remplaçant `$app->get()` par
   `$app->match()`.
   
   **Note :** `$requete->headers` est légèrement différent des autres
   tableaux : les clés sont des chaînes de caractères, comme pour les
   autres tableaux ; les valeurs, par contre, sont des listes, en
   effet une entête HTTP peut prendre plusieurs valeurs. Pour que
   l'affichage de `$requete->headers` soit intéressant, il sera
   opportun d'afficher le premier élément de chaque liste de valeurs.

8. Mettez maintenant tous les composants ensemble. Créez un
   gestionnaire pour l'URL `/` qui répond à tous les types de requêtes
   et qui affiche
   
   - la *query string*,
   - le contenu de la requête, s'il y en a un,
   - les entêtes HTTP,
   - les cookies.



## Contenu statique et templates

Maintenant que nous maîtrisons le routage et l'API de la requête en
Silex, nous allons appliquer nos connaissances au jeu de Puissance 4.

Dans la section précédente, nous avons utilisé deux techniques très
différentes pour créer nos pages :

- Pour les URL dynamiques, comme `/query_string`, etc., nous avons
  défini des gestionnaires dans un fichier PHP. La sortie HTML a été
  obtenue à coups de concaténations de chaînes de caractères.
- Pour le formulaire statique, nous avons créé un simple fichier HTML.

Ce sont deux manières de coder opposées, et il serait dommage d'être
limités à cela et de ne pas pouvoir les mélanger. Dans cette section
nous allons apprendre comment Silex permet de lire et servir des
fichiers statiques, puis comment le moteur de templates Twig permet de
réaliser une transition douce entre les pages statiques et les pages
dynamiques.

Dans la suite on va supposer que le jeu de Puissance 4 développé au TD
précédent est contenu dans les trois fichiers `puissance4.html`,
`puissance4.css` et `puissance4.js`.

### Servir des fichiers

1. Créez un fichier `index.php`, et initialisez-le avec le squelette
   habituel de Silex.

2. Créez un gestionnaire pour l'URL `/play`. Afin de pouvoir accéder à
   l'objet
   [`Application`](http://silex.sensiolabs.org/api/Silex/Application.html)
   depuis le gestionnaire, il faudra le définir ainsi
   
   ~~~
   $app->get('/play', function(Application $app, Request $req) {
	   ...
   });
   ~~~
   
   La méthode `$app->sendFile()` crée une réponse constituée du
   contenu d'un fichier (HTML par défaut). Elle s'utilise ainsi
   
   ~~~
   return $app->sendFile('nom-du-fichier.html');
   ~~~
   
   Écrivez le gestionnaire en sorte que le jeu de Puissance 4 soit
   accèssible à l'URL `/play`.
   
   **Note :** grâce à un peu de magie contenue dans le fichier (caché)
   `.htaccess`, ce gestionnaire sera accessible aussi bien à l'URL
   
   ~~~
   https://...c9.io/index.php/play
   ~~~
   {:.bash}
   
   qu'à l'URL

   ~~~
   https://...c9.io/play
   ~~~
   {:.bash}
   
   À cause des URLs des fichiers CSS et JavaScript, ce n'est que cette
   dernière qui va bien marcher.

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
`puissance4.html` et le mettre dans `index.php`.

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
moins riche. Le langage de templating par défaut de Silex est Twig,
voici un
[tour rapide de sa syntaxe](http://twig.sensiolabs.org/doc/templates.html). Les
seuls composants dont nous allons nous servir dans ce TD sont le
remplacement de variables, montré dans l'exemple précédent, et
(éventuellement) la boucle `for`.

**Important :** Twig n'est pas activé par défaut dans Silex. Pour
pouvoir l'activer il faut ajouter la ligne suivante à la configuration
de l'application :

~~~
$app->register(new Silex\Provider\TwigServiceProvider(), 
               array('twig.path' => 'templates'));
~~~

où le paramètre `'twig.path'` indique le dossier qui va contenir les
fichiers de templates.

Ensuite, en supposant que le template montré plus haut soit dans le
fichier `templates/hello.html`, il serait exécuté ainsi

~~~
return $app['twig']->render('hello.html', array(
	'nom' => 'Toto'
));
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
$app['twig']->render('boucle_for.html', array(
	'num' => array(
		'One' => 'Un',
		'Two' => 'Deux',
		'Three' => 'Trois'
	)
));
~~~

produit le code

~~~
<ul>
  <li>One = Un</li>
  <li>Two = Deux</li>
  <li>Three = Trois</li>
</ul>
~~~

**Attention :** contrairement à la syntaxe PHP, il n'y a pas de
`foreach` dans Twig. Pour plus d'exemples d'utilisation de la boucle
`for`, voir <http://twig.sensiolabs.org/doc/tags/for.html>.

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

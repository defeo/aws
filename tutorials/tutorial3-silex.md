---
layout: tutorial
title: Ma première application web
subtitle: (PHP+Silex)
---

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
   
   Servez le formulaire à l'URL `/` par la méthode `sendFile` ; il
   doit envoyer ses données à l'URL `/play` (par GET ou POST, au
   choix).


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

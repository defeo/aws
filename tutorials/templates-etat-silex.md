---
layout: tutorial
title: Templates, données, état
subtitle: (PHP+Silex)
---

Dans ce TD nous introduisons le moteur de templates Twig, et nous
étudions quelques techniques de maintien d'état. Vous pouvez continuer
à travailler dans le même espace de travail Cloud9, dans ce cas,
rentrez la commande suivante dans le terminal :

~~~
git pull
~~~

Alternativement, vous pouvez créer un nouvel espace de travail en
clonant <https://github.com/defeo/aws-project.git>.

Les références pour ce TD sont

- Le [manuel de PHP](http://www.php.net/manual/),
- Le [manuel de Silex](http://silex.sensiolabs.org/documentation) (en anglais uniquement),
- Le
  [*Book* de Symfony](http://symfony.com/fr/doc/current/book/index.html)
  (disponible aussi
  [en anglais](http://symfony.com/doc/current/book/index.html)),
- La [référence de Symfony](http://api.symfony.com/master/) (en anglais uniquement),
- Ce
  [tutoriel sur Twig](http://symfony.com/fr/doc/current/book/templating.html),
- La [documentation de Twig](http://twig.sensiolabs.org/documentation)
  (en anglais uniquement).


## Contenu statique et templates

Dans le [TD précédent](reflector-silex), nous avons utilisé deux
techniques très différentes pour créer nos pages :

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


### Servir des fichiers

1. Créez un fichier `form.html`, contenant un formulaire comme ceci
   
   {::nomarkdown}
   <div style="border:solid thin black;border-radius:10px;padding:5px">
   <input type="text" placeholder="choisissez un pseudo">
   <p>Choisissez une couleur</p>
   <input type="radio">rouge<br>
   <input type="radio">jaune</br>
   <input type="button" value="Entrer">
   </div>
   {:/}
   
   Tâchez de créer une page HTML complète et valide : avec
   `<!Doctype>`, entêtes, `<body>`, etc.

2. Créez un fichier `index.php`, et initialisez-le avec le squelette
   habituel de Silex.

3. Créez un gestionnaire pour l'URL `/signin`. Afin de pouvoir accéder à
   l'objet
   [`Application`](http://silex.sensiolabs.org/api/Silex/Application.html)
   depuis le gestionnaire, il faudra le définir ainsi
   
   ~~~
   $app->get('/signin', function(Application $app, Request $req) {
	   ...
   });
   ~~~
   
   La méthode `$app->sendFile()` crée une réponse constituée du
   contenu d'un fichier (HTML par défaut). Elle s'utilise ainsi
   
   ~~~
   return $app->sendFile('nom-du-fichier.html');
   ~~~
   
   Écrivez le gestionnaire en sorte que le formulaire soit accessible
   à l'URL `/signin`.
   
   **Note :** grâce à un peu de magie contenue dans le fichier
   `.htaccess` (fichier caché, visible en sélectionannt *show hidden
   files* dans les options de Cloud9), ce gestionnaire sera accessible
   aussi bien à l'URL
   
   ~~~
   https://...c9.io/index.php/signin
   ~~~
   {:.bash}
   
   qu'à l'URL

   ~~~
   https://...c9.io/signin
   ~~~
   {:.bash}

4. Créez une deuxième page html (complète et valide) contenant
   simplement le texte *« Bonjour ! »*. Servez cette page à l'url
   `/hello` par la méthode `sendFile`. Modifiez le formulaire pour
   qu'il dirige vers cette page.
   

### Templates Twig

{% raw %}

Un template est un modèle d'un document (usuellement un document HTML,
mais ce n'est pas obligatoire) avec du marquage spécial qui indique
les parties dynamiques du document.

Voici un template très simple :

~~~
<p>Hello {{ nom }} !</p>
~~~

Le marquage spécial `{{ nom }}` indique qu'il faudra remplacer à cet
endroit la valeur de la variable `nom`.

Chaque *langage de templating* définit sa propre syntaxe, plus ou
moins riche. Le langage de templating par défaut de Silex est Twig,
voici un
[tour rapide de sa syntaxe](http://twig.sensiolabs.org/doc/templates.html). Les
seuls composants dont nous allons nous servir dans ce TD sont le
remplacement de variables, montré dans l'exemple précédent, et
les blocs `if` et `for`.

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

1. Étudiez à nouveau le fichier `example.php` et comprenez comment il
   utilise les templates Twig.

2. Éditez le gestionnaire et le template à l'url `/hello` pour que le
   texte affiché soit *« Bonjour, ... ! »*, où le nom rentré dans le
   formulaire apparaît à la place des points de suspension.

Voici maintenant un exemple de template utilisant la boucle `for`.

~~~
<ul>
 {% for en, fr in nombres %}
  <li>{{ en }} signifie {{ fr }}</li>
 {% endfor %}
</ul>
~~~

Cet exemple, exécuté par l'appel

~~~
$app['twig']->render('boucle_for.html', array(
	'nombres' => array(
		'One' => 'Un',
		'Two' => 'Deux',
		'Three' => 'Trois'
	)
));
~~~

produit le code

~~~
<ul>
  <li>One signifie Un</li>
  <li>Two signifie Deux</li>
  <li>Three signifie Trois</li>
</ul>
~~~

**Attention :** contrairement à la syntaxe PHP, il n'y a pas de
`foreach` dans Twig. Pour plus d'exemples d'utilisation de la boucle
`for`, voir <http://twig.sensiolabs.org/doc/tags/for.html>.

1. Insérez dans votre code PHP ces deux tableaux :
   
   ~~~
   array('cerise', 'fraise', 'sang')
   array('soleil', 'citron', 'banane')
   ~~~
   {:.php}
   
   Dans la page `/hello`, à l'aide d'un bloc `{% if %}` et d'un bloc
   `{% for %}`, affichez l'un ou l'autre, selon la couleur choisie
   dans le formulaire.

2. Ajoutez une balise `<style>` dans l'entête du
   template. Servez-vous-en pour colorer en rouge ou en jaune le texte
   de la liste, selon la couleur choisie dans le formulaire.
{:start="3"}

## Persistance

Nous étudions maintenant les différentes techniques de persistance des
données. Nous allons faire persister le nom saisi par l'utilisateur à
travers plusieurs pages.

### Persistance par le *query string*

Nous commençons par faire persister les données dans le *query
string*.

1. Ajoutez un lien (balise `<a>`) dans la page `/hello` vers une
   nouvelle page `/bye`.

1. Toujours à l'aide du moteur de templates, servez une page à l'url
   `/bye`, contenant le texte *« Au revoir, ... »*, où les points sont
   remplacés par le nom saisi par l'utilisateur. Vous pouvez recevoir
   cette donnée par le *query string*, par exemple, en répondant aux
   urls de la forme `/bye?nom=toto`.

### Persistance par champs cachés

Nous passons maintenant aux techniques de persistance par la méthode
POST. Cette technique peut être melangée avec la précédente.

1. Modifiez `form.html` pour qu'il envoie ses données par la méthode
   POST.

1. Créez un gestionnaire pour les requêtes de type POST à l'url
   `/hello`. Affichez *« Bonjour, ... »*, comme vous l'avez fait plus
   tôt.

1. Ajoutez dans `/hello` un formulaire contenant un champ de texte
   prérempli avec le nom de l'utilisateur, et un bouton de
   soumussion. Le formulaire pointera vers l'url `/bye`.

1. Créez un gestionnaire pour les requêtes de type POST à l'url
   `/bye`. Affichez *« Au revoir, ... »* comme vous l'avez fait plus
   tôt.

1. Modifiez le formulaire de l'url `/hello` en transformant le champ
   de texte en champ de type `hidden`.

### Persistance par l'URL

Dernière technique légère de persistance : garder les données
directement dans l'url. Cela est rendu possible par le routeur de
Silex. Nous changeons légèrement d'exercice : nous réalisons un
compteur de visites.

1. Créez un gestionnaire
   
   ~~~
   $app->get('/{nom}/compteur', ...);
   ~~~
   {:.php}
   
   À l'aide d'un template, affichez le texte *« ..., ceci est votre
   première visite »*, où vous remplacerez à la place des points le
   nom passé par l'url.

2. Créez un gestionnaire pour les urls de la forme
   `/{nom}/compteur/{cnt}`. Le composant `{cnt}` de l'url va être un
   entier qui compte le nombre de visites. Affichez le texte *« ...,
   vous avez visité cette page ... fois »*, où vous remplacerez
   `{nom}` et `{cnt}` à la place des points.
   
   **Note :** Vous pouvez lire
   [cette partie du manuel de Silex](http://silex.sensiolabs.org/doc/usage.html#requirements)
   pour voir comment restreindre `{cnt}` à des valeurs exclusivement
   numériques.

3. Ajoutez un lien dans `/{nom}/compteur` vers
   `/{nom}/compteur/1`. Ajoutez un lien dans `/{nom}/compteur/{cnt}`
   vers la même page, avec le compteur augmenté.

Si vous avez correctement exécuté l'exercice, vous avez un compteur
qui augmente d'une unité à chaque clic sur le lien. Vous pouvez, bien
sûr, appliquer la même technique au *query string* ou aux formulaires
cachés. Essayez pour vous en convaincre.

1. Donnez un prix à la millionième visite.

1. Sans cliquer un million de fois, gagnez le prix.
{:start="4"}

## Cookies et Storage API (optionnel)

Nous arrivons aux deux dernières techniques de persistance gérée par
le client. Les cookies sont une extension du protocole HTTP, ils sont
manipulés par le serveur et stockés par le client. La storage API est
une partie de la spécification du DOM, elle est totalement manipulée
par le client via JavaScript.

### Cookies

Les cookies sont des couples clef-valeur stockés par le client. Un
gestionnaire peut demander à stocker un cookie avec le code suivant

~~~
$res = new HTTP\Response();
$res->headers->setCookie(new HTTP\Cookie('user', 'toto'));
return $res;
~~~

Une fois stockés, les cookies sont envoyés par le client avec toute
requête pour le même domaine (peu importe le gestionnaire). Ils sont
lus dans l'objet `$req->cookies`, comme déjà vu au TD précédent.

1. Créez une page `/compteur-cookie` qui compte le nombre de visites à
   elle même. L'information sera stockée dans un cookie. Si le cookie
   n'est pas initialisé (par ex., à la première visite), celui-ci sera
   initialisé à 1. S'il est initialisé, sa valeur sera augmentée de 1
   et il sera envoyé à nouveau au client. Pour voir le nombre de
   visites augmenter, il suffira de recharger la page.

1. Offrez un prix à la millionième visite.

1. Gagnez le prix (suggestion : il va probablement falloir installer
   une extension pour votre browser).

### Storage API

La storage API se gère entièrement par JavaScript, vous pouvez donc
utiliser une page html statique, sans passer par Silex.

Il s'agit d'un simple tableau, `localStorage`, qui persiste aux
rechargements de la page et à la fermeture du browser.

1. Créez une page qui compte son nombre de visite à l'aide de l'API
   `localStorage`. Rechargez la page et vérifiez que cela fonctionne.

1. Offrez un prix à la millionième visite.

1. Gagnez le prix (la console JavaScript devrait vous suffire).

{% endraw %}

---
title: Templates, données, état
subtitle: (Node.js+Express)
---

Dans ce TD nous introduisons le moteur de templates Twig, et nous
étudions quelques techniques de maintien d'état. Vous pouvez continuer
à travailler dans le même espace de travail Cloud9.  Alternativement,
vous pouvez créer un nouvel espace de travail en clonant
<https://github.com/defeo/aws-project.git> ; n'oubliez pas de lancer à
nouveau la commande `npm install` dans ce cas.

Les références pour ce TD sont


- Le [manuel de JavaScript](https://developer.mozilla.org/docs/Web/JavaScript),
- La [référence de Node.js](http://nodejs.org/api/),
- Les [aides de NodeJitsu](http://docs.nodejitsu.com/),
- Le [guide de Express](http://expressjs.com/guide.html),
- La [référence de Express](http://expressjs.com/3x/api.html),
- Ce
  [tutoriel sur Twig](http://symfony.com/fr/doc/current/book/templating.html),
- La [documentation de Twig](http://twig.sensiolabs.org/documentation)
  (en anglais uniquement).


## Contenu statique et templates

Dans le [TD précédent](reflector-node), nous avons utilisé deux
techniques très différentes pour créer nos pages :

- Pour les URL dynamiques, comme `/query_string`, etc., nous avons
  défini des gestionnaires dans un fichier JavaScript. La sortie HTML
  a été obtenue à coups de concaténations de chaînes de caractères.
- Pour le formulaire statique, nous avons créé un simple fichier HTML.

Ce sont deux manières de coder opposées, et il serait dommage d'être
limités à cela et de ne pas pouvoir les mélanger. Dans cette section
nous allons apprendre comment Express permet de lire et servir des
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

2. Créez un fichier `app.js`, et initialisez-le avec le squelette
   habituel de Express.

3. Créez un dossier `static` et déplacez-y le fichier
   `form.html`. Ajoutez à la configuration de `app.js` la ligne
   
   ~~~
   app.use('/s', express.static('static'));
   ~~~
   
   Ceci permet à Node.js de servir les fichiers contenus dans le
   dossier `static` à l'URL `/s/...`. Exécutez `app.js` et vérifiez
   que le formulaire est bien servi à l'url
   
   ~~~
   /s/form.html
   ~~~
   {:.bash}


4. Nous allons aussi servir le même document à une autre URL. Créez un
   gestionnaire pour l'URL `/signin`, et utilisez la méthode
   `res.sendFile()` pour servir le formulaire (la méthode prend un
   paramètre : le chemin du fichier à servir).
   
   **Note :** la methode `res.sendFile()` demande le chemin absolu
   vers le fichier à servir. La façon la plus portable de donner ce
   chemin est d'utiliser la variable globale `__dirname` prédéfinie
   par Node.js, comme ceci
   
   ~~~
   res.sendFile(__dirname + '/static/nom_du_fichier.html');
   ~~~

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
moins riche. Node dispose d'une pléthore de moteurs de templating ;
pour s'en faire une idée, il suffit de regarder la
[liste disponible sur le serveur de paquets de Node](https://www.npmjs.org/browse/keyword/template).

Pour rester compatibles avec la partie du cours faites en PHP, ce TD
va utiliser langage de templating Twig, voici un
[tour rapide de sa syntaxe](http://twig.sensiolabs.org/doc/templates.html). Les
seuls composants dont nous allons nous servir dans ce TD sont le
remplacement de variables, montré dans l'exemple précédent, et les
blocks `if` et `for`.

Sachez, cependant, que le module Twig pour Node.js est encore en phase
expérimentale. Vous êtes encouragés à explorer d'autres langages de
templating populaires : le plus proche de Twig est
[Nunjucks](https://www.npmjs.org/package/nunjucks), mais peut-être
trouverez-vous votre bonheur avec
[Hogan (Mustache)](http://twitter.github.io/hogan.js/),
[Jade](https://github.com/visionmedia/jade), ...

**Important :** avant d'utiliser Twig (ou tout autre moteur de
templating), il faut dire à Express où se trouvent les fichiers de
templates. Par exemple, la configuration

~~~
app.set('views', 'templates');
~~~

dit à Express de chercher les fichiers de templates dans le dossier
`templates`. **Attenion :** seuls les fichiers avec extension `.twig`
seront passés au moteur Twig**; pour configuer Express de façon plus
flexible, lisez la doc de
[`app.engine`](http://expressjs.com/en/4x/api.html#app.engine).

Ensuite, en supposant que le template montré plus haut soit dans le
fichier `templates/hello.twig`, il serait exécuté ainsi

~~~
res.render('hello.twig', { 'nom' : 'Toto' });
~~~

ce qui produirait la sortie

~~~
<p>Hello Toto !</p>
~~~

**Important :** Pour se protéger des attaques XSS, il est aussi
fortement recommandé d'activer l'échappement automatique des variables
avec

~~~
app.set("twig options", { autoescape: true });
~~~

1. Étudiez à nouveau le fichier `example.js` et comprenez comment il
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
res.render('boucle_for.twig', { 'nombres' : {
	'One' : 'Un',
	'Two' : 'Deux',
	'Three' : 'Trois'
} });
~~~

produit le code

~~~
<ul>
  <li>One signifie Un</li>
  <li>Two signifie Deux</li>
  <li>Three signifie Trois</li>
</ul>
~~~

**Attention :** il n'y a pas de `foreach` dans Twig. Pour plus
d'exemples d'utilisation de la boucle `for`, voir
<http://twig.sensiolabs.org/doc/tags/for.html>.

1. Insérez dans votre code JavaScript ces deux tableaux :
   
   ~~~
   ['cerise', 'fraise', 'sang']
   ['soleil', 'citron', 'banane']
   ~~~
   
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
Express. Nous changeons légèrement d'exercice : nous réalisons un
compteur de visites.

1. Créez un gestionnaire
   
   ~~~
   app.get('/:nom/compteur', ...);
   ~~~
   {:.javascript}
   
   À l'aide d'un template, affichez le texte *« ..., ceci est votre
   première visite »*, où vous remplacerez à la place des points le
   nom passé par l'url.

2. Créez un gestionnaire pour les urls de la forme
   `/:nom/compteur/:cnt`. Le composant `:cnt` de l'url va être un
   entier qui compte le nombre de visites. Affichez le texte *« ...,
   vous avez visité cette page ... fois »*, où vous remplacerez
   `:nom` et `:cnt` à la place des points.
   
   **Note :** Vous pouvez restreindre `:cnt` à des valeurs
   exclusivement numériques avec une *expression régulière*.

3. Ajoutez un lien dans `/:nom/compteur` vers
   `/:nom/compteur/1`. Ajoutez un lien dans `/:nom/compteur/:cnt` vers
   la même page, avec le compteur augmenté.

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
res.cookie('user', 'toto');
~~~

Une fois stockés, les cookies sont envoyés par le client avec toute
requête pour le même domaine (peu importe le gestionnaire). Ils sont
lus dans l'objet `req.cookies` par le *middleware* `cookie-parser`,
comme déjà vu au TD précédent.

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
utiliser une page html statique, sans passer par Node.

Il s'agit d'un simple tableau, `localStorage`, qui persiste aux
rechargements de la page et à la fermeture du browser.

1. Créez une page qui compte son nombre de visite à l'aide de l'API
   `localStorage`. Rechargez la page et vérifiez que cela fonctionne.

1. Offrez un prix à la millionième visite.

1. Gagnez le prix (la console JavaScript devrait vous suffire).

{% endraw %}

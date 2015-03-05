---
layout: tutorial
title: Le réflecteur
subtitle: (Node.js+Express)
---

Dans ce TD nous abordons un exercice classique : le *réflecteur*. Un
réflecteur est une simple page web qui affiche (qui reflète) toutes
les données qui lui sont envoyées : *query string*, formulaires,
entêtes HTTP, ...

Les références pour ce TD sont

- Le [manuel de JavaScript](https://developer.mozilla.org/docs/Web/JavaScript),
- La [référence de Node.js](http://nodejs.org/api/),
- Les [aides de NodeJitsu](http://docs.nodejitsu.com/),
- Le [guide de Express](http://expressjs.com/guide.html),
- La [référence de Express](http://expressjs.com/3x/api.html),


## Préparer son espace de travail

Vous allez créer un nouvel espace de travail Cloud9 pour ce TD. Plutôt
que partir de zéro, vous allez *cloner* un espace de travail
préconfiguré. Depuis le *Dashboard*, suivez ces instructions.

1. Cliquez sur le bouton *« Create new workspace »*, puis *« Clone
   from URL »* ;
2. Dans la case *« Source URL »* écrivez
   <https://github.com/defeo/aws-project.git> ;
3. Laissez les autres paramètres tels quels (*« Open and
   Discoverable »* et *« Custom »*) ;
4. Cliquez sur *« Create »*.

Votre espace de travail va s'appeler *« aws-project »* ; vous pouvez
maintenant y accéder. Vous y trouverez quelques fichiers préparés par
le professeur, auxquels il ne faudra pas toucher. Notamment la racine
de votre espace de travail doit contenir le fichier `package.json`.

> **Note :** Si vous souhaitez installer Express dans un espace de
> travail créé à la main, vous pouvez importer les contenus préparés
> par le professeur en tapant les commandes suivantes dans le
> *Terminal* (en bas dans l'espace de travail, tapez `Alt-T` s'il
> n'est pas déjà ouvert).

> ~~~
> git init .
> git remote add -f origin https://github.com/defeo/aws-project.git
> rm README.md
> git checkout master
> ~~~
> {:.bash}

Pour installer Express et ses composants, maintenant, tapez la commande

	npm install
{:.bash}

dans le terminal (en bas dans l'espace de travail, tapez `Alt-T` s'il
n'est pas déjà ouvert). Cette commande va télécharger et installer les
composants de Express (la liste des paquets installés est dans le
fichier `package.json`) et le moteur de templates Twig dans votre
espace de travail (à l'intérieur d'un dossier nommé
`node_modules`). Cette opération peut prendre quelques minutes.

Pour vérifier que Express a été correctement installé, ouvrez le
fichier `exemple.js` dans l'éditeur et cliquez sur le bouton
*« Run »*. Dans le terminal s'affiche un lien. Cliquez et observez la
page affichée, elle devrait contenir le texte *« Hello
world ! »*. Dans la barre d'adresse interne à C9 (ou dans un autre
onglet), ajoutez `/toto` à la fin de l'URL, l'onglet devrait
maintenant afficher *« Hello toto »*. N'hésitez pas à étudier le code
de `exmple.js` et `exemple.twig` pour en comprendre le fonctionnement.


## Le réflecteur

Créez un fichier nommé `reflector.js`, et initialisez-le avec le code
suivant (qui s'occupe de charger Express, créer et exécuter une
application web vide).

~~~
var express = require('express');
var bodyP = require('body-parser');
var cookieP = require('cookie-parser');

var app = express();

// Configuration des middlewares
app
	.use(bodyP.urlencoded({ extended: false }))
	.use(cookieP())
	.use(express.static('.'));
	
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

2. Dans votre gestionnaire, avec une boucle `for ... in`, affichez le
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
   
   un couple clé-valeur par ligne.
   
   **Attention :** un gestionnaire ne peut pas **exécuter**
   `res.send()` plus d'une fois. On rappelle que l'opérateur de
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
   partie par les pratiques communes.  Express analyse automatiquement
   la *query string* : son contenu est accessible dans l'objet
   [`req.query`](http://expressjs.com/3x/api.html#req.query) du
   gestionnaire.
   
   Modifiez le gestionnaire écrit au point précédent pour qu'il
   affiche le contenu de la *query string*, un couple clé-valeur par
   ligne. Testez votre gestionnaire en saisissant des *query strings*
   dans la barre d'adresse, comme par exemple
   
   ~~~
   http://<nom_du_projet>.c9.io/query_string?user=toto&pwd=12345
   ~~~
   {:.http}

4. Le *query string* non analysé est accessible grâce à la propriété
   `req._parsedUrl.query`. Modifiez votre gestionnaire pour qu'il
   affiche, en plus, le *query string* non analysé. Visitez maintenant
   l'URL
   
   ~~~
   /query_string?A=B=3&C=%26&X Y=W+Z&X%20Y=W%2BZ
   ~~~
   {:.http}
   
   Qu'observez-vous ? Pour comprendre en détail comment l'URL a été
   transformée, vous pouvez lire cette
   [page Wikipedia](http://en.wikipedia.org/wiki/Percent-encoding).

4. Dans un autre fichier, créez un formulaire HTML qui envoie ses
   données à l'URL `/query_string` (attribut `action`) par la méthode
   *get* (attribut `method`). Testez le réflecteur à travers le
   formulaire ; testez notamment les caractères spéciaux, tels les
   espaces, les ampersands (`&`), etc.
   
   **Note :** vous pouvez visualiser le formulaire avec le bouton
   *Preview*, mais vous pouvez aussi le visualiser à l'url
   
   ~~~
   http://<nom_du_projet>.c9.io/<nom_du_formulaire>.html
   ~~~
   
   ceci a été rendu possible par le *middleware*
   `express.static`. Puisque le formulaire et votre application se
   trouvent sur le même domaine `<nom_du_projet>.c9.io`, vous avez la
   possiblité d'utiliser une url relative dans le champ `action`. Ceci
   n'est pas possible si vous utilisez le bouton *Preview*, en effet
   le formulaire est dans ce cas servi sur le domaine `preview.c9.io`.
   
5. Reprenez le formulaire du point précédent, en envoyant les données
   dans le corps d'une requête de type POST (`method="POST"`).
   
   Au lieu de transiter par le *query string*, les données passent
   maintenant directement dans le corps de la requête.  Lorsqu'il est
   configuré avec le *middleware* `body-parser`, Express analyse
   automatiquement le corps de la requête et remplit l'objet
   `req.body` avec son contenu.
   
   Créez un nouveau gestionnaire pour des requêtes de type POST à
   l'URL `/form_data`.

   **Note :** pour créer un gestionnaire de type POST en Express, on
   utilise `app.post()` à la place de `app.get()`.
   
   Faites en sorte qu'il affiche le corps de la requête, un couple
   clé-valeur par ligne. Testez avec le formulaire du point
   précédent. Comparez les affichages avec l'onglet *« Réseau »* des
   *dev tools* de Chrome ou Firefox (une version récente).
   
7. Deux autres tableaux contiennent des données utiles :
   
   - `req.headers` contient les entêtes HTTP de la requête ;
   - `req.cookies` contient les *cookies* (cet objet est rempli par le
	 middleware `cookie-parser` ; remarquez que la même information
	 est aussi présente dans les entêtes brutes).
   
   Créez un nouveau gestionnaire à l'URL `/headers` qui affiche le
   contenu de ces deux tableaux. Comparez avec les informations
   affichées par l'outil *« Réseau »* des *dev tools*.
   
   **Note :** vous pouvez créer un gestionnaire qui répond à tous les
   types de requête (GET, POST, etc.) en remplaçant `app.get()` par
   `app.all()`.
   
8. Mettez maintenant tous les composants ensemble. Créez un
   gestionnaire pour l'URL `/` qui répond à tous les types de requêtes
   et qui affiche
   
   - la *query string*,
   - le contenu de la requête, s'il y en a un,
   - les entêtes HTTP,
   - les cookies.


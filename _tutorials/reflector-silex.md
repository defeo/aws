---
layout: tutorial
title: Le réflecteur
subtitle: (PHP+Silex)
---

Dans ce TD nous abordons un exercice classique : le *réflecteur*. Un
réflecteur est une simple page web qui affiche (qui reflète) toutes
les données qui lui sont envoyées : *query string*, formulaires,
entêtes HTTP, ...

Les références pour ce TD sont

- Le [manuel de PHP](http://www.php.net/manual/),
- Le [manuel de Silex](http://silex.sensiolabs.org/documentation) (en anglais uniquement),
- Le
  [*Book* de Symfony](http://symfony.com/fr/doc/current/book/index.html)
  (disponible aussi
  [en anglais](http://symfony.com/doc/current/book/index.html)),
- La [référence de Symfony](http://api.symfony.com/master/) (en anglais uniquement),

## Préparer son espace de travail

Vous allez créer un nouvel espace de travail Cloud9 pour ce
TD. Plutôt que partir de zéro, vous allez *cloner* un espace de
travail préconfiguré. 

Vous avez deux façons de le faire:

### Étape 1 : En créant un nouvel espace de travail (recommandée dans un premier temps)

Depuis le *dashboard*, suivez ces instructions.

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
de votre espace de travail doit contenir les fichiers `composer.json`
et `install.sh`.

Passez à l'étape 2.

### Étape 1 : À partir d'un espace "vierge"

Si vous souhaitez installer Silex dans un espace de
travail créé à la main, vous pouvez importer les contenus préparés
par le professeur en tapant les commandes suivantes dans le
*Terminal* (en bas dans l'espace de travail, tapez `Alt-T` s'il
n'est pas déjà ouvert).

~~~
git init .
git remote add -f origin https://github.com/defeo/aws-project.git
rm README.md
git checkout master
~~~
{:.bash}

### Étape 2 : Installation

Pour installer Silex et ses composants, maintenant, tapez la commande

	./install.sh

dans le terminal (en bas dans l'espace de travail, tapez `Alt-T` s'il
n'est pas déjà ouvert). Cette commande va télécharger et installer les
composants de Silex (la liste des paquets installés est dans le
fichier `composer.json`) dans votre espace de travail (à l'intérieur
d'un dossier nommé `vendor`). Cette opération peut prendre quelques
minutes.

Pour vérifier que Silex a été correctement installé, ouvrez le fichier
`exemple.php` dans l'éditeur et cliquez sur le bouton *« Run »*. Dans
le terminal s'affiche un lien. Cliquez et observez la page affichée,
elle devrait contenir le texte *« Hello world ! »*. Dans la barre
d'adresse interne à C9 (ou dans un autre onglet), ajoutez `/toto` à la
fin de l'URL, l'onglet devrait maintenant afficher *« Hello
toto »*. N'hésitez pas à étudier le code de `exmple.php` et
`exemple.twig` pour en comprendre le fonctionnement.


## Le réflecteur

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
~~~

1. En suivant le modèle du premier gestionnaire de `exemple.php` (URL
   `/`), créez un gestionnaire pour l'URL `/query_string` qui affiche
   le texte
   
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
   
   un couple clé-valeur par ligne.
   
   **Note :** Il est inapproprié d'utiliser la fonction `echo` dans
   Silex, et un gestionnaire doit exécuter **exactement** un
   `return`. On rappelle que l'opérateur de concaténation en PHP est
   le point (`.`).

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
   dans la barre d'adresse, comme par exemple
   
   ~~~
   http://...c9.io/reflector.php/query_string?user=toto&pwd=12345
   ~~~
   {:.http}

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

4. Dans un autre fichier, créez un formulaire HTML qui envoie ses
   donnée à l'URL `/query_string` (attribut `action`) par la méthode
   *get* (attribut `method`). Testez le réflecteur à travers le
   formulaire ; testez notamment les caractères spéciaux, tels les
   espaces, les ampersands (`&`), etc.
   
5. Reprenez le formulaire du point précédent, en envoyant les données
   dans le corps d'une requête de type POST (`method="POST"`).
   
   Au lieu de transiter par le *query string*, les données passent
   maintenant directement dans le corps de la requête. Ces données
   sont analysées par Silex et insérées dans le tableau
   `$requete->request`. Quant au corps brut de la requête, il est
   accessible via la méthode `$requete->getContent()`.
   
   Créez un nouveau gestionnaire pour des requêtes de type POST à
   l'URL `/form_data`.

   **Rappel :** pour créer un gestionnaire de type POST en Silex, on
   utilise `$app->post()` à la place de `$app->get()`.
   
   Faites en sorte qu'il affiche le corps de la requête, un couple
   clé-valeur par ligne. Faites-lui afficher aussi la requête
   brute. Testez avec le formulaire du point précédent. Comparez les
   affichages avec l'onglet *« Réseau »* des *dev tools* de Chrome ou
   Firefox.

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

---
layout: tutorial
title: HTML, CSS et formulaires
---

## L'IDE Cloud9

Dans ce cours nous allons utiliser un environnement de développement
(IDE) *dans le cloud*. Même si ce TD pourrait être développé
entièrement en local (il suffit d'un browser et d'un éditeur de
texte), nous allons en profiter pour nous familiariser d'avance avec
Cloud9, notre IDE.

**Important :** vous devez avoir un **browser récent** pour pouvoir
utiliser Cloud9, de préférence la **dernière version** de Firefox,
Chrome ou Safari (par exemple, la version de Firefox des cartables
numériques n'est pas assez récente, mais Chrome convient). Contrôlez
votre version avant de commencer.

Dirigez votre browser sur <http://c9.io/>, créez un compte si ce n'est
pas déjà fait, et connectez-vous à votre espace personnel. Si vous
possédez déjà un compte [GitHub](http://github.com/) ou
[Bitbucket](http://bitbucket.org), il est possible de l'utiliser pour
une identification sur C9 sans besoin de créer de nouveau compte ;
ceci a l'avantage ajouté de vous permettre d'importer vos projets
GitHub et Bitbucket en un seul click.

Votre compte contient un projet nommé `demo-project`, ouvrez-le avec
un click. Après un peu de temps de chargement, vous êtes dans un IDE
comme Eclipse ou Netbeans : navigation des fichiers à gauche, éditeur
de fichiers au milieu, et (mieux que Eclipse ou Netbeans !) terminal
Linux en bas.

1. Commencez par créer un nouveau fichier HTML dans la racine du
   projet.

## HTML

Partez de ce squelette

~~~
<!DOCTYPE html>
<html>
  <head>
    <title>TD 1</title>
    <meta charset="utf-8" />
  </head>
  <body>
    <!-- Votre contenu ici -->
  </body>
</html>
~~~
	
1. Éditez le fichier. Ajoutez une entête et quelques paragraphes.

3. Visualisez le résultat dans le browser.
   
   Puisqu'il s'agit d'un projet public, tout le contenu est disponible
   *statiquement* à l'URL
   
   > <https://preview.c9.io/[nom-d'utilisateur]/demo-project/>
   
   (remplacez votre nom d'utilisateur dans l'URL), et les pages HTML
   sont servies comme telles. Il vous suffit de naviguer vers la page
   que vous venez de créer pour voir le résultat.
   
   Vous pouvez obtenir le même résultat, directement dans l'IDE, avec
   le bouton *Preview* → *Live preview file* (l'URL ouvert correspond
   au fichier couramment ouvert dans l'éditeur).

4. Transformez ce fichier en votre CV. **On va se désintéresser de
   l'élégance et du style pour l'instant**.  Aidez vous avec la
   [référence de w3schools](http://www.w3schools.com/tags/default.asp)
   pour l'utilisation des balises.
   
   - Éditez la balise `<title>`.
   
   - Donnez une entête à la page (`<h1>`).
   
   - Créez deux sections (`<section>`) : une pour vos données
     personnélles et une pour tout le reste. Donnez un `id` à chaque
     section.
   
   - Dans la première section :
	 
	 - Mettez une entête (`<h2>`) ;
	 - Avec une liste à puces (`<ul>`), ou une liste de définitions
       (`<dl>`), listez vos données personnelles ;
	 - Ajoutez une photo de vous (l'attribut `alt` est obligatoire
       pour la balise `<img>`), dans une balise `<figure>`.

   - Dans la seconde section :
	 
	 - Créez les sous-sections suivantes : *Études*, *Diplômes*,
       *Hobbies*, chacune dans une balise `<article>`, avec son propre
       `id` ;
	 - Démarrez chaque sous-section par un titre (balise `<h2>`) ;
	 - Remplissez chaque sous-section avec des entêtes (`<h3>`, etc.),
       des paragraphes (`<p>`), des listes (`<ul>`, `<ol>`, `<dl>`),
       des liens (`<a>`), etc.
	 - Dans la sous-section *Diplômes*, utilisez un tableau
       (`<table>`, `<tr>`, `<td>`) ;
	 - En haut de cette section, ajoutez une zone de navigation
       (`<nav>`), contenant une liste (`<ul>`) de liens (`<a>`) vers
       les sous-sections. Souvenez-vous que vous pouvez *linker*
       n'importe quel élément d'un document HTML avec l'URL `#id` (où
       `id` est l'identifiant de la balise).

	**Important :** évitez les balises de mise en forme, dépréciez
	(par ex.: `<font>`, `<center>`, ...) ou hors place (par ex.:
	`<h*>` pour faire autre chose que des titres, `<br>` pour faire
	des listes, `<table>` pour faire de la mise en page, ...)

5. Validez votre document avec le validateur de W3C:
   <http://validator.w3.org/>. Corrigez vos erreurs jusqu'à ne plus en
   avoir.


## CSS

Créez maintenant un fichier CSS et liez-le à votre CV avec la balise
`<link>`. En vous aidant avec la
[référence CSS de W3Schools](http://www.w3schools.com/css/),
modifiez l'apparence de votre page comme suit :

1. Délimitez les entêtes des sous-sections par une ligne horizontale
   (propriété `border`). Ajoutez du `padding` et du `margin` à votre
   goût.

2. Centrez les titres des sous-sections, modifiez la taille de la
   police.

3. Bougez votre photo à droite de la page (voir le
   [positionnement](http://www.w3schools.com/css/css_positioning.asp)).

4. Faites disparaître les ronds/carrés/autres à gauche des listes de
   la zone de navigation (voir les
   [listes](http://www.w3schools.com/css/css_list.asp)).

5. Les liens de la zone de navigation doivent être en noir, et devenir
   rouges lorsque la souris passe dessus (voir les pseudoclasses
   `:link`, `:hover`, `:active`, `:visited`).

6. Les liens de la zone de navigation doivent s'afficher à la suite
   sur la même ligne (propriété `display`, entre autres).

7. En ajoutant des attributs `class` dans le document HTML, faites en
   sorte que les lignes impaires du tableau de diplômes aient un fond
   différent des lignes paires. Allez voir, ensuite, la pseudo-classe
   [`:nth-child`](http://www.w3schools.com/cssref/sel_nth-child.asp).

8. Faites en sorte que les `<h2>` contenus dans les `<article>` soient
   écrits plus petit que les autres `<h2>`.

9. Faites en sorte que les `<h2>` contenus dans les `<article>` aient
   la première lettre plus grande (pseudo-élément `:first-letter`).

10. Ouvrez maintenant la page dans Chrome ou Firefox, lancez les
*Outils du développeur* (`F12`) et sélectionnez l'onglet *Éléments*
(Chrome) ou *Inspecteur* (Firefox). Sélectionnez une balise `<h2>` et
observez les informations sur son style qui s'affichent à droite. Dans
l'éditeur de style qui s'ouvre sur la droite, éditez quelques
propriétés et ajoutez des nouvelles propriétés dans le groupe
`element.style` (Chrome) ou `element` (Firefox). Bien évidemment, ces
modifications ne seront pas sauvegardées dans la page, et elles ne
survivront pas à un rechargement.

11. Validez le CSS de votre document avec le validateur du W3C :
    <http://jigsaw.w3.org/css-validator/>. Corrigez vos erreurs
    jusqu'à ne plus en avoir.


## Formulaires

On va ajouter un formulaire de recherche très simpliste, s'appuyant
sur Google. L'URL utilisée par la recherche Google varie selon
l'interface, mais une URL standard aura à peu près cette forme

~~~
https://www.google.com/search?q=ma+recherche&hl=fr
~~~

Le point d'interrogation `?` sépare l'adresse de la page de ses
paramètres. Suivent des paires `nom=valeur` séparées par des
*amperdand* `&`. Deux paires nom-valeur importantes pour google sont
`q` (le contenu de la recherche) et `hl` (la langue de l'interface) ;
il y en a plein d'autres.

Les formulaires HTML permettent d'envoyer des requêtes contenant des
paramètres vers d'autres pages. Ces paramètres sont envoyés soit dans
l'URL d'une requête HTTP de type GET, comme c'est le cas pour Google ;
soit dans le corps d'une requête de type POST.

1. Ajoutez un formulaire (balise `<form>`) à votre page, avec les
   attributs `method="GET"` et `action="https://www.google.com/search"`.

2. Dans le formulaire, ajoutez un champ de texte et un bouton de type
   submit (balise `<input>` dans les deux cas), comme ceci
   
   <input type="text"><input type="submit" value="Chercher">

   Le champ de texte doit avoir l'attribut `name="q"`. Le texte
   affiché par le bouton peut être contrôlé avec l'attribut `value`.

3. Ouvrez la page dans un onglet du browser (la *Preview* ne marchera
   pas) et faites une recherche. Observez comment l'URL varie quand
   vous changez le contenu du champ de texte.

4. Ouvrez à nouveau la page avec Chrome ou Firefox, lancez les *outils
   du développeur* (`F12`) et sélectionnez l'onglet *Network*. Lancez
   une recherche et étudiez le type de requête envoyé par le
   browser. Vous remarquerez que la requête originale (la première) a
   donné lieu à beaucoup d'autres requêtes.

5. Maintenant utilisez `method="POST"` dans la balise `<form>` et
   faites à nouveau une recherche. À part le fait que Google refuse la
   requête, quelles différences constatez-vous dans les *outils du
   développeur* ?

6. Revenez à la méthode GET. Ajoutez l'attribut `required` au champ
   de texte et essayez de faire une recherche vide. Que
   constatez-vous ?

6. Ajoutez un attribut `placeholder` au champs de texte.

6. Avec l'attribut `pattern`, restreignez le champ de texte aux
   seules recherches contenant les mots HTML ou CSS (c'est l'occasion
   d'apprendre les
   [RegExp](http://www.w3schools.com/js/js_obj_regexp.asp), si vous ne
   savez pas encore vous en servir).

6. La recherche Google peut accepter plusieurs champs nommés `q` : ils
   seront concaténés dans la recherche. Ajoutez un deuxième champs de
   texte au formulaire, pré-rempli avec le texte `site:w3schools.com`
   (utilisez l'attribut `value`).

7. Changez ce dernier champs de `type="text"` à `type="hidden"`. Faites
   une nouvelle recherche. Que constatez-vous ?

8. Ajoutez quelques *checkbox* permettant d'ajouter des termes à la
   recherche, comme ceci (il est important d'utiliser l'attribut
   `value`)
   
   <input type="checkbox">Pomme<br>
   <input type="checkbox">Poire<br>
   <input type="checkbox">Banane

9. Ajoutez des *boutons radio* pour choisir la langue de l'interface
   (`hl=en` ou `hl=fr`), comme ceci
   
   <input type="radio" name="hl">Français<br>
   <input type="radio" name="hl">Anglais

10. Ajoutez plus de choix pour la recherche dans un menu déroulant
    (balises `<select>` et `<option>`), comme ceci
	
	<select>
	  <option>Mangue</option>
	  <option>Fraise</option>
	  <option>Melon</option>
	</select>

...et n'oubliez pas de valider, bien sûr !

---
title: HTML, CSS et formulaires
---

## L'IDE Glitch

Dans ce cours nous allons utiliser un environnement de développement
(IDE) *dans le cloud*. Même si ce TD pourrait être développé
entièrement en local (il suffit d'un browser et d'un éditeur de
texte), nous allons en profiter pour nous familiariser d'avance avec
Glitch, notre IDE.

**Important :** vous devez avoir un **navigateur récent** pour pouvoir
utiliser Glitch, de préférence la **dernière version** de Firefox,
Chrome ou Safari. Contrôlez votre version avant de commencer.

Dirigez votre browser sur <https://glitch.com/>, créez un compte si ce
n'est pas déjà fait, et connectez-vous à votre espace personnel. Si
vous possédez déjà un compte [GitHub](https://github.com/), vous
pourrez importer et exporter vos projets vers celui-ci.

Pour votre premier projet, *rémixez*
<https://glitch.com/~defeo-lu-aws-get-started> en cliquant sur le
bouton "Remix". Vous pouvez également créer un nouveau projet: cliquez
sur *"Start a new project"*, puis *"Create a website"*.

## HTML

1. Ouvrez le fichier `index.html`, ou, si votre projet n'en contient
   pas, créez-en un avec ce squelette:

   ~~~
   <!DOCTYPE html>
   <html>
	 <head>
	   <meta charset="utf-8" />
	   <title>TD 1</title>
	 </head>
	 <body>
	   <!-- Votre contenu ici -->
	 </body>
   </html>
   ~~~
	
1. Éditez le fichier. Ajoutez un titre (`<h1>`) et quelques paragraphes.

3. Visualisez le résultat dans le navigateur.
   
   Puisqu'il s'agit d'un projet public, tout le contenu est disponible
   *statiquement* à l'URL
   
   > [https://[nom-du-projet].glitch.me/](about:invalid)
   
   (remplacez le nom du projet dans l'URL), et les pages HTML
   sont servies comme telles.  Pour ouvrir ce lien dans un nouvel
   onglet, cliquez sur le bouton *"Show"*.

4. Transformez ce fichier en votre CV. **On va se désintéresser de
   l'élégance et du style pour l'instant**.  Aidez vous avec la
   [référence de w3schools](https://www.w3schools.com/tags/default.asp)
   pour l'utilisation des balises.
   
   - Éditez la balise `<title>`.
   
   - Donnez une titre à la page (`<h1>`).
   
   - Créez deux sections (`<section>`) : une pour vos données
     personnélles et une pour tout le reste. Donnez un `id` à chaque
     section.
   
   - Dans la première section :
	 
	 - Mettez un titre (`<h2>`) ;
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

	**Important :** évitez les balises de mise en forme, dépréciées
	(par ex.: `<font>`, `<center>`, ...), ou hors place (par ex.:
	`<h*>` pour faire autre chose que des titres, `<br>` pour faire
	des listes, `<table>` pour faire de la mise en page, ...)

5. Validez votre document avec le validateur de W3C:
   <https://validator.w3.org/>. Corrigez vos erreurs jusqu'à ne plus en
   avoir.


## CSS

Créez maintenant un fichier CSS et liez-le à votre CV avec la balise
`<link>`. En vous aidant avec la
[référence CSS de W3Schools](https://www.w3schools.com/css/),
modifiez l'apparence de votre page comme suit :

1. Délimitez les entêtes des sous-sections par une ligne horizontale
   (propriété `border`). Ajoutez du `padding` et du `margin` à votre
   goût.

2. Centrez les titres des sous-sections, modifiez la taille de la
   police.

3. Bougez votre photo à droite de la page (voir le
   [positionnement](https://www.w3schools.com/css/css_positioning.asp)).

4. Faites disparaître les ronds/carrés/autres à gauche des listes de
   la zone de navigation (voir les
   [listes](https://www.w3schools.com/css/css_list.asp)).

5. Les liens de la zone de navigation doivent être en noir, et devenir
   rouges lorsque la souris passe dessus (voir les pseudoclasses
   `:link`, `:hover`, `:active`, `:visited`).

6. Les liens de la zone de navigation doivent s'afficher à la suite
   sur la même ligne (propriété `display`, entre autres).

7. En ajoutant des attributs `class` dans le document HTML, faites en
   sorte que les lignes impaires du tableau de diplômes aient un fond
   différent des lignes paires. Allez voir, ensuite, la pseudo-classe
   [`:nth-child`](https://www.w3schools.com/cssref/sel_nth-child.asp).

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
    <https://jigsaw.w3.org/css-validator/>. Corrigez vos erreurs
    jusqu'à ne plus en avoir.


## Formulaires

On va ajouter un formulaire de recherche très simpliste, s'appuyant
sur Google. L'URL utilisée par la recherche Google varie selon
l'interface, mais une URL standard aura à peu près cette forme

~~~
https://www.google.fr/search?q=ma+recherche&hl=fr
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
   attributs `method="GET"` et `action="https://www.google.fr/search"`.

2. Dans le formulaire, ajoutez un champ de texte et un bouton de type
   submit (balise `<input>` dans les deux cas), comme ceci
   
   <input type="text"><input type="submit" value="Chercher">

   Le champ de texte doit avoir l'attribut `name="q"`. Le texte
   affiché par le bouton peut être contrôlé avec l'attribut `value`.

3. Ouvrez la page dans un onglet du navigateur (la *Preview* ne marchera
   pas) et faites une recherche. Observez comment l'URL varie quand
   vous changez le contenu du champ de texte.

4. Ouvrez à nouveau la page avec Chrome ou Firefox, lancez les *outils
   du développeur* (`F12`) et sélectionnez l'onglet *Network*. Lancez
   une recherche et étudiez le type de requête envoyé par le
   navigateur. Vous remarquerez que la requête originale (la première) a
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
   [RegExp](https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions), si vous ne
   savez pas encore vous en servir).

6. Pré-remplissez le champs `q` avec le texte `site:w3schools.com`
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

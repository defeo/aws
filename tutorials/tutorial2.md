---
layout: tutorial
title: JavaScript et le DOM
---

Dans ce TD nous allons créer une interface pour jouer à
[Puissance 4](http://fr.wikipedia.org/wiki/Puissance_4). JavaScript et
quelques composants basiques de CSS3 seront suffisants à créer une
interface agréable et parfaitement fonctionnelle.

Puisque ce TD constitue une partie du projet sur lequel vous êtes
évalués, il sera opportun de créer un nouvel espace de travail dans
Cloud9 (si vous avez épuise le nombre d'espaces publiques à votre
disposition, vous pouvez en effacer des anciens, par exemple
`demo-project`).

Le seules références nécessaires pour ce TD sont

- Le [cours](../classes/class2),
- Mozilla Developer Network :
  <https://developer.mozilla.org/fr/docs/CSS>,
  <https://developer.mozilla.org/fr/docs/JavaScript>,
- W3Schools : <http://www.w3schools.com/>.

Le site de questions/réponses
[StackOverflow](http://stackoverflow.com/) est à utiliser avec
précaution. Toutes les autres références sont dangereuses, et risquent
de vous pénaliser si elles ne sont pas utilisées à bon escient.


## Le plateau en pur CSS3

Pour simplicité, nous allons commencer avec un plateau réduit, de
taille 2×3. 

1. Créez un document HTML5 valide contenant un `<div>` contenant
   tableau (`<table>`) de 3 lignes sur 2 colonnes, avec toutes les
   cases vides. Donnez un identifiant unique au `<div>`.

2. Liez une feuille de style à votre document HTML. Donnez une largeur
   (`width`) et une hauteur (`height`) fixes aux cases du tableau. En
   utilisant la propriété `border`, donnez des bordures bleues aux
   cases du tableau.
   
   Maintenant vous avez une grille presque jolie, mais carrée. À
   l'aide de la propriété `border-radius` faites en sorte que les
   cases deviennent des ronds, comme cela
   
   <div style="margin:auto;width:2em;height:2em;border-radius:2em;border:solid 0.2em blue"></div>
   
   Il reste une dernière touche de classe à donner : remplir les
   espaces blancs entre les cases. Pour cela, servez-vous
   judicieusement de `background-color` sur les différents éléments du
   tableau, pour obtenir un résultat comme cela
   
   <div style="background-color:blue;width:2.4em;margin:auto">
   <div style="background-color:white;width:2em;height:2em;border-radius:2em;border:solid 0.2em blue">
   </div></div>

3. Il est temps de jouer. Ajoutez des classes `joueur1` et `joueur2`
   sur les cases du tableau. Les cases seront remplies avec un jeton
   rouge ou jaune selon si elles appartiennent à l'une ou l'autre
   classe (utiliser à nouveau `background-color`).


## Unobtrusive JavaScript

On est maintenant prêts à écrire la vraie application interactive. On
pourrait faire un tableau 6×7 directement dans le code HTML, comme
dans la partie précédente, mais nous sommes trop paresseux pour taper
tous ces `<td></td>` à la main. À la place, nous allons générer
dynamiquement les éléments du tableau avec JavaScript. Ceci aura
plusieurs avantages, la possibilité de modifier facilement la taille
du tableau n'étant pas le dernier.

En faisant cela nous allons nous conformer à un principe très
populaire dans le développement web moderne : celui du
[*Unobtrusive JavaScript*](http://en.wikipedia.org/wiki/Unobtrusive_JavaScript)
(JavaScript discret). Ce paradigme dit que la page HTML doit pouvoir
marcher même en l'absence de JavaScript, les éléments dynamiques étant
ajoutés seulement une fois que le JavaScript est chargé.

En l'occurrence, vu que notre page ne contient qu'un jeu interactif,
il faudra se limiter à afficher un message d'erreur lorsque JavaScript
n'est pas chargé.

1. Effacez le `<table>` du document HTML. Remplacez le `<div>` par un
   simple
   
	   <div id="...">Activez JavaScript pour jouer.</div>
   
   (mettez l'identifiant que vous avez choisi auparavant à la place
   des `...`).
   
2. Liez un fichier JavaScript à la page HTML. Pour éviter les
   problèmes de chargement du DOM, mettez la balise `<script>` après
   le `<div>`, vers la fin du `<body>`.

3. Dans le JavaScript récupérez l'élément correspondant au `<div>`
   grâce à `document.querySelector`. En vous servant de
   
   - `document.createElement` pour créer des nouveaux nœuds,
   - la propriété `.innerHTML` et/ou la méthode `.appendChild` pour ajouter des nœuds au DOM,
   - deux boucles `for` imbriquées,
   
   remplacez le texte du div par un tableau 6×7. Pour une majeure
   flexibilité, vous pouvez faire en sorte que 6 et 7 soient des
   constantes stockées dans des variables JavaScript.

4. Il serait pénible d'utiliser l'API du DOM pour parcourir le plateau
   à chaque fois que l'on veut modifier la partie ou en vérifier une
   propriété. Il est plus pratique d'avoir un tableau JavaScript à
   deux dimensions qui pointe vers les cases (les `<td>`) du
   plateau. Modifiez la double boucle `for` de sorte à remplir un
   tableau à deux dimensions avec des pointeurs vers les
   `HTMLTdElement` correspondants aux cases du plateau.

5. Écrivez une fonction `set(row, column, player)` qui prend en entrée
   des numéros de ligne et de colonne et un code représentant le
   joueur 1 ou 2, et qui place un jeton de la couleur correspondante
   dans la case désignée. On vous rappelle que pour attribuer un
   élément du DOM à la classe `joueur1` il suffit d'utiliser
   l'attribut `.className`. Par exemple
   
	   var elt = document.querySelector('#mon-element');
	   elt.className = 'joueur1';
   
   Testez votre fonction à travers la console.

6. Ajoutez une variable `turn` qui indique à qui est le tour de jouer,
   initialisée au joueur 1 (adoptez la même convention que vous avez
   utilisée pour le paramètre `player`).

7. Écrivez une fonction `play(column)` qui

   - prend en entrée un numéro de colonne,
   - cherche la première ligne libre en partant du bas (s'il y en a),
   - y joue un pion de la couleur indiquée par la variable `turn`,
   - passe le tour en changeant la valeur de `turn`.
   
   Testez votre fonction à travers la console.


## Gestion des évènements

Il est maintenant temps de répondre aux clics de l'utilisateur.

## Dernières touches

Un jeu n'est pas tel s'il n'y a pas de gagnant.

1. Écrivez une fonction qui teste si un coup est gagnant (4 pions de
   la même couleur alignés verticalement, horizontalement ou
   diagonalement). Remarquez qu'il suffit de tester quatre directions
   autour de la dernière case jouée, et de s'éloigner d'au plus 3
   cases en chaque direction.

2. Modifiez votre application pur qu'à chaque nouveau coup elle teste
   s'il s'agit d'un coup gagnant, ou à défaut si le plateau a été
   complètement rempli (il s'agit d'une égalité dans ce cas). Lorsque
   la partie est terminée, l'interface affiche le gagnant. Cliquer à
   nouveau sur le plateau démarre alors une nouvelle partie.

3. En utilisant la propriété CSS `animation` (attention
   `-webkit-animation` pour Chrome), faites *flasher* l'alignement de
   4 pions gagnant. Vous pouvez consulter ce
   [guide aux animations CSS.](https://developer.mozilla.org/fr/docs/CSS/Animations_CSS)

4. Encapsulez votre code dans un objet JavaScript, de sorte à pouvoir
   avoir plusieurs plateaux dans la même page.


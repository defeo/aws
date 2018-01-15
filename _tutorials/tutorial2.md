---
title: Un simple jeu en JavaScript
---

Dans ce TD nous allons créer une interface pour jouer à
[Puissance 4](https://fr.wikipedia.org/wiki/Puissance_4). JavaScript et
quelques composants basiques de CSS3 seront suffisants pour créer une
interface agréable et parfaitement fonctionnelle.

Pour ce TD, on fera référence

{% assign lessons = site.collections | where:'label','lessons' | first %}
- Aux leçons {% include link.html collection=lessons href="CSS.md" %},
  {% include link.html collection=lessons href="javascript.md" %},
  {% include link.html collection=lessons href="dom.md" %}.
- Au Mozilla Developer Network :
  - <https://developer.mozilla.org/docs/CSS>,
  - <https://developer.mozilla.org/docs/JavaScript>.
- Aux tutoriels de W3Schools : <https://www.w3schools.com/>.
- Aux CodePens du prof : <https://codepen.io/collection/AaMOJZ/>.

On consultera enfin le livre
[Eloquent JavaScript](https://eloquentjavascript.net/) pour une
référence plus détaillée.

Le site de questions/réponses
[StackOverflow](https://stackoverflow.com/) est à utiliser avec
précaution. Toutes les autres références risquent de vous induire en
erreur avec des exemples datés, non standard, ou non
idiomatiques. Appliquez du jugement.

Pour ce TD, créez un nouveau projet dans Glitch.

## Le plateau en pur CSS3

Pour simplicité, nous allons commencer avec un plateau réduit, de
taille 3×2.

1. Créez un document HTML5 valide contenant un `<div>`, contenant un
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
pourrait créer un tableau 6×7 directement dans le code HTML, comme
dans la partie précédente, mais nous sommes trop paresseux pour taper
tous ces `<td></td>` à la main. À la place, nous allons générer
dynamiquement les éléments du tableau avec JavaScript. Ceci aura
plusieurs avantages, la possibilité de modifier facilement la taille
du tableau n'étant pas le dernier.

En faisant cela nous allons nous conformer à un principe très
populaire dans le développement web moderne : celui du
[*Unobtrusive JavaScript*](https://en.wikipedia.org/wiki/Unobtrusive_JavaScript)
(JavaScript discret). Ce paradigme dit que la page HTML doit pouvoir
marcher même en l'absence de JavaScript, les éléments dynamiques étant
ajoutés seulement une fois que le JavaScript est chargé.

En l'occurrence, vu que notre page ne contient qu'un jeu interactif,
il faudra se limiter à afficher un message d'erreur lorsque JavaScript
n'est pas chargé.

1. Effacez le `<table>` du document HTML. Remplacez le `<div>` par un
   simple
   
   ~~~html
   <div id="...">Activez JavaScript pour jouer.</div>
   ~~~
   
   (mettez l'identifiant que vous avez choisi auparavant à la place
   des `...`).
   
2. Liez un fichier JavaScript à la page HTML. Pour éviter les
   problèmes de chargement du DOM, mettez la balise `<script>` après
   le `<div>`, vers la fin du `<body>`, comme ceci :
   
   ~~~html
   <body>
	   <div id="...">Activez JavaScript pour jouer.</div>
	   
	   <script src="..."></script>
   </body>
   ~~~
   
   Faites un affichage de contrôle avec `console.log` dans le
   JavaScript, et testez avec la console (`Shift+Ctrl+K` sous Firefox,
   `F12` sous Chrome) que votre script est bien chargé.

3. Dans le JavaScript récupérez l'élément correspondant au `<div>`
   grâce à `document.querySelector`. En vous servant de
   
   - `document.createElement` pour créer des nouveaux nœuds,
   - la méthode `.appendChild` pour ajouter des nœuds au DOM,
   - deux boucles `for` imbriquées,
   
   remplacez le texte du div par un tableau 6×7.  Pour une majeure
   flexibilité, vous pouvez faire en sorte que 6 et 7 soient des
   constantes stockées dans des variables JavaScript. Vous pouvez vous
   inspirer de l'exemple ci-dessous.
   
   {% include codepen.md pen="xbYawz" tab="js" height="250" %}

4. Il serait pénible d'utiliser l'API du DOM pour parcourir le plateau
   à chaque fois que l'on veut modifier la partie ou en vérifier une
   propriété. Il est plus pratique d'avoir un tableau JavaScript à
   deux dimensions qui pointe vers les cases (les `<td>`) du
   plateau. Modifiez la double boucle `for` de sorte à remplir un
   tableau à deux dimensions avec les 
   balises `td` du plateau. Cet exemple pourrait vous aider.
   
   {% include codepen.md pen="myXGeZ" tab="js" height="250" %}

5. Écrivez une fonction `set(row, column, player)` qui prend en entrée
   des numéros de ligne et de colonne et un code représentant le
   joueur 1 ou 2, et qui place un jeton de la couleur correspondante
   dans la case désignée. On vous rappelle que pour attribuer un
   élément du DOM à la classe `joueur1` il suffit d'utiliser
   l'attribut `.className`. Par exemple
   
   ```js
   var elt = document.querySelector('#mon-element');
   elt.className = 'joueur1';
   ```
   
   Testez votre fonction à l'aide de la console.

6. Ajoutez une variable `turn` qui indique à qui est le tour de jouer,
   initialisée au joueur 1 (adoptez la même convention que vous avez
   utilisée pour le paramètre `player`).

7. Écrivez une fonction `play(column)` qui

   - prend en entrée un numéro de colonne,
   - cherche la première ligne libre en partant du bas (s'il y en a),
   - y joue un pion de la couleur indiquée par la variable `turn`,
   - passe le tour en changeant la valeur de `turn`.
   
   Testez votre fonction à l'aide de la console.


## Gestion des évènements

Il est maintenant temps de répondre aux clics. On veut que, lorsque
l'utilisateur clique dans une colonne (peu importe la ligne), la
fonction `play` soit appelée sur cette colonne.

On pourrait définir un gestionnaire d'évènements par `<td>`, mais ce
ne serait ni élégant, ni efficace : 42 gestionnaires d'évènements,
c'est très lourd, surtout pour un navigateur mobile... Nous allons
plutôt définir un unique gestionnaire pour tout le plateau, et
utiliser l'objet de type `Event` pour savoir quelle case a généré
l'évènement. Il est ici crucial de comprendre la différence entre la
propriété `.target` et la propriété `.currentTarget` vues dans la
[leçon sur le DOM](../lessons/dom#lobjet-evenement). Étudiez aussi
l'exemple ci-dessous.

{% include codepen.md pen="WbMgrx" tab="js" height="350" %}

Mais comment faire pour savoir à quelle colonne appartient un `<td>`
donné ? Parmi les nombreuses solutions à notre disposition (on
pourrait, par exemple, naviguer le DOM pour compter combien `<td>`
sœurs existent à gauche), l'API *data attributes* de HTML5 nous offre
la plus élégante.

1. Par la méthode `.addEventListener()`, définissez un gestionnaire
   pour l'évènement `click` sur le plateau (sur la balise `<table>`,
   par exemple). Pour l'instant, contentez vous de faire un
   
   ```js
   console.log(event.target)
   ```
   
   dans le gestionnaire (`event` étant l'objet évènement passé au
   gestionnaire). Testez votre gestionnaire à l'aide de la console.

2. Modifiez votre double boucle `for` en sorte que les balises `<td>`
   contiennent un attribut `data-column` égal à la colonne dans
   laquelle la balise se trouve. Les attributs `data-*` ont une API
   dédiée en Javascript: tous les objets du DOM ont un champ `dataset`
   qui permet d'accéder en lecture et en écriture aux attributs
   `data-*`. Par exemple, si `ma_case` représente une balise `<td>`,
   le code suivant
   
   ~~~js
   // exemple utilisant dataset
   ma_ligne.appendChild(ma_case);
   ma_case.dataset.column = 0;
   ~~~
   
   insère une balise
   
   ~~~html
   <td data-column="0"></td>
   ~~~
   
   dans le document. **Attention**, toutes les propriétés de `dataset`
   sont automatiquement converties en chaînes de caractères par
   JavaScript.
   
   Modifiez le gestionnaire pour qu'il affiche dans la console la
   valeur de l'attribut `data-column`. Testez avec la console.

3. Modifiez votre gestionnaire pour qu'il réponde aux clics en jouant
   dans la colonne cliquée, ou bien en ne faisant rien lorsqu'on
   clique ailleurs (vous pouvez utiliser l'existence de la donnée
   `column` comme test pour savoir si on a bien cliqué sur une case).
   

## Touches finales (Optionnel)

Vous pouvez aborder les points suivants dans n'importe quel
ordre. Suivez vos goûts !

1. Écrivez une fonction qui teste si un coup est gagnant (4 pions de
   la même couleur alignés verticalement, horizontalement ou
   diagonalement). Remarquez qu'il suffit de tester quatre directions
   autour de la dernière case jouée, et de s'éloigner d'au plus 3
   cases en chaque direction. L'exemple ci-dessous peut vous servir
   d'inspiration.
   
   {% include codepen.md pen="QwQVyK" tab="js" height="300" %}

2. Modifiez votre application pour qu'à chaque nouveau coup elle teste
   s'il s'agit d'un coup gagnant, ou à défaut si le plateau a été
   complètement rempli (il s'agit d'une partie nulle dans ce
   cas). Lorsque la partie est terminée, l'interface affiche le
   gagnant. Cliquer à nouveau sur le plateau démarre alors une
   nouvelle partie.

3. En utilisant la propriété CSS `animation` (attention
   `-webkit-animation` pour Chrome), faites *flasher* l'alignement de
   4 pions gagnant. Vous pouvez consulter ce
   [guide aux animations CSS.](https://developer.mozilla.org/fr/docs/CSS/Animations_CSS)
   (aussi
   [en anglais](https://developer.mozilla.org/docs/CSS/CSS_Animations)).

4. Ajoutez des touches de style grâce à la propriété `box-shadow`.

4. Encapsulez votre code dans un objet JavaScript, de sorte à pouvoir
   avoir plusieurs plateaux dans la même page.

5. Testez votre application avec un téléphone portable et adaptez-la
   aux petits écrans. Si vous n'avez pas de smartphone, vous pouvez
   utiliser l'émulation de Chrome ou Firefox (`Shfit+Ctrl+M`).
   
   Il vous sera utile de consulter ce
   [guide au développement sur mobile](https://developer.mozilla.org/docs/Web/Guide/Mobile),
   et en particulier la partie sur
   [l'utilisation de la balise `viewport`](https://developer.mozilla.org/fr/docs/Mozilla/Mobile/Balise_meta_viewport)
   (en
   [anaglais](https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag))

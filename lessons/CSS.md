---
layout: lesson
title: CSS
subtitle: Cascading StyleSheets
---

<section>

## Le contenu et l'affichage

Les balises HTML renseignent sur la **signification** (la
**sémantique**) des données, pas sur la façon de les **présenter**.

Exemple : la balise controversée `<i>` (à l'origine, *italique*)

~~~
<i>Some text</i>
~~~

> *Some text*

Cependant, la spécification HTML5 dit :

> The i element now represents a span of text in an alternate voice or
  mood, or otherwise offset from the normal prose in a manner
  indicating a different quality of text, such as a taxonomic
  designation, a technical term, an idiomatic phrase from another
  language, a thought, or a ship name in Western texts.
{:.cite}

</section>
<section>

### Ne jamais faire d'assomptions sur l'affichage

Pensez à

- Browsers en mode texte ;
- Utilisateurs malvoyants;
- Utilisateurs qui lisent dans des langues étrangères (qui pourraient
  ne pas posséder un concept similaire à l'*italique*);
- Site tiers qui pourraient réutiliser votre contenu.

Donc, qui décide de l'affichage ?

Les **Feuilles de style**.
{:.centered}

</section>
<section class="compact">

## Cascading Style Sheets

CSS est un langage pour l'expression de directives d'affichage.

**Cascading** veut dire que plusieurs feuilles de style peuvent
s'appliquer à un document, le résultat est calculé d'après des règles
de precedence *en cascade*.
  
~~~
p.lead {
  font-weight: bold;
  font-family: "Gill Sans MT", GillSans, sans-serif;
  padding: 2pt;
}

p.lead:first-letter {
  font-size: 200%;
}

p.lead em {
  font-variant: small-caps;
  font-style: normal;
}
~~~

<style>
p.lead {
  font-weight: bold;
  font-family: "Gill Sans MT", "Gill Sans", GillSans, sans-serif;
  padding: 2pt;
}

p.lead:first-letter {
  font-size: 200%;
}

p.lead em {
  font-variant: small-caps;
  font-style: normal;
}
</style>

<p class="lead">Lorem ispsum <em>dolor sit</em> amet</p>

</section>
<section class="compact">

## La syntaxe CSS

**Règles CSS**

~~~
selector {property: value; property:value; ...}
~~~

**Commentaires**

~~~
/* Ceci est la seul façon de faire des commentaires en CSS
   (en effet, // n'introduit pas un commentaire)       */
~~~

**At-rules**

~~~
@import "unautrestyle.css";  /* Importe dans la feuille
                                courante */
@media screen;               /* S'applique seulement à un
                                affichage sur écran (par ex.,
								pas à l'impression) */
~~~

Référence actuelle: <http://www.w3.org/TR/2011/REC-CSS2-20110607/>

Le draft CSS3 est trop grand pour tenir en un seul module. Voir <http://www.w3.org/Style/CSS/>

</section>
<section class="compact">

## Sélecteurs CSS

**Sélecteurs simples (`tag` est toujours optionnel)**

~~~
tag {...}                /* Toute balise <tag>            */
tag.class {...}          /* Tout <tag> de classe class    */
#id {...}                /* La balise identifiée par id   */
tag:pseudoclass {...}    /* Sélection de contenu spécial  */
tag[att=val] {...}       /* Tout <tag> ayant attribut att
                            égal à val                    */
~~~
{:.css}

**Combinateurs de sélecteurs**

~~~
selector, selector {...} /* Chacun des selector                */
parent child {...}       /* child s'il est un fils de parent   */
parent > child {...}     /* child seulement s'il est un fils
                            direct de parent                   */
sister ~ brother {...}   /* brother seulement s'il suit sister */
sister + brother {...}   /* brother seulement s'il suit
                            immediatement sister               */
~~~

Référence complète: <http://www.w3.org/TR/CSS2/selector.html>

Draft CSS3: <http://www.w3.org/TR/2011/REC-css3-selectors-20110929>

</section>
<section class="compact">

## Où va le style ?

~~~
<html>
  <head>
    <!-- Ceci s'applique à tout le document -->
    <link rel='stylesheet' href='sheet.css' type='text/css' />
    <style>
      body {font-family: Arial;}
    </style>
  </head>
  <body>
    <div>
      <!-- Ceci s'applique seuelement dans ce div -->
      <style scoped>
        p {color:blue;}
      </style>
      <!-- Ceci s'applique seulement à ce paragraphe
           La syntaxe CSS y est limitée -->
      <p style="font-weight:bold">...</p>
    </div>
  </body>
</html>
~~~

</section>
<section>

## Le document et le style

~~~
<style>
  .lerouge {color:red;}
  div.lerouge {background-color:yellow;}
  #lenoir {color:black;}
  div p {font-style:italic;}
</style>
...
<p class="lerouge">Premier</p>
<div class="lerouge">
  <p id="lenoir">Deuxième</p>
  <p>Troisième</p>
</div>
~~~

<style scoped>
  .lerouge {color:red;}
  div.lerouge {background-color:yellow;}
  #lenoir {color:black;}
  /* I cheat to avoid HTML4 unscoped problems */
  div.lerouge p {font-style:italic;}
</style>
<p class="lerouge">Premier</p>
<div class="lerouge">
  <p id="lenoir">Deuxième</p>
  <p>Troisième</p>
</div>

</section>
<section>

## *Layout* (Mise en page)

### Problématique

- Distribuer le contenu dans la page.
- S'adapter à des modes d'affichage différents (écran, mobile,
  impression, ...).
- Permettre un certain degré de *non-linéarité*.

### Modèles de *layout*

- *Box model* (le plus ancien),

- *Positionnement absolu* (le petit frère du *box model*),

- *Flexbox* (le nouvel arrivant),

- *Grille* (encore dans les cartons...)

</section>
<section>

## Le *box model*

Il y a trois types de **boîtes** en CSS :

<div style="background-color: yellow">
**Bloc:** Un *bloc* est un rectangle. Il prend toute la largeur et
autant de hauteur que nécessaire.
</div>

**Inline:** <span style="background-color:yellow"> Les *inlines* se
comportent comme des lignes de texte, qui reviennent à la ligne
lorsqu'elles atteignent la marge. Elles prennent seulement l'espace
qu'elles occupent.</span>

<div style="display:inline-block;width:60%;background-color:yellow">
**Inline-block:** Les *inline blocks*, comme les blocs, ne reviennent
pas à la ligne.  Mais, comme les inline il peut y en avoir plusieurs
sur une même ligne, et ils ne prennent que l'espace qu'ils occupent.
</div>

<div style="display:inline-block;background-color:red;width:35%">

Je prends peu de place

</div>

</section>
<section>

## Le *inline*, le *block* et le truand

Il y a des règles sur quelles balises peuvent aller dans quelles
autres. Au vieux temps, il y avait deux catégories :

- Les blocs peuvent aller dans les blocs,
- Les inlines peuvent aller dans les inlines ou les blocs,
- Les blocs ne peuvent pas aller dans les inlines.

Depuis l'introduction de la propriété `display` en CSS, on peut
changer le type de boîte d'une balise ; et avec HTML5 les règles se
sont encore complexifiées.

- Blocs par défaut: **`<div>`**, `<hX>`, `<p>`, ...
- Inlines par défaut: **`<span>`**, `<a>`, `<em>`, `<img>`, texte simple, ...


</section>
<section>

## Le *flux*

### Flux normal

Dans le **flux normal**, les boîtes sont disposées du **haut vers le
bas** et de **gauche à droite** (mais le dernier peut être changé).

### Floats

Les boîtes peuvent sortir du flux en **flottant** :

- `float: left`
- `float: right`

Uniquement utile pour insérer des figures dans un texte.

</section>
<section>

## Positionnement absolu

En plus de la propriété `float`, les boîtes peuvent **sortir du flux**
en étant positionnées explicitement, grâce à la propriété CSS
`position`:

- `static` : Le flux par défaut.

- `absolute` : Positionnement en coordonnées X-Y par rapport au bloc
  conteneur.

- `fixed` :  Positionnement en coordonnées X-Y par rapport à l'écran.

- `relative` : Positionnement en coordonnées X-Y par rapport au point
  où l'élément se serait positionné normalement.

Les coordonnées de positionnement sont spécifiées par les propriétés
`left`, `right`, `top` et `bottom`.

</section>
<section>

## Flexbox

### Limitations du *box model*

- Centrer verticalement.
- Layout en colonnes (traditionnellement simulé avec `float`,
  `display`, `position`, dimensions fixes, etc., voire même avec
  `<table>`).
- Adaptation à la taille de l'écran.
- *Non-linéarité*.

### Flexbox

- Un modèle de boîtes *agnostique par rapport à la direction*.
- Basé sur un *conteneur* et ses *éléments*.
- Algorithmes de calcul de taille et espacement.
- *Non-linéaire*

</section>
<section>

## Les propriétés CSS de flexbox

#### Propriétés principales du *conteneur*

- `display: flex` déclare un *conteneur* flexible.
- `flex-flow: row nowrap` déclare la *direction* et le mode de retour
  à la ligne.

#### Propriétés principales des *éléments*

- `flex: 0 1 auto` déclare l'*élasticité* d'un *élément*.
- `order: 1` permet de réaliser un affichage *non-linéaire*.

#### Autres propriétés

- Conteneur : `flex-direction`, `flex-wrap`, `justify-content`,
  `align-items`, `align-content`.

- Éléments : `flex-grow`, `flex-shrink`, `flex-basis`, `align-self`.

</section>
<section>

## Utiliser des frameworks

- CSS est un standard géant.
- Les parties expérimentales sont en constante évolution.
- Assurer la compatibilité avec les vieux navigateurs est un
  cauchemar.
- Les problématiques de mise en page peuvent procurer des maux de
  tête.

Laissez faire cela aux experts : utilisez un *frontend framework*.

## Exemples

- Bootstrap <http://getbootstrap.com/> (Twitter)
- Pure CSS <http://purecss.io/> (Yahoo)
- ...

</section>
<section>

## Autres usages avancés de CSS

- Transformations 2D et 3D.
- Animations, transitions.
- Adaptation à la taille d'écran (*responsive layout*).
- Pagination.
- ...

## Références

- [Liste des propriétés CSS sur MDN](https://developer.mozilla.org/docs/Web/CSS/Reference).
- [Référence W3Schools](http://www.w3schools.com/cssref/default.asp) (en anglais).
- Le [validateur officiel de CSS](http://jigsaw.w3.org/css-validator/).

</section>

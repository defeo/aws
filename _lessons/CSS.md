---
layout: lesson
title: CSS
subtitle: Cascading StyleSheets
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/css.webm
    quizzes:
      - 58900075ba7ec5013560f763
---

<section>

## Le contenu et l'affichage

Les balises HTML renseignent sur la **signification** (la
**sémantique**) des données, pas sur la façon de les **présenter**.

Exemple : la balise controversée `<i>` (à l'origine, *italique*)

~~~html
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
  
~~~css
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
<section>

## La syntaxe CSS

**Règles CSS**

~~~css
selector {property: value; property: value; ...}
~~~

**Commentaires**

~~~css
/* Ceci est la seul façon de faire des commentaires en CSS
   (en effet, // n'introduit pas un commentaire)       */
~~~

**At-rules**

~~~css
@import "unautrestyle.css";  /* Importe dans la feuille courante */
@media screen;               /* S'applique seulement à un affichage
                                sur écran (par ex., pas à l'impression) */
~~~

Référence actuelle: <https://www.w3.org/TR/2011/REC-CSS2-20110607/>

Le draft CSS3 est trop grand pour tenir en un seul module. Voir <https://www.w3.org/Style/CSS/>

</section>
<section>

## Sélecteurs CSS

**Sélecteurs simples (`tag` est toujours optionnel)**

~~~css
tag {...}                /* Toute balise <tag>                       */
tag.class {...}          /* Tout <tag> de classe class               */
#id {...}                /* La balise identifiée par id              */
tag:pseudoclass {...}    /* Sélection de contenu spécial             */
tag[att=val] {...}       /* Tout <tag> ayant attribut att égal à val */
~~~
{:.css}

**Combinateurs de sélecteurs**

~~~css
selector, selector {...} /* Chacun des selector                     */
parent child {...}       /* child s'il est un fils de parent        */
parent > child {...}     /* child seulement s'il est un fils direct */
sister ~ brother {...}   /* brother seulement s'il suit sister      */
sister + brother {...}   /* brother seulement s'il suit
                            immediatement sister                    */
~~~

Référence complète: <https://www.w3.org/TR/CSS2/selector.html>

Draft CSS3: <https://www.w3.org/TR/2011/REC-css3-selectors-20110929>

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

~~~html
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

### Modèles de *layout* (voir les approfondissements)

- [*Box model*](boxmodel) (le plus ancien),

- [*Positionnement absolu*](boxmodel) (le petit frère du *box model*),

- [*Flexbox*](flexbox) (le nouvel arrivant),

- *Grille* (encore dans les cartons...)

</section>
<section>

## Autres usages avancés de CSS

- Transformations 2D et 3D.
- Animations, transitions.
- Adaptation à la taille d'écran (*responsive layout*).
- Pagination.
- ...

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

### Exemples

- Bootstrap <https://getbootstrap.com/> (Twitter)
- Pure CSS <https://purecss.io/> (Yahoo)
- ...

</section>
<section>

## Références

- [Liste des propriétés CSS sur MDN](https://developer.mozilla.org/docs/Web/CSS/Reference).
- [Référence W3Schools](https://www.w3schools.com/cssref/default.asp) (en anglais).
- Le [validateur officiel de CSS](https://jigsaw.w3.org/css-validator/).

</section>

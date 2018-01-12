---
layout: lesson
title: HTML
subtitle: HyperText Markup Language
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/html.webm
    quizzes:
      - 58900075ba7ec5013560f7a7
    playbackRate: 0.95
---

<section>

## Balises HTML

HTML est un *langage de balisage* (*markup language*), inspiré par
SGML, pour l'écriture de documents Hypertexte **lisibles par un
humain** (!!!)

~~~html
<tag>
  Mon contenu <tag>plus de contenu</tag>
</tag>
~~~

Les **Balises** (**tags**) délimitent du contenu textuel :

- À chaque balise ouvrante `<tag1>` correspond une balise fermante
  `</tag1>`.
- Une balise peut en contenir d'autres, proprement imbriquées.
- Toute balise ne peut pas aller dans toute autre.
- Certaines balises n'ont pas de contenu. Dans ce cas `<tag></tag>`
  peut être raccourci en `<tag/>`.

</section>
<section>

## Attributs

Les balises peuvent avoir des **attributs**, dans la balise ouvrante.

~~~html
<tag attribut1="valeur 1"
     attribut2='valeur 2'
     attribut3=valeur3>
  Contenu
</tag>
~~~

- Les valeurs des attributs sont contenues entre guillemets simples,
  doubles ou aucun guillemet ; dans ce dernier cas (à éviter)
  elles ne doivent pas contenir d'espace.
- Certains attributs sont obligatoires pour certains tags.

</section>
<section>

## Commentaires

Les commentaires sont écrits entre `<!--` et `-->`

~~~html
<!-- Ceci est un commentaire, ce sera ignoré -->
<tag>Ceci sera interprété par le browser</tag>
~~~

Bien évidemment, un commentaire **n'est pas une balise**, elle lui
ressemble juste un tout petit peu.

</section>
<section>

## La structure du document

Il y a un nombre limité de balises, l'utilisateur **ne peut pas** en inventer.

Tout document HTML **doit** avoir cette forme

~~~
<html>
  <head>
    <!--
	 Le head contient toutes les informations
     sur le document qui ne sont pas du contenu
     -->
    <title>Un titre</title>
  </head>
  <body>
    <!-- Le body contient le vrai Hypertexte -->
  </body>
</html>
~~~

</section>
<section>

## Ce qui va dans le `<head>`

Le `<head>` contient tout ce qui concerne le document, mais qui n'en
fait pas partie. Voici quelques unes de ses balises plus importantes.

`<title>`: Le titre du document. Obligatoire.

`<script>`: Code pour le scripting côté client (JavaScript, VBScript, etc.).

`<style`>: Directives d'affichage (CSS, etc.).

`<meta>`: Meta-informations sur le document (langue, encodage, etc.).

`<link>`: Documents reliés (flux de news, favicons, etc.)

`<base>`: Base pour la résolution des liens.

</section>
<section class="compact">

## Ce qui va dans le `<body>`

Le `<body>` contient le vrai contenu. Voici une petite
sélection de balises.

`<section>`, `<nav>`: Structure du document.

`<header>`, `<footer>`, `<aside>`, `<address>`: Structure d'une section.

`<p>`, `<h1>`, ..., `<h6>`: Un paragraphe de texte, un titre de
premier niveau, ..., un titre de sixième niveau.

`<a>`: Une *ancre*, c.-à-d. un lien vers d'autres contenus.

`<img>`, `<audio>`, `<video>`, `<object>`, `<svg>`: Inclusion de médias

`<form>`, `<input>`, ...: Interaction avec l'utilisateur.

`<table>`, `<tr>`, `<td>`, ...: Tableaux.

`<strong>`, `<em>`: Texte présente *différemment* (par ex., gras ou italique)

`<div>`, `<span>`: Balises avec aucune signification (importantes pour
faire le lien avec style et scripts).

Allez voir d'autres balises sur <https://www.w3schools.com/>.

</section>
<section>

## Attributs

Les attributs jouent plusieurs rôles. Voici les plus communs.

`id`: Assigne un identifiant à une balise. Doit être unique.

`class`: Assigne une balise à une **classe** (pour regroupement logique).

`src`: Indique où trouver les ressources externes.

`href`: HyperReference. Utilisé pour faire des liens aux ressources externes.

`style`: Pour ajouter des directives de style.

`title`: Donne plus d'informations sur une balise.

`onclick`, `onload`, `onmouseover`, ...: *Event hooks* pour les scripts.

`data-*`: Attributs définissables par les utilisateurs (depuis HTML5).

</section>
<section>

## Suivez les standards

En s'efforçant de rendre plus facile ou plus puissant la programmation
web, les développeurs des browsers ont introduit au fil du temps des
tonnes de balises et règles d'interprétation *non standard*.

Ceci a finalement amené à des **mauvaises pratiques** en programmation
web, et à des **incompatibilités**.

Le W3C essaye d'imposer les standards du Web, aussi à travers ses
outils de **validation**.

**Servez-vous en :**

- <https://validator.w3.org/>
- <https://jigsaw.w3.org/css-validator/>
- <https://validator.w3.org/mobile/>
- <https://validator.w3.org/checklink>

</section>
<section>

## Déclarer le langage

Il faut déclarer le langage et la variante dans laquelle vous écrivez
vos documents. Un document HTML5 proprement déclaré commence comme ceci
(façon préférée dans ce cours)

~~~
<!DOCTYPE html>
<html>
    <head>...</head>
    <body>...</body>
</html>
~~~

Ou comme ceci (avec l'encodage XHTML)

~~~
<html xmlns="https://www.w3.org/1999/xhtml">
    <head>...</head>
    <body>...</body>
</html>
~~~

</section>
<section>


## Attention à l'imbrication !

**Bien**

~~~html
<p>
  <strong>Gras <em>et même italique</em></strong>
</p>
~~~

**MAL!!!!!!!**

~~~html
<p>
  <strong>Gras <em>et même italique</strong></em>
</p>
~~~

~~~html
<p>
  <strong>Gras <em>et même italique</em></strong>
~~~

</section>
<section>

## Bonne pratique : déclarer l'encodage

Par exemple (préférez l'encodage Unicode)

~~~html
<head>
  <meta charset="utf-8" />
  ...
</head>
~~~

ou comme ceci (encore commun dans les versions françaises de Windows)

~~~html
<head>
  <meta charset="iso-8859-1" />
  ...
</head>
~~~

</section>
<section>

## Références

- [Liste des balises HTML sur MDN](https://developer.mozilla.org/docs/Web/HTML/Element).
- [Référence W3Schools](https://www.w3schools.com/tags/default.asp) (en anglais).
- Le validateur officiel du W3C: <https://validator.w3.org/>

</section>

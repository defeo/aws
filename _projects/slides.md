---
title: Slides
difficulty: 2
tags: [mobile, websocket]
publish: yes
---

Le but du projet est de développer une application permettant de créer des 
présentations sous forme de diapositives. L'application permettra également
de faire défiler les diapositives grâce à un téléphone (ce dernier servant alors
de "pointeur").

Vous pourrez présenter votre projet en utilisant l'application que vous avez 
développée.

### Les données

On peut envisager deux tables : une table pour les utilisateurs, et une table 
pour les présentations.

Une présentation comprend : 

* un titre,
* un créateur,
* une liste de diapositves.

Trois modèles de diapositives seront proposés à l'utilisateur :

* "titre" : l'utilisateur peut uniquement rentrer un court texte (par exemple
pour séparer des sections de la présentation),
* "texte + image" : l'utilisateur peut rentrer un texte et spécifier l'URL d'une
  image déjà présente sur le Web,
* "texte + code" : l'utilisateur peut rentrer un texte et un code source
informatique (par exemple pour expliquer une suite d'instructions).

Dans un premier temps, l'utilisateur n'a pas le choix de la disposition du texte
par rapport à l'image, ni de la police.

Ces données seront stockées dans une table SQL avec 3 colonnes :

* titre (de type texte),
* créateur (clef étrangère vers la table utilisateur),
* charge utile (de type texte, encondant la liste des diapositives en format
 JSON).


### Les actions possibles

Comme dans le TD, donner la possibilité aux utilisateurs de créer un compte
et de s'enregistrer.

Un fois enregistré, l'utilisateur peut:

* créer une nouvelle présentation,
* voir la liste des présentations qu'il a créées et les modifier,
* lancer une présentation en mode "visionnage" (en utilisant l'ordinateur relié au vidéo projecteur 
par exemple),
* prendre le contrôle d'une de ses présentations (en 
utilisant son téléphone par exemple), c'est à dire pouvoir faire défiler les
diapositives en avant ou en arrière.

*Remarque :* il est envisageable que le mode "visionnage" soit accessible à 
n'importe qui. Cependant, le mode "contrôle" doit être uniquement accessible par
le propriétaire de la présentation.

**Côté technique :** 

* au lancement d'une présentation, le navigateur ouvre une websocket vers le
serveur pour recevoir
des ordres comme "avancer/reculer" (c'est à peu près le seul endroit où une 
websocket est indispensable);
* depuis le téléphone contrôlant la présentation, lorsque l'utilisateur fait 
avancer les diapositives, une requête est envoyée au serveur, 
qui transfère l'ordre au navigateur via la websocket.


### Parties optionnelles

* Utiliser l'API 
  ["Touch Event"](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
  pour gérer le contrôle de la présentation (par exemple, un glissement vers 
  la droite fait avancer d'une diapositive).

* Utiliser une base de données NO-SQL (comme MongoDB) au lieu d'une base SQL.

* Ajouter la possibilité au présentateur de pointer des choses sur l'écran en
  agissant sur son téléphone (par exemple pour surligner un bout de texte ou une
  image...).

* Permettre aux personnes du public, mêmes si elles n'ont pas de
  compte, de suivre la présentation en mode visionnage (sur leur
  téléphone ou ordinateur). À tout moment, tous les visionneurs
  doivent voir le même transparent, peu importe à quel moment ils ont
  commencé à suivre la présentation.
  
* Dans le cadre de la question précédente, afficher au début de la
  présentation, un code QR encodant l'URL de la
  présentation. *Flasher* le code amène à la présentation en mode
  visionnage. Vous pouvez vous servir d'une
  [bibliothèque](https://github.com/schmich/instascan).
  
* Permettre également au public de poser des questions pendant la
  présentation.  Les questions seront affichées à la fin de la
  présentation. 

* Ajouter la possibilité d'inclure des images directement dans la
  présentation, sans besoin de pointer vers un serveur externe.  Le
  plus simple est [d'encoder les images en
  base64](https://en.wikipedia.org/wiki/Data_URI_scheme). Alternativement
  vous pouvez téléverser les images et les stocker dans la base de
  données.

* Améliorer l'interface d'édition des diapositives. Par exemple, en permettant à 
  l'utilisateur de créer des blocs déplaçables à la souris (on pourra utiliser
  des `<div>` avec comme propriété CSS 
  [`position; absolute`](https://developer.mozilla.org/en-US/docs/Web/CSS/position)
  et modifier les
  propriétés `left` et `top` en écoutant les événements `mousedown` et 
  `mousemove`).

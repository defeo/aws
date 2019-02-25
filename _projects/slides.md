---
title: Slides
difficulty: 3
tags: [mobile, websocket]
publish: false
---

Le but du projet est de développer une application permettant de créer des 
présentations sous forme de diapositives. L'application permettra également
de faire défiler les diapositives grâce à un téléphone (ce dernier servant alors
de "pointeur").

Vous pourrez présenter votre projet en utilisant l'application que vous avez 
développé.

### Les données

On peut envisager deux tables : une table utilisateur, et une table 
présentation.

Une présentation comprend : 

* un titre,
* un créateur,
* une liste de diapositves.

Trois modèles de diapositives seront proposés à l'utilisateur :

* "titre" : l'utilisateur peut uniquement rentrer un court texte (par exemple
pour séparer des sections de la présentation),
* "texte + image" : l'utilisateur peut rentrer un texte et spécifier l'URL d'une
  image déjà présente sur le Web,
* "texte + code" : l'utilisateur peut rentrer un texte et un code source
informatique (par exemple pour expliquer une suite d'instrutions).

Dans un premier temps, l'utilisateur n'a pas le choix de la disposition du texte
par rapport à l'image, ni de la police.

Ces données seront stockées dans une table SQL avec 3 colonnes :

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
* lancer une présentation (en utilisant l'ordinateur relié au vidéo projecteur 
par exemple),
* voir la liste des présentations en cours et en prendre le contrôle (en 
utilisant son téléphone par exemple), c'est à dire pouvoir faire défiler les
diapositives en avant ou en arrière.


**Côté technique :** 

* le serveur peut contenir une variable globale 
`running_presentations` contenant la liste des présentations en cours, chaque 
présentation étant identifiée grâce à un
[`uuid`](https://github.com/kelektiv/node-uuid) (on pourra notamment stocker la
diapositive actuellement affichée). De façon alternative, on peut
également stocker ces informations dans une base de données SQL (plus propre, 
cela évite de perdre les informations de présentation si le serveur redémarre)
ou dans un systèmes type [Redis](https://redis.io/) (pour les étudiants les plus
avancés) ;
* au lancement d'une présentation, le serveur génère un `uuid` pour la 
présentation, et le navigateur ouvre une websocket vers le serveur pour recevoir
des ordres comme "avancer/reculer" (c'est à peu près le seul endroit où une 
websocket est indispensable);
* depuis le téléphone contrôlant la présentation, lorsque l'utilisateur fait 
avancer les diapositives, une requête est envoyée au serveur, 
qui transfert l'ordre au navigateur via la websocket.


### Parties optionnelles

* Utiliser l'API 
  ["Touch Event"](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
  pour gérer le contrôle de la présentation (par exemple, un glissement vers 
  la droite fait avancer d'une diapositive).

* Améliorer l'interface d'édition des diapositives. Par exemple, en permettant à 
  l'utilisateur de créer des blocs déplaçables à la souris (on pourra utiliser
  des `<div>` avec comme propriété CSS 
  [`position; absolute`](https://developer.mozilla.org/en-US/docs/Web/CSS/position)
  et modifier les
  propriétés `left` et `top` en écoutant les événements `mousedown` et 
  `mousemove`).

* Ajouter la possibilité au présentateur de pointer des choses sur l'écran en
  agissant sur son téléphone (par exemple pour surligner un bout de texte ou une
  image...).

* Permettre aux personnes du public de suivre la présentation et également de
  poser des questions grâce à leur téléphone pendant la présentation.
  Les questions
  seront affichées à la fin de la présentation. Pour cela, on peut envisager 
  qu'au début de la présentation, un QR code encodant l'URL de la présentation
  soit affiché en grand format ;
  le public peut alors "flasher" le code et accéder directement à la 
  présentation.

* Ajouter la possibilité d'envoyer des images qui ne sont pas encore sur le Web.
  Le plus simple est d'encoder les images en "base 64". Une solution plus 
  pérenne est de stocker ces images sur un serveur (soit le même que votre 
  application, soit un serveur dédié à cet usage).

* Utiliser une base de données NO-SQL (comme MongoDB) au lieu d'une base SQL.
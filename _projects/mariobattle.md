---
title: Dario Battle
difficulty: 3
frameworks: Node
tags: [multi-utilisateur, temps réel, jeu]
---

Le but de ce projet est de développer un jeu multi-joueurs en temps
réel. On va s'inspirer des modalités *battle* présentes dans les
différentes sorties de la saga Super Mario Bros. développée par
Nintendo.

## Description du jeu

Le *battle mode* de Super Mario Bros. 3 est décrit en détail dans
[cette page de StrategyWiki](http://strategywiki.org/wiki/Super_Mario_Bros._3/Battle_Game).
Vous pouvez aussi regarder
[cette vidéo](https://www.youtube.com/watch?v=QH06zyZAwsE) démontrant
une partie.

Nous allons implanter une version simplifiée du jeu, dans laquelle au
moins deux personnages évoluent dans une grille de jeu régie par la
gravité.  Les personnages sont contrôlés par les touches
directionnelles du clavier : ils peuvent avancer, reculer, s'accroupir
et sauter.  Les bords gauche et droite de la grille sont reliés : un
personnage sortant par la droite réapparaît par la gauche, et
inversement.

Lorsqu'un personnage réussit à sauter sur la tête d'un autre, ce
dernier est éliminé et disparaît du jeu.  Le dernier joueur restant en
jeu est déclaré gagnant.

**Note :** on vous rappelle que la franchise Super Mario est un
copyright de Nintendo. Si vous avez droit de développer le jeu dans un
but pédagogique, mettre votre application à disposition du public
aurait des implications légales fâcheuses.

## Description du projet

Vous devez réaliser un jeu en ligne sur le modèle
[vu en TD](tutorials/accounts-node).  Il doit comporter :

- Une page permettant de s'enregistrer,
- Une page présentant la liste des utilisateurs en ligne, leur nombre
  de parties gagnées/perdues, et autres informations éventuelles,
- Un mécanisme pour se connecter,
- Un mécanisme permettant de défier un ou plusieurs adversaires,
- Une interface permettant de jouer le jeu.

L'interface du jeu sera réalisée en JavaScript.  Pour faire simple,
bornez-vous au possibilités décrites plus haut.  Des améliorations
imitant le jeu original sont proposées dans les parties optionnelles.

## Ressources

- Pour la communication entre clients, vous avez le choix entre les
  deux technologies de communication bidirectionnelle :
  
  - [`EventSource`](https://developer.mozilla.org/docs/Web/API/EventSource),
  - [WebSockets](https://developer.mozilla.org/en/docs/WebSockets).

- Pour dessiner la scène de jeu, il est conseillé d'utiliser l'API
  canvas. Vous pouvez suivre
  [ce tutoriel](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial).

##Parties Optionnelles

- Ajouter des caractéristiques du jeu original, ou de votre crû :
  
  - Les personnages doivent recevoir plusieurs coups avant d'être éliminés ;
  - Présence d'*upgrades* (champignons et similaires) ;
  - Présence de plate-formes que les personnages peuvent escalader ;
  - Présence d'ennemis contrôlés par l'ordinateur ;
  - Autres modalités de jeu : contre la montre, collection de pièces, ... ;
  - ...

- Utiliser une base de données No-SQL (par exemple MongoDB) à la place
  de MySQL.

- Proposer un "éditeur de niveaux" pour construire des grilles
  personnalisés.

- Permettre de contrôler le personnage avec un gamepad ou un joystick
  (voir la
  [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API)).

- Transformer le jeu en 3D en utilisant la technologie WebGL, par
  exemple avec la bibliothèque [three.js](http://threejs.org/docs/).

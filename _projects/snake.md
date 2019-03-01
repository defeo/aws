---
title: Tron
difficulty: 3
tags: [multi-utilisateur, temps réel, jeu]
publish: yes
---

Le but de ce projet est de développer un jeu de *Tron* (*snake*)
multi-joueurs en temps réel.

## Description du jeu

Dans un jeu de Tron, deux joueurs contrôlent un "serpent" (un *scoot
laser*, en théorie) qui se déplace sur une grille n×n qui occupe tout
l'écran. La tête du serpent peut être orientée dans les quatres
directions haut, bas, gauche, droite, et à intervales réguliers
(relativement rapides) le serpent avance d'une case.

Les serpents laissent derrière eux une *trace*, qui ne peut être
franchie ni par l'autre joueur ni par eux mêmes: lorsqu'un serpent
rencontre une trace, il est éliminé.

[Cette vidéo](https://www.youtube.com/watch?v=jNnpGa8gbVQ) illustre
bien le principe.

## Description du projet

Vous devez réaliser un jeu en ligne sur le modèle
[vu en TD](tutorials/accounts).  Il doit comporter :

- Une page permettant de s'enregistrer,
- Une page présentant la liste des utilisateurs en ligne, leur nombre
  de parties gagnées/perdues, et autres informations éventuelles,
- Un mécanisme pour se connecter,
- Un mécanisme permettant de défier un adversaire,
- Une interface permettant de jouer le jeu.

L'interface du jeu sera réalisée en JavaScript, le contrôle du serpent
pouvant se faire au clavier.

Soyez attentifs avec la gestion de l'état du jeux: Tron nécessite d'un
horloge interne qui régit l'avancement des serpents. Si les clients
étaient les seuls responsables du maintient de l'horloge, ils se
désynchroniseraient très facilement, ou, pire, il serait facile de
tricher.

## Ressources

- Pour la communication entre clients, préférez les
  [WebSockets](https://developer.mozilla.org/en/docs/WebSockets). Vous
  êtes libres d'utiliser votre bibliothèque WebSocket préférée.

- Pour dessiner la scène de jeu, vous avez le choix parmi ces techniques:

  - Une table HTML,
  - Un [layout en grille
    CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout),
  - Une balise `<svg>`, possiblement à l'aide d'une [bibliothèque](http://svgjs.com/),
  - Une balise `<canvas>`, voir [ce
    tutoriel](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial).

## Parties Optionnelles

- Permettre de jouer à plus que deux joueurs (typiquement 4).

- Ajouter des difficultés au jeu, par exemple :
  
  - Des obstacles additionnels apparaissent au hasard ;
  - Des *bonus* apparaissent au hasard, donnant des pouvoirs aux
    serpents (par ex., casser une *trace*) ;
  - La grille de jeu est *torique*, c.-à-d. les serpents qui sortent
    par la gauche rentrent par la droite, et vice-versa ; même chose
    pour haut-bas ;
  - La vitesse des serpents augment avec le temps ;
  - ...

- Utiliser une base de données No-SQL (par exemple MongoDB) à la place
  de MySQL.

- Permettre de contrôler le personnage avec un gamepad ou un joystick
  (voir la
  [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API)).

- Adapter le jeux aux petits *touch screens* (par ex., un smartphone),
  avec les [Touch
  gestures](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events).

- Transformer le jeu en 3D (déplacement dans un cube, vue en
  subjectif) en utilisant la technologie WebGL, par exemple avec la
  bibliothèque [three.js](http://threejs.org/docs/).

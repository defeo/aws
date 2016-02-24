---
title: Labyrinthe 3D avec WebGL
difficulty: 3
frameworks: Node, Silex
tags: [WebGL, 3D]
---

Le but de ce projet est de développer un labyrinthe en 3D (vue en
première personne), ainsi que son éditeur de cartes.

L'application tournera sur un ordinateur muni d'une carte graphique et
d'un browser compatible webGL (Firefox et Chromium-browser
fonctionneront avec la plupart des cartes nvidia et ati).

### Description

On considèrera des labyrinthes dont le plan en 2D est construit sur la
base d'un quadrillage en petits carrés, dans lequel certaines cloisons
entre deux carrés adjacents ont été supprimées.

Les cloisons qui restent forment les murs du labyrinthe, et peuvent
avoir chacune sa couleur.  Le joueur démarre depuis un des carrés, qui
est désigné comme la case initiale, et doit trouver son chemin vers un
carré désigné comme la case finale.

Le but du projet consiste en la création d'un éditeur de labyrinthe
entièrement en ligne. On devra être capable de créer, supprimer ou
éditer la couleur de chaque cloison en quelques clics. Le labyrinthe
sera naturellement sauvegardé dans une base de donnée, et pourra être
réédité ultérieurement.

Ensuite, il faut créer le jeu en lui même. On utilisera le framework
Three.js afin d'afficher le labyrinthe en 3D, en vue à la première
personne. On utilisera la souris pour tourner la caméra, et le clavier
pour avancer. Le joueur gagne lorsqu'il atteint la case finale, et le
temps qu'il a mis est enregistré dans les high-scores du labyrinthe
dans la base de donnée.

### Ressources

- Pour le moteur graphique, vous pourrez utiliser la librairie
  Three.js (à moins que vous ne souhaitiez reprogrammer tous les
  shaders à la main...):
  
  - [Doc officielle de Three.js](http://threejs.org/docs/),
  - [Un exemple parlant](http://keats.prism.uvsq.fr/webgl.html).

### Parties optionnelles

- Faire un mode multijoueur dans lequel vous mettez plusieurs joueurs
  en temps réel sur le même labyrinthe, et le premier qui arrive
  gagne. Un joueur peut être modélisé par une boule colorée qui avance
  dans le labyrinthe.

- Utiliser une base de données No-SQL (par exemple MongoDB) à la place
  de MySQL.

- Permettre un mode spectateur en 2D.

- Ajouter d'autres règles (téléportation d'une case à une autre,
  possibilité de détruire des cloisons, possibilité de traverser
  temporairement une cloison, possibilité de tuer des adversaires qui
  sont dans la même case...)

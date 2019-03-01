---
title: Dames
difficulty: 2
tags: [multi-utilisateur, jeu]
publish: yes
---

Le but de ce projet est de réaliser un jeu de dames (simplifié) en
ligne multi-utilisateur.


### Description du jeu

On rappelle le principe du [jeu de dames](https://fr.wikipedia.org/wiki/Dames)

- Deux joueurs, le noir et le blanc, jouent sur un échiquier 10×10.

- Chaque joueur dispose de 20 pions. Les pions ne peuvent être posés
  que sur les cases noire, ils commencent la partie disposés sur les
  quatres lignes les plus proches du joueur respectif.

- Les joueurs jouent à tour de rôle, les blancs commencent. Un pion ne
  peut se déplacer que d'une case, en diagonal vers l'avant (deux
  choix possibles). Lorsque l'une des deux cases en face d'un pion est
  occupée par un pion adverse, et qu'il y a une case libre derrière,
  le joueur peut prendre le pion adverse en le "sautant", le pion est
  alors éliminé de l'échiquier.

- Lorsqu'un pion arrive sur la ligne opposée de l'échiquier, il est
  promu en *dame*. Une dame se comporte comme un pion, mais en plus
  elle peut se déplacer en arrière.

- Le joueur qui n'a plus de pions perd la partie.

### Description du projet

Vous devez réaliser un jeu en ligne sur le modèle vu en TD. Il doit
comporter :

- Une page permettant de s'enregistrer,
- Une page présentant la liste des utilisateurs en ligne, leur nombre
  de parties gagnées/perdues, et autres informations éventuelles,
- Un mécanisme pour se connecter,
- Un mécanisme permettant de défier un adversaire,
- Une interface permettant de jouer le jeu.

L'interface du jeu doit être réalisée en JavaScript :

- Les pions sont disposés au début la partie, et c'est au blanc de jouer.
- Le joueur sélectionne le pion à jouer en cliquant dessus, puis il
  clique sur la case où le pion doit se déplacer. Le serveur vérifie
  que le coup est valide, et prend le pion adverse le cas échéant.
- Lorsqu'un joueur a perdu tous ses pions, ce joueur est déclaré
  perdant et le jeu se termine.

### Ressources

- La [page Wikipedia sur le jeu de dames](https://fr.wikipedia.org/wiki/Dames).

### Parties optionnelles

- Étendre les règles pour réaliser la version internationale des (voir
  la [page Wikipedia](https://fr.wikipedia.org/wiki/Dames)). En
  particulier, le jeu calcule les prise obligatoires, et les montre au
  joueur qui doit jouer.

- Tous les points optionnels du [TD sur Puissance
  4](tutorials/websockets#to-go-further-optional) sont aussi valables
  pour ce projet.

- Implanter plusieurs systèmes de règles différents, et proposer une
  interface pour que le joueur qui invite puisse choisir le système.

- Utiliser une base de données No-SQL (par ex., MongoDB) à la place de SQL.

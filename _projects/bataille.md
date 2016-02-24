---
title: Bataille navale
difficulty: 2
frameworks: Node
tags: [multi-utilisateur, jeu]
publish: yes
---

Le but de ce projet est de réaliser un jeu de bataille navale en ligne
multi-utilisateur.


### Description du jeu

On rappelle le principe de la bataille navale.

- Deux joueurs disposent chacun d'une grille de jeu (par ex., de 10×10
  cases).

- Chaque joueur dispose du même nombre de navires. Les navires peuvent
  occuper une, deux, trois ou quatre cases.

- Avant de commencer la partie, chaque joueur dispose ses navires sur
  sa grille.

- À tour de rôle, un joueur décide de frapper une case sur la grille
  du joueur adverse. S'il touche un navire, l'adversaire lui annonce
  « touché », sinon il lui annonce « manqué ». Lorsque toutes les
  cases d'un même navire ont été touchées, le joueur annonce « coulé ».

- Gagne le joueur qui en premier coule tous les navires de
  l'adversaire.

### Description du projet

Vous devez réaliser un jeu en ligne sur le modèle
[vu en TD](tutorials/accounts-node). Il doit comporter :

- Une page permettant de s'enregistrer,
- Une page présentant la liste des utilisateurs en ligne, leur nombre
  de parties gagnées/perdues, et autres informations éventuelles,
- Un mécanisme pour se connecter,
- Un mécanisme permettant de défier un adversaire,
- Une interface permettant de placer ses navires sur la grille, 
- Une interface permettant de jouer le jeu.

L'interface du jeu doit être réalisée en JavaScript :

- Chauque joueur voit les deux grilles :
  - Sur sa propre grille toutes les informations sont affichées :
	disposition des navires, navires touchés/coulés, cases frappées ;
  - Sur la grille de l'adversaire, uniquement les cases frappées,
    touchées, coulées sont affichées, mais pas les bateaux.
- Le joueur doit pouvoir sélectionner la case à frapper en cliquant
  dessus.
- L'affichage montre clairement si la frappe a manqué/touché/coulé.
- Lorsqu'un joueur a coulé tous les navires de son adversaire, le jeu déclare le joueur gagnant.

### Ressources

- [Le TD sur Puissance 4 multi-utilisateurs](tutorials/accounts-node),
- [La page wikipedia du jeu de la bataille navale](https://fr.wikipedia.org/wiki/Bataille_navale_%28jeu%29).

### Parties optionnelles

- Tous les points optionnels du
  [TD sur Puissance 4](tutorials/accounts-node#pour-aller-plus-loin-optionnel)
  sont aussi valables pour ce projet.

- Faites une version multi-joueurs du jeu : les joueurs sont séparés
  en deux équipes, qui essaient de collaborer pour vaincre les
  adversaires.

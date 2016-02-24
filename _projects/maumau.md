---
title: Mau mau
difficulty: 2
frameworks: Node
tags: [multi-utilisateur, jeu]
---

Le but de ce projet est de réaliser un jeu de cartes en ligne
multi-utilisateur. Il s'agit du jeu *Mau mau*, ancêtre de *Uno*
populaire en Allemagne.


### Description du jeu

Le jeu de Mau mau se joue ainsi :

- Un jeu de cartes est mélange. 7 cartes sont distribuées à chaque
  joueur. On pose le reste du jeu, face cachée, au milieu.

- On découvre la première carte du jeu et on la pose par terre.
  
- À tour de rôle, chacun des joueurs a droit de poser par dessus la
  carte découverte une de ses cartes qui a soit la même enseigne
  (cœurs, carreaux, trèfles, piques), soit la même valeur.
  
  S'il ne peut pas poser de carte, il en pioche une du jeu face
  cachée. Il la joue s'il peut, sinon il la met dans son jeu.
  
  Un joueur a droit de piocher et passer son tour même s'il possède
  des cartes jouables dans son jeu.

- Lorsque le jeu face cachée est épuisé, on prend la totalité des
  cartes découvertes à l'exception de la dernière, on les mélange et
  on les pose à nouveau face cachée.

- Gagne le joueur qui se débarrasse en premier de son jeu.


### Description du projet

Vous devez réaliser un jeu en ligne sur le modèle
[vu en TD](../tutorials/accounts-node). Il doit comporter :

- Une page permettant de s'enregistrer,
- Une page présentant la liste des utilisateurs en ligne, leur nombre
  de parties gagnées/perdues, et autres informations éventuelles,
- Un mécanisme pour se connecter,
- Un mécanisme permettant de défier un adversaire,
- Une interface permettant de jouer le jeu.

L'interface du jeu doit être réalisée en JavaScript :

- Le joueur voit uniquement sont jeu et la dernière carte découverte.
- Le joueur doit pouvoir sélectionner la carte à jouer en cliquant
  dessus.
- L'interface doit clairement montrer les cartes jouables.
- Lorsque il ne peut pas jouer, l'interface doit lui montrer
  clairement la nouvelle carte piochée, et lui permettre de la jouer
  si possible.
- Un bouton pour passer la main doit être présent.

**Note :** en première approximation, vous pouvez simplement
représenter une carte par une boîte contenant sa description
textuelle, ex. : *« 7 de piques »*. Si vous voulez utiliser des
icônes, pensez à utiliser un jeu libre de droits ou avec une licence
permissive.

**Note :** pour faire simple, limitez une partie à deux joueurs.

### Ressources

- [Le TD sur Puissance 4 multi-utilisateurs](../tutorials/accounts-node),
- [La page wikipedia du jeu de Mau mau](http://en.wikipedia.org/wiki/Mau_Mau_%28card_game%29).

### Parties optionnelles

- Tous les points optionnels du
  [TD sur Puissance 4](../tutorials/accounts-node#pour-aller-plus-loin-optionnel)
  sont aussi valables pour ce projet.

- Permettez de faire des parties à un nombre arbitraire de joueurs.


---
title: Bomberman
difficulty: 3
frameworks: Node
tags: [multi-utilisateur, temps réel, jeu]
publish: yes
---

Le but de ce projet est de développer un jeu à deux joueurs en temps
réel. On va choisir l'*arcade* très populaire
[*Bomberman*](https://en.wikipedia.org/wiki/Bomberman).

### Description du jeu

Bomberman se joue de deux a quatre joueurs. Les joueurs démarrent aux
coins opposés d'une une grille 11×11.

Les joueurs peuvent se déplacer librement dans la grille. Toutes les
cases de coordonnées paires de la grille sont inaccessibles, formant
ainsi des couloirs pour les joueurs.

Les joueurs disposent d'un nombre illimité de bombes à retardement,
qu'ils peuvent placer dans une case libre. Les bombes explosent après
un nombre prédéterminé de secondes. Aucun joueur ne peut déposer plus
d'une bombe en même temps.

Lorsqu'une bombe explose, son explosion frappe dans quatres
directions, jusqu'à une distance préderminée. Un joueur frappé par une
explosion est éliminé du jeu.

Une [vidéo](https://www.youtube.com/watch?v=DZNcCowQKRQ) va expliquer
mieux que mille mots.

### Description du projet

Vous devez réaliser un jeu de Bomberman en ligne sur le modèle
[vu en TD](tutorials/accounts-node). Il doit comporter :

- Une page permettant de s'enregistrer,
- Une page présentant la liste des utilisateurs en ligne, leur nombre
  de parties gagnées/perdues, et autres informations éventuelles,
- Un mécanisme pour se connecter,
- Un mécanisme permettant de défier un adversaire,
- Une interface permettant de jouer le jeu.

L'interface du jeu doit être réalisée en JavaScript. Pour faire
simple, limitez vous à un jeu basique :

- Uniquement deux joueurs;
- Pas de murs autres que les murs indestructibles;
- Pas d'*upgrades*;
- Pas de temps limite.

Les joueurs peuvent contrôler leur personnage avec le clavier: flèches
pour se déplacer, espace pour déposer une bombe.

**Note :** on vous rappelle que le jeu Bomberman est un copyright de
Konami. Si vous avez droit de développer le jeu dans un but
pédagogique, mettre votre application à disposition du public aurait
des implications légales fâcheuses.

### Ressources

- Pour la communication entre clients, vous avez le choix entre les
  deux technologies de communication bidirectionnelle :
  
  - [`EventSource`](https://developer.mozilla.org/docs/Web/API/EventSource),
  - [WebSockets](https://developer.mozilla.org/en/docs/WebSockets).

### Parties optionnelles

- Permettre des parties jusqu'à 4 joueurs.

- Ajouter des caractéristiques du jeu original, ou de votre crû : murs
  destructibles, *upgrades*, etc.

- Utiliser une base de données No-SQL (par exemple MongoDB) à la place
  de MySQL.

- Permettre de contrôler le personnage à la souris : clic gauche pour
  se déplacer, clic droit pour déposer une bombe. Quel parcours
  choisir lorsque le déplacement ne peut pas se faire en ligne droite ?

- Transformer le jeu en 3D en utilisant la technologie
  WebGL. [Cet exemple](https://codepen.io/defeo/pen/qbeJML/) pourrait
  vous aider.

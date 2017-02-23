---
title: Curiosity – Qu'y a-t-il sous les pavés?
difficulty: 2
frameworks: Node, Silex
tags: [multi-utilisateur, jeu]
publish: yes
---

Le but de ce projet est de développer une version simplifiée du jeu
multi-joueurs
[*Curiosity*](https://www.youtube.com/watch?v=3JWfK16M7OE).

### Description du jeu

[Curiosity](https://en.wikipedia.org/wiki/Curiosity_%E2%80%93_What's_Inside_the_Cube%3F)
était un jeu vidéo expérimental, ainsi qu'une expérience sociale
consistant en un pavage cubique composé d'environ 69 milliards de
petits cubes, formant un grand cube d'environ 4000 cubes de côté.

Il existe un unique grand cube dans le jeu, et son état est stocké sur
le serveur. Les joueurs agissent tous en parallèle sur l'état global,
en cliquant les petits cubes, ce qui les fait disparaître. Le but du
jeu est de casser tous les cubes, une couche à la fois, jusqu'à
révéler le noyau du cube. Les joueurs gagnent des points au fur et à
mesure qu'ils détruisent les petits cubes; les points accumulés
peuvent être dépensés en *upgrades* variés. Le premier joueur à
atteindre le noyau est déclaré le gagnant.

Dans ce projet nous allons développer une version simplifiée du jeu,
ne comportant pas d'éléments 3D. L'état du serveur consiste en une
*tour* de *n* étages, chaque étage étant pavé par une grillé *m×m* de
pavés. Le but des joueurs est de casser la tour, pavé par pavé, un
étage à la fois, jusqu'à arriver au sol. Les joueurs gagnent un point
pour chaque pavé cassé, mais dans cette version simplifiée ils
n'auront pas d'*upgrades* pour les dépenser. Le premier joueur qui
atteint le sol a gagné.


### Description du projet

Vous devez réaliser le jeu de Curiosity simplifié, en vous inspirant
du modèle [vu en TD](tutorials/accounts-node). Notez bien que tous les
joueurs jouent en parallèle sur la même *tour (tower)*, et qu'il n'y a
pas de concept de tour (turn) de jeu, contrairement à
Puissance 4. Vous devrez être particulièrement vigilants à ce que deux
jouers cliquant sur un même pavé en même temps ne gagnent pas tous les
deux le point. Pour que l'interface soit intuitive les mises à jour de
l'affichage doivent se faire le plus vite possible.

Votre application doit comporter :

- Une page permettant de s'enregistrer,
- Une page présentant la liste des utilisateurs en ligne, leur score
  actuel, et autres informations éventuelles,
- Un mécanisme pour se connecter,
- Une interface permettant de jouer le jeu.

L'interface du jeu doit être réalisée en JavaScript. Les mises à jours
doivent se faire en temps réel (WebSocket ou EventSource avec
Node.js), ou quasi-réel (polling avec PHP, remarquez que ceci devient
très lourd dès qu'il y a beaucoup de joueurs).


### Ressources

- Pour la communication entre clients, vous avez le choix entre les
  deux technologies de communication bidirectionnelle :
  
  - [`EventSource`](https://developer.mozilla.org/docs/Web/API/EventSource),
  - [WebSockets](https://developer.mozilla.org/en/docs/WebSockets),
  
  ou à défaut du polling avec `XMLHttpRequest`.

- Pour le dessin de l'interface de jeux vous avez deux choix :
  
  - Une interface minimaliste, avec une grille de jeux représentée par
	un tableau HTML ou similaire. Ceci est assez similaire à ce qui a
	été vu en cours pour le plateau de puissance 4.

  - Une interface plus fluide, utilisant la balise `<canvas>` pour
	dessinner directement avec des primitives graphiques. Vous pouvez
	suivre
	[ce tutoriel](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial).


### Parties optionnelles

- Ajoutez la possibilité d'acheter des *upgrades* avec les points
  collectés. Donnez libre cours à votre imagination, voici quelques
  exemples :
  
  - *Gros doigts :* un clic détruit plusieurs pavés dans un rayon donné ;
  - *Clics automatiques :* un curseur clique pour vous toutes les *x*
    secondes ;
  - *Exclusivité :* vous êtes le seul à pouvoir cliquer pendant les
	prochaines *x* secondes ;
  - ...

- Ajoutez la possibilité pour le serveur d'héberger plusieurs parties
  en même temps. L'interface listera les parties en cours, et
  permettra de créer une nouvelle partie, avec un identifiant choisi
  aléatoirement. Chaque joueur pourra rejoindre n'importe quelle
  partie active.

- Utilisez une base de données No-SQL (par exemple MongoDB) à la place
  de MySQL.

- Ajoutez la possibilité de zoomer et de se déplacer à la souris, ou
  au toucher (sur écran tactile). Lisez les documentations de:
  
  - L'évènement [`drag`](https://developer.mozilla.org/en-US/docs/Web/Events/drag),
  - L'évènement [`wheel`](https://developer.mozilla.org/en-US/docs/Web/Events/wheel),
  - Les
    [évènements tactiles](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Using_Touch_Events).

- Implantez le vrai jeu de Curiosity sur un cube 3D. Utilisez la
  bibliothèque [three.js](http://threejs.org/docs/) pour l'affichage.

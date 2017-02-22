---
title: WiiPong
difficulty: 4
frameworks: Node
tags: [multi-utilisateur, jeu, mobile]
publish: no
---

Le but de ce projet est de réaliser un jeu de
[Pong](https://en.wikipedia.org/wiki/Pong) dont les raquettes sont
contrôlées par les accéléromètres de téléphones portables ou
tablettes.

### Description du jeu

Pong est un jeu à deux joueurs en temps réel, inspiré du tennis et du
ping pong. Sur deux côtés opposés de l'écran, deux raquettes se
déplacent sur des axes parallèles sont contrôlées par les joueurs. Une
balle est lancée par le jeu en direction de l'un des deux joueurs, qui
doit déplacer sa raquette en face de la balle pour pouvoir la renvoyer
à l'adversaire.

Le joueur qui laisse une balle sortir par son côté de l'écran fait
marquer un point à son adversaire. Lorsque la balle rencontre un mur
perpendiculaire aux raquettes, elle rebondit. La vitesse et la
direction avec lesquelles la balle rebondit après avoir rencontré une
raquette sont déterminées en fonction de la distance du point
d'impact au centre de la raquette.

[Cette vidéo](https://www.youtube.com/watch?v=fiShX2pTz9A) vous donnera
des explications plus claires que mille mots.

### Description du projet

Le but de ce projet est de réaliser un jeu de pong à deux
utilisateurs, où le contrôle de la raquette se fait à l'aide des
accéléromètres installés dans un téléphone portable ou une tablette.

Pour la partie applicative, vous pouvez suivre le modèle
[vu en TD](tutorials/accounts-node). Elle doit comporter :

- Une page permettant de s'enregistrer,
- Une page présentant la liste des utilisateurs en ligne, leur nombre
  de parties gagnées/perdues, et autres informations éventuelles,
- Un mécanisme pour se connecter,
- Un mécanisme permettant de défier un adversaire,
- Une interface permettant de jouer le jeu.

L'interface de jeu doit être réalisée en JavaScript, et utiliser les
techniques de communication bidirectionnelles pour faire les mises à
jour en temps réel.

Le contrôle des raquettes doit se faire à travers l'API
[`DeviceMotion`](https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation#Processing_motion_events),
supportée par la plus part des navigateurs mobiles. Pour tester si
votre téléphone supporte l'API, vérifiez que les barres dans l'exemple
ci-dessous réagissent à vos mouvements:

- Les trois premières barres représentent votre accélération absolue
  (sans tenir compte de la force de gravité) ;
- Les trois barres suivantes représentent votre accélération, incluant
  la force de gravité ;
- Les trois dernières représentent votre accélération angulaire.

{% include codepen.md pen='mRNMqq' tab='result' alt='DeviceMotion demo' height='500' %}

Deux autres APIs peuvent vous aider à offrir un meilleur contrôle :

- [`DeviceOrientation`](https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation),
  pour connaître l'orientation de votre téléphone par rapport à l'axe
  de gravité;

- L'événement
  [`orientationchange`](https://developer.mozilla.org/en-US/docs/Web/Events/orientationchange),
  pour détecter le passage du mode paysage au portrait.


**Note :** on vous rappelle que le jeu Pong est un copyright de
Atari. Si vous avez droit de développer le jeu dans un but
pédagogique, mettre votre application à disposition du public aurait
des implications légales fâcheuses.


### Ressources

- Pour la communication entre clients, vous avez le choix entre les
  deux technologies de communication bidirectionnelle :
  
  - [`EventSource`](https://developer.mozilla.org/docs/Web/API/EventSource),
  - [WebSockets](https://developer.mozilla.org/en/docs/WebSockets).

- Pour l'API `DeviceMotion`, se référer à
  [ce guide MDN](https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation#Processing_motion_events),
  ainsi qu'au [Codepen d'exemple](http://codepen.io/defeo/pen/mRNMqq).

- Pour le dessin de l'interface vous pouvez utilser le DOM, ou alors
  l'API `<canvas>` qui permet de dessiner directement avec des
  primitives graphiques. Vous pouvez suivre
  [ce tutoriel](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial).

### Parties optionnelles

- Permettre la connexion de certains clients en mode affichage seul,
  et de certains autres en mode contrôleur. De cette façon, vous
  pourrez utiliser le téléphone comme une manette de jeu, tout en
  affichant la partie sur un autre écran.

- Passer en mode 3D simulée: la perspective sera subjective, avec la
  balle qui s'agrandit en approchant et rétrécit en s'éloignant, et la
  raquette qui peut se déplacer sur un plan plutôt que sur une
  droite. L'API Canvas peut suffire à réaliser cette partie, ou alors
  la bibliothèque [three.js](http://threejs.org/docs/) vous permet de
  créer des scènes plus réalistes.

- Mode multi-joueurs: accepter jusqu'à *n* joueurs, en les plaçant sur
  les sommets d'un *n*-gone régulier. Les raquettes pourront
  maintenant se déplacer sur un arc de cercle autour du joueur, et il
  y aura potentiellement plusieurs balles.

- Mode multi-joueurs 3D: en combinant les deux parties précédentes,
  vous permettrez aux raquettes de se déplacer sur un cylindre.


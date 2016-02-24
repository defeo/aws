---
title: Remote lightsaber
difficulty: 4
frameworks: Node
tags: [mobile, orientation, WebGL]
publish: yes
---

Le but de ce projet est d'utiliser un smartphone comme télecommande
pour contrôler un objet sur un écran distant. Pour développer ce
projet vous aurez besoin d'un smartphone avec un navigateur web
supportant l'API
[device orientation](https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation).

Les acceleromètres du téléphone vont contrôler les mouvements d'un
objet (épée, sabre laser, ou similaire) sur l'écran d'un autre
appareil connecté au serveur.

L'utilisation d'une base de données n'est pas obligatoire pour cette
application.

### Description

En imitant le modèle des chats, l'application compartimente les
utilisateurs dans des *chambres*. Chaque chambre sera identifiée par
une URL du type

~~~
http://application.com/aeadfw23x
~~~

où `aeadfw23x` est l'identifiant de la chambre. Les identifiants
peuvent être générés aléatoirement, ou créés par les utilisateurs.

1. Lorsque le client se connecte à l'application, deux possibilités lui
   sont offertes :
   
   - Rejoindre/créer une chambre en modalité affichage, pour
     visualiser le sabre,
   - Rejoindre/créer une chambre en modalité contrôleur, pour
     contrôler le sabre avec un smartphone.
   
   Chaque chambre accepte au plus un contrôleur, mais peut avoir un
   nombre arbitraire d'afficheurs.

2. Le contrôleur communique en continu son orientation, obtenue à
   travers l'API
   [device orientation](https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation).

3. Les afficheurs reçoivent les données sur l'orientation, et
   modifient l'affichage du sabre en conséquence.

L'application peut être testée en local en connectant le serveur et
les clients mobiles au même réseau local (par ex.: un réseau wifi), ou
en utilisant le serveur de Cloud9. Pour un test hors du laboratoire
(par ex., le jour de la soutenance), il est nécessaire d'héberger le
serveur à une adresse accessible depuis le web. Cela peut être fait
avec Cloud9, mais nous conseillons les hébergeurs gratuits suivants :

- [Heroku](https://heroku.com),
- [Openshift](https://openshift.com).


### Ressources

- Pour le moteur graphique, vous pourrez utiliser la bibliothèque
  Three.js (à moins que vous ne souhaitiez reprogrammer tous les
  shaders à la main...):
  
  - [Doc officielle de Three.js](http://threejs.org/docs/),
  - [Un exemple parlant](https://codepen.io/defeo/pen/qbeJML/).

- Pour la communication entre clients, vous avez le choix entre les
  deux technologies de communication bidirectionnelle :
  
  - [`EventSource`](https://developer.mozilla.org/docs/Web/API/EventSource),
  - [WebSockets](https://developer.mozilla.org/en/docs/WebSockets).

- L'orientation de l'appareil doit être interrogée avec l'API web
  <https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation>,
  éventuellement en combinaison avec l'API
  <https://developer.mozilla.org/en-US/docs/Web/Events/devicemotion>.

### Parties optionnelles

- Créer une scène, par exemple une pièce avec des murs, ou un
  labyrinthe, pour les afficheurs.

- Comme dans un First Person Shooter, utiliser l'écran du smartphone
  comme un touchpad pour contrôler le mouvement du personnage : en
  déplaçant le doigt vers le haut/bas, le personnage avance/recule (la
  vitesse peut être proportionnelle à l'éloignement du milieu de
  l'écran). En déplaçant le doigt vers la gauche/droite, le personnage
  tourne à gauche/droite.

- Permettre à plusieurs contrôleurs de rejoindre une même
  chambre. Pour chaque contrôleur, un personnage est créé dans la
  scène, et affiché à tous les afficheurs.

- Créer une résolution de duels primitive : lorsque deux personnages
  sont suffisamment proches, ils ne peuvent pas se traverser. En vous
  basant sur les orientations des sabres, décidez qui des personnages
  a gagné le duel, et éliminez le perdant. Gagne le dernier personnage
  resté vivant.

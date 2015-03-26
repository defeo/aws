---
title: Find my Friends
difficulty: 3
frameworks: Node
tags: mobile, géolocalisation, multi-utilisateur
---

Le but de ce projet est de développer une application similaire à
l'application iPhone *Find my friends*.

Il s'agit d'une application pour appareils dotés de
géolocalisation. L'application utilise ces données pour montrer en
temps réel la distance et la direction des autres utilisateurs
connectés.

Afin de pouvoir tester l'application, il est impératif de disposer de
plusieurs appareils munis de géolocalisation. Puisque cette
application utilise des technologies web non-standardisées, elles ne
peut être compatible qu'avec les appareils suivants :

- téléphones et tablettes Android avec navigateur Firefox,
- téléphones et tablettes Firefox OS,
- ordinateurs munis de GPS.

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
   
   - Rejoindre une chambre déjà existante,
   - Créer une nouvelle chambre.
   
   **Note :** C'est votre responsabilité que définir le comportement
   lorsque un utilisateur essaye de créer une chambre déjà existante.

   **Note :** Limitez le nombre d'utilisateurs par chambre à 2.

2. Chacun des deux utilisateurs connectés à une chambre communique en
   continu au serveur sa position GPS. Le serveur transmet cette
   information à l'autre utilisateur.

3. Chaque utilisateur, à la réception de la position de l'autre,
   visualise sa position avec une flèche pointant dans sa direction,
   et la distance de celui-ci.
   
   **Note :** afin de pouvoir diriger la flèche, vous devez accéder
   aux données de la boussole de l'appareil. En première
   approximation, vous pouvez afficher un cap à la place de la flèche
   (par ex.: 20° Nord), ce qui ne nécessite pas de boussole.
   
   **Note :** cette partie nécessite de savoir faire des calculs
   géodésiques. C'est des mathématiques de niveau L1, mais si vous y
   êtes allergiques, ce projet n'est pas pour vous.

L'application peut être testée en local en connectant le serveur et
les clients mobiles au même réseau local (par ex.: un réseau wifi), ou
en utilisant le serveur de Cloud9. Pour un test hors du laboratoire,
il est nécessaire d'héberger le serveur à une adresse accessible
depuis le web. Nous conseillons les hébergeurs gratuits suivants :

- [Heroku](https://heroku.com),
- [Openshift](https://openshift.com).


### Ressources

- Pour la communication entre clients, vous avez le choix entre les
  deux technologies de communication bidirectionnelle :
  
  - [`EventSource`](https://developer.mozilla.org/docs/Web/API/EventSource),
  - [WebSockets](https://developer.mozilla.org/en/docs/WebSockets).

- Les données de géolocalisation doivent être interrogées avec l'API
  web
  <https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation>.

- L'orientation de l'appareil doit être interrogée avec l'API web
  <https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation>.


### Parties optionnelles

- Faire vibrer les appareils lorsque la distance est inférieure à un
  seuil.

- Permettre la privatisation d'une chambre avec mot de passe
  (nécessite l'ajout d'une base de données).

- Autoriser plus de 2 utilisateurs par chambre, et afficher une flèche
  pour chacun.

- Ajouter une visualisation des positions sur carte.

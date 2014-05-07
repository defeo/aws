---
layout: tutorial
title: Deuxième checkpoint
---

Ce travail est à réaliser seul ou en binôme. Envoyez votre travail
[par mail](http://defeo.lu/) **avant le dimanche 20 mars à minuit**, en
précisant vos noms et prénoms, et en donnant un lien vers le code
source, hébergé

- soit dans un espace de travail public sur Cloud9 (par ex.,
  <http://c9.io/votrelogin/aws-project>),
- soit dans un répo [GitHub](http://github.com).

N'envoyez pas de fichiers joints et/ou dans le corps du mail.

## Travail à réaliser

Vous devez compléter le Jeu de Puissance 4 décrit aux TDs « Comptes
utilisateur » et « Un jeu multi-utilisateurs »

- Versions pour PHP : [TD 4](tutorial4-silex) et
  [TD 5](tutorial5-silex) ;
- Versions pour Node.js : [TD 4](tutorial4-node) et
  [TD 5](tutorial5-node).

Pas la peine de montrer toutes les étapes intermédiaires par
lesquelles vous êtes passés, ni que vous avez suivi point par point le
TD. Votre application doit comporter au moins

- Des profils d'utilisateur, stockés dans la base de données.

- Les *vues* suivantes :
  
  - Une page d'accueil, qui permet aux utilisateurs de se connecter
	avec leur mot de passe (formulaire permettant à un ou deux
	utilisateurs de se connecter, selon jusqu'où vous êtes arrivés
	dans les TDs) ;
  - Une page pour créer un nouveau compte d'utilisateur ;
  - Une page présentant la liste des utilisateurs (tous, ou bien
	seulement les utilisateurs connectés) ;
  - Une page présentant un plateau de jeu de puissance 4, permettant à
	deux utilisateurs connectés de jouer une ou plusieurs parties, et
	tenant trace des scores.

Votre application doit au minimum implanter la partie obligatoire du
TD « Comptes utilisateur » (application *single client*, sans
AJAX). Les éléments suivants vont contribuer à ajouter des points :

- Utilisation du paradigme AJAX,
- Implantation d'un mécanisme *server push*, soit par *short polling*
  soit par événements et `EventSource`, soit par Web Sockets.
- Application *multi-client*, permettant à deux utilisateurs distants
  de jouer une partie.
- Tout composant optionnel, proposé dans les TDs, ou imaginé par vous
  mêmes.

D'autres éléments qui vont contribuer à la note finale sont :

- La propreté, la concision et le style du code source ;
- L'organisation du code et la séparation entre logique, contenu et
  présentation ;
- L'utilisation correcte des standards HTML, CSS, JavaScript, etc. ;
- L'utilisabilité de l'application ;
- Le soin porté à l'affichage de l'application ;
- La réflexion aux failles de sécurité potentielles de l'application.

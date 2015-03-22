---
title: Calendrier
difficulty: 2
frameworks: Node, Silex
---

Le but du projet est de définir une application permettant de gérer un
calendrier personnel (un peu comme Google Calendar).

### Description

Un calendrier est une suite d'événements, qui **ne doivent jamais se
chevaucher ou se superposer**.  Un événement a au moins :

* un titre,
* une date et heure de début,
* une date et heure de fin,
* un créateur.

Ces champs sont reflétés dans une table MySQL.

Sur la page principale, le planning de la semaine apparaît sous la
forme d'une grande table, avec **une colonne par jour**. Les
événements sont représentés par des boites colorées contenant le titre
de l'événement, positionnées par dessus la table.  Un menu doit
permettre de naviguer dans les semaines.

Un forumlaire de login sur la même page permet aux utilisateurs de
s'identifier. Les utilisateurs sont enregistrés dans une autre table
MySQL. Uniquement les utilisitaeurs indentifiés ont droit de modifier
le calendrier.

Les utilisateurs identifiés doivent pouvoir ajouter des événements
avec la souris en cliquant sur la table : clic sur le début, clic sur
la fin, ou alors un clic glissé du début à la fin. Une fois les heures
choisies, et si cela ne chevauche pas un autre événement, un pop-up
apparaît pour demander le titre de l'événement, et eventuellement
d'autres infos de style (couleur, etc...). Après validation,
l'événement est créé.

Il doit aussi y avoir la possibilité de supprimer un événement (par
exemple une petite croix sur la boîte de l'événement).

Un lien ou bouton sur la page doit permettre aux utilisateurs de se
déconnecter.

Faire enfin une page d'enregistrement d'un nouvel utilisateur.

**Note :** prêtez attention à vérifier la validité d'un évenement
(format des dates, non-chevauchement, etc.) du côté serveur, et pas
uniquement du côté client.

### Ressources

Les guides des évènements

- [`mousedown`](https://developer.mozilla.org/fr/docs/Web/Events/mousedown),
- [`mouseup`](https://developer.mozilla.org/fr/docs/Web/Events/mouseup),
- [Drag and drop](https://developer.mozilla.org/fr/docs/Glisser_et_d%C3%A9poser).

### Parties optionnelles


* Définir quatre niveaux d'accès au calendrier : création,
  modification, effacement, administration. Ajouter une page
  d'administration, accessible uniquement aux administrateurs, pour
  donner/enlever ces droits aux utilisateurs.
  
  Créer un utilisateur spécial *guest*, qui correspond aux droits des
  utilisateurs non-connectés.

* Gérer plusieurs calendrier : dans ce cas, chaque calendrier a un
  identifiant (par exemple toto, et sera accessible à l'adresse
  <http://serveur-calendrier/toto>).

* Faire en sorte que 15 minutes avant un événement, un message
  d'alerte soit affiché sur la page.

* Faire en sorte qu'à chaque modification d'événement, tous les
  navigateurs qui affichent le même calendrier soient mis à jour
  automatiquement.

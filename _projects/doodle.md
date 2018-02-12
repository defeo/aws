---
title: Doodle calendar
difficulty: 1
frameworks: Node, Silex
tags: ajax
---

Le but du projet est de créer une version simplifiée d'un doodle,
permettant à plusieurs utilisateurs de se mettre d'accord sur une
date. Chaque utilisateur peut voter pour les dates où il est
disponible, et tout le monde voit quelles dates ont le plus de
consensus.

### Description

Un doodle n'est qu'une collection de préférences individuelles pour
des jours de l'année. Une préférence est composée au moins de :

* une date,
* un créateur.

Ces champs sont reflétés dans une table MySQL. Une autre table MySQL
sera utilisée pour stocker les utilisateurs, leurs mots de passe, et
une couleurs qu'ils auront choisi au moment de la création du compte.

L'application est composée de deux *vues* :

- Une page pour enregistrer un nouvel utilisateur. Vous pouvez suivre
  le modèle déjà utilisé en TD.

- Une page principale, présentant le calendrier du mois, et :
  - soit un formulaire de login, si l'utilisateur n'est pas connecté,
  - soit un lien de déconnexion, si l'utilisateur est connecté.

#### La page principale

Sur la page principale, le planning du mois courant apparaît sous la
forme d'une grande table, avec **une semaine par ligne** et **une case
par jour**. Le tableau doit être généré par JavaScript. La hauteur des
cases doit être fixe.

Les préférences pour une date sont représentés en ajoutant un bloc (un
carré, ou une barre), coloré aux couleurs des utilisateurs, pour
chaque utilisateur ayant voté pour celle-ci. La case affiche aussi le
nombre total d'utilisateurs s'étant exprimés favorablement. Voici à
quoi cela pourrait ressembler :

<div style="width:100px;height:100px;border:solid thin black;margin:1ex auto;display:flex;align-content:flex-start;flex-wrap:wrap">
<p style="width:100px;font-size:12px;text-align:center;border-bottom:solid thin black">12 Mai 2016</p>
<div style="width:10px;height:10px;background-color:red"></div>
<div style="width:10px;height:10px;background-color:green"></div>
<p style="width:100px;text-align:center;opacity: 0.3">2</p>
</div>

Des boutons/menus permettent de naviguer dans les mois.

#### Ajout/suppression d'une préférence

Uniquement les utilisateurs connectés ont droit de répondre au
doodle. Il vont faire cela en interagissant avec le tableau du mois.

Un clic sur une case va engendrer une des deux actions suivantes :

- Si l'utilisateur ne s'est pas déjà exprimé favorablement pour cette
  date, une préférence est ajoutée à la base de données ;
- Si l'utilisateur s'est déjà exprimé favorablement, tous les blocs
  colorés de la case sont grisés, à l'exception du sien ; un clic sur
  son propre bloc, efface la préférence ; un clic ailleurs revient en
  mode normal.

Une interaction de type AJAX et préférable pour cette action.

**Attention :** prêtez attention à vérifier la validité d'une
insertion/suppression du côté serveur, et pas uniquement du côté
client.  Sans cette vérification, vous risquez d'ajouter une même
préférence deux fois. Affichez un message d'erreur sensé lorsque cette
étape de validation ne passe pas.

#### Routes

Vous êtes libres de structurer la logique de l'application comme vous
le souhaitez. Nous proposons ici un exemple de découpage en
gestionnaires :

- Route `/` : présentant la page principale.
- Route `/signup` : permettant de créer un nouvel utilisateur.
- Route `/login` : permettant de se connecter. Redirige vers `/` après
  un login réussi.
- Route `/logout` : permettant de se déconnecter. Redirige vers `/` après
  un logout réussi.
- Route `/ajouter` : permettant d'ajouter une préférence.
  - Si AJAX, renvoie un code de succès/erreur.
  - Si non-AJAX, redirige vers `/` après un ajout réussi.
- Route `/effacer` : permettant d'éliminer une préférence.
  - Si AJAX, renvoie un code de succès/erreur.
  - Si non-AJAX, redirige vers `/` après un ajout réussi.
- Route `/préférences` : renvoyant la liste de toutes les préférences
  exprimées au format JSON (ou XML, ou autre), pour la mise à jour de
  l'affichage client après une action. Uniquement si AJAX.

Vous aurez en plus les routes statiques pour le téléchargement des
contenus annexes : feuilles de style, scripts côté client, ...

### Ressources

Les guides des évènements

- [`mousedown`](https://developer.mozilla.org/fr/docs/Web/Events/mousedown),
- [`mouseup`](https://developer.mozilla.org/fr/docs/Web/Events/mouseup),
- [Drag and drop](https://developer.mozilla.org/fr/docs/Glisser_et_d%C3%A9poser),
- [Évènements tactiles](https://developer.mozilla.org/fr/docs/Web/Guide/DOM/Events/Touch_events).

### Parties optionnelles

* Permettre de basculer entre le mode d'affichage normal, et un autre
  mode où les jours sont rangés du plus voté au moins voté (et les
  jours sans votes ne sont pas affichés).

* Gérer les clics glissés (clics qui commencent sur une case et qui
  terminent sur une autre). Toutes les cases entre le début et la fin
  du clic sont sélectionnées ; si l'utilisateur s'est déjà prononcé en
  faveur de **toutes** ces dates, ses préférences sont effacées ;
  sinon, une préférence est ajoutée pour toute date qui n'est pas déjà
  sélectionnée. Utiliser des classes CSS pour visualiser la plage
  sélectionnée pendant le glissement.

* Ajouter la possibilité de créer plusieurs doodles indépendants,
  chacun comportant un id, et étant servi à une URL différente (par
  exemple le doodle *toto* sera accessible à l'adresse
  <http://serveur-calendrier/doodle/toto>).

* Définir quatre niveaux d'accès au doodle : création,
  modification, effacement, administration. Les administrateurs ont
  droit de modifier/effacer les préférences de tout le monde. Ajouter
  une page d'administration, accessible uniquement aux
  administrateurs, pour donner/enlever ces droits aux utilisateurs.

* Réaliser un affichage qui s'adapte à la taille de l'écran, notamment
  aux écrans mobiles. Ajouter de la gestion d'évènements tactiles, et
  tester avec un téléphone ou tablette.

* Utiliser une base de données No-SQL (par exemple MongoDB) à la place
  de MySQL.

* Utiliser AJAX pour ne télécharger de la base de données que les
  préférences du mois visualisé.
  
  Ou, encore mieux : pour rendre l'interface plus fluide, vous pouvez
  télécharger en même temps le mois courant, le mois précédent et le
  mois suivant. Lorsque l'utilisateur navigue dans les mois, vous
  utilisez la liste de préférences stockée en cache pour afficher le
  nouveau mois immédiatement, et vous lancez une nouvelle requête AJAX
  pour télécharger le contenu du nouveau bloc de trois mois. Gardez à
  l'esprit que le contenu d'un mois peut avoir changé entre le
  moment où les données ont été téléchargées, et le moment où
  l'utilisateur demande une navigation.

* Faire en sorte qu'à chaque modification de préférence, tous les
  navigateurs qui affichent le même doodle soient mis à jour
  automatiquement.

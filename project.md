---
layout: default
title: Propositions de projet
styles: css/collapsible.css
scripts: js/collapsible.js
---

<style>
.info {
  list-style-type: none;
  margin-top: -1em;
  font-size: 80%;
}
</style>

# Propositions de projet

Cette page présente les typologies de projet de développement
acceptées aux fins de validation du contrôle continu. Les projets ne
sont pas tous du même niveau : pour chacun on indique une estimation
de sa difficulté, et la note maximale à laquelle vous pouvez aspirer
en développant celui-ci.

Vous devez respecter les contraintes suivantes :

- Les projets sont à développer en groupe, idéalement en trinôme.

- Le code source est à rendre par mail au plus tard le dimanche 3 mai.

- Le projet doit faire l'objet d'une présentation orale la semaine du
  18-22 mai. Vous avez la possibilté de corriger votre code et y
  ajouter des fonctionnalités en vue de la soutenance. Le code soumis
  avant le 3 mai et le code final seront également jugés.

- Un *kickstarting*/*review* de votre projet sera fait en
  [semaine 9](./#semaine-9) sur la séance de TD habituelle. La
  présence à cette séance est obligatoire. Les groupes et les sujets
  devront être arrêtés à cette date, et ne pourront plus être
  modifiés, sauf dérogation exceptionnelle.

Il est conseillé d'héberger votre projet pour la démonstration
finale. [Heroku](https://heroku.com) et
[Openshift](https://openshift.com) sont deux plateformes gratuites
d'hébergement avec support pour PHP, Node.js et MySQL.


{% for p in site.projects %}
<div class="collapsible collapsed" id="project-{{ forloop.index }}">
<div class="always-on">
## {{ p.title }}


- *Frameworks :* {{ p.frameworks | join: ', ' }}
- *Difficulté :* {% for i in (1..p.difficulty) %}<i class="fa fa-star"></i>{% endfor %}
- *Mots-clé :* {{ p.tags | join: ', ' }}
{:.info}
</div>
<div class="toggleable">
{{ p.output }}
</div>
</div>
{% endfor %}

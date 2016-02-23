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
de sa difficulté.

- Les projets sont à développer en groupe, idéalement en trinôme.

- Le projet doit faire l'objet d'une présentation orale.

Il est conseillé d'héberger votre projet pour la démonstration
finale. [Heroku](https://heroku.com) et
[Openshift](https://openshift.com) sont deux plateformes gratuites
d'hébergement avec support pour PHP, Node.js et MySQL.


{% for p in site.projects %}{% if p.publish %}
<div class="collapsible collapsed" id="project-{{ forloop.index }}">
<div class="always-on">
## {{ p.title }}


- *Frameworks :* {{ p.frameworks | join: ', ' }}
- *Difficulté :* {% for i in (1..p.difficulty) %}<i class="fa fa-star"></i>{% endfor %}
- *Mots-clé :* {{ p.tags | join: ', ' }}
{:.info}
</div>
<div class="toggleable">
{{ p.content | markdownify }}
</div>
</div>
{% endif %}{% endfor %}

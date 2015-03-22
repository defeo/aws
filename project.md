---
layout: default
title: Propositions de projet
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
- Le code source est à rendre par mail au plus tard le ...
- Le projet doit faire objet d'une présentation orale la semaine du
  ...


{% for p in site.projects %}
## {{ p.title }}


- *Frameworks :* {{ p.frameworks | join: ', ' }}
- *Difficulté :* {% for i in (1..p.difficulty) %}<i class="fa fa-star"></i>{% endfor %}
- *Mots-clé :* {{ p.tags | join: ', ' }}
{:.info}

{{ p.output }}
{% endfor %}

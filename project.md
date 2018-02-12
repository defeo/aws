---
layout: default
title: Project proposals
styles: assets/css/collapsible.css
scripts: assets/js/collapsible.js
---

<style>
.info {
  list-style-type: none;
  margin-top: -1em;
  font-size: 80%;
}
</style>

# Project proposals

Here are the development project that will be accepted for passing the
course. The difficulty of each project is not the same: stars indicate
how difficult each project is.

- Projects must be developed in pairs.

- You are expected to give an oral presentation of your project with a
  demonstration.

You can develop and host your projects on
[Glitch](https://glitch.com). Other (free) options for hosting your
project are [Heroku](https://heroku.com) and
[Now](https://zeit.co/now).

{% for p in site.projects %}{% if p.publish %}
<div class="collapsible collapsed" id="project-{{ forloop.index }}">
<div class="always-on">
## {{ p.title }}


- *Difficulty:* {% for i in (1..p.difficulty) %}<i class="fa fa-star"></i>{% endfor %}
- *Keywords:* {{ p.tags | join: ', ' }}
{:.info}
</div>
<div class="toggleable">
{{ p.content }}
</div>
</div>
{% endif %}{% endfor %}

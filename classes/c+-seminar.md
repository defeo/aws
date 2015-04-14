---
layout: default
title: Interfaces utilisateur rapides avec React.js
subtitle: Intervention par CANAL+
---

# Interfaces utilisateur rapides avec React.js <span class="subtitle">(Intervention par CANAL+)</span>

### Intervenants

- [Pierre Guilleminot](https://github.com/jinroh)
- [Alexandre Duros](https://github.com/alexduros)

**Quand :** Le mercredi 15 avril 2015, à 13h30.

**Où :** Amphi B, [UFR de Sciences, Université de Versailles](http://www.sciences.uvsq.fr/).

## Qui sommes-nous ? 

Nous travaillons dans l'équipe innovation de CANAL+, et notre rôle est
de défricher les sujets techniques qui peuvent avoir un intérêt pour
CANAL+ dans son métier de distributeur (par ex., permettre aux gens de
regarder la télé). Pendant 2 ans, nous avons travaillé sur la refonte
du logiciel du décodeur. Depuis septembre 2014, notre travail se
concentre notamment sur la problématique de lire nos contenus au sein
des navigateurs web.

## De quoi allons-nous discuter ? 

Une forte dominante dans nos axes de travail est le web. Depuis
maintenant 4 ans, nous sommes convaincus qu'il est plus facile de
développer une interface en HTML / Javascript plutôt qu'en Java, voire
un autre language natif (n'est-ce pas ?).  Ainsi, nous avons développé
une forte expertise en web, notamment dans le développement de *web
applications*, c'est-à-dire des applications mono-page dont le
fonctionnel et la réaction aux évènements clients est uniquement géré
en JavaScript.

Comme évoqué précédemment, l'interface utilisateur du décodeur CANAL+
utilisé par nos 6 millions d'abonnés fonctionne de cette manière.

Dans ce contexte, nous nous intéressons aux technologies du web qui
vont dans ce sens, mais peuvent aussi se révéler intéressantes en
termes de maintenabilité, de facilité de développement, et de
portabilité sur divers *devices*.
[React](https://facebook.github.io/react/) est un bon client pour
adresser ces divers problèmes.

Depuis quelques mois, nous utilisons React afin de développer une
version HTML5 du player premium, tel que vous pouvez le voir sur
[myCanal](http://live.mycanal.fr) si vous êtes abonnés et que vous
utilisez Chrome 40+.

Notre but est donc ici de discuter de React, afin de montrer en quoi
ce genre de technologie très récente peut s'avérer très intéressant
pour un acteur comme CANAL+.


## Ressources

Pour notre intervention, nous proposons 2 types de ressources :

- Une série de vidéos / docs pour découvrir ce qu'est React ;

- Une page d'exemple qui fait tourner une application React, un
*player* minimaliste que nous comptons ouvrir en open source, avec un
*« core player »* que nous développons actuellement. Le *« core
player »* en lui-même sort du scope de React, mais si le sujet vous
intrigue ou vous intéresse, nous serons ravis de vous en parler au
cours de notre intervention.


### Vidéos

#### Introduction à React

Tout d'abord, 2 vidéos introductives :

- Une [première vidéo](https://www.youtube.com/watch?v=XxVg_s8xAms)
  assez détaillée, qui fait un tour de React ;
- Une [seconde vidéo](https://www.youtube.com/watch?v=qqVbr_LaCIo),
  proposant une session de live-coding.


#### Pour aller plus loin

Une seconde série de vidéos que nous vous proposons aborde des sujets
liés au
[DOM Virtuel](https://facebook.github.io/react/docs/glossary.html),
notion importante de React :

- [PeteHunt: Secret's to Virtual DOM](https://www.youtube.com/watch?v=-DX3vJiqxm4)
- [Vjeux: Why does React Scale?](https://www.youtube.com/watch?v=D-ioDiacTm8)

### Docs

#### Introduction

Tout d'abord, React propose une documentation relativement
conséquente, mise à jour quotidiennement puisque le projet est en
pleine évolution, qui se trouve
[ici](https://facebook.github.io/react/docs/getting-started.html)

Parallèlement à ça, voici plusieurs ressources abordant la genèse de
React :

- [Removing User Interface Complexity, or Why React is Awesome](http://jlongster.com/Removing-User-Interface-Complexity,-or-Why-React-is-Awesome)
- [Why did we build React ? - Facebook](http://facebook.github.io/react/blog/2013/06/05/why-react.html)
- [A Quick Introduction to React](http://words.taylorlapeyre.me/an-introduction-to-react)
- [An Introduction to React.js](http://www.instrument.com/developers/an-introduction-to-react-js)

#### Pour aller plus loin

Pour approfondir, l'article suivant aborde l'algorithme de diff qui
permet à React d'être performant :

- [React performance](http://blog.vjeux.com/2013/javascript/react-performance.html)

### Démo 

Pour illustrer ce que peut permettre React, voici un exemple d'un
player minimaliste. Cette application est destinée à être mise à
disposition des développeurs, afin qu'ils puissent utiliser celle-ci
au sein de leurs applications web.

- [Démo Player](http://ovh10.canallabs.fr/~jinroh/react-player/)

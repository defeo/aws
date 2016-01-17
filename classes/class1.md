---
title: Le WWW
subtitle: son histoire, ses langages
video:
  url: https://www.dropbox.com/s/zhqfrbooj1g0fhj/class-2015-02-04.webm?dl=1
---

<section>

## Applications Web et Sécurité

<div class="incremental">

**Le prof :** Luca De Feo <http://defeo.lu/>

#### Le matériel de cours

- Le site (slides, TPs, vidéos) : <http://defeo.lu/aws/>.
- Pour ne pas perdre une mise à jour : le
  [flux ATOM](https://github.com/defeo/aws/commits/gh-pages.atom).

**Le blog :** <http://defeo.lu/blog/> <small>(En anglais, un peu vide...)</small>

#### Les technologies

* [HTML5](http://www.w3schools.com/html/html5_intro.asp),
  [CSS3](http://www.w3schools.com/css/css3_intro.asp), (un minimum de
  familiarité est attendue),
* [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), [JSON](http://www.json.org/), AJAX, (WebSockets ?),
* [PHP](http://www.php.net/manual/fr/), [Twig](http://twig.sensiolabs.org/), [Symfony](http://symfony.com/doc/current/index.html)
* [MySql](http://dev.mysql.com/doc/refman/5.6/en/index.html), [Sqlite](http://www.sqlite.org/about.html), (Key-value stores ?)
* **Optionnel :** [Node.js](http://nodejs.org/about/), [Express.js](http://expressjs.com/).

</div>
</section>
<section>

### La structure du cours

- 8 cours : Mercredi 13h30 - 15h, amphi B,
- 8 TPs sur machine :
  - Groupe 1 : Jeudi 9h45 - 13h, salle ALSACE,
  - Groupe 2 : Mercredi 15h15 - 18h30, salle ALSACE,
  - Groupe 3 : Lundi 13h30 - 16h45, salle G207.
  
  Venez avec *votre ordinateur* ou un *cartable numérique*.
  **Apportez un cable ethernet !** Développement dans le cloud grâce à
  l'IDE [Cloud9](https://c9.io).
	  
- Évaluation : 0.4 CC + 0.6 Ex (consulter scolarité)
  - Contrôle continu : projet à développer en TD
  - Examen : en amphi.
  
  voir aussi le [site de l'an dernier](http://defeo.lu/aws-2014).

{:.incremental}

</section>
<section>

# L'histoire du WWW

</section>
<section>

## L'histoire du WWW

De l'excellente [Courte histoire du World Wide Web](http://www.w3.org/History.html)

**1990** Tim Berners-Lee (MIT) et Robert Calliau (CERN) inventent le
*World Wide Web*

> HyperText is a way to link and access information of various kinds
> as a web of nodes in which the user can browse at will.
{:.cite}

En trois mois ils

- Définissent les Hypertextes, basés sur Dynatext SGML (précurseur de HTML) ;
- Inventent le protocole HTTP ;
- Écrivent le premier serveur web,
- et le premier browser **et éditeur** (appelé WorldWideWeb, puis Nexus).

</section>
<section>

### Le concept original

> HyperText is a way to link and access information of various kinds
> as a web of nodes in which the user can browse at will.
{:.cite}

![Image de la proposition originale de Berners-Lee](http://www.w3.org/History/1989/Image2.gif)
{:.centered}

</section>
<section>

### L'histoire du WWW

**1993** ViolaWWW et Mosaic sont les premiers browsers graphiques populaires.

**1994** Fondation du World Wide Web Consortium (W3C) par Berners-Lee.

**1995** Première release du serveur web Apache.

**1995** Rasmus Ledorf crée PHP.

**1995** Le développement de Netscape (précurseur de Mozilla) commence. JavaScript est né.

**1996** Macromedia distribue Flash.

**1997** Standardisation de JavaScript en ECMAScript. Les documents deviennent *dynamiques*.

</section>
<section>

### Structure d'une page Web 1.0

![Description du modèle de flux de données du Web 1.0, par Jesse J Garret](../assets/web1.0.png)
{:.centered}

</section>
<section>

**1998** Publication du standard XML.

**1999** Java popularise (crée?) le terme *Application Web*.

> Java Servlet API 2.2 includes one new feature so significant it
> may change the way the Web works. That feature: <span
> style="color:red">Web applications</span>.
{:.cite}

**2002** Publication du format d'échange de données JSON.

**2004** Des membres de Apple, Mozilla et Opera quittent le W3C pour
fonder le WHATWG. Le travail sur HTML5 est amorcé.

**2005** Jesse James Garret crée le mot *AJAX*, acronyme de
"Asynchronous Javascript and XML". Les applications web abandonnent le
design push-pull.

**2007** Le groupe de travail HTML du W3C accepte d'utiliser le draft
  de HTML5 du WHATWG's comme base pour son prochain standard HTML.

**2014** HTML 5.0 devient une recommandation en octobre.

</section>
<section>

### Structure d'une application AJAX

![Description of the AJAX dataflow model, by Jesse J Garret](../assets/web2.0.png)
{:.centered}


</section>
<section>

## Pour la semaine prochaine

* Révisez vos bases de HTML et CSS. Les tutoriels des W3Schools
  peuvent vous aider :
  - <http://www.w3schools.com/html/html5_intro.asp>,
  - <http://www.w3schools.com/css/css3_intro.asp>.
* Créez-vous un compte sur Cloud9 <https://c9.io/>.
* Vérifiez, si possible, que vous arrivez à vous servir d'internet et
  à vous connecter sur Cloud9 depuis votre salle de TP (avec votre
  ordinateur, ou un cartable numérique).

C'est tout !

</section>

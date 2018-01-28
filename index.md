---
layout: default
title: Home
---

# AWS – Applications web et sécurité

Cours de niveau Master sur la programmation web moderne, et
introduction à la sécurité des applications web.

**Almæ matres:** [![](http://www.uvsq.fr/jsp/images/favicon.png) Université de Versailles – 
  ![](https://www.universite-paris-saclay.fr/profiles/saclay/themes/saclay_v2/favicon.ico) Paris Saclay](https://www.universite-paris-saclay.fr/fr/formation/master/m1-informatique-site-de-versailles#presentation-m1)
  et
  [![](http://www.isty.uvsq.fr/images/ISTY/favicon.png) ISTY](http://www.isty.uvsq.fr/institut-des-sciences-et-techniques-des-yvelines/langue-fr/cycle-ingenieur-informatique/presentation/cycle-ingenieur-informatique-231898.kjsp)

**Mots clés:** Web, HTML5, CSS, JavaScript, Node.js,
  Sécurité, HTTPS, Injection SQL, XSS, CSRF.

## Contenus du cours

#### **8 décembre 2017:** [Amphi de presentation (slides)](presentation)

{% include plan.html plan=site.data.plan %}


### Modalités d'évaluation

- **30%** [Questionnaires](addons/clicker/results);
- **80%** [Projet final](project).

## Archives

Éditions précédentes de ce cours :

- [2016-2017](http://defeo.lu/aws-2017)
- [2015-2016](http://defeo.lu/aws-2016)
- [2014-2015](http://defeo.lu/aws-2015)
- [2013-2014](http://defeo.lu/aws-2014)

## Liens utiles

#### Pour les TDs

- Mes [CodePens](https://codepen.io/collection/AaMOJZ/) et mes
  [Glitches](https://glitch.com/@defeo), qui démontrent comment
  exécuter les passages délicats de certains TDs.
- Les validateurs HTML <https://validator.w3.org/> et CSS <https://jigsaw.w3.org/css-validator/>.

#### Documentation

- Le framework [Express](https://expressjs.com/) pour Node.js.

#### Associations de développeurs

- Les initiations gratuites de NodeSchool Paris <https://nodeschool.io/paris/>.
- Le [groupe français des utilisateurs de Node.js](https://plus.google.com/communities/113346206415381691435).

#### Autres

- Les ressources pédagogiques de B. Pesquet sur
  [OpenClassrooms](https://openclassrooms.com/membres/bpesquet), et
  [encore d'autres](http://www.bpesquet.fr/)


## Bibliographie

La bibliographie sur la programmation web est surabondante. La
BU regorge de littérature redondante et obsolescente sur le sujet.

Pour approfondir vos connaissances sur HTML, JavaScript, etc., vous
pouvez prendre essentiellement n'importe quel livre de la BU et le
feuilleter. Évitez les livres trop vieux : contrôlez que la première
édition (pas la dernière) n'ait pas été écrite plus de, disons, il y a
cinq ans.

Suit une modeste sélection de liens et livres qui pourront vous être
plus utiles que la moyenne.

---

### HTML et CSS

W3Schools. *HTML5 Tutorial*
: <https://www.w3schools.com/html/>. Très bon tutoriel pour
débutants. Exemples à essayer en ligne.

W3Schools. *CSS Tutorial*
: <https://www.w3schools.com/CSS/>.  Très bon tutoriel pour
débutants. Exemples à essayer en ligne.

W3Schools.
: <https://www.w3schools.com>. D'autres tutoriels sont aussi
disponibles sur le site de W3Schools.

Mozilla Developer Network. *Ressources HTML*.
: En anglais <https://developer.mozilla.org/en-US/docs/Web/HTML>, et
en français <https://developer.mozilla.org/fr/docs/Web/HTML>

Mozilla Developer Network. *Ressources CSS*.
: En anglais <https://developer.mozilla.org/en-US/docs/Web/CSS>, et
en français <https://developer.mozilla.org/fr/docs/Web/CSS>

L. van Lancker. *HTML5 et CSS3*
: Eni Éditions, 2011. ISBN: 978-2-7460-6242-9. Côte BU: 005.71htm
VAN. Manuel d'introduction à HTML et CSS.

B. Lawson and R. Sharp. *Introduction à HTML5*
: Pearson Education France, 2011. ISBN: 978-2-7440-2476-4. Côte
BU: 005.71htm LAW. Destiné à ceux qui connaissent déjà HTML4.

---

### JavaScript et AJAX

Marijn Haverbeke. *Eloquent JavaScript*.
: No Starch Press 2014. Disponible en ligne en anglais
	<https://eloquentjavascript.net/>. Bel ouvrage sur JavaScript et le
	DOM. La première édition est aussi disponible en français
	<http://fr.eloquentjavascript.net/>, et à la BU (côte 005.71jaS HAV).

Baptiste Pesquet. *The JavaScript Way*.
: LeanPub 2017. <https://leanpub.com/thejsway>. Sources disponibles en
  CC 4.0 sur <https://github.com/bpesquet/thejsway>.

Mozilla Developer Network. *JavaScript Guide*.
: En anglais
	<https://developer.mozilla.org/en-US/docs/JavaScript/Guide> et en
	français <https://developer.mozilla.org/fr/docs/JavaScript/Guide>. La
	première référence pour JavaScript.

Mozilla foundation. Mozilla DOM resources.
: La référence sur le DOM <https://developer.mozilla.org/en/DOM>.

D. Crockford. *JavaScript. Gardez le meilleur !*.
: Pearson 2008. ISBN: 978-2-7440-2328-6. Côte BU : 005.13jaS
CRO. Référence pour la syntaxe JavaScript.

I. Wetzel and Z. Yi Jiang. *JavaScript Garden*.
: <https://bonsaiden.github.com/JavaScript-Garden/>. Un guide aux
détails méconnus de JavaScript.

C. Porteneuve. *Bien développer pour le Web 2.0*.
: 2ème édition. Eyrolles, 2009. ISBN: 978-2-212-12391-3. Côte
BU: 005.71aja POR. Livre excellent pour l'apprentissage de
JavaScript et AJAX, même s'il commence à prendre de l'age.

N. C. Zakas. *Professional JavaScript for Web Developers*.
: 3rd edition. John Wiley & Sons, 2012. ISBN: 978-1-118-02669-4. Côte
BU : 005.71jas ZAK. Livre très complet, centré sur le JavaScript côté
client. Référence complète à JavaScript et au DOM, plus des extras sur
les technologies récentes comme les Canvas et les Web Sockets.

T. Stubbs and G. Allain. *JQuery, Le guide complet*
: Micro Application Éditions, 2011. ISBN: 978-2-300-036194. Côte
BU: 005.71jsp ALL. Pour les programmeur déjà calé en Javascript.

---

### Node.js

*Node school*.
: <https://nodeschool.io/>, tutoriels interactifs.

*The Node.js API reference*.
: <https://www.nodejs.org/api>, le manuel de référence.

M. Kiessling. *The Node beginner guide*.
: en anglais <https://www.nodebeginner.org/> et français
	<https://nodejs.developpez.com/tutoriels/javascript/node-js-livre-debutant/>.

F. Geisendörfer. *Node.js Guide*
: <https://nodeguide.com/>.

A. MacCaw. *JavaScript Web Applications*.
: O'Reilly 2011. ISBN: 978-1-449-30351-8. Côte BU: 005.71jsp
MAC. Livre avancé sur JavaScript côté client et côté
serveur. Aborde les patrons de développement (surtout MVC),
la délégation de contrôle, et les frameworks JavaScript.

M. Nebra. *Des applications ultra-rapides avec Node.js*
: [Cours sur OpenClassrooms](https://fr.openclassrooms.com/informatique/cours/des-applications-ultra-rapides-avec-node-js) (anciennement Site du zéro).

[Ilya Grigorik](https://www.igvita.com/). *High performance Browser Networking*.
: O'Reilly 2013. <https://hpbn.co/>. Texte avancé sur les techniques
de communication à bande large disponibles dans le navigateur.

---

### Sécurité

M. Zalewski. *Browser Security Handbook*.
: Google Inc 2009.
	<https://code.google.com/p/browsersec/wiki/Main>. Excellente traité sur
	la sécurité des browsers, la Same Origin Policy et d'autres
	mécanismes expérimentaux.

M. Zalewski. *The Tangled Web*.
: No Starch Press 2011. ISBN
978-1-593-27388-0. <http://lcamtuf.coredump.cx/tangled/>. Côte
BU 005.8 ZAL. Traité complet sur la sécurité des applications
web. Dérivé de l'ouvrage précédent, mais plus complet et plus à jour.

Mozilla Developer Network. *Sécurité Web*.
: <https://developer.mozilla.org/en-US/docs/Web/Security>

OWASP. *OWASP development guide*
: <https://www.owasp.org/index.php/Category:OWASP_Guide_Project>.
Guide complet à la sécurité des applications web.
	
OWASP. *OWASP development guide*
: <https://www.owasp.org/>.  Wiki de la fondation OWASP.

D. Seguy and P. Gamache. *Sécurité PHP5 et MySQL*.
: 2ème édition. Eyrolles 2009. ISBN: 978-2-212-12554-2. Côte BU: 005.8
SEG. Livre d'introduction sur la sécurité web. Le chapitre 2 traîte
XSS et CRSF. Les chapitres suivants sont plutôt orientés vers la
pratique et donnent des conseils pour sécuriser les applications
PHP+MySQL.

R. Cannings, H.Dwivedi and Z. Lackey. *Haking sur le Web 2.0*
: Pearson Education France, 2008. ISBN: 978-2-7440-2306-4. Côte BU:
005.8 CAN. Mal écrit et pis traduit, il s'agit d'un pamphlet
publicitaire pour la boîte des auteurs. Cependant, il est l'un des
rares ouvrages sur la sécurité disponibles à la BU. Les parties I et
II valent le détour.

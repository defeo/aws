---
layout: lesson
title: Le Web
subtitle: Passé, présent, futur
scripts: ../assets/js/chart/Chart.min.js
---

<section>

## L'histoire du WWW

De l'excellente [Courte histoire du World Wide Web](http://www.w3.org/History.html)

**1990 :** Tim Berners-Lee (MIT) et Robert Calliau (CERN) inventent le
*World Wide Web*


> HyperText is a way to link and access information of various kinds
> as a web of nodes in which the user can browse at will.
{:.cite}

#### En trois mois ils...

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
<section class="compact">

### Course aux armements

|**1993**| ViolaWWW et Mosaic sont les premiers browsers graphiques populaires.
|**1994**| Fondation du World Wide Web Consortium (W3C) par Berners-Lee.
|**1995**| Sortie du serveur web Apache.
|        | Rasmus Ledorf crée PHP.
|        | Brendan Eich, employé par Netscape Communications, crée JavaScript (en [10 jours](http://youtu.be/IPxQ9kEaF8c))
|**1996**| Sortie de Flash, par Macromedia.
|        | Publication du standard CSS 1.
|**1997**| Sortie de Internet Explorer 4.0. Il est installé par défaut avec Windows.
|        | Standardisation de JavaScript en ECMAScript.
|**1998**| Netscape publie le code source de Netscape Communicator, et démarre le projet Mozilla.
|        | Netscape Communications est acheté par AOL.
|**1999**| Sortie de Internet Explorer 5.0.
{:.pretty.content}

</section>
<section>

### Première guerre des navigateurs

<div class="two-cols" style="align-items:center">
![](https://upload.wikimedia.org/wikipedia/commons/2/24/Browser_Wars_%28en%29.svg)
{:.centered}

**Source :** [Wikipedia](https://en.wikipedia.org/wiki/File:Browser_Wars_%28en%29.svg#file)
</div>

</section>
<section>

### Le moyen âge

|**1998**| Publication du standard XML. Démarrage des travaux sur XHTML.
|**2000**| Publication du standard XHTML par le W3C.
|**2001**| Sortie de Internet Explorer 6.0.
|**2005**| Sortie de Internet Explorer 7. Les documents `application/xhtml+xml` ne sont pas affichés correctement.
|**2009**| Sortie de Internet Explorer 8. Les documents `application/xhtml+xml` ne sont toujours pas affichés correctement !
{:.pretty.content}

> "The XHTML family is the next step in the evolution of the
> Internet. By migrating to XHTML today, content developers can enter
> the XML world with all of its attendant benefits, while still
> remaining confident in their content's backward and future
> compatibility."
{:.cite}

</section>
<section class="compact">

### Renaissance

|**1998**| Microsoft crée l'API `XMLHTTP`, pour Outlook Web Access,
|**1999**| Microsoft inclut `XMLHTTP` dans ActiveX.
|**2000**| Mozilla implante l'API `XMLHTTP` de Microsoft en JavaScript, sous le nom `XMLHttpRequest`.
|**2002**| Publication du format d'échange de données JSON.
|**2004**| Des membres de Apple, Mozilla et Opera quittent le W3C pour fonder le WHATWG. Le travail sur HTML5 est amorcé.
|        | Google lance GMail.
|**2005**| Google lance Google Maps.
|        | Jesse James Garret crée le mot *AJAX*.
|**2007**| Le W3C annonce qu'il va travailler avec le WHATWG pour standardiser HTML5.
|**2011**| Adobe annonce qu'il va arrêter le développement de Flash, pour se concentrer sur HTML5.
|**2014**| HTML 5.0 devient une recommandation du W3C.
{:.pretty.content}

</section>
<section>

### Il n'y a pas que les navigateurs...

|**2004**| Première version du serveur nginx (serveur haute performance, à évènements)
|**2009**| Première version de Node.js, basée sur le moteur V8 de Chrome.
|**2011**| Standardisation du protocole WebSocket.
|**2012**| Google expérimente avec le protocole SPDY.
|**2015**| Standardisation de HTTP/2.
|        | Google annonce la fin de vie de SPDY.
|**2016**| Lancement de Let's encrypt, première autorité de certification TLS gratuite.
{:.pretty.content}

</section>
<section>

### Retour aux hostilités

|**2002**| Apple *forke* KHTML et KJS, les moteurs du navigateur Konqueror. Le projet est nommé WebKit.
|**2003**| Sortie de Safari pour MacOS.
|**2004**| Sortie de Firefox 1, par la Mozilla Foundation.
|**2008**| Sortie de Chrome 1, par Google, basé sur le moteur de rendu WebKit, et son propre moteur JavaScript V8.
|**2011**| Sortie de Internet Explorer 9. C'est le premier navigateur de Microsoft a obtenir un score de 100/100 aux tests Acid3.
|**2013**| Google crée Blink, son propre *fork* de WebKit.
|        | Opera change son moteur de rendu pour Blink.
|**2015**| Sortie de Edge, par Microsoft.
{:.pretty.content}

</section>
<section>

### Deuxième guerre des navigateurs

<div class="two-cols content">
<style scoped>
.legend { list-style-type: none }
.legend em { display: inline-block; width: 1em; height: 1em; }
#ie-edge { background-color: blue}
#chrome { background-color: green}
#ffox { background-color: orange}
#safari { background-color: gray}
#opera { background-color: red}
#autres { background-color: black}
</style>
<canvas id="snd-browser-war" width="700" height="400"></canvas>

- * *{:#ie-edge} IE+Edge
- * *{:#chrome} Chrome
- * *{:#ffox} Firefox
- * *{:#safari} Safari
- * *{:#opera} Opera
- * *{:#autres} Autres
{:.legend}

</div>
<script>
document.on('DOMContentLoaded', () => {
var stats = [
  {% for q in site.data.statcounter-browser %}
  { {% for b in q %}"{{ b[0] }}": "{{ b[1] }}", {% endfor %} },
  {% endfor %}
];
var other = (q) => {
  var sum = 0;
  for (k in q) sum += /Date|IE|Edge|Chrome|Firefox|Safari|Opera/.test(k) ? 0 : parseFloat(q[k]);
  return sum;
}
var myNewChart = new Chart($("#snd-browser-war").getContext("2d")).Line({
  labels: stats.map((q) => q.Date.replace('-', ' q')),
  datasets: [
    { label: 'IE+Edge', data: stats.map((q) => parseFloat(q.IE) + parseFloat(q.Edge)), pointColor: 'blue', strokeColor: 'blue' },
    { label: 'Chrome', data: stats.map((q) => q.Chrome), pointColor: 'green', strokeColor: 'green' },
    { label: 'Firefox', data: stats.map((q) => q.Firefox), pointColor: 'orange', strokeColor: 'orange' },
    { label: 'Safari', data: stats.map((q) => q.Safari), pointColor: 'gray', strokeColor: 'gray' },
    { label: 'Opera', data: stats.map((q) => q.Opera), pointColor: 'red', strokeColor: 'red' },
    { label: 'Autres', data: stats.map(other), pointColor: 'black', strokeColor: 'black' },
  ]
}, {
  datasetFill: false,
  animation: false,
  scaleLabel: '<%=value%>%',
});
console.log(stats.map(other));
});
</script>


**Source :** [StatCounter Global Stats - Browser Market Share](http://gs.statcounter.com/browser-market-share/desktop/worldwide/#quarterly-200901-201701).

</section>
<section>

### Internet et les marchés financiers

En 2000, les marchés financiers vivent une période d'*exubérance
irrationnelle* pour le web :

- **Get large or get lost :** beaucoup de start-ups technologiques se
  lancent sur le marché sans réel *business plan*, dépensent des
  fortunes pour agrandir leur clientèle.

- Ajouter un **« e- »** dans le nom, ou refaire un site web peut faire
  rebondir de 10× la valeur d'une action.

- Beaucoup font faillite rapidement. Survivants notables : Google,
  eBay, Amazon, ...

<div class="two-cols" style="align-items: center">

<div>
<canvas id="nasdaq" width="600" height="280"></canvas>
<script>
var nasdaq = new Map([
  {% for q in site.data.nasdaq reversed %}
  [ new Date("{{ q.Date }}"), {{ q.Close }}],
  {% endfor %}
]);
document.on('DOMContentLoaded', () => {
new Chart($("#nasdaq").getContext("2d")).Line({
  labels: Array.from(nasdaq.keys()).map(function (d) { return d.getMonth() ? '' : d.getUTCFullYear() }),
  datasets: [
	{ label: 'NASDAQ Composite',
	data: Array.from(nasdaq.values()),
	pointColor: 'transparent', pointStrokeColor: 'transparent', strokeColor: 'blue' },
  ]
}, {
  animation: false,
  datasetFill: false,
  showTooltips: false,
  bezierCurve: false,
});
});
</script>
</div>

Indice **NASDAQ Composite** 1995--2017  
(source : [Yahoo Finance](http://finance.yahoo.com/q/hp?s=^IXIC)).

</div>

</section>
<section>

### Inscriptions universitaires en Sciences et Ingénierie (États-Unis)

<div class="two-cols content">
<style scoped>
.legend { list-style-type: none }
.legend em { display: inline-block; width: 1em; height: 1em; }
#cs { background-color: red}
#eng { background-color: blue}
#bio { background-color: green}
#phys { background-color: yellow}
</style>
<canvas id="inscriptions" width="600" height="400"></canvas>

- * *{:#cs} Math/Info
- * *{:#eng} Ingénierie
- * *{:#bio} Biologie
- * *{:#phys} Physique
{:.legend}

</div>
<script>
document.on('DOMContentLoaded', () => {
new Chart($("#inscriptions").getContext("2d")).Line({
  labels: Array(20).fill(null).map(function (x,i) { return 1995+i }),
  datasets: [
	{ label: 'Total',
	data: [23.5,25.3,25.7,23.3,24.8,23.9,23.9,23.1,22.1,22.9,21.3,21.5,21.5,23.8,25.1,27.0,28.8,28.8,32,35],
	pointColor: 'transparent', pointStrokeColor: 'transparent', fillColor: '#eee' },
    { label: 'Physique',
	data: [2.3,2.1,2.1,1.8,1.9,1.8,1.9,2.0,2.0,2.3,2.8,2.3,2.4,2.4,2.5,2.7,2.8,2.5,2.4,2.5],
	pointColor: 'yellow', strokeColor: 'yellow', fillColor: 'transparent' },
    { label: 'Biologie',
	data: [9.4,9.3,9.1,8.1,8.2,7.5,7.5,7.8,7.7,8.3,8.1,8.8,9.1,9.8,10.4,11.6,11.4,12.9,14.7,13.8],
	pointColor: 'green', strokeColor: 'green', fillColor: 'transparent' },
    { label: 'Ingénierie',
	data: [8.1,9.6,9.7,8.2,9.0,8.7,9.1,9.5,9.3,9.6,8.4,8.0,7.5,9.3,9.7,10.3,12.0,10.3,11.2,13.8],
	pointColor: 'blue', strokeColor: 'blue', fillColor: 'transparent' },
    { label: 'Informatique',
	data: [3.7,4.3,4.8,5.2,5.7,5.9,5.4,3.8,3.1,2.7,2.0,2.4,2.5,2.3,2.5,2.4,2.6,3.1,3.7,4.9],
	pointColor: 'red', strokeColor: 'red', fillColor: 'transparent' },
  ]
}, {
  animation: false,
  scaleLabel: '<%=value%>%',
  bezierCurve: false,
});
});
</script>

**Source :** National Science Foundation, [SEI 2012](http://www.nsf.gov/statistics/seind12/c2/c2s2.htm), [SEI 2016](http://www.nsf.gov/statistics/2016/nsb20161/).

</section>
<section>

### Cibles mobiles

|**2006**| Opera est le premier navigateur mobile à passer les tests Acid2.
|**2007**| Apple met en vente l'iPhone 1.
|**2008**| Le premier smartphone Android (HTC Dream) est mis en vente.
|**2010**| Microsoft lance Windows Phone.
|**2014**| Microsoft achète Nokia Mobile.
|        | Google lance le programme Android One, cible les marchés émergents.
|**2016**| Le nombre d'utilisateurs de smartphones atteint 2 milliards.
{:.pretty.content}

</section>
<section>

### Mobile vs Desktop

<div class="two-cols content">
<style scoped>
.legend { list-style-type: none }
.legend em { display: inline-block; width: 1em; height: 1em; }
#mobile { background-color: blue}
#desktop { background-color: red}
#tablet { background-color: green}
</style>
<canvas id="mobile-vs-desktop-canvas" width="700" height="400"></canvas>

- * *{:#desktop} Desktop
- * *{:#mobile} Mobile
- * *{:#tablet} Tablet
{:.legend}

</div>
<script>
document.on('DOMContentLoaded', () => {
var stats = [
  {% for q in site.data.statcounter-mobile-vs-desktop %}
  { {% for b in q %}"{{ b[0] }}": "{{ b[1] }}", {% endfor %} },
  {% endfor %}
];
var myNewChart = new Chart($("#mobile-vs-desktop-canvas").getContext("2d")).Line({
  labels: stats.map((q) => q.Date.replace('-', ' q')),
  datasets: [
    { label: 'Desktop', data: stats.map((q) => q.Desktop), pointColor: 'red', strokeColor: 'red' },
    { label: 'Mobile', data: stats.map((q) => q.Mobile), pointColor: 'blue', strokeColor: 'blue' },
    { label: 'Tablet', data: stats.map((q) => q.Tablet), pointColor: 'green', strokeColor: 'green' },
  ]
}, {
  datasetFill: false,
  animation: false,
  scaleLabel: '<%=value%>%',
});
});
</script>

**Source :** [StatCounter Global Stats - Desktop vs Mobile vs Tablet Market Share Worldwide](http://gs.statcounter.com/platform-market-share/desktop-mobile-tablet/worldwide/#quarterly-200901-201701).

</section>
<section>

### Navigateurs mobiles

<div class="two-cols content">
<style scoped>
.legend { list-style-type: none }
.legend em { display: inline-block; width: 1em; height: 1em; }
#android { background-color: blue}
#m-chrome { background-color: green}
#ucb { background-color: orange}
#m-safari { background-color: gray}
#m-opera { background-color: red}
#rim { background-color: purple}
#m-autres { background-color: black}
</style>
<canvas id="mobile-war" width="700" height="400"></canvas>

- * *{:#android} Android
- * *{:#m-chrome} Chrome
- * *{:#ucb} UC Browser
- * *{:#m-safari} Safari
- * *{:#m-opera} Opera
- * *{:#rim} BlackBerry
- * *{:#m-autres} Autres
{:.legend}

</div>
<script>
document.on('DOMContentLoaded', () => {
var stats = [
  {% for q in site.data.statcounter-mobile %}
  { {% for b in q %}"{{ b[0] }}": "{{ b[1] }}", {% endfor %} },
  {% endfor %}
];
var other = (q) => {
  var sum = 0;
  for (k in q) sum += /Date|Android|Chrome|UC Browser|Safari|BlackBerry|Opera/.test(k) ? 0 : parseFloat(q[k]);
  return sum;
}
var myNewChart = new Chart($("#mobile-war").getContext("2d")).Line({
  labels: stats.map((q) => q.Date.replace('-', ' q')),
  datasets: [
    { label: 'Android', data: stats.map((q) => q.Android), pointColor: 'blue', strokeColor: 'blue' },
    { label: 'Chrome', data: stats.map((q) => q.Chrome), pointColor: 'green', strokeColor: 'green' },
    { label: 'UC Browser', data: stats.map((q) => q['UC Browser']), pointColor: 'orange', strokeColor: 'orange' },
    { label: 'Safari', data: stats.map((q) => q.Safari), pointColor: 'gray', strokeColor: 'gray' },
    { label: 'Opera', data: stats.map((q) => q.Opera), pointColor: 'red', strokeColor: 'red' },
    { label: 'BlackBerry', data: stats.map((q) => q.BlackBerry), pointColor: 'purple', strokeColor: 'purple' },
    { label: 'Autres', data: stats.map(other), pointColor: 'black', strokeColor: 'black' },
  ]
}, {
  datasetFill: false,
  animation: false,
  scaleLabel: '<%=value%>%',
});
console.log(stats.map(other));
});
</script>

**Source :** [StatCounter Global Stats - Mobile Browser Market Share](http://gs.statcounter.com/browser-market-share/mobile/worldwide/#quarterly-200901-201701).

</section>
<section>

## En quoi le web est-il révolutionnaire?

| | Personal computing | WWW
|-
| Exécution de code non-fiable  | ❌ | ✓
| Portabilité | ❌ | ✓ (dans les bons cas...)
| Assembleur | ✓ | en cours (WebAssembly)
| Parallélisme | ✓ | en cours (WebWorkers)
| Modèle de sécurité | Basé sur l'utilisateur | Basé sur les permissions
| Marchés visés | Prestataires, tâches automatisables, secrétaires, ... | Intermédiaires, presse, divertissement, ...
| *Business model* | Basé sur la propriété intellectuelle | Basé sur les services
{:.pretty.content}

</section>
<section>

### Évolutions à surveiller : le présent du web

ES6, ES7
: JavaScript fait peau neuve : syntaxe, promesses, classes, itérateurs/générateurs, modules, ...

WebRTC
: Visio-conf peer-to-peer dans le navigateur.

WebGL
: Graphisme 3D.

Service workers, push notifications
: Background scripts, applications offline.

Reactive user interfaces
: Meteor, React.js, React native, ...

WebExtensions
: Des extensions de navigateurs **portables**, implantées avec les
  mêmes technologies que le web.

</section>
<section>

### Évolutions à surveiller : le futur (proche) du web

WebAssembly
: *Bytecode* pour le web (successeur de asm.js). Accélération de jeux
  vidéos/traitement de données, *compiler target* pour d'autres
  langages.
  
WebVR
: Réalité virtuelle pour le navigateur.

Encrypted Media Extensions
: Exécution de code propriétaire (DRM) dans le navigateur.

WebTorrent
: Streaming peer-to-peer basé sur WebRTC

</section>
<section>

## Les défis du web

### Protection de la vie privée

- Vol de données (iCloud, Ashley Madison, Yahoo, ...) ;
- Collecte de données, traçage ;
- Surveillance généralisée (Snowden, Apple vs FBI, ...).

### Sécurité des systèmes

- Sécurité du web : SOP, CSRF, mash-ups, ... ;
- Systèmes connectées : voiture intelligente (Chrysler/jeep), *internet of things* ;
- Authentification : Oauth, authentification sans mot de passe (<https://fidoalliance.org/>).

### Qui finance le web ? – Garder le Web *ouvert*

- Convergence web–mobile, app-stores,  signature du code, DRM ;
- Positions de monopole, *zero rating*, *vendor lock-in* ;
- Publicité, risques de sécurité, *ad-blockers*, *micro-payments* (<https://www.brave.com/>).

</section>
<section>

## Et mon rôle en tant que développeur web ?

C'est dans votre **intérêt** qu'il y ait plusieurs
navigateurs/téléphones/objets/... en compétition **équitable** :

- Plus de R&D, distribution plus rapide,
- Meilleure compatibilité.

C'est votre **devoir** de :

- Développer de façon portable, suivre les standards ;
- Tester sur plusieurs plates-formes ;
- Distribuer votre code source, lorsque cela fait du sens ;
- Participer au développement des standards, commenter, faire du lobbying.

**Souvenez-vous :** à chaque fois que vous vous appuyez sur une
technologie non-standard vous **choisissez un côté dans une guerre** !

</section>
<section>

## Références

- W3C,
  [A Little History of the World Wide Web](http://www.w3.org/History.html).
- W3C,
  [A Short History of JavaScript](https://www.w3.org/community/webed/wiki/A_Short_History_of_JavaScript).
- C. Severance,
  [JavaScript: Designing a Language in 10 Days](http://www.computer.org/csdl/mags/co/2012/02/mco2012020007.html).
- The Michigan Daily,
  [Government alleges illegal campaign by Microsoft](https://web.archive.org/web/20060708210502/http://www.pub.umich.edu/daily/1998/oct/10-20-98/news/news14.html)
- T. Berners-Lee,
  [Reinventing HTML](http://dig.csail.mit.edu/breadcrumbs/node/166).
- Tony Mobily, [Interview with Igor Sysoev, author of Apache's competitor NGINX](http://www.freesoftwaremagazine.com/articles/interview_igor_sysoev_author_apaches_competitor_nginx).
- Marshall Kirkpatrick, [How the OAuth Security Battle Was Won, Open Web Style](http://www.nytimes.com/external/readwriteweb/2009/04/25/25readwriteweb-how_the_oauth_security_battle_was_won_open_web_st.html?pagewanted=1).
- Thomas Gerbet, Amrit Kumar, Cédric Lauradoux,
  [A Privacy Analysis of Google and Yandex Safe Browsing](https://hal.inria.fr/hal-01120186/file/RR8686.pdf).
- Dan Kaminsky, [Defcon 23: Let’s End Clickjacking](http://dankaminsky.com/2015/08/09/defcon-23-lets-end-clickjacking/).
- Tim Sweeney, [Epic's Tim Sweeney: Here's how to keep Windows an open platform](http://venturebeat.com/2016/03/10/epics-tim-sweeney-heres-how-to-keep-windows-an-open-platform/).
- Sebastian Anthony, [Mozilla co-founder unveils Brave, a browser that blocks ads by default](http://arstechnica.com/business/2016/01/mozilla-co-founder-unveils-brave-a-web-browser-that-blocks-ads-by-default/).
- Wikipedia, [Dot-com bubble](https://en.wikipedia.org/wiki/Dot-com_bubble).
- Eric Elliot, [What is WebAssembly?](https://medium.com/javascript-scene/what-is-webassembly-the-dawn-of-a-new-era-61256ec5a8f6#.t8zvnw28t).

</section>
<section>

# Merci !

> 

> 

### [![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAgCAYAAACRpmGNAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAB7CAAAewgFu0HU+AAAAB3RJTUUH4AMOEQ42MTLNkQAAAvRJREFUWMPFmE1IVUEUgL/7shcoFQxBKVFEv2QpGBRWq2hZhDoTLcIEWyVR0K5oV4sWtepvEQRZC5nJNhIRBRFFYmRZKvZDi0AsitHCfl3Y5ry4Pd+f3ut7Z/PenXvuzDdn5pw5ZwIA4zxWK+KSVH/G+XXAAWAXsFJevwNuA+1Wq4FMYxvnq4HBINRQCYwAkUCN8wABcB44lEf9AnDYajVpnE8Ay4EzQJnVqjEM9wXoslq1RLWkcX4IWFug+hDQAzTL8w+rVYVxnkA6Wwx8lJcXrVZtMwU0zncCDRF2xWar1dOU+THOrwcGQgqdVqum6QDKci4ExmYINQY0AQpoAboS8mJemmKjcb4fqAoNnFNkEqcjWKwcuA9YoNxqdTkF9yeDcjUwbJxvSlmvAMi2CHBJ+e2xWu0wzpOCyzWqM87/Ns5vhH/6U0CN8+UxRKGbVqstqZVIyJ8R4FeeWb0EvhnnT2YJN4moZFYrHZ50OJTUAc+m0ddbYBC4AzwRh5qICBf8N9sUqdWqVzZkobIa2ANcAl5EBcskCTlmaozz26xWO4G7lEY+pTeUhfbLI7GiF+9NFhnu9RQ4AfocalMlslxvekPYIb4CCyid7AVsOAqE3X8rpZV76eEpEcq/BoAbJQLrs1qNZgyc4rFYrfbL2VZsOZ6pMciSwdYBD4GKIsFVSB6XHU4AjwKLgLlAI7BqlsGOWa3O5bWcwFUBw0Vc0iQwkSlvDLIkjleA1iKA7bNadWQ9vrJUTgeB/lkGe2616siVIwZ5SrtbcrgHMYONW63m5z34s6XcAtgALAGuxQxXW4hSUEhxHHruA2oigtVbrbojwYXBJLycjSHb3SR5IzOGM84ngRWABk7FsIzvgQ1Wq5/T+ajMON8sldYcYBmwHaiMaW9NAletVq2FlJeZks12qU+7gaUxbvoHwG6r1fhMbw+CtL21Ri5fjkSAOgFct1p9iDq7IIcT1EuOVyvFTKVcNySB78CoHHNvpMB5bLV6FeeV2l+lcxypqbAV/QAAAABJRU5ErkJggg==){:style="height:1.5ex"} @luca_defeo](http://twitter.com/luca_defeo){:style="color:#292f33e"}
{:.centered}

> 

> If I had taken a proprietary control of the Web, then it would never
> have taken off. People only committed their time to it because they
> knew it was open, shared: that they could help decide what would
> happen to it next.. and I wouldn't be raking off 10%!
{:.cite}

Tim Berners-Lee - World Wide Web Founder
{:style="text-align: right"}

</section>

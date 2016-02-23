---
layout: lesson
title: AJAX cross-domain
subtitle: Restrictions de sécurité liées au domaine
scripts: ../js/mock-browser.js
---

<section>

## Same Origin Policy

Deux documents **ne provenant pas du même domaine** ne peuvent pas
accéder aux contenus respectifs :

- Pas d'accès au DOM, aux cookies, aux URLs, ...
- Pas d'accès **entre fenêtres** et **entre frames**.

#### Cependant

- Les scripts inclus avec `<script>` ont plein accès
  (**conséquence :** SOP ne peut pas bloquer le **JavaScript
  injecté**) ;
- Autres balises violant la SOP (et pour cause) : `<img>`, `<link>`,
  `<embed>`, `<object>`, `<iframe>`, `<bgsound>`, `<audio>`,
  `<video>`, ...
- `window.name` viole la SOP (pas très utilisé) ;
- [`window.postMessage`](https://developer.mozilla.org/docs/DOM/window.postMessage) :
  violation *contrôlée* de la SOP.

Lire : <http://code.google.com/p/browsersec/wiki/Part2>.

</section>
<section>

## SOP : Exemple

<div id="sop" class="mock-browser content" data-callback="sop"
	data-height="90%" style="height: 70%"
	data-src="{{ site.baseurl }}{{ page.url }}#sop-exemple"></div>

<div class="centered">
<input id="child" type="button" value="Modifier fenêtre fils" style="margin: 0 1ex"/>
<input id="parent" type="button" value="Modifier fenêtre parent" style="margin: 0 1ex"/>
</div>

<style>
.highlight { background-color: yellow !important }
</style>

<script>
var sopCount = 0;	
function sop(addr) {
	return sopCount++ ? addr.replace('#', '?' + Math.random() + '#') : null;
}

$('#child').on('click', function() {
    try {
        $('#sop iframe').contentDocument.body.classList.toggle('highlight');
    } catch (err) {
		alert(err);
	}
});
		
$('#parent').on('click', function() {
	top.document.body.classList.toggle('highlight');
});
</script>

</section>
<section>

## Restrictions sur AJAX

- Un script peut envoyer une `XMLHttpRequest` **vers toute adresse** ;
- il ne peut lire que les réponses **provenant du même domaine**.

<form id="xhr-go">
<fieldset style="border:none">
<input id="xhr-page" type="text" style="width:90%" value="{{ site.baseurl }}{{ page.url }}" />
<input type="submit" value="→" style="width:6%" />
</fieldset>
</form>

<textarea id="xhr" style="width:90%;height:300px;margin:auto;display:block" readonly>
</textarea>

<script>
$('#xhr-page').on('keydown', function (e) { e.stopPropagation(); });
$('#xhr-go').on('submit', function(e) {
    $('#xhr-go fieldset').disabled = true;
    xhr = new XMLHttpRequest();
    xhr.open('GET', $('#xhr-page').value);
    xhr.responseType = 'text';
    xhr.onerror = function(e) {
		alert(e.type + " " + e.target);
	}
    xhr.onload = function() {
        $('#xhr').value = xhr.response;
	}
    xhr.onloadend = function() {
		$('#xhr-go fieldset').disabled = false;
	}

	xhr.send()
	e.preventDefault();
    return false;
});
</script>

**Problème :** comment interroger des APIs de sites tiers (Google
  maps, Yahoo finance, etc.) ?

</section>
<section>

##  AJAX Cross-domain

**Problème :** comment interroger des API tierces ?

Solution classique : **Proxies**

Écrire un programme côté server qui transmet la requête au service
web.


<svg width="620" height="250" style="margin:auto;display:block">
  <defs
     id="defs4">
    <marker
       inkscape:stockid="Arrow1Lend"
       orient="auto"
       refY="0"
       refX="0"
       id="Arrow1Lend"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         style="fill-rule:evenodd;stroke:#000;"
         transform="matrix(-0.8,0,0,-0.8,-10,0)" />
    </marker>
    <marker
       inkscape:stockid="redarrow"
       orient="auto"
       refY="0"
       refX="0"
       id="redarrow"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         style="fill-rule:evenodd;stroke:#f00;fill:#f00"
         transform="matrix(-0.8,0,0,-0.8,-10,0)" />
    </marker>
        <marker
       inkscape:stockid="cross"
       orient="auto"
       refY="0.0"
       refX="0.0"
       id="cross"
       style="overflow:visible">
      <g>
        <path
           d="M 4.6254930,-5.0456926  -5.4129913,4.9543074"
           style="fill:none;fill-rule:evenodd;stroke:#f00" />
        <path
           d="M -5.4129913,-5.0456926 4.6254930,4.9543074"
           style="fill:none;fill-rule:evenodd;stroke:#f00" />
      </g>
    </marker>
  </defs>
  <g>
    <text x="0" y="40" style="font-family:monospace">www.example.com</text>
    <text x="0" y="220">AJAX Client</text>
    <text x="350" y="40" style="font-family:monospace">query.yahooapis.com</text>
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow1Lend)"
       d="m 30,60 0,130" />
    <image
        xlink:href="../assets/document.png"
        x="10" y="90"
        width="44" height="60" />
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow1Lend)"
       d="m 100,190 0,-130" />
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow1Lend)"
       d="m 120,60 0,130" />
    <text x="90" y="140" style="font-weight:bold;stroke:#888;fill:#000">AJAX</text>
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow1Lend)"
       d="m 260,30 70,0" />
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow1Lend)"
       d="m 330,40 -70,0" />
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow1Lend)"
       d="m 160,200 300,-140" />
    <path
       style="fill:none;stroke:#f00;stroke-dasharray:1, 1;stroke-dashoffset:0;marker-end:url(#redarrow);marker-mid:url(#cross)"
       d="m 490,60 -36,17 -36,17 -36,17 -36,17 -36,17 -36,17 -36,17 -36,17 -36,17 " />
  </g>
</svg>

...Pas très satisfaisant

</section>
<section class="compact">

## Cross-Origin Resource Sharing

CORS : [standardise en 2014 par le W3C](www.w3.org/TR/cors/) :

1. Le `XMLHttpRequest` fait une requête GET cross-domain ;
2. Le browser ajoute une entête HTTP `Origin` ;

~~~
GET /api/query.php?car=peugeot HTTP/1.1
Host: api.webservice.com
...
Origin: www.example.com
~~~
{:.http}

3. Le server réponds avec **`Acces-Control-Allow-Origin`**:
{: start="3"}

~~~
HTTP/1.1 200 OK
...
Access-Control-Allow-Origin: *
~~~
{:.http}

~~~
HTTP/1.1 200 OK
...
Access-Control-Allow-Origin: www.example.com
~~~
{:.http}

4. Le browser renvoie la réponse à `XMLHttpRequest` seulement si
   l'origine est autorisée.
{: start="4"}

</section>
<section class="compact">

## Les requêtes POST ne sont pas *nilpotentes* !

Par convention, les requêtes POST ont des effets non-réversibles → politique CORS adaptée

1. `XMLHttpRequest` fait une requête POST cross-domain ;
2. Le browser change le type de la requête en **OPTIONS** ;

~~~
OPTIONS /api/query.php?car=peugeot HTTP/1.1
Host: api.webservice.com
Origin: www.example.com
Access-Control-Request-Method: POST
~~~

3. Le server réponds avec **`Acces-Control-Allow-Origin`** :
{: start="3"}

~~~
HTTP/1.1 200 OK
Access-Control-Allow-Origin: www.example.com
Access-Control-Allow-Methods: POST, GET, OPTIONS 
~~~

4. Si la requête est autorisée, le browser envoie la requête **POST** ;
{: start="4"}

~~~
POST /api/query.php?car=peugeot HTTP/1.1
Host: api.webservice.com
Origin: www.example.com
~~~

5. La réponse est renvoyée à `XMLHttpRequest`.
{: start="5"}

</section>
<section class="compact">

## CORS et sécurité 

CORS est une protection **opt-out** : `www.hacker.com` **ne peut pas
se connecter** à `www.mybank.com` **en se faisant passer pour un
utilisateur**

- Cohérent avec la SOP des frames et des fenêtres ;

`www.hacker.com` **peut obliger** `www.mybank.com` **à télécharger du
contenu** de `www.hacker.com`

- Nécessite une faille XSS pour démarrer l'attaque ;
- Pas plus dangereux que les balises `<script>`, `<iframe>`, `<img>`, ...

<svg width="550" height="260" style="margin:auto;display:block">
  <defs
     id="defs4">
    <marker
       orient="auto"
       refY="0"
       refX="0"
       id="Arrow2Lend"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         style="fill-rule:evenodd;stroke:#000;"
         transform="matrix(-0.8,0,0,-0.8,-10,0)" />
    </marker>
    <marker
       orient="auto"
       refY="0"
       refX="0"
       id="redarrow2"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         style="fill-rule:evenodd;stroke:#f00;fill:#f00"
         transform="matrix(-0.8,0,0,-0.8,-10,0)" />
    </marker>
        <marker
       orient="auto"
       refY="0.0"
       refX="0.0"
       id="cross2"
       style="overflow:visible">
      <g>
        <path
           d="M 4.6254930,-5.0456926  -5.4129913,4.9543074"
           style="fill:none;fill-rule:evenodd;stroke:#f00" />
        <path
           d="M -5.4129913,-5.0456926 4.6254930,4.9543074"
           style="fill:none;fill-rule:evenodd;stroke:#f00" />
      </g>
    </marker>
  </defs>
  <g>
    <text x="0" y="40" style="font-family:monospace">www.mybank.com</text>
    <text x="240" y="235">Client</text>
    <text x="350" y="40" style="font-family:monospace">www.hacker.com</text>
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow2Lend)"
       d="m 340,35 -100,0" />
    <text x="260" y="45" style="font-weight:bold;stroke:#888;fill:#000">XSS</text>
    <path
       style="fill:none;stroke:#000;marker-end:url(#Arrow2Lend)"
       d="m 100,54 180,126 180,-126" />
    <path
       style="fill:none;stroke:#f00;stroke-dasharray:1, 1;stroke-dashoffset:0;marker-end:url(#redarrow2);marker-mid:url(#cross2)"
       d="m 480,60 -40,28 -40,28 -40,28 -40,28 -40,28 -40,-28 -40,-28 -40,-28 -40,-28 -40,-28 " />
  </g>
</svg>

**Exemple d'utilisation :** contourner un filtrage bloquant
l'injection de balises `<script>`.

</section>
<section>

## Lectures


### Google browser security guide (M. Zalewski)

- <https://code.google.com/p/browsersec/wiki/Part1>,
- <https://code.google.com/p/browsersec/wiki/Part2>,
- <https://code.google.com/p/browsersec/wiki/Part3>.

### Same Origin Policy

- [The tangled web](http://lcamtuf.coredump.cx/tangled/), Part II,
- [SOP](https://developer.mozilla.org/docs/Web/JavaScript/Same_origin_policy_for_JavaScript),
- [Cross Origin Resource Sharing](https://developer.mozilla.org/docs/HTTP/Access_control_CORS).

</section>

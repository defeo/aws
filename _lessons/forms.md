---
layout: lesson
title: Formulaires HTML
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/forms.webm
    quizzes:
      - 58900075ba7ec5013560f79a
---

<section>

## Formulaires

<svg
   id="post-img"
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:xlink="http://www.w3.org/1999/xlink"
   version="1.1"
   width="280px"
   height="440px">
  <defs>
    <marker
       refX="0"
       refY="0"
       orient="auto"
       id="Arrow1Lend"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         transform="matrix(-0.8,0,0,-0.8,-10,0)"
         style="fill-rule:evenodd;stroke:#000;stroke-width:1pt;marker-start:none" />
    </marker>
  </defs>
  <g style="font-size:smaller;font-family:monospace;opacity:0.3">
    <text x="20" y="30" xml:space="preserve">POST /user HTTP/1.1</text>
    <text x="20" y="60" xml:space="preserve">Host: www.captcha.net</text>
    <text x="20" y="90" xml:space="preserve">...</text>
    <text x="20" y="120" xml:space="preserve">first=Alan&</text>
    <text x="20" y="150" xml:space="preserve">last=Turing&</text>
    <text x="20" y="180" xml:space="preserve">sex=M&</text>
    <text x="20" y="210" xml:space="preserve">email=alan@gchq.gov.uk</text>
    <line x1="280" y1="290" x2="170" y2="290"
       style="fill:none;stroke:#000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow1Lend)" />
  </g>
  <image
    xlink:href="../assets/server.png"
	x="25" y="230"
	width="128" height="139" />
    <text
		x="20" y="400"
		style="font-size: smaller"
		xml:space="preserve" >www.captcha.net</text>
</svg>

<div id="post-form">
<label for="name">First name:</label>
<input type="text" value="Alan" name="first" id="first">
<br>
<label for="name">Last name:</label>
<input type="text" value="Turing" name="last" id="last">
<br>
Gender: <label for="male">Male</label>
<input type="radio" name="sex" id="male" value="M" checked>
<label for="female">Female</label>
<input type="radio" name="sex" id="female" value="F">
<br>
<label for="email">e-mail:</label>
<input type="email" value="alan@gchq.gov.uk" name="email" id="email">
<br>
<input type="button" value="Subscribe" onclick="document.querySelector('#post-img > g').style.opacity=1;">
</div>

~~~html
<form method="POST"
      action="http://www.captcha.net/user">
  First name:
  <input type="text" name="first">
  <br>
  Last name:
  <input type="text" name="last">
  <br>
  Gender: Male
  <input type="radio" name="sex" value="M">
  Female
  <input type="radio" name="sex" value="F">
  <br>
  e-mail:
  <input type="email" name="email">
  <br>
  <input type="submit" value="Subscribe">
</form>
~~~
{: #post-source}

<style>
#post-img, #post-form, #post-source {
  display: inline-block;
  vertical-align: top;
}
#post-form {
  width: 300px;
}
#post-source {
  width: 380px
}
#post-form, #post-source {
  font-size: 15px;
}
#post-form *, #post-source * {
  margin: 0;
}
</style>
 
</section>
<section>

## Contrôles des formulaires

La balise `<input>` représente presque tous les contrôles. Le choix se
fait à travers l'attribut `type`.

**Champs de texte :** <input type="text" placeholder="tapez quelque chose">

~~~html
<input type="text" name="clef">
~~~

**Boutons radio:** <input type="radio" name="choice" value="1">A <input type="radio" name="choice" value="2">B

~~~html
<input type="radio" name="choice" value="choice-1">A
<input type="radio" name="choice" value="choice-2">B
~~~

**Checkbox:** <input type="checkbox" name="check1" value="1">C <input type="checkbox" name="check2" value="2">D

~~~html
<input type="checkbox" name="check1" value="check-1">C
<input type="checkbox" name="check2" value="check-2">D
~~~

</section>
<section>

**Password:** <input type="password" value="strongpass">

~~~html
<input type="password" name="mot_de_passe">
~~~

**Fichier:** <input type="file">

~~~html
<input type="file" name="fichier">
~~~

**Email:** (depuis HTML5, vérifie qu'il y a un @) <input type="email">

~~~html
<input type="email" name="courriel">
~~~

</section>
<section>


**Submit:** pour envoyer une requête <input type="submit" value="Send data">

~~~html
<input type="submit" value="Send data">
~~~

**Button:** pour interaction avec les scripts <input type="button" value="Click me!">

~~~html
<input type="button" value="Click me!">
~~~

**Image:** envoie les coordonnées du click <input type="image" src="../assets/like.svg" width="40" alt="Like!">

~~~html
<input type="image" src="like.svg" alt="Like!">
~~~

D'autres types sont définis dans HTML5 : **date**, **time**,
**number**, **range**, **color**, **tel**, **url**, ...

</section>
<section>

### Autres contrôles

**Text area:** <textarea> Du texte très long </textarea>

~~~html
<textarea name="texte_long">
Du texte très long
</textarea>
~~~


**Selection list:**
<select>
  <option value="M">MySQL injection</option>
  <option value="X">XSS</option>
  <option value="C">CSRF</option>
</select>

~~~html
<select name="liste">
  <option value="M">MySQL injection</option>
  <option value="X">XSS</option>
  <option value="C">CSRF</option>
</select>
~~~


Nouveaux en HTML5 : `<datalist>`, `<keygen>` et `<output>`.

</section>
<section>


## Validation des formulaires

<style>
.validation:invalid {background-color:#F66}
</style>


Attribut `required`: prévient si pas rempli <input class="validation" type="text" required size="10">

~~~html
<input type="text" required>
~~~

Attribut `pattern`: compare l'entrée à une regexp <input class="validation" type="text" pattern="[0-9]{6}" size="10">

~~~html
<input type="text" pattern="[0-9]{6}">
~~~

Attribut `placeholder`: donne une suggestion <input class="validation" type="text" placeholder="tapez quelque chose" size="10">

~~~html
<input type="text" placeholder="tapez quelque chose">
~~~

Attribut `novalidate`: désactive toutes les validations précédentes.

Plus d'autres contrôles standards (par ex., urls, emails, etc.) et des
attributs liés aux nombres, aux intervalles, aux fichiers, etc.

Des validations plus compliquées doivent être faites en Javascript.

</section>
<section>

## Références

- [Le guide MDN des formulaires](https://developer.mozilla.org/fr/docs/Web/Guide/HTML/Formulaires).
- [La référence W3Schools](https://www.w3schools.com/html/html_forms.asp) (en anglais).

</section>

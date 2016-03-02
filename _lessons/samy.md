---
layout: lesson
title: Le ver XSS Samy
subtitle: Étude de cas
---

<section>

## Vers XSS : Samy

- Le 11 avril 2005 à 1h un ver basé sur une injection XSS commence à
  se répandre sur MySpace.
- En moins de 24h, plus d'un million de profiles sont infectés.
- MySpace est contraint à fermer le site pendant plusieurs heures pour
  extirper le ver.


#### Comment marche Samy

1. MySpace permet une personnalisation limitée de la page de
   profile. Samy découvre qu'il peut inclure du JavaScript dans cette
   page.
2. Un utilisateur visite un profil infecté, le JavaScript malicieux
   s'exécute dans le browser de l'utilisateur.
3. Le JavaScript malicieux envoie une demande d'amitié à Samy, puis
   ajoute Samy aux *« héros »* de l'utilisateur.
4. Enfin, le JavaScript malicieux se copie dans le profil de
   l'utilisateur. L'infection peut grandir de façon exponentielle !

Lire l'histoire complète ici : <http://fast.info/myspace/>.

</section>
<section class="compact">

## Comment a-t-il fait ?

### Injection des scripts

- MySpace bloque `</script>`, `onxxx`, ...
- Mais certains browsers acceptent du JavaScript dans les
  attributs CSS.

~~~
<div style="background:url('javascript:alert(1)')">
~~~

### Imbriquer les guillemets (à mon avis, l'astuce la plus jolie)

- L'astuce précédente a déjà utilisé un guillemet simple `'` et un
  double `"`.
- Samy doit encoder des chaînes en JavaScript, mais MySpace filtre
  `\'` et `\"`.
- Par exemple, Samy ne peut pas écrire :
  
~~~
<div style="background:url('javascript:alert("hah!")')">
<div style="background:url('javascript:alert('hah!')')">
<div style="background:url('javascript:alert(\'hah!\')')">
~~~

- Idée : mettre le source JavaScript dans un autre attribut (utilise
  `document.all`, spécifique à IE 4-10).
  
~~~
<div id="mycode" expr="alert('hah!')"
     style="background:url('javascript:eval(document.all.mycode.expr)')"> 
~~~

</section>
<section>

### Déclarer le code JavaScript

- MySpace filtre le mot `javascript`.
- Samy exploite une *« feature »* de IE.

~~~
<div ... style="background:url('java
script:eval(...)')">
~~~

### Un peu d'encodage et de césures par ci et par là

~~~
console.log('double quote: ' + String.fromCharCode(34));
eval('document.body.inne' + 'rHTML'); 
eval('xmlhttp.onread' + 'ystatechange = callback'); 
~~~

### GET and POST

- Samy doit générer des requêtes (amitié, modification de profil, ...)
- Il aurait probablement pu utiliser les iframes, mais il a trouvé
  plus simple de générer des requêtes AJAX.


</section>
<section>

### Redirection

- Maintenant Samy est confronté à un *mur cross-domain* (entre
  `profile.myspace.com` et `www.myspace.com`).
- Il rédirige l'utilisateur vers `www.myspace.com`.

~~~
if (location.hostname == 'profile.myspace.com')
  document.location = 'http://www.myspace.com' +
                      location.pathname + location.search; 
~~~

### Jetons cachés

- MySpace demande une confirmation avant d'ajouter un ami : il utilise
  un `<input>` caché avec une valeur aléatoire. (Il s'agit d'une
  protection [CSRF](lessons/csrf)).
- Avec XSS, il est simple de contourner les protections CSRF : Samy
  fait quelques requêtes GET et POST en plus pour simuler
  l'interaction avec l'utilisateur.


**LE code:** <http://fast.info/myspace/>

</section>

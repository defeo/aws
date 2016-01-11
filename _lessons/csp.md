---
layout: lesson
title: Content Security Policy
subtitle: Accès sélectif aux ressources cross-domain
---

<section>

## Content Security Policy

**Problème :** Comment mieux circonscrire les dangers d'un XSS ?

**CSP** restreint les actions sur la base du domaine d'origine, au
  niveau de HTTP :

### Ce que l'on peut restreindre

- JavaScript *inlined*, `eval`, CSS, transformations XSLT, Web Fonts ;
- Sources pour les balises HTML : `<script>`, `<object>`, `<embed>`, `<style>`, `<img>`, `<audio>`, `<video>`, `<iframe>` ;
- Sources pour les APIs DOM : `XMLHttpRequest`, WebSockets, Server events.

Standard depuis février 2015, voir : <http://www.w3.org/TR/CSP/#sotd>

</section>
<section>

## Exemple de CSP...

~~~
HTTP/1.1 200 OK
...
Content-Security-Policy: default-src 'self';
                         img-src *;
                         object-src media.example.com
                                    *.cdn.example.com;
                         script-src https://js.example.com;
                         connect-src https:
~~~
{:.http}

Les balises `<img>` sont **toujours permises**

~~~
<img src="http://farm1.staticflickr.com/1/xxxxxxxxxx.jpg" />
~~~

Les plugins sont autorisés uniquement sur **certains sous-domaines**

~~~
<object data="http://media.example.com/video.swf"></object>
~~~

</section>
<section>

## ...Exemple de CSP

`<script>` permises **uniquement sur `https://js.example.com`**

~~~
<script src="https://js.example.com/jquery.min.js"></script>
~~~


AJAX est permis **uniquement sur SSL**

~~~
var xhr = new XMLHttpRequest()
xhr.open("GET", "https://api.finance.com/cac40?c=total")
~~~

Tout autre contenu est **permis uniquement en provenance de la même
page**

**Problème:** CSP est une protection **opt-in**. Elle doit être
configurée explicitement par le server.

</section>
<section>

## Lectures

- Browser Security Handbook : <https://code.google.com/p/browsersec/wiki/Part3>,
- [The tangled web](http://lcamtuf.coredump.cx/tangled/), Chapitre 16,
- [Content Security Policy](http://www.w3.org/TR/CSP/#sotd).

</section>

---
layout: lesson
title: "Mitigation d'attaques"
subtitle: Transport security, Sandboxing, Subresource integrity, CSP
ContentSecurityPolicy: "child-src 'self' ent.uvsq.fr"
scripts:  ../assets/js/mock-browser.js
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/csp.webm
    playbackRate: 0.95
    quizzes:
      - 58a4d1006e24fc1857e29198
      - 58a4d1006e24fc1857e291a8
---

<section>

## Sécurité du transport

Une connexion chiffrée par HTTPS (HTTP+TLS) est le **seul moyen de
garantir**

- **Confidentialité :** aucun espion peut lire la communication ;
- **Authenticité :** on parle bien au bon serveur ;
- **Intégrité :** les requêtes et les réponses HTTP n'ont pas été modifiées.

### *Mixed content*

Lorsque un navigateur rencontre un contenu non-HTTPS dans une page HTTPS :

- Donne un avertissement pour les *contenus passifs* (images, audio, video, ...)
- Bloque la requête pour les *contenus actifs* (scripts, iframes, AJAX, ...)

### *Strict transport security*

L'entête
[`Strict-Transport-Security`](https://developer.mozilla.org/en-US/docs/Web/Security/HTTP_strict_transport_security)
interdit de déclasser en HTTP une page servie à l'origine par HTTPS.

~~~
Strict-Transport-Security: max-age=3600
~~~

</section>
<section>

## Subresource integrity

**Objectif :** empêcher les fournisseurs (par ex., un CDN) et les
intermédiaires de remplacer des contenus (scripts, feuilles de style).

- Attribut `integrity` sur les balises `script` ou `link`.
- **Valeur :**
  - `sha256-`, `sha384-`, ou `sha512-`,
  - plus le haché de la ressource codé en
  [*base64*](https://en.wikipedia.org/wiki/Base64) ;

~~~
<script src="https://example.com/script.js"
        integrity="sha256-VNUJvFEYSnn/xZL+dv3c8LEmHNL57wC1DzH5sC6M/m8=">
</script>
~~~

Interdit le chargement de la ressource si le haché ne correspond pas.

</section>
<section>

## *Frame sandboxing*

L'attribut `sandbox` permet de restreindre les capacité d'un
[`<iframe>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/iframe) :

- Exécuter des scripts,
- Afficher des popups,
- Contrôler le curseur/l'interface,
- Accéder à son origine,
- Naviguer la fenêtre parent, ...

~~~
<iframe sandbox="" src="http://ent.uvsq.fr/">
~~~

<div id="sop" class="mock-browser content" data-sandbox=""
     data-height="200px" data-src="http://ent.uvsq.fr/"></div>

</section>
<section>


## Content Security Policy

**Problème :** Comment limiter les dommages potentiels d'une attaque XSS ?

### Content Security Policy (CSP)

- Définir des restrictions d'accès au contenus sur des bases **plus
  restrictives** que la [Same Origin Policy](cross-domain) ;
- Mécanisme *opt-in* : l'application doit être **explicitement
  configurée** pour bénéficier d'une CSP ;
- Configuration à travers les entêtes HTTP, ou une balise `<meta>`.

### Ce que l'on peut restreindre

- Sources pour les balises HTML : `<script>`, `<object>`, `<embed>`, `<style>`, `<img>`, `<audio>`, `<video>`, `<iframe>` ;
- JavaScript *inlined*, `eval`, CSS, transformations XSLT, Web Fonts ;
- Sources pour les APIs DOM : formulaires, `XMLHttpRequest`, WebSockets, Server events :
- Permet aussi d'affaiblir certaines protections (*mixed content*, heuristiques anti-XSS).

Standard depuis février 2015, voir : <http://www.w3.org/TR/CSP/#sotd>

</section>
<section>

## Exemple

Cette page définit la CSP suivante :

~~~
<meta http-equiv="Content-Security-Policy" content="child-src 'self'">
~~~

<div class="mock-browser content" data-height="300px" data-src="{{ site.baseurl }}/"></div>

</section>
<section class="compact">

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


`<script>` permises **uniquement sur `https://js.example.com`**

~~~
<script src="https://js.example.com/jquery.min.js"></script>
~~~


AJAX est permis **uniquement sur TLS**

~~~
var xhr = new XMLHttpRequest()
xhr.open("GET", "https://api.finance.com/cac40?c=total")
~~~

Tout autre contenu est **permis uniquement en provenance de la même
page**

</section>
<section>

## Lectures

- Browser Security Handbook : <https://code.google.com/p/browsersec/wiki/Part3>,
- [The tangled web](http://lcamtuf.coredump.cx/tangled/), Chapitre 16,
- [Mixed content](https://developer.mozilla.org/en-US/docs/Security/Mixed_content),
- [Strict transport security](https://developer.mozilla.org/en-US/docs/Web/Security/HTTP_strict_transport_security)
- [IFrames *sandboxed*](https://developer.mozilla.org/en/docs/Web/HTML/Element/iframe#attr-sandbox)
- [Content Security Policy (MDN)](https://developer.mozilla.org/en-US/docs/Web/Security/CSP),
- [Content Security Policy (html5rocks)](http://www.html5rocks.com/en/tutorials/security/content-security-policy/
)
- [Postcards from the post-XSS world](http://lcamtuf.coredump.cx/postxss/), par Michal Zalewski.

</section>

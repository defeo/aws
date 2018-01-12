---
layout: lesson
title: HTTP
subtitle: HyperText Transfer Protocol
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/HTTP.webm
    quizzes:
      - 58900075ba7ec5013560f7b3
    playbackRate: 0.95
---

<section style="font-size: 90%">

## Comprendre HTTP

HTTP (*Hypertext Transfer Protocol*) est un protocole *textuel, sans
état, à requête-réponse* destiné à *servir* des documents web.

<svg style="margin:auto;display:block"
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:xlink="http://www.w3.org/1999/xlink"
   version="1.1"
   width="790"
   height="190">
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
         style="fill-rule:evenodd;stroke:#000000;stroke-width:1pt;marker-start:none" />
    </marker>
  </defs>
  <g>
    <image
       xlink:href="../assets/firefox.png"
       x="0" y="30"
       width="138" height="99" />
    <image
       xlink:href="../assets/server.png"
       x="530" y="20"
       width="138" height="139" />
    <image
       xlink:href="../assets/document.png"
       x="680" y="10"
       style="opacity:0.5"
       width="44" height="60" />
    <path
       d="m 150,60 380,0"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow1Lend)" />
    <path
       d="m 530,90 -380,0"
       id="path4280"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow1Lend)" />
    <text
       x="25" y="160"
       xml:space="preserve" >CLIENT</text>
    <text
       x="580" y="190"
       xml:space="preserve" >SERVER</text>
    <text
       x="160" y="40"
       style="font-family:mono"
       xml:space="preserve" >GET /index.html HTTP/1.1</text>
    <text
       x="220" y="120"
       style="font-family:mono"
       xml:space="preserve" >HTTP/1.1 200 OK</text>
    <text
       x="220" y="170"
       style="font-family:mono"
       xml:space="preserve" ><html>...</html></text>
    <text
       x="660" y="35"
       style="font-size:smaller"
       xml:space="preserve" >index.html</text>
  </g>
</svg>

**Requête :** Le client (browser) demande à lire ou modifier un document (hypertexte, image, ...)

**Réponse :** Le server envoie une réponse (pas nécessairement le document).

**Textuel :** Toutes les communications sont codées en ASCII (ce n'est plus le cas avec HTTP 2.0).

**Sans état :** Le server ne se souvient pas du client entre deux requêtes.

</section>
<section>

## Le protocole HTTP

Servi habituellement sur le port 80. Exemple de dialogue HTTP (avant 2.0).

**REQUÊTE**

```http
GET / HTTP/1.1
Host: www.google.fr
```

</section>
<section>

**RÉPONSE**

```http
HTTP/1.1 200 OK
Date: Tue, 24 Jan 2012 17:09:10 GMT
Expires: -1
Cache-Control: private, max-age=0
Content-Type: text/html; charset=ISO-8859-1
Set-Cookie: PREF=ID=4479751101deda66:FF=0:TM=1327424950:LM=1327424950:S=CDCjreHNXoofkoQk; expires=Thu, 23-Jan-2014 17:09:10 GMT; path=/; domain=.google.fr
Set-Cookie: NID=56=jkWXBR2FaxtIwRcpdJ-3nAJqgoJ2hDIqdo0Q7-ttgoCSX_5go3FrbRWBWg0em3oKnE88UcPz-4sjCwQNxb7iPcs7vu-kXQ3zKnSlXH97v-TAQgOQfNx2QqCM2XNPCUUl; expires=Wed, 25-Jul-2012 17:09:10 GMT; path=/; domain=.google.fr; HttpOnly
P3P: CP="This is not a P3P policy! See http://www.google.com/support/accounts/bin/answer.py?hl=en&answer=151657 for more info."
Server: gws
X-XSS-Protection: 1; mode=block
X-Frame-Options: SAMEORIGIN
Transfer-Encoding: chunked

1000
<!doctype html>...
```

</section>
<section>

## La requête HTTP

<pre><code><div id="http-req-req">POST /document.html HTTP/1.1
</div><div id="http-req-head">Host: www.example.com
User-Agent: Mosaic/2.1
Cookie: sessionid=aa03x;
Content-Length: 10
</div><div id="http-req-crlf">
</div><div id="http-req-body">1234567890</div></code></pre>

<style>
html[data-incremental="1"] #http-req-req {
  outline: solid thick rgba(255,0,0,0.5);
  outline-offset: -5px;
}
html[data-incremental="2"] #http-req-head {
  outline: solid thick rgba(255,0,0,0.5);
  outline-offset: -5px;
}
html[data-incremental="3"] #http-req-crlf {
  outline: solid thick rgba(255,0,0,0.5);
  outline-offset: -5px;
}
html[data-incremental="4"] #http-req-body {
  outline: solid thick rgba(255,0,0,0.5);
  outline-offset: -5px;
}
</style>


* Action,
* Entêtes (seulement `Host` est obligatoire),
* Une ligne vide (attention: `<CR><LF>`),
* Corps du message (Optionnel).
{:.incremental}


</section>
<section>

### La ligne d'action

```http
POST /document.html HTTP/1.1
```

#### Méthode

- **HEAD** Demande seulement les entêtes.
- **GET** Demande une page. Ne modifie pas l'état du server.
- **POST** Envoie des données. Peut entraîner une modification de l'état du server.

D'autres méthodes occasionnellement utilisées: `PUT`, `DELETE`,
`TRACE`, `OPTIONS`, `CONNECT`, `PATCH`.

#### Ressource

Adresse du document web.

#### Protocole

Deux possibilités: `HTTP/1.0` ou `HTTP/1.1`.

</section>
<section class="compact">

### Entêtes des requêtes

```
Host: www.example.com
User-Agent: Mosaic/2.1
Cookie: sessionid=aa03x;
Content-Length: 10
```

Servent à envoyer des meta-données au server.

#### Obligatoires

- **Host** Le nom de domaine du server à qui on envoie la requête.
- **Content-Length** Obligatoire seulement pour POST et PUT. Donne la longueur en octets du contenu.

### Fréquentes

- **Accept-*** Type de contenu que le client accepte (type, encodage, langue)
- **Cookie** Utilisé pour la persistance côté client.
- **Referer** Adresse qui a donné origine à la requête.
- **User-Agent** Nom du browser du client.
- **Content-Type** *MIME type* du contenu (texte, HTML, etc.).

Les applications peuvent définir leur propres entêtes (en général avec
un prefixe **X-**).

</section>
<section>

## Réponse HTTP

<pre><code><div id="http-res-res">HTTP/1.1 200 OK
</div><div id="http-res-head">Date: Tue, 24 Jan 2012 18:34:40 GMT
Server: Apache/2.2.21 (Debian)
Last-Modified: Fri, 10 Dec 2010 14:10:25 GMT
Content-Length: 53
Content-Type: text/html
Set-Cookie: sessionid=jkWXBR; expires=Wed, 25-Jul-2012 17:09:10 GMT; path=/; domain=.google.fr; HttpOnly
</div><div id="http-res-crlf">
</div><div id="http-res-body">&lt;html&gt;&lt;head&gt;&lt;/head&gt;&lt;body&gt;&lt;h1&gt;Hello world!&lt;/h1&gt;&lt;/html&gt;</div></code></pre>

<style>
html[data-incremental="1"] #http-res-res {
  outline: solid thick rgba(255,0,0,0.5);
  outline-offset: -5px;
}
html[data-incremental="2"] #http-res-head {
  outline: solid thick rgba(255,0,0,0.5);
  outline-offset: -5px;
}
html[data-incremental="3"] #http-res-crlf {
  outline: solid thick rgba(255,0,0,0.5);
  outline-offset: -5px;
}
html[data-incremental="4"] #http-res-body {
  outline: solid thick rgba(255,0,0,0.5);
  outline-offset: -5px;
}
</style>

* *Status line*,
* Entêtes,
* Une ligne vide (attention: `<CR><LF>`),
* Contenu (Optionnel).
{:.incremental}

</section>
<section class="compact">

### La *status line*

```http
HTTP/1.1 200 OK
```

#### Protocole + code d'état + message

Les codes d'état décrivent le résultat de la requête. Les plus fréquents :

- **200 OK** Le document a été trouvé et envoyé au client.
- **301 MOVED PERMANENTLY** Rédirection permanente (nécessite `Location`).
- **302 FOUND**
- **303 SEE OTHER**
- **307 TEMPORARY REDIRECT** Différents types de redirection (nécessitent `Location`).
- **400 BAD REQUEST** Le client a envoyé une requête mal formatée.
- **403 FORBIDDEN** Le document n'est pas accessible.
- **404 NOT FOUND** Le document est inconnu au server.
- **410 GONE** Le document n'existe plus.
- **418 I'M A TEAPOT** [Poison d'avril IETF 1998](https://tools.ietf.org/html/rfc2324).
- **500 INTERNAL SERVER ERROR** Erreur sur le server.
- **503 SERVICE UNAVAILABLE** Le server est momentanément indisponible.

</section>
<section>

### Entêtes de la réponse

```
Date: Tue, 24 Jan 2012 18:34:40 GMT
Server: Apache/2.2.21 (Debian)
Last-Modified: Fri, 10 Dec 2010 14:10:25 GMT
Content-Length: 53
Content-Type: text/html
Set-Cookie: sessionid=jkWXBR; expires=Wed, 25-Jul-2012 17:09:10 GMT; path=/; domain=.google.fr; HttpOnly
```

Plus fréquentes :

- **Date**, **Expires**, **Last-Modified** Gestion des caches.
- **Content-Type** [MIME type]() du contenu de la réponse.
- **Content-Length** Longueur en octets du contenu. Non obligatoire (peut être spécifié autrement).
- **Location** Utilisé par les redirections.
- **Server** Nom du logiciel du server.
- **Set-Cookie** Utilisé pour la persistance côté client.

</section>
<section>

## Au delà de HTTP

- **HTTPS :** HTTP + TLS, surcouche de authentification +
  chiffrement.
  
  - Authenticité du serveur (et optionellement du client),
  - Confidentialité de la communication.

- **HTTP 2.0 :** Refonte du protocole focalisée sur
  l'efficacité.
  
  - Basé sur SPDY (Google), API compatible avec HTTP 1.1,
  - Protocole binaire, connexions multiplexées,
  - En 2017, supporté par la majorité des navigateurs, mais encore une
    minorité de sites.

## Références

- [La page Wikipedia](https://fr.wikipedia.org/wiki/Hypertext_Transfer_Protocol).
- Le
  [guide HTTP de MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP). Très
  complet, mais en anglais.

</section>

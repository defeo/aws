---
layout: lesson
title: URLs
subtitle: Uniform Resource Locators
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/url.webm
    quizzes:
      - 58900075ba7ec5013560f7d9
      - 58900075ba7ec5013560f7e9
    playbackRate: 0.95
---

<style>
  [data-incremental="1"] #intro .scheme,
  [data-incremental="2"] #intro .authority,
  [data-incremental="3"] #intro .path,
  [data-incremental="4"] #intro .fragment,
  [data-incremental="0"] #authority .authority,
  [data-incremental="1"] #authority .user,
  [data-incremental="2"] #authority .password,
  [data-incremental="3"] #authority .host,
  #path .path, #query .query, #query .fragment
  { border-bottom: solid thick red }
</style>

<section id="intro">

## Des adresses pour le Web

### URL = **U**niform **R**esource **L**ocator

- Introduits par Tim Berners-Lee en 1994 dans la RFC 1738,
- Identifient une **ressource** dans le Web, et le moyen d'y
  **accéder** et d'**intéragir** avec.

### Anatomie d'une URL

<code><span class="scheme">https:</span>//<span class="authority">en.wikipedia.org</span><span class="path">/wiki/Uniform_Resource_Locator</span><span class="fragment">#Syntax</span></code>
{:.centered}

- **Schéma :** méthode d'accès (en général un protocole réseau) ;
- **Autorité :** les informations sur le serveur à contacter ;
- **Chemin :** l'identifiant de la ressource auprès du serveur ;
- **Fragment :** une sous-ressource à accéder.
{:.incremental}

</section>
<section>

## Le schéma

#### Protocoles traités par le navigateur

- `http`, `https` : protocole [HTTP](../HTTP) (Web),
- `file` : accéder un fichier local,
- `ftp`, `gopher`, `shttp` : autres protocoles réseau.

#### Protocoles délégués à une application externe

- `mailto` : composer un mail (ex. :
  [`mailto:tim-berners-lee@example.com`](mailto:tim-berners-lee@example.com)),
- `callto`, `sip`, `sms` : téléphonie,

#### Pseudo-protocoles

- `javascript` : evaluateur JavaScript (ex. : [`javascript:alert('hello')`](javascript:alert('hello'))>,
- `data` :  inclusion de documents (ex. : [`data:text/plain;base64,SGVsbG8hCg==`](data:text/plain;base64,SGVsbG8hCg==){:title="Par mesure de sécurité ce lien n'est pas cliquable. Copiez-collez dans la barre d'adresse."})
- `about`, `chrome` : configuration du navigateur,
- `view-source` : exploration du code source (ex. : [`view-source:`](view-source:){:title="Par mesure de sécurité ce lien n'est pas cliquable. Copiez-collez dans la barre d'adresse."})

</section>
<section id="authority">

## L'autorité

<code>https://<span class="authority"><span class="user">toto</span>:<span class="password">superman</span>@<span class="host">www.example.com:8080</span></span>/profile</code>
{:.centered}

- Nom d'utilisateur,
- Mot de passe (mécanisme d'authentification dépendant du protocole),
- Hôte : nom de domaine + numéro de port  
  (ports par défaut : `http` → `80`, `https` → `443`).
{:.incremental}

### Sécurité

Une bonne partie des mécanismes de sécurité des navigateurs est basée
sur l'autorité :

- [Same Origin Policy](../cross-domain) (JavaScript, requêtes AJAX) :
  contrôle d'égalité stricte, incluant le schéma ;
- [Cookies](../etat#cookies) : limités au domaine et sous-domaines.
- ...

</section>
<section id="path">

## Le chemin

Inspiré de la syntaxe des chemins dans les systèmes de fichiers UNIX.

<code>https://www.dropbox.com<span class="path">/home/pictures/1985/10/26/doc.jpg</span></code>
{:.centered}

Représentation d'une arborescence :

- **Racine :** `/`, origine de l'arborescence,
- **Niveau courant :** `.`,
- **Remonter d'un niveau :** `..`,

#### Exemples

- `/home/pictures/./1985`    ==    `/home/pictures/1985`,
- `/home/pictures/../music`    ==    `/home/music`

En pratique, le serveur web est **libre d'interpréter le chemin** comme
bon il lui semble.

</section>
<section id="query">

## Le *query string* et le fragment

<code>https://www.google.com/search?<span class="query">q=url&ie=utf-8</span>#<span class="fragment">res</span></code>
{:.centered}

### Le *query string*

- Défini dans la RFC 3986,
- Commence par `?`, suite de paires `clef=valeur` séparées par `&`,
- Indique en général des paramètres associés à la ressource.

### Le fragment

- Commence par `#`,
- Indique un sous-document (ex. sauter à une sous-section dans le navigateur),
- N'est pas transmis au serveur.


</section>
<section class="compact">

## URLs complètes, absolues, relatives

`http://example.com/home/profile?action=view#picture`
{:.centered}

Une URL peut être **évaluée dans le contexte** d'une autre URL (par
ex., dans la navigation de **liens**) :

- **URLs complètes :** commençant par le schema, le contexte est ignoré
  
  `https://google.com/search`    →    `https://google.com/search`
  {:.centered}

- **URLs relative au protocole :** commençant par `//`, uniquement le
  protocole est gardé
  
  `//jquery.com/latest.js`    →    `http://jquery.com/latest.js`
  {:.centered}

- **URLs absolues :** commençant par `/`, récupère le schema et
  l'autorité du contexte
  
  `/home/music`    →    `http://example.com/home/music`
  {:.centered}

- **URLs relatives :** commençant par tout autre caractère, tout est
  gardé jusqu'au dernier `/` du chemin
  
  `../login`    →    `http://example.com/login`  
  `www.google.fr`    →    `http://example.com/home/www.google.fr`
  {:.centered}

- **URLs relatives (cas spéciaux) :** commençant par `?` ou `#`,
  
  `?action=edit`    →    `http://example.com/home/profile?action=edit`  
  `#email`    →    `http://example.com/home/profile?action=view#email`
  {:.centered}

</section>
<section>

## Références

- <https://en.wikipedia.org/wiki/Uniform_Resource_Identifier>,
- [*The tangled web*](../#sécurité), Chapitre 2.

</section>

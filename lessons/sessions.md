---
layout: lesson
title: Sessions
---

<section>

## Sessions

Sous le nom de **sessions** on regroupe plusieurs techniques pour la
réalisation d'un **stockage éphémère clef-valeur associé à un client**
du côté server.

- Lorsque le client se connecte pour la première fois, l'application
  lui associe un **identifiant de session**. Cet identifiant peut être
  stocké et transmis par l'une des méthodes vues auparavant.

- Lorsque la session est créée, un **stockage clef-valeur éphémère**
  est mis en place sur le server (*fichier temporaire*, *mémoire*,
  *base de donnée*, ...)
 
- À chaque requête qui suit, le framework charge dans l'objet
  *Requête* le contenu de la session.

</section>
<section>

## Sessions à la PHP

![exemple de session PHP](../assets/php-session.gif){:width="700"}
{:.centered}

</section>
<section>

## Sessions par cookie chiffré

- Données de session stockées dans un cookie chez le client ;
- Cookie protégé cryptographiquement :
  - Chiffrement pour la confidentialité (optionnel) ;
  - [HMAC](http://en.wikipedia.org/wiki/Hash-based_message_authentication_code)
    pour l'intégrité et l'authenticité ;
- La clef secrète (symétrique) est connue et utilisée exclusivement
  par le server.


</section>
<section class="compact">

## Sessions en Silex

~~~
// Configuration
$app->register(new Silex\Provider\SessionServiceProvider());

$app->get('/welcome',
  function(Application $app, Request $req) {
    // On stocke dans la session
    $app['session']->set('user', $req->query->get('name'));
    ...
});

$app->get('/next', function(Application $app) {
  // On cherche dans la session
  $u = $app['session']->get('user');
  if ($u) {
    return 'Hello ' . $u;
  } else {
    // Si user n'est pas défini, or rédirige sur /welcome
    return $app->redirect('/welcome');
  }
});
~~~

</section>
<section class="compact">

## Sessions en Express

~~~
// Configuration (utilise un cookie signé, non chiffré)
app
  .use(express.query())
  .use(express.cookieParser())
  .use(express.session( { secret : '12345' } ));

app.get('/welcome', function (req, res) {
  // On stocke dans la session
  req.session.user = req.query.user;
  ...
});

app.get('/next', function (req, res) {
  // On cherche dans la session
  if (req.session.user) {
    res.end('Hello ' + req.session.user);
  } else {
    // Si user n'est pas défini, or rédirige sur /welcome
    res.redirect('/welcome');
  }
});
~~~

</section>
<section>

## Sessions

### Avantages

- API transparente, cache les détails du protocole et de
  l'implantation.
- Souvent plus rapide qu'une interrogation d'une BD.

### Désavantages

- Utilise davantage de ressources du server.
- Quasiment toutes les implantations nécessitent des cookies.

### Alternatives et compléments

Systèmes de stockage global pour l'application

- Clef-valeur en mémoire : Redis, ...
- *Big table* : Memcached, ...

</section>
<section>

## Quelques conseils de sécurité

**Ne pas stocker de données sensibles non chiffrées chez le client**,
  ne pas les transmettre en clair par l'URL.

**Générer des identifiants de session difficiles à deviner :**
  utiliser des générateurs aléatoires et beaucoup de caractères.
  
**Chiffrer les sessions critiques :** transmettre exclusivement par
  HTTPS les informations sensibles.

Un attaquant qui peut **voler** un cookie de session peut accéder à
**toutes les données** de l'utilisateur.

**Donner des durées de vie limitées :** les cookies de session, les
  identifiants, ... devraient périmer rapidement (ou régulièrement).
  
**Demander une confirmation avant toute opération critique :** par
  ex., redemander le mot de passe avant de transférer de l'argent vers
  un compte bancaire !

**ET TOUJOURS VÉRIFIER LES DONNÉES DU CLIENT !**
{:.centered}

</section>
<section>

#### Sessions

- [En Silex](http://silex.sensiolabs.org/doc/providers/session.html),
- [En Express](http://www.senchalabs.org/connect/session.html).

</section>

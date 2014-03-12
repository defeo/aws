---
layout: slideshow
title: Scripts côté server
subtitle: PHP, Silex (Symfony), Node.js
---

<section>

## Avant les pages dynamiques

Le premiers servers web se limitaient à servir des fichiers statiques:
HTML, images, etc.

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

- L'URL correspond à un chemin dans le système de fichiers du serveur.

</section>
<section>

## Génération statique

- Fichiers HTML sont assemblés à partir de plusieurs composants, 
- Compilés avant d'être chargés sur le serveur
{:.no-wrap}

#### Un exemple moderne

<svg style="margin:auto;display:block" width="504" height="200" transform="scale(0.7)" >
  <defs>
    <marker id="arrow" orient="auto"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         transform="matrix(-0.8,0,0,-0.8,-10,0)"
         style="fill-rule:evenodd;stroke:black;stroke-width:1pt;marker-start:none" />
    </marker>
	<image id="file"
		xlink:href="../assets/document.png"
		width="44" height="60" />
  </defs>
  <g style="-webkit-transform:scale(0.7);-ms-transform:scale(0.7)">
  <g style="font-family:Mono">
	<use xlink:href="#file" x="40" y="0" />
	<text x="0" y="80">menu.html</text>

	<use xlink:href="#file" x="40" y="100" />
	<text x="0" y="180">content.md</text>

	<use xlink:href="#file" x="40" y="200" />
	<text x="0" y="280">footer.jade</text>

	<a xlink:href="http://perl.org">
		<image xlink:href="../assets/perl.png" x="370" y="105" width="135" height="51" />
	</a>

	<use xlink:href="#file" x="620" y="100" />
	<text x="580" y="180">index.html</text>
  </g>
  <g style="stroke:black;stroke-width:2;marker-end:url(#arrow)">
    <path d="m 100,30 260,80" />
    <path d="m 100,130 60,0" />
    <path d="m 100,230 100,0" />

	<path d="m 300,130 60,0" />
	<path d="m 260,230 100,-80" />

	<path d="m 510,130 100,0" />
</g>
  <g style="fill:blue">
    <a xlink:href="http://daringfireball.net/projects/markdown/"><text x="170" y="138">Markdown</text></a>
	<a xlink:href="http://jade-lang.com/"><text x="210" y="238">Jade</text></a>
  </g>
  </g>
</svg>

- [Markdown](http://daringfireball.net/projects/markdown/): transformation Texte → HTML,
- [Jade](http://jade-lang.com/) syntaxe simplifiée pour HTML,
- [Perl](http://perl.org/) langage de programmation générique.

Ces transparents sont générés statiquement
([Markdown](http://daringfireball.net/projects/markdown/) +
[Jekyll](http://jekyllrb.com/)).

</section>
<section>

## Web 1.0 : pages dynamiques

La création du document advient au moment de la requête

<svg style="margin:auto;display:block" width="630" height="210" transform="scale(0.7)">
  <defs>
    <marker
       refX="0"
       refY="0"
       orient="auto"
       id="Arrow2Lend"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         transform="matrix(-0.8,0,0,-0.8,-10,0)"
         style="fill-rule:evenodd;stroke:#000000;stroke-width:1pt;marker-start:none" />
    </marker>
    <marker
       refX="0"
       refY="0"
       orient="auto"
       id="Arrow2Lstart"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         transform="matrix(0.8,0,0,0.8,10,0)"
         style="fill-rule:evenodd;stroke:#000000;stroke-width:1pt;marker-start:none" />
    </marker>
  </defs>
  <g style="-webkit-transform:scale(0.7);-ms-transform:scale(0.7)">
    <image
       xlink:href="../assets/server.png"
       x="300" y="80"
       width="138" height="139" />
    <image
       xlink:href="../assets/document.png"
       x="480" y="10"
       style="opacity:0.2"
       width="44" height="60" />
    <image
       xlink:href="../assets/php.png"
       x="460" y="150"
       width="95" height="51" />
    <image
       xlink:href="../assets/server.png"
       x="700" y="60"
       style="opacity:0.5"
       width="70" height="70" />
    <image
       xlink:href="../assets/db.png"
       x="700" y="140"
       style="opacity:0.5"
       width="60" height="60" />
    <image
       xlink:href="../assets/document.png"
       x="705" y="220"
       style="opacity:0.2"
       width="44" height="60" />
    <image
       xlink:href="../assets/document.png"
       x="120" y="210"
       style="opacity:0.2"
       width="66" height="90" />
    <path
       d="m 40,120 250,0"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow2Lend)" />
    <path
       d="m 290,150 -250,0"
       id="path4280"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow2Lend)" />
    <path
       d="m 505,100 0,50"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow2Lend)" />
    <path
       d="m 550,150 100,-30"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow2Lend);marker-start:url(#Arrow2Lstart)" />
    <path
       d="m 560,175 90,0"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow2Lend);marker-start:url(#Arrow2Lstart)" />
    <path
       d="m 550,200 100,30"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow2Lend);marker-start:url(#Arrow2Lstart)" />
    <text
       x="0" y="100"
       style="font-family:monospace"
       xml:space="preserve" >GET /app.php HTTP/1.1</text>
    <text
       x="0" y="190"
       style="font-family:monospace"
       xml:space="preserve" >HTTP/1.1 200 OK</text>
    <text
       x="450" y="90"
       style="font-family:monospace"
       xml:space="preserve" >app.php</text>
    <text
       x="450" y="250"
       xml:space="preserve" >Moteur de</text>
    <text
       x="450" y="280"
       xml:space="preserve" >Scripting</text>
    <text
       x="620" y="110"
       xml:space="preserve" >Server d'authentification</text>
    <text
       x="680" y="180"
       xml:space="preserve" >Database</text>
    <text
       x="660" y="270"
       xml:space="preserve" >template XML</text>
    <text
       x="60" y="250"
       xml:space="preserve" >document HTML</text>
    <text
       x="100" y="290"
       xml:space="preserve" >généré</text>
  </g>
</svg>

Le serveur peut

- Compiler le document à la volée (comme dans la génération statique),
- Interagir avec d'autres serveurs (authentification, API, ...),
- Interroger des bases de données.

</section>
<section>

## Web 2.0 : Applications web

Focalisées autour de *l'interaction* avec l'utilisateur

<svg style="margin:auto;display:block" width="630" height="210" transform="scale(0.7)">
  <defs>
    <marker
       refX="0"
       refY="0"
       orient="auto"
       id="Arrow2Lend"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         transform="matrix(-0.8,0,0,-0.8,-10,0)"
         style="fill-rule:evenodd;stroke:#000000;stroke-width:1pt;marker-start:none" />
    </marker>
    <marker
       refX="0"
       refY="0"
       orient="auto"
       id="Arrow2Lstart"
       style="overflow:visible">
      <path
         d="M 0,0 5,-5 -12.5,0 5,5 0,0 z"
         transform="matrix(0.8,0,0,0.8,10,0)"
         style="fill-rule:evenodd;stroke:#000000;stroke-width:1pt;marker-start:none" />
    </marker>
  </defs>
  <g style="-webkit-transform:scale(0.7);-ms-transform:scale(0.7)">
    <image
       xlink:href="../assets/server.png"
       x="300" y="120"
       width="138" height="139" />
    <image
       xlink:href="../assets/symfony.svg"
       x="430" y="100"
       width="151" height="168" />
    <image
       xlink:href="../assets/server.png"
       x="700" y="60"
       style="opacity:0.5"
       width="70" height="70" />
    <image
       xlink:href="../assets/db.png"
       x="700" y="140"
       style="opacity:0.5"
       width="60" height="60" />
    <image
       xlink:href="../assets/document.png"
       x="705" y="220"
       style="opacity:0.2"
       width="44" height="60" />
    <image
       xlink:href="../assets/document.png"
       x="120" y="210"
       style="opacity:0.2"
       width="66" height="90" />
    <path
       d="m 40,120 250,0"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow2Lend)" />
    <path
       d="m 290,150 -250,0"
       id="path4280"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow2Lend)" />
    <path
       d="m 550,150 100,-30"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow2Lend);marker-start:url(#Arrow2Lstart)" />
    <path
       d="m 560,175 90,0"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow2Lend);marker-start:url(#Arrow2Lstart)" />
    <path
       d="m 550,200 100,30"
       style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;marker-end:url(#Arrow2Lend);marker-start:url(#Arrow2Lstart)" />
    <text
       x="0" y="100"
       style="font-family:monospace"
       xml:space="preserve" >GET /users.json HTTP/1.1</text>
    <text
       x="0" y="190"
       style="font-family:monospace"
       xml:space="preserve" >HTTP/1.1 200 OK</text>
    <text
       x="440" y="80"
       xml:space="preserve" >Application</text>
    <text
       x="480" y="110"
       xml:space="preserve" >Web</text>
    <text
       x="620" y="110"
       xml:space="preserve" >Server d'authentification</text>
    <text
       x="680" y="180"
       xml:space="preserve" >Database</text>
    <text
       x="660" y="270"
       xml:space="preserve" >template XML</text>
    <text
       x="60" y="250"
       xml:space="preserve" >document JSON</text>
    <text
       x="100" y="290"
       xml:space="preserve" >généré</text>
  </g>
</svg>

- Les URL ne correspondent plus à des fichiers sur le serveur,
- Une URL indique une *ressource virtuelle*, une **action**,
- Exécution de l'application web 
  - par un serveur web (e.g. Apache+PHP, Tomcat+Java, ...),
  - ou par son propre serveur (e.g. Node.js, ...).
  

</section>
<section>

## Frameworks Web

Un *framework web* est une bibliothèque et une collection d'outils qui
facilitent la construction d'applications web.

### Quelques composants classiques d'un framework

- *API HTTP(S)* : parsing/écriture de requêtes/réponses HTTP,
- *Router* : définit la correspondance **URL → Code à exécuter**,
- *Moteur de templates*: génération **Modèles → Pages HTML**,
- *Stockage volatile*: persistance, sessions, memcache,
- *Abstraction de bases de données*,
- *Mechanismes de sécurité*: injections, XSS, CSRF,
- *Caching*, *Internationalisation*, ...

**Exemples**: [Symfony](http://symfony.com/) (PHP),
**[Silex](http://silex.sensiolabs.org/) (PHP, basé sur Symfony)**,
[Zend](http://www.zend.com/) (PHP), **[Node.js](http://nodejs.org/)
(JavaScript)**, [Ruby on Rails](http://rubyonrails.org/) (Ruby),
[Django](https://www.djangoproject.com/) (Python),
[Flask](http://flask.pocoo.org/) (Python),
[Java EE](http://www.oracle.com/technetwork/java/javaee/), ...

</section>
<section>


# PHP

</section>
<section>

## Programmer en PHP

[PHP](http://www.php.net/) est un langage *interprété*, *dynamiquement
typé*, *impératif* et *orienté aux objets* avec une syntaxe inspirée
par Perl, C et d'autres languages similaires.

~~~
<?php
    echo "Hello World!";
?>
~~~

PHP *est aussi un framework web* (assez basique):

- API HTTP(S),
- Moteur de templates (PHP est un langage de templating),
- Sessions,
- Abstraction de bases de données (SQL).

</section>
<section>

## Délimiteurs PHP 

PHP est orienté au texte :

- Seul le code entre les délimiteurs `<?php` et `?>` est exécuté.
- Tout autre texte est affiché *verbatim*.

~~~
<?php
    echo "Hello World!\n";
?>
Hello Again!
~~~

#### Sortie

    Hello World!
    Hello Again!

### Nous NE NOUS SERVIRONS PAS de cela !
{:.centered}

</section>
<section>

## Commentaires

Les commentaires s'écrivent comme en C

~~~
<?php
    echo "Hello "; // Un commentaire
    /*
       Un commentaire
	   sur plusieurs lignes
    */
?>
~~~

Ou comme en Perl

~~~
<?php
    echo "World!"; # Encore un commentaire
?>
~~~

</section>
<section>

## Variables

Les noms de variables commencent toujours par dollar (`$`).

~~~
<?php
    $a = 10;
    echo $a;
?>
~~~

Les variables n'ont **pas de type**, elles ne sont **pas déclarées**,
elles sont **initialisées a une valeur par défaut**.

~~~
<?php
    $foo = 10;
    echo $foo;
    $foo .= " apples";
    echo $foo;            # Affiche "10 apples"
?>
~~~

</section>
<section>

Les variables sont **converties automatiquement**, ou leur type peut
être forcé par un **cast** (comme en C).

~~~
<?php
  $foo = "10";
  $foo += 2;                 # $foo vaut 12
  $bar = $foo . " apples";   # $bar vaut "12 apples"
  $fee = (boolean) $bar;     # $fee vaut TRUE
?>
~~~
{:.compact}

</section>
<section>

## Portée

Les variables ont **portée locale**. Les fonctions introduisent une
nouvelle **portée locale**.

~~~
<?php
  $a = "Hello";
   
  function foo() {
      echo $a;    # Cette variable est locale à foo
  }
    
  foo();          # N'affiche rien et donne un
                  # warning en PHP5
?>
~~~

</section>
<section>

Une fonction peut déclarer explicitement ses variables `global`, pour
les importer d'une portée externe.

~~~
<?php
    $a = "Hello";
    
    function foo() {
        global $a;
        echo $a;       # Cette variable est globale
    }
    
    foo();             # Affiche "Hello";
?>
~~~

</section>
<section>

## Constantes

Les constantes **ne sont pas précédées par un symbole `$`**. Elles
peuvent être définies avec la fonction `define`

~~~
<?php
    define("COLOR", "blue");
    echo COLOR;                # Affiche "blue"
?>
~~~

ou avec le mot clef `const`

~~~
<?php
    const COLOR="blue";
    echo COLOR;                # Affiche "blue"
?>
~~~

</section>
<section>

Leur portée est toujours **globale**

~~~
<?php
    const COLOR="blue";
    
    function foo() {
        echo COLOR;
    }
    
    foo();                # Affiche "blue"
?>
~~~

</section>
<section class="compact">

## Chaînes de caractères (guillemets simples)

~~~
<?php
  echo 'Bonjour, ';
  # Il faut échapper les ' avec un backslash \
  echo 'J\'apprends "PHP". ';
  echo 'Les retours à la ligne
sont permis
   entre guillemets simples
';
  # On doit échapper les backslash avant le guillmet
  echo 'Ceci est un backslash \\';
  # Tous les autres sont pris tels quels
  echo ' ceci \ aussi. ';
  echo 'Même ceci : \n';
?>
~~~

#### Sortie

~~~
Bonjour, J'apprends PHP. Les retours à la ligne
sont permis
   entre guillemets simples
Ceci est un backslash \ ceci \ aussi. Même ceci : \n
~~~

</section>
<section class="compact">

## Chaînes de caractères (guillemets doubles)

~~~
<?php
  # Il faut échapper les "
  echo "V'là un \"backslash\": \\
";
  echo "Ceci est un retour à la ligne : \n";
  $foo = 42;
  echo '$foo est une variable';
  # Les variables sont substituées
  echo "\nLa réponse est : $foo \n";
  # Les accolades évitent les ambiguïtés
  echo "Votre {solde} est 2*${foo}00\n";
?>
~~~

#### Sortie

~~~
V'là un "backslash": \
Ceci est un retour à la ligne :
$foo est une variable
La réponse est : 42 
Votre {solde} est 2*4200
~~~

</section>
<section class="compact">

## Chaînes de caractères (Heredoc)

Syntaxe pour des chaînes complexes.  On commence par `<<<Identifier`
et on termine par `Identifier`, avec `Identifier` n'importe quel nom
valide.

~~~
<?php
    echo <<<EOT
'A thousand kisses buys my heart from me;
And pay them at thy leisure, one by one.
What is ten hundred touches unto thee?
Are they not quickly told and quickly gone?
Say, for non-payment that the debt should double,
Is twenty hundred kisses such a trouble?

EOT;
?>
~~~

Mêmes propriétés qu'entre guillemets doubles, à l'exception de
l'échappement de `"`.

</section>
<section>

## Concaténation de chaînes

Le point (`.`) est l'opérateur de **concaténation**.

~~~
<?php
  $a = 'Hello' . " World";
  $b = "$a!";
  $c = (2 * 10) . " " . $b;
  # $c vaut "20 Hello World!"
?>
~~~

</section>
<section >

## Tableau associatifs

En PHP les index des tableaux peuvent avoir tout type

~~~
<?php
    $tab[0] = "Hello";
    $tab["one"] = "World";
    $tab[true] = "!";
    echo "$tab[0] ${tab['one']} ${tab[true]}";
	# Affiche "Hello world !"
?>
~~~

</section>
<section class="compact">

Il sont construits par la fonction `array` et affichés avec la
fonction `print_r`.

~~~
<?php
    $tab = array(0 => 10,
	             "nested" => array(6 => 5, 13 => 9, "a" => 42));
    print_r($tab);
?>
~~~

#### Sortie

~~~ 
Array
(
    [0] => 10
    [nested] => Array
        (
            [6] => 5
            [13] => 9
            [a] => 42
        )

)
~~~

</section>
<section class="compact">

## Syntaxe impérative

~~~
<?php
    if ($a > $b) {
        echo "a is bigger than b";
    } elseif ($a == $b) {
        echo "a is equal to b";
    } else {
        echo "a is smaller than b";
    }
?>
~~~

~~~
<?php
    $i = 1;
    while ($i <= 10) {
        echo $i++;
    }
?>
~~~

</section>
<section class="compact">

~~~
<?php
    for ($i = 1; $i <= 10; $i++) {
        echo $i;
    }
?>
~~~

~~~
<?php
    $arr = array(1, 2, 3, 4);
    foreach ($arr as $value) {
        echo $value * 2;
    }
?>
~~~

~~~
<?php
    $jours = array(
        "Sunday" => "Lundi",
        "Monday" => "Mardi",
        "Tuesday" => "Mercredi"
    );
    foreach ($jours as $eng => $fr) {
        echo "$eng se traduit par $fr.\n";
    }
?>
~~~

</section>
<section class="compact">

~~~
<?php
    function foo($a, $b, $c=true) {
        if ($c)
            return $a + $b;
        else
            return $a - $b;
    }
    
    echo foo(1, 2) . " ";
    echo foo(1, 2, false);
?>
~~~

~~~
<?php
  $counter = 10;
  $incr = function($i) use ($counter) {
    $counter += $i;
    echo $counter . ' ';
  };
  
  $incr(1); $incr(2); $incr(3);
  # Affiche 11 12 13
?>
~~~

</section>
<section class="compact">

~~~
<?php
  # exécute of script1.php
  include 'script1.php';
  # comme avant, mais erreur si le fichier n'existe pas
  require 'script1.php';
  # exécute script2.php, seulement s'il ne l'a pas déjà été
  include_once 'script2.php'; 
  # comme avant, mais erreur si le fichier n'existe pas
  require_once 'script2.php';
?>
~~~

Toutes les inclusions sont textuelles : les variables globales de
chaque fichier sont disponibles pour tous les autres.

### Lectures

- Le manuel de référence de PHP : <http://www.php.net/manual/>,
- Plus de références [bibliographie du cours](../#php).

</section>
<section class="compact">

## Syntaxe orientée aux objets

~~~
<?php
  class SimpleClass extends BasicClass
  {
    // Attribut d'instance
	public $var = 'a default value';
	// Attribut de classe
	public static $classvar = 'another value';
	// Méthode d'instance
	public function displayVar() {
	  echo $this->var;
	}
	// Méthode de classe
	public static function displayClass() {
	  echo parent::classvar;
	}
  }
  SimpleClass::displayClass();   # Affiche "another value"
  $x = new SimpleClass();
  $x->displayVar();               # Affiche "a default value"
?>
~~~

</section>
<section class="compact">

## Espaces de noms

~~~
<?php
  # La déclaration du namespace doit aller au début du fichier
  namespace Projets\Projet1;
  class MaClasse {}
  function mafonction {}
  mafonction();
?>
~~~

~~~
<?php
  include 'projet1.php';

  $a = new Projets\Projet1\MaClasse();
  Projets\Projet1\mafonction();

  use Projets\Projet1 as P1;
  $b = new P1\MaClasse();

  use Projets\Projet1\MaClasse;
  $c = new MaClasse();
?>
~~~

</section>
<section>

## API HTTP

PHP fournit quelques variables globales par défaut qui représentent la
requête HTTP courante

- `$_GET` paramètres de l'URL (*query string*),
- `$_POST`, `$_FILES` contenu de la requête,
- `$_SERVER` entêtes HTTP,
- `$_COOKIE` cookies,
- `$_SESSION` stockage volatile.

### Nous n'allons PAS NOUS SERVIR de cela
{:.centered}

</section>
<section>

# Silex

</section>
<section>

## Silex

[Silex](http://silex.sensiolabs.org/) est un *micro-framework* web
écrit en PHP. Il comporte

- *Router*,
- *Stockage volatile*: Sessions.

Modules optionnels

- *Moteur de templates* ([Twig](http://twig.sensiolabs.org/)),
- *Abstraction de bases de données* ([Doctrine](http://www.doctrine-project.org/)),
- *Mechanismes de sécurité*: injections, XSS, CSRF,
- *Caching*, *Internationalisation*, *Mail*, ...


Silex est basé sur [Symfony](http://symfony.com/), un framework full-stack.

Silex est très adapté aux applications *single page*, qui présentent
une seule page web et dont le code tient en quelques fichiers.

**Documentation :** <http://silex.sensiolabs.org/documentation>

</section>
<section class="compact">

## Hello world

~~~
<?php
  require_once 'vendor/autoload.php';    # Charge Silex

  $app = new Silex\Application();   # Crée l'application web

  function hello() {
	  return 'Hello World!';        # On ne fait pas de echo
  }
  $app->get('/', hello);   # Définit une action pour l'URL /

  $app->run();                     # Lance l'application web
?>
~~~

</section>
<section>

## Router

Le router associe une fonction (*gestionnaire*) à chaque requête pour
une URL.

~~~
$app->get('/url1', gest1);   # Requêtes GET

$app->post('/url2/form', gest2);  # Requêtes POST

# Avec une fonction anonyme et une URL parametrée
$app->get('/url/{param}', function ($param) {
  return 'Hello ' . $param;
});
~~~

À une requête pour `/url/toto`, le dernier gestionnaire répond

~~~
Hello toto
~~~

</section>
<section class="compact">

## API HTTP

Un gestionnaire lit une `Request` est écrit une `Response`

~~~
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$app->get('/form', function (Request $req) {
    $nom = $req->query->get('name');
    return new Response('Hello ' . $nom, 202);
});

$app->post('/form', function (Request $req) {
    $nom = $req->request->get('name');
    return new Response('Hello ' . $nom, 202);
});
~~~

À une requête pour `/form?name=toto` répond (avec code 202)

~~~
Hello toto
~~~

Même chose pour les données envoyées par POST.

</section>
<section>

# Node.js

</section>
<section>

## Node.js

[Node.js](http://nodejs.org/) est un *micro-framework* web écrit en
JavaScript. Son noyau ne comporte que

- Server Web,
- API HTTP,
- Gestionnaire de paquets.

Il existe énormément de modules optionnels :

- *Router*, *Middlewares* :
  ([Connect](http://www.senchalabs.org/connect/),
  [Express](http://expressjs.com/)),
- *Stockage volatile* : Sessions, Memcache, ...
- *Moteurs de templates*,
- *Abstraction de bases de données*
- *Mechanismes de sécurité*,
- *WebSockets*, ...


**Docs :** <http://docs.nodejitsu.com/>, <http://nodejs.org/api/>.

</section>

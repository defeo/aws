---
layout: lesson
title: PHP
subtitle: "PHP: Hypertext Preprocessor"
addons:
  video:
    url: https://sourcesup.renater.fr/aws-media/php.webm
---

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

**Versions courantes :** 5.6, 7.0.

PHP est aussi un **framework web** (assez basique):

- API HTTP(S),
- Moteur de templates (PHP est un *langage de templating*),
- Sessions,
- Abstraction de bases de données (SQL).

</section>
<section>

## Délimiteurs PHP 

PHP est *orienté au texte* :

- Seul le code entre les délimiteurs `<?php` et `?>` est exécuté.
- Tout autre texte est affiché *verbatim*.

<div class="two-cols">

~~~
<?php
    echo "Hello World!\n";
?>
Hello Again!
~~~

~~~
Hello World!
Hello Again!
~~~

</div>

- **NOUS NE NOUS SERVIRONS PAS de cela !** Nos fichiers vont contenir
  uniquement du code PHP exécutable.

- Il est conseillé d'omettre le `?>` fermant dans les fichiers qui ne
  contiennent que du code PHP.

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
~~~

Ou comme en Perl

~~~
<?php
    echo "World!"; # Encore un commentaire
~~~

</section>
<section>

## Variables

Les noms de variables commencent toujours par dollar (`$`).

<div class="two-cols">

~~~
<?php
    $a = 10;
    echo $a;
~~~

	10

</div>

Les variables n'ont **pas de type**, elles ne sont **pas déclarées**,
elles sont **initialisées a une valeur par défaut**.

<div class="two-cols">

~~~
<?php
    $foo = 10;
    echo $foo;
	echo "\n";
    $foo .= " apples";
    echo $foo;
~~~

	10
	10 apples

</div>

</section>
<section>

## Conversions

Les variables sont **converties automatiquement**, ou leur type peut
être forcé par un **cast** (comme en C).

<div class="two-cols">

~~~
<?php
  $foo = "10";
  $foo += 2;
  echo $foo;
  $bar = "\n" . $foo . " apples\n";
  echo $bar;
  $fee = (boolean) $bar;
  echo $fee == True;
~~~

~~~
12
12 apples
1
~~~


</div>

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
    
  foo();          # N'affiche rien et donne un warning en PHP5
~~~

</section>
<section>

## Variables globales

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
~~~

À utiliser avec parcimonie !

</section>
<section class="compact">

## Constantes

Les constantes **ne sont pas précédées par un symbole `$`**. Elles
peuvent être définies avec la fonction `define`, ou avec le mot clef `const`

<div class="two-cols">

~~~
<?php
    define("COLOR1", "blue");
    echo COLOR1;
    const COLOR2 = "red";
    echo COLOR2;
~~~

	blue
	red

</div>

Leur portée est toujours **globale**

<div class="two-cols">

~~~
<?php
    const COLOR = "blue";
    
    function foo() {
        echo COLOR;
    }
    
    foo();
~~~

	blue

</div>

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
~~~

#### Sortie

~~~
Bonjour, J'apprends PHP. Les retours à la ligne
sont permis
   entre guillemets simples
Ceci est un backslash \ ceci \ aussi. Même ceci : \n
~~~
{:.no-highlight}

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
~~~

#### Sortie

~~~
V'là un "backslash": \
Ceci est un retour à la ligne :
$foo est une variable
La réponse est : 42 
Votre {solde} est 2*4200
~~~
{:.no-highlight}

</section>
<section>

## Chaînes de caractères (Heredoc)

Syntaxe pour des chaînes complexes.  On commence par `<<<Identifier`
et on termine par `Identifier`, où `Identifier` est n'importe quel nom
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
~~~

Mêmes propriétés qu'entre guillemets doubles, à l'exception de
l'échappement de `"`.

</section>
<section>

## Concaténation de chaînes

Le point (`.`) est l'opérateur de **concaténation**.

<div class="two-cols">

~~~
<?php
  $a = 'Hello' . " World";
  $b = "$a!";
  $c = (2 * 10) . " " . $b;
  echo $c
~~~

	20 Hello World!

</div>

</section>
<section>

## Tableau associatifs

En PHP les index des tableaux peuvent avoir tout type

~~~
<?php
    $tab[0] = "Hello";
    $tab["one"] = "World";
    $tab[true] = "!";
    echo "$tab[0] ${tab['one']} ${tab[true]}";
~~~

### Sortie

~~~
Hello world !
~~~

</section>
<section>

Il sont construits par la fonction `array` et affichés avec la
fonction `print_r`.

~~~
<?php
    $tab = array(0 => 10,
	             "nested" => array(6 => 5, 13 => 9, "a" => 42));
    print_r($tab);
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
<section>

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
~~~

- `else if` peut être utilisé à la place de `elseif`.

- Il existe aussi une instruction `switch`, comme en C.

</section>
<section>

## Boucles

~~~
<?php
    $i = 1;
    while ($i <= 10) {
        echo $i++;
    }
~~~

~~~
<?php
	$i = 1;
	do {
		echo $i++;
    } while ($i <= 10);
~~~

~~~
<?php
    for ($i = 1; $i <= 10; $i++) {
        echo $i;
    }
~~~

</section>
<section>

## Boucle `foreach`

~~~
<?php
    $arr = array(1, 2, 3, 4);
    foreach ($arr as $value) {
        echo $value * 2;
    }
~~~

<div class="two-cols">

~~~
<?php
    $jours = array(
        "Sunday" => "Lundi",
        "Monday" => "Mardi",
        "Tuesday" => "Mercredi"
    );
    foreach ($jours as $eng => $fr) {
        echo "$eng is not $fr.\n";
    }
~~~

~~~
Sunday is not Lundi.
Monday is not Mardi.
Tuesday is not Mercredi.
~~~
{:.no-highlight}

</div>

</section>
<section>

## Fonctions <small>(arguments par défaut, variadiques)</small>

<div class="two-cols">

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
~~~

	3 -1

</div>
<div class="two-cols">

~~~
<?php
	# Uniquement dans PHP >=5.6
	function variadique($a, ...$b) {
		foreach ($b as $x)
			echo "$a : $x\n";
	}
	variadique('fruits', 'pomme', 'poire', 'mangue');
~~~

~~~
fruits : pomme
fruits : poire
fruits : mangue
~~~

</div>

</section>
<section>

## Fonctions anonymes et clôtures

Les fonctions sont des *objets de première classe* en PHP

<div class="two-cols">

~~~
<?php
  $counter = 10;
  $incr = function($i) use ($counter) {
    $counter += $i;
    echo $counter . ' ';
  };
  
  $incr(1); $incr(2); $incr(3);
  echo "\n$counter";
~~~

	11 12 13
	10

</div>

- Le mot clef `use` indique quelles variables de la portée externe
  sont importées dans la fonction.

- Les variables importées par `use` sont copiées au moment de la
  définition (différent des clôtures de JavaScript, et beaucoup moins
  utile).

</section>
<section>

## Importation

PHP ne possède pas un vrai système de *modules*, se contentant d'un
système d'inclusion similaire à un pré-processeur.

~~~
<?php
  # exécute script1.php
  include 'script1.php';
  # comme avant, mais erreur si le fichier n'existe pas
  require 'script1.php';
  # exécute script2.php, seulement s'il ne l'a pas déjà été
  include_once 'script2.php'; 
  # comme avant, mais erreur si le fichier n'existe pas
  require_once 'script2.php';
~~~

- Toutes les inclusions sont textuelles : les variables globales de
  chaque fichier sont disponibles pour tous les autres.

- La portée des variables s'étend aux fichiers inclus, et inversement.

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

### Nous n'allons PAS NOUS SERVIR de cela, non plus !
{:.centered}

À la place, nous utiliserons un framework plus avancé :
[Silex](http://silex.sensiolabs.org/), framework léger dérivé de
[Symfony](http://symfony.com/).

</section>
<section>

## Lectures

- Le manuel de référence de PHP : <http://www.php.net/manual/>,

- Plus de références dans la [bibliographie du cours](../#php).

</section>

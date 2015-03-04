---
layout: lesson
title: PHP orienté aux objets
---

<section>

## Syntaxe orientée aux objets

<div class="two-cols">

~~~
class BasicClass {
  public $var = 'a default value';

  public function displayVar() {
    echo "$this->var + 1";
  }
}

$x = new BasicClass();
$x->displayVar();
~~~
{:.php}

~~~
a default value + 1
~~~
{:.no-highlight}

</div>

Les *propriétés* peuvent être initialisées **uniquement** avec des
valeurs primitives.

</section>
<section class="compact">

## Propriétés statiques

<div class="two-cols">

~~~
class SimpleClass extends BasicClass
{
  const C = 'a default constant';
  public static $classvar = 'another value';

  public static function displayClass() {
    echo self::$classvar . "\n" . parent::class;
  }
  
  public function displayConst() {
    echo self::C;
  }
}

$x = new SimpleClass();
$x->displayConst();
SimpleClass::displayClass();
~~~
{:.php}

~~~
a default constant
BasicClass
another value
~~~
{:.no-highlight}

</div>

- Les propriétés statiques et les constantes peuvent être initialisées
  **uniquement** avec des valeurs primitives.
- Les mots clef `self`, `parent` et la propriété `class` sont
  réservés.

</section>
<section class="compact">

## Constructeurs et destructeurs

<div class="two-cols">

~~~
class BaseClass {
  function __construct() {
    echo "Initialisation objet\n";
  }

  function __construct() {
    echo "Destruction objet\n";
  }
}

class SubClass extends BaseClass {
  function __construct() {
    parent::__construct();
    print "Initialisation sous-objet\n";
  }
}

new BaseClass();
new SubClass();
echo "\n\n";
~~~

~~~
Initialisation objet
Initialisation objet
Initialisation sous-objet


Destruction objet
Destruction objet
~~~
{:.no-higlight}

</div>

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
~~~

</section>
<section>

## Chargement automatique (*autoload*)

~~~
<?php
  function __autoload($class_name) {
    include $class_name . '.php';
  }

  $obj  = new MyClass1();
  $obj2 = new MyClass2();
~~~
{:.php}

- Inclut la définition de la classe la première fois qu'elle est
  utilisée.

- Utilisable uniquement si **Une classe → un fichier**.

- Lourdement utilisé par Silex.

- Non disponible en mode interpréteur.

Très mauvaise pratique, si vous me demandez mon avis !

</section>
<section>

## Autres mécanismes

- Classes abstraites (mot clef `abstract`).

- Interfaces (mots clef `interface`, `implements`). **Exemple :**
  interface `Traversable`, utilisée en combinaison avec la boucle
  `foreach`.

- *Traits* (ou *Mixins*, héritage partiel, mot clef `trait`).

- Typage (lourdement utilisé par Silex).

## Lectures

La
[section sur les classes](http://php.net/manual/fr/language.oop5.php)
du manuel officiel de PHP.

</section>

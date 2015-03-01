---
layout: lesson
title: PHP orienté aux objets
---

<section class="compact">

## Syntaxe orientée aux objets

<div class="two-cols">

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
  SimpleClass::displayClass();
  $x = new SimpleClass();
  $x->displayVar();
~~~

~~~
another value
a default value
~~~
{:.no-highlight}

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

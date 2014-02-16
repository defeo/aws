<?php

// On charge le framework Silex
require_once 'vendor/autoload.php';

// On définit des noms utiles
use Silex\Application;

// On crée l'application et on la configure en mode debug
$app = new Application();
$app['debug'] = true;

// On définit une route pour l'url /
$app->get('/', function() {
    return 'Hello world !';
  });


// Maintenant on démontre l'utilisation des templates Twig
// On commence par charger le moteur de templating
$app->register(new Silex\Provider\TwigServiceProvider(), 
	       array('twig.path' => '.',));

// On définit une route qui répond à tout url de la forme /blabla
// en répondant Hello blabla
$app->get('/{n}', function(Application $app, $n) {
    return $app['twig']->render('example.twig', array('nom' => $n));
  });

// On lance l'application
$app->run();

?>

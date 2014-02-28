<?php
require_once 'vendor/autoload.php';
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;

$filename = __DIR__.preg_replace('#(\?.*)$#', '', $_SERVER['REQUEST_URI']);
if (php_sapi_name() === 'cli-server' && is_file($filename)) {
    return false;
}

$app = new Application();

$app['debug'] = true;
$app->register(new Silex\Provider\TwigServiceProvider(), 
	       array('twig.path' => 'templates',));
$app->register(new Silex\Provider\SessionServiceProvider());

$app->get('/', function(Application $app) {
    return $app['twig']->render('create-game.twig', 
				array('colors' => 
				      array('red', 'yellow', 
					    'green', 'blue')));
  });

$app->match('/play/', function(Application $app, Request $req) {
    $players = array();
    for ($i = 0 ; $i < 2 ; $i++) {
      $players[$i] = array('name' => $req->query->get('name' . ($i + 1)),
			   'color' => $req->query->get('color' . ($i + 1)));
      $players[$i]['score'] = +$req->request->get('score' . ($i + 1));
    }
    error_log(print_r($req->request, true));

    return $app['twig']->render('four-in-a-row.twig',
				array('players' => $players));
  });

$app->run();
?>

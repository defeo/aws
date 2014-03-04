var express = require('express'),
    app = express(),
    twig = require("twig");

app.set('views', 'templates');
app.set('view engine', 'html');
app.engine('html', twig.__express);

app
    .use('/static', express.static('static'))
    .use(express.query())
    .use(express.bodyParser());

app.get('/', function(req, res) {
    res.render('create-game.twig', {'colors' :
                ['red', 'yellow', 'green', 'blue'] });
});

app.use('/play', function(req, res) {
    var players = [];
    for (var i = 0 ; i < 2 ; i++) {
        players[i] = { 'name' : req.query['name' + (i+1)],
                       'color' : req.query['color' + (i+1)],
                       'score' : req.body['score' + (i+1)] || 0 };
    }
    res.render('four-in-a-row.twig', { 'players' : players })
});

app.listen(process.env.PORT);
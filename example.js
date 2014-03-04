var express = require('express'),
    app = express(),
    twig = require("twig");

app.set('views', '.');

app.get('/', function(req, res) {
    res.end('Hello world !');
});

app.get('/:n', function(req, res) {
    res.render('example.twig', { 'nom' : req.params.n })
});

app.listen(process.env.PORT);
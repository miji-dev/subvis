var express = require('express'),
	subvis = require('./app/subvis.js');

var app = express();

app.set('views', __dirname + '/app/tpl');
app.set('view engine', 'jade');

// Deliver static content
app.use('/lib', express.static(__dirname + '/public/lib'));
app.use('/res', express.static(__dirname + '/public/res'));
app.use('/src', express.static(__dirname + '/public/src'));

// Routing
// Home
app.get('/', subvis.showHome);

// More Routing
// ...

app.listen('8080');
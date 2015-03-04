var express = require('express');
var app = express();
var subsreader = require('./app/subsreader');
var sublist = subsreader.getSubs();
var subshit = require('./app/subshit');
var events = require('events');
var eventEmitter = new events.EventEmitter();

// Needed to deliver static files (css, img, etc) 
app.use(express.static('public'));
// Sets the template engine. We use jade
app.set('views', __dirname + '/app/tpl');
app.set('view engine', 'jade');

// Routing
// Home
app.get('/', function (req, res) {
	res.render('home', {
		subs: sublist
	});
	res.end()
});

// Single Movie by id (only digits)
app.get(/^\/\d+$/, function (req, res) {
	var subtitleID = Number(req.url.slice(1));

	// Returns the best rated subtitle string for the requested movie by imdbid
	subshit.getSubtitle(subtitleID, function(data) {
		//TODO: All of the subtitle processing
		//TODO: Prepare the UI
		//TODO: Send everything back to the client
		console.log(data, 'yay');
	});
});

// Single Movie by Name (every character allowed)
/*
app.get(/./, function (req, res) {
	res.send('Single by name');
});
*/

// Multiple Movies
app.get('/multi', function (req, res) {
	res.send('Multi');
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log(host, port);
});
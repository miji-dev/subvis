// This fucking shit is a fucking shit fuck!
var subshit = require('../node_modules/opensubtitles-client/Index.js');
var events = require('events');
var http = require('http');
var zlib = require('zlib');
var events = require('events');
var eventEmitter = new events.EventEmitter();

var TOKEN;
var callback;

subshit.api.on("login", function (token) {
	console.log("login: " + token);
});

subshit.api.on("search", function () {
	console.log("searching ...")
});

subshit.api.login().done(
	function (token) {
		TOKEN = token;
	}
);

// public method to get a specific subtitle file
var getSubtitle = function (id, cb) {
	callback = cb;

	subshit.api.searchID(TOKEN, 'eng', id).done(function (results) {
		var bestRating = 0;
		var bestID;
		var subLink;
		for (var i = 0; i < results.length; i++) {
			var sub = results[i],
				rating = Number(sub.SubRating);

			if (rating > bestRating) {
				bestRating = rating;
				bestID = i;
				subLink = sub.SubDownloadLink;
				if (bestRating == 10) {
					break;
				}
			}
		}
		console.log(subLink);
		downloadSubtitle(subLink);
	});
};

var downloadSubtitle = function (link) {
	var req = http.request(link, onSubtitleDownloaded);

	req.on('error', function (err) {
		console.log(err, " . Error");
	});

	req.end();
};

var preprocessSubtitle = function (subString) {
	var data = subString.split(/\r\n\r\n/g);
	for (var i = 0; i < data.length; i++) {
		data[i] = data[i].split(/\r\n/);
	}
	callback(data);
};

var onSubtitleDownloaded = function (res) {
	var result = [];
	var gunzip = zlib.createGunzip();
	res.pipe(gunzip);
	gunzip.on('data', function (chunk) {
		result.push(chunk.toString());
	}).on('end', function () {
		preprocessSubtitle(result.join(''));
	}).on('error', function (err) {
		console.log('res error: ', err);
	});
};

exports.getSubtitle = getSubtitle;
// This fucking shit is a fucking shit fuck!
var subshit = require('../node_modules/opensubtitles-client/Index.js');
var http = require('http');
var zlib = require('zlib');
var SubModel = require('./SubModel');
var subModel;

var TOKEN;
var SUBLIST;

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
		var mostDownloads = 0,
			bestRated = 0,
			bestID,
			subLink,
			movieName = '',
			movieYear = 0,
			movieRating = 0;


		for (var i = 0; i < results.length; i++) {
			var sub = results[i],
				downloads = Number(sub.SubDownloadsCnt),
				subRating = Number(sub.SubRating);
			if(subRating > bestRated) {
//			if (downloads > mostDownloads) {
				movieName = movieName || sub.MovieName;
				movieYear = movieYear || sub.MovieYear;
				movieRating = movieRating|| sub.MovieImdbRating;
//				mostDownloads = downloads;
				bestRated = subRating;
				bestID = i;
				subLink = sub.SubDownloadLink;
			}
		}

		subModel = new SubModel(id, movieName, movieYear, movieRating);
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
	var data = subString.split(/\r\n\r\n/g),
		i,
		l;

	for (i = 0, l = data.length; i < l; i++) {
		var splitted = data[i].split(/\r\n/);
		var timestamp = splitted[1].split(' --> ');

		data[i] = {
			id: splitted[0],
			from: formatTime(timestamp[0]),
			to: formatTime(timestamp[1]),
			text: splitted.slice(2, splitted.length).join(' '),
		}
		data[i].duration = data[i].to - data[i].from;
	}
	subModel.setSequences(data);

	callback(subModel);
};

var formatTime = function (timeString) {
	var hms = timeString.split(':');
	var sms = hms[2].split(',');
	var millisecs = Number(hms[0]) * 3600000 + Number(hms[1]) * 60000 + Number(sms[0]) * 1000 + Number(sms[1]);
	return millisecs;
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
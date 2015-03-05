// This fucking shit is a fucking shit fuck!
var subshit = require('../node_modules/opensubtitles-client/Index.js');
var http = require('http');
var zlib = require('zlib');

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
			text: splitted.slice(2,splitted.length),
		}
		data[i].duration = data[i].to - data[i].from;

		// not sure if I should mix array and objects features ...
		if(i == 0) {
			data.first = data[i].from;
		}
		if(i == l - 1) {
			data.last = data[i].to;
		}
	}
		
	callback(data);
};

var formatTime = function(timeString) {
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
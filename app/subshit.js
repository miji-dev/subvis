// This fucking shit is a fucking shit fuck!
var subshit = require('../node_modules/opensubtitles-client/Index.js');
var http = require('http');
var zlib = require('zlib');
var SubModel = require('./SubModel');
var NlProcessor = require('./NlProcessor');
var subModel;

var nlp;

var TOKEN;
var SUBLIST;

var callback;

var unsuitableSubs = [];
var downloadResults;
var curId;

// online for pulp dummy
var fs = require('fs'),
	path = require('path'),
	SUB_LIST_PATH = path.join('app', 'txt', 'pulp.txt');

subshit.api.on("login", function (token) {
	console.log("login: " + token);
});

subshit.api.on("search", function (data) {
	console.log("searching ...", data.length)
});

subshit.api.login().done(
	function (token) {
		TOKEN = token;
	}
);

// for local file
var getSubtitle1 = function(id, cb) {
//	callback = cb;
	var data = fs.readFileSync(SUB_LIST_PATH).toString();
	
	subModel = new SubModel(id, "Pulp Fiction", '1994', '8.9');
	processSequences2(preprocessSubtitle(data));
	cb(subModel);
};

// public method to get a specific subtitle file
// using subshit
var getSubtitle = function (id, cb) {
	callback = cb || callback;
	if(id) {
		subshit.api.searchID(TOKEN, 'eng', id).done(onSubtitleListDownloaded);
	} else {
		onSubtitleListDownloaded();
	}
};

var onSubtitleListDownloaded = function(results) {
	var mostDownloads = 0,
		bestRating = 0,
		bestID = 0,
		subLink,
		movieName = '',
		movieYear = 0,
		movieRating = 0;

	downloadResults = results || downloadResults;

	for (var i = 0; i < downloadResults.length; i++) {
		var sub = downloadResults[i],
			downloads = Number(sub.SubDownloadsCnt),
			rating = Number(sub.SubRating);

		if ((downloads > mostDownloads || rating > bestRating) && unsuitableSubs.indexOf(i) < 0 && sub.SubSumCD == 1) {
			movieName = movieName || sub.MovieName;
			movieYear = movieYear || sub.MovieYear;
			movieRating = movieRating|| sub.MovieImdbRating;
			mostDownloads = downloads;
			bestRating = rating;
			bestID = i;
			curId = bestID;
			subLink = sub.SubDownloadLink;
		}
	}
	if(bestID > 0) {
		subModel = new SubModel(bestID, movieName, movieYear, movieRating);
		downloadSubtitle(subLink);
	} else {
		callback(false);
	}
};

var downloadSubtitle = function (link) {
	var req = http.request(link, onSubtitleDownloaded);

	req.on('error', function (err) {
		console.log(err, " . Error");
	});

	req.end();
};

var preprocessSubtitle = function (subString) {
	var data = subString.split(/\r\n\r\n/g), // /\n\n/g --> for local file
		i,
		l;

	for (i = 0, l = data.length; i < l; i++) {
		var splitted = data[i].split(/\r\n/); // /\n/ --> for local file
		var timestamp = splitted[1].split(' --> ');

		if(timestamp[1]) {
			data[i] = {
				id: splitted[0],
				from: formatTime(timestamp[0]),
				to: formatTime(timestamp[1]),
				text: preProcessText(splitted.slice(2, splitted.length)),
				fromto: splitted[1]
			};
			data[i].duration = data[i].to - data[i].from;
		} else {
			return false;
		}
	}
	return data;
};

var preProcessText = function(text) {
	return text.join(' ').toLowerCase().replace(/(\.\.\.|\.\.)/g, '.').replace(/(<\/?\w+>)/g,'');
};

var processSequences2 = function(seqs) {
	if(!seqs) {
		return false;
	}
	nlp = NlProcessor.init();
	// add to each sequence its structured sentences
	for (var i = 0; i < seqs.length; i++) {
		seqs[i].stemmedTokens = nlp.getTokenizedAndStemmedWords(seqs[i].text);
		seqs[i].sentiment = nlp.getSentimentScore(seqs[i].text);
	}
	subModel.setSequences(seqs);
	return true;
}

// deprecated due to nlp.getSentenceStructure (.pos function) which can't be casted to client
var processSequences = function(data) {
	nlp = NlProcessor.init();
	// get all sequences form submodel
	var seqs = data;
	// add to each sequence its structured sentences
	for (var i = 0; i < seqs.length; i++) {
		// create sentences
		var sents = nlp.getSentenceStructure(nlp.getSegmentedSentences(seqs[i].text));
		var nText = "";
		// stemmed Tokens
		for (var x = 0; x < sents.length; x++) {
			//console.log("Sent: ", seqs[i].sentences);
			sents[x].stemmedTokens = nlp.getTokenizedAndStemmedWords(sents[x].text());
			// normalized Sentence
			var norm = "";
			for (var j = 0; j < sents[x].stemmedTokens.length; j++) {
				if (j != 0) {
					norm = norm + " ";
				}
				norm = norm + sents[x].stemmedTokens[j];
			}
			sents[x].normalized = norm;
			// get sentiment score of sentence
			sents[x].sentiment = nlp.getSentimentScore(norm);
			// get entity names in sentence
			sents[x].ents = nlp.getEntityNames(norm);

			if (x != 0) {
				nText = nText + " ";
			}
			nText = nText + norm;
		}
		seqs[i].sentences = sents;
		// normalized Text of sequence
		seqs[i].normText = nText;
		// get senitment score of seq text
		seqs[i].sentiment = nlp.getSentimentScore(nText);
		// get entity names in seq
		seqs[i].ents = nlp.getEntityNames(nText);
	}
	subModel.setSequences(seqs);
};

var formatTime = function (timeString) {
	try {
		var hms = timeString.split(':');
		var sms = hms[2].split(',');
		var millisecs = Number(hms[0]) * 3600000 + Number(hms[1]) * 60000 + Number(sms[0]) * 1000 + Number(sms[1]);
		return millisecs;
	} catch(err) {
		console.log('TimeString:', timeString);
		console.log("Time format error:", err);
		return '00:00:00';
	}
};

var onSubtitleDownloaded = function (res) {
	var result = [];
	var gunzip = zlib.createGunzip();
	res.pipe(gunzip);
	gunzip.on('data', function (chunk) {
		result.push(chunk.toString());
	}).on('end', function () {
//		preprocessSubtitle(result.join(''));
//		processSequences2();
		if(processSequences2(preprocessSubtitle(result.join('')))) {
			callback(subModel);
		} else {
			unsuitableSubs.push(curId);
			getSubtitle();
		}
//		processSequences();
//		subModel.update();
	}).on('error', function (err) {
		console.log('res error: ', err);
	});
};

exports.getSubtitle = getSubtitle;
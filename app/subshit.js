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
			bestID,
			subLink,
			movieName = '',
			movieYear = 0,
			movieRating = 0;


		for (var i = 0; i < results.length; i++) {
			var sub = results[i],
				downloads = Number(sub.SubDownloadsCnt);

			if (downloads > mostDownloads) {
				movieName = movieName || sub.MovieName;
				movieYear = movieYear || sub.MovieYear;
				movieRating = movieRating|| sub.MovieImdbRating;
				mostDownloads = downloads;
				bestID = i;
				subLink = sub.SubDownloadLink;
			}
		}

		subModel = new SubModel(id, movieName, movieYear, movieRating);
		downloadSubtitle(subLink);
	});
};

var downloadSubtitle = function (link) {
	/*var options = {
	  hostname: link,
	  method: 'GET',
	  headers: {
	    'Accept-Encoding': 'gzip,deflate',
		}
	};*/
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
	
//	return data;
	subModel.setSequences(data);
};

var processSequences2 = function(data) {
	nlp = NlProcessor.init();
	var seqs = subModel.getSequences();
	// add to each sequence its structured sentences
	for (var i = 0; i < seqs.length; i++) {
		seqs[i].stemmedTokens = nlp.getTokenizedAndStemmedWords(seqs[i].text);
		seqs[i].sentiment = nlp.getSentimentScore(seqs[i].text);
	}
	subModel.setSequences(seqs);
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
		preprocessSubtitle(result.join(''))
		processSequences2();
//		processSequences(preprocessSubtitle(result.join('')));
//		processSequences();
//		subModel.update();
	
	callback(subModel);

	}).on('error', function (err) {
		console.log('res error: ', err);
	});
};

exports.getSubtitle = getSubtitle;
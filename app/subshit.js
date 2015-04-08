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
	subModel.setSequences(data);

	callback(subModel);
};

var processSequences = function() {
	nlp = NlProcessor.init();
	// get all sequences form submodel
	var seqs = subModel.getSequences();
	// add to each sequence its structured sentences
	for (var i = 0; i < seqs.length; i++) {
		// create sentences
		seqs[i].sentences = nlp.getSentenceStructure(nlp.getSegmentedSentences(seqs[i].text));
		// stemmed Tokens
		for (var x = 0; x < seqs[i].sentences.length; x++) {
			//console.log("Sent: ", seqs[i].sentences);
			seqs[i].sentences[x].stemmedTokens = nlp.getTokenizedAndStemmedWords(seqs[i].sentences[x].text());
			// normalized Sentence
			seqs[i].sentences[x].normalized = "";
			for (var j = 0; j < seqs[i].sentences[x].stemmedTokens.length; j++) {
				if (j != 0) {
					seqs[i].sentences[x].normalized = seqs[i].sentences[x].normalized + " ";
				}
				seqs[i].sentences[x].normalized = seqs[i].sentences[x].normalized + seqs[i].sentences[x].stemmedTokens[j];
			}
			// get sentiment score of sentence
			seqs[i].sentences[x].sentiment = nlp.getSentimentScore(seqs[i].sentences[x].normalized);
			// get entity names in sentence
			seqs[i].sentences[x].ents = nlp.getEntityNames(seqs[i].sentences[x].normalized);
		}
		// normalized Text of sequence
		seqs[i].normText = "";
		for (var k = 0; k < seqs[i].sentences.length; k++) {
				if (k != 0) {
					seqs[i].normText = seqs[i].normText + " ";
				}
				seqs[i].normText = seqs[i].normText + seqs[i].sentences[k].normalized;
			}
		// get senitment score of seq text
		seqs[i].sentiment = nlp.getSentimentScore(seqs[i].normText);
		// get entity names in seq
		seqs[i].ents = nlp.getEntityNames(seqs[i].normText);
	}

	//var logNum = 0;
	//console.log("Sentence: ", seqs[logNum].sentences[logNum]);	
	//console.log("Pos: ", seqs[logNum].sentences[logNum].tokens[0].pos);
	//console.log("Analy: ", seqs[logNum].sentences[logNum].tokens[0].analysis);

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
		preprocessSubtitle(result.join(''));
		processSequences();
		var test = subModel.getDataForIntervall();
		console.log("wordcount: ", test.statistics.count);
		//console.log("lists: ", test.lists.normList[0]);
		console.log("listsl1: ", test.lists.wordList.length);
		console.log("listsl2: ", test.lists.normList.length);
		console.log("eigennamen: ", test.lists.entityList);

		
	}).on('error', function (err) {
		console.log('res error: ', err);
	});
};

exports.getSubtitle = getSubtitle;
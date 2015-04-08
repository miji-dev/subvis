/**
 * Constructor for SubModel Objects
 * @param {Number} imdb           imdb id of the movie
 * @param {String} title          movie title
 * @param {Number} year           movie year
 * @param {Number} rating         imdb rating
 * @param {Array}  [sequences=[]] array of all sequences.
 */
var SubModel = function (imdb, title, year, rating, sequences) {
	this.imdb = imdb;
	this.title = title;
	this.year = year;
	this.rating = rating;
	this.sequences = sequences || [];
	this.tempseqs = [];
	this.intervall = {};
};

/**
 * sets all the sequences at once
 * @param {Array}	sequences	subtitle sequences to be set
 */
SubModel.prototype.setSequences = function (sequences) {
	this.sequences = sequences;
	this.update(null);
};

/**
 * gets all the sequence-objects at once
 */
SubModel.prototype.getSequences = function () {
	return this.sequences;
};

/*
 * returns the requested property
 * @param {String}	which	the property name
 * @return {various}		the property value
 */
SubModel.prototype.get = function (which) {
	return this[which];
};

/**
 * adds a sequence object to the sequences arrays
 * @param {Object}	obj	object to be added
 */
SubModel.prototype.addSequence = function (obj) {
	this.sequences.push(obj);
};

/**
 * returns the timestamp of the last subtitle sequence
 * that is also the best approximation for the movie length
 * @return {Number} the movie's last timestamp aka movie length
 */
SubModel.prototype.getLastTime = function () {
	return this.sequences[this.sequences.length - 1].to;
};

/**
 * returns formatted time string hh:mm:ss
 * @param   {String} which which time should be returned
 * @returns {String} the formatted time string
 */
SubModel.prototype.getTimeString = function (which) {
	var millis, str = '',
		hours, mins, secs;
	switch (which) {
	case 'length':
		millis = this.getLastTime();
		break;
	case 'first':
		millis = this.getFirstTime();
		break;
	case 'speechduration':
		millis = this.getSpeechDuration();
		break;
	}
	hours = Math.floor(millis / 36e5);
	mins = Math.floor((millis % 36e5) / 6e4);
	secs = Math.floor((millis % 6e4) / 1000);
	str += (hours > 9 ? hours : ('0' + hours));
	str += ':' + (mins > 9 ? mins : ('0' + mins));
	str += ':' + (secs > 9 ? secs : ('0' + secs));
	return str;
}

/**
 * returns the text array of the last subtitle sequence
 * @return {Array} the movie's last subtitle sequence
 */
SubModel.prototype.getLastText = function () {
	return this.sequences[this.sequences.length - 1].text;
};

/**
 * returns the text array of the first subtitle sequence
 * @return {Array} the movie's firt subtitle sequence
 */
SubModel.prototype.getFirstText = function () {
	return this.sequences[0].text;
};

/**
 * returns the timestamp of the first subtitle sequence
 * @return {Number} the movie's first timestamp
 */
SubModel.prototype.getFirstTime = function () {
	return this.sequences[0].from;
};

/**
 * returns a string with all spoken text
 * @return {String} all the subtitle texts concatenated
 */
SubModel.prototype.getAllWordsString = function () {
	var str = '';
	for (var i = 0; i < this.sequences.length; i++) {
		if (i > 0) {
			str += ' ';
		}
		str += this.sequences[i].text.join(' ');
	}
	return str;
};

SubModel.prototype.getSequencesPercent = function () {
	var res = [],
		last = this.getLastTime(),
		tick = Math.floor(last / 100),
		seq,
		currTime = 0;
	for (var i = 0; i < this.sequences.length; i++) {
		seq = this.sequences[i];
		if (seq.from > currTime && seq.from < (tick * i + 1)) {
			
		}
	}
}

/**
 * returns an array with all spoken text, split into subtitle sequences
 * @return {Array} all the subtitle texts by sequences
 */
SubModel.prototype.getAllSequences = function () {
	var arr = [];
	for (var i = 0; i < this.sequences.length; i++) {
		arr.push(this.sequences[i].text.join(' '));
	}
	return arr;
};

/**
 * returns the number of subtitle sequences
 * @return {Number} the subtitle sequences count
 */
SubModel.prototype.getSequenceCount = function () {
	return this.sequences.length;
};

/**
 * removes a part of the subtitles array
 * helpful for ads, spam and self-aduation
 * @param {Number}	start	where to start removing
 * @param {Number}	count	how many items should be removed
 */
SubModel.prototype.removePart = function (start, count) {
	this.sequences.splice(start, count);
};

/**
 * returns the overall speech duration in milliseconds
 * @return {Number} the movie's overall speech duration
 */
SubModel.prototype.getSpeechDuration = function () {
	var dur = 0;
	for (var i = 0; i < this.sequences.length; i++) {
		dur += Number(this.sequences[i].duration);
	}
	return dur;
};

SubModel.prototype.getDataForIntervall = function (intervall) {
	var data = {};

	this.update(intervall);

	data.sequences = this.tempseqs;
	data.statistics = this.getSentenceStatistics();
	// Anzahl der Sätze insgesamt
	//data.sentenceCount = this.getSentenceCount();
	// durchschnittliche Länge von Sätzen
	//data.avgSentenceLength = this.getAvgSentenceLength();
	// längster vs. kürzester Satz
	//data.minMaxSentence = this.getMinMaxSentence();
	// gesamt Wortanzahl
	//data.wordCount = this.getWordCount();
	// alle normalisierten Wörter
	//data.normWordCount = this.getNormWordCount();
	// - key value: -
	// geordnete liste nach häufigkeit
	data.lists = this.getWordFreqLists();
	//data.NormWordFreqList = this.getNormWordFreqList();
	// geordnete liste je Wortart nach Häufigkeit - häufigstes Verb, Nomen und soweiter
	//data.verbFreqList = this.getVerbFreqList();
	//data.adjectiveFreqList = this.getAdjectiveFreqList();
	//data.adverbFreqList = this.getAdverbFreqList();
	//data.nounFreqList = this.getNounFreqList();
	// Vorkommen von zahlen (datum, jahreszahl, nummer …)
	//data.valueFreqList = this.getValueFreqList();
	// geordnete liste der Eigennamen nach Häufigkeit
	//data.entityFreqList = this.getEntityFreqList();
	// Wörter/Sätze pro minute (wo wird viel gesprochen wo wenig)
	//data.wordsPerMinute = this.getWordsPerMinute();
	//data.sentencesPerMinute = this.getSentencesPerMinute();
	// Sentiment Score für bestimmte Passagen (mittelwert berechnen, 
		// anzeigen wieviele wörter mit wörterbuchabgeglichen und deren score + gesamtscore)
	//data.totalSentimentScore = this.getTotalSentimentScore();
	/* wörter verweise immer an ihre stelle im text 
	--> gleichzeitige markierung im Fließtext bei klick 
	{token:, count:, index:}
	oder
	search-function: find all words of a selected kind
	*/
	return data;
};

/**
 * 
 */
SubModel.prototype.update = function (intervall) {
	this.intervall = intervall;
	this.setSequencesToIntervall(intervall);
};

/**
 * sets the temp sequences to a sepcific intervall
 * {intervall.start, intervall.end}
 */
SubModel.prototype.setSequencesToIntervall = function (intervall) {
	var seqs = [];
	if (!intervall) {
		seqs = this.sequences;
	} else {
		for (var i = 0; i < this.sequences.length; i++) {
			if (this.sequences[i].from >= intervall.from && this.sequences[i].to <= intervall.to) {
				seqs.push(this.sequences[i]);
			}
		}
	}
	this.tempseqs = seqs;
};

/**
 * 
 */
SubModel.prototype.getSentenceStatistics = function() {
	var stats = {};
	stats.wordCount = 0;
	stats.normCount = 0;
	stats.sents = 0;
	var low = 0;
	var high = 0;
	stats.min = [];
	stats.max = [];
	for (var i = 0; i < this.tempseqs.length; i++) {
		stats.sents += this.tempseqs[i].sentences.length;
		for (var j = 0; j < this.tempseqs[i].sentences.length; j++) {
			var words = this.tempseqs[i].sentences[j].tokens.length;
			stats.wordCount += words;
			stats.normCount += this.tempseqs[i].sentences[j].stemmedTokens.length;
			if (low == 0) {
				low = words;
				stats.min.push(this.tempseqs[i].sentences[j]);
			}
			if (words > high) {
				high = words;
				stats.max = [];
				stats.max.push(this.tempseqs[i].sentences[j]);
			} else if (words == high) {
				stats.max.push(this.tempseqs[i].sentences[j]);
			}
			if (words < low) {
				low = words;
				stats.min = [];
				stats.min.push(this.tempseqs[i].sentences[j]);
			} else if (words == low) {
				stats.min.push(this.tempseqs[i].sentences[j]);
			}
		}
	}
	stats.avgWordsInSent = stats.wordCount / stats.sents;
	stats.wordsPerMinute = this.getItemsPerMinute(stats.wordCount);
	stats.sentencesPerMinute = this.getItemsPerMinute(stats.sents);
	stats.allSentiments = this.getTotalSentimentScore();
	return stats;
};

/**
 * 
 */
SubModel.prototype.getWordFreqLists = function() {
	var lists = {};
	lists.wordList = [];
	lists.normList = [];
	lists.verbList = [];
	lists.adjectiveList = [];
	lists.adverbList = [];
	lists.nounList = [];
	lists.valueList = [];
	lists.entityList = [];

	var index = 0;

	var getPos = function(key) {
		for (var i = 0; i < lists.wordList.length; i++) {
			if (lists.wordList[i].key == key) {
				return i;
			}
		}
		return -1;
	};

	var createSortedList = function(origin) {
		// sort list alphabetical
		origin.sort(function(a, b) {
		    var keyA = a.normalised; //.toString().toLowerCase();
		    var keyB = b.normalised; //.toString().toLowerCase();
		    return (keyA < keyB) ? -1 : (keyA > keyB) ? 1 : 0;
		});
		//origin.sort(function(a,b){return (a.normalised) - (b.normalised)});
		var oldPos = -1;
		var oldKey;
		var tmp = [];
		for (var k = 0; k < origin.length; k++) {
			var key = origin[k].normalised;

			if (tmp.length == 0 || key != oldKey) {

				var entry = {};
				entry.key = key;
				entry.tokens = [];
				entry.tokens.push(origin[k]);
				entry.amount = 1;

				tmp.push(entry);
				oldKey = key;
				oldPos++;
			} else if (key == oldKey) {
				tmp[oldPos].tokens.push(origin[k]);
				tmp[oldPos].amount++;
			}
		}
		// sort by amount
		tmp.sort(function(a,b){return (b.amount) - (a.amount)});
		return tmp;
	};

	for (var i = 0; i < this.tempseqs.length; i++) {
		for (var j = 0; j < this.tempseqs[i].sentences.length; j++) {
			// make wordList
			for (var s = 0; s < this.tempseqs[i].sentences[j].tokens.length; s++) {
				// add index to tokens
				this.tempseqs[i].sentences[j].tokens[s].seqIndex = index;
				index++;
			}
				// add token to list
				lists.wordList = lists.wordList.concat(this.tempseqs[i].sentences[j].tokens);

				/*
				var pos = getPos(key);

				if (lists.wordList.length == 0 || pos == -1) {

					var entry = {};
					entry.key = this.tempseqs[i].sentences[j].tokens[k].normalised;
					entry.tokens = [];
					entry.tokens.push(this.tempseqs[i].sentences[j].tokens[k]);
					entry.amount = 1;

					lists.wordList.push(entry);
				} else if (pos > -1) {
					lists.wordList[pos].tokens.push(this.tempseqs[i].sentences[j].tokens[k]);
					lists.wordList[pos].amount++;
				}
				*/
			
			// make normList
			var normKeys = this.tempseqs[i].sentences[j].stemmedTokens;
			for (var r = 0; r < normKeys.length; r++) {
				lists.normList.push(normKeys[r]);
			}
			// make verbList
			var verbs = this.tempseqs[i].sentences[j].verbs();
			//for (var l = 0; l < verbs.length; l++) {
				lists.verbList = lists.verbList.concat(verbs);
			//}
			// make adjectiveList
			var adjectives = this.tempseqs[i].sentences[j].adjectives();
			//for (var m = 0; m < adjectives.length; m++) {
				lists.adjectiveList = lists.adjectiveList.concat(adjectives);
			//}
			// make adverbList
			var adverbs = this.tempseqs[i].sentences[j].adverbs();
			//for (var n = 0; n < adverbs.length; n++) {
				lists.adverbList = lists.adverbList.concat(adverbs);
			//}
			// make nounList
			var nouns = this.tempseqs[i].sentences[j].nouns();
			//for (var o = 0; o < nouns.length; o++) {
				lists.nounList = lists.nounList.concat(nouns);
			//}
			// make valueList
			var values = this.tempseqs[i].sentences[j].values();
			//for (var p = 0; p < values.length; p++) {
				lists.valueList = lists.valueList.concat(values);
			//}
			// make entityList
			var entities = this.tempseqs[i].sentences[j].entities();
			//for (var q = 0; q < entities.length; q++) {
				lists.entityList = lists.entityList.concat(entities);
			//}
				
		}
	}

	
	// create sorted lists
	lists.wordList = createSortedList(lists.wordList);
	lists.normList = createSortedList(lists.normList);
	lists.verbList = createSortedList(lists.verbList);
	lists.adjectiveList = createSortedList(lists.adjectiveList);
	lists.adverbList = createSortedList(lists.adverbList);
	lists.nounList = createSortedList(lists.nounList);
	lists.valueList = createSortedList(lists.valueList);
	lists.entityList = createSortedList(lists.entityList);


	console.log(lists.wordList.length);
	console.log(lists.normList.length);
	console.log(lists.verbList.length);
	console.log(lists.adjectiveList.length);
	console.log(lists.adverbList.length);
	console.log(lists.nounList.length);
	console.log(lists.valueList.length);
	console.log(lists.entityList.length);

	// sort lists
	//lists.wordList.sort(function(a,b){return (b.amount) - (a.amount)});
	//lists.normList.sort(function(a,b){return (b.amount) - (a.amount)});
	return lists;
};


/**
 * 
 */
SubModel.prototype.getItemsPerMinute = function(items) {
	var dur = 0;
	for (var i = 0; i < this.tempseqs.length; i++) {
		dur += this.tempseqs[i].duration;
	}
	return dur / 6e4;
};

/**
 * 
 */
SubModel.prototype.getTotalSentimentScore = function() {
	var score = 0;
	var arr = [];
	var total = this.tempseqs.length;
	for (var i = 0; i < total; i++) {
		score += this.tempseqs[i].sentiment.score;
		arr.push(this.tempseqs[i].sentiment)
	}
	score = score / total;
	return {score: score, sentiments: arr};
};

module.exports = SubModel;
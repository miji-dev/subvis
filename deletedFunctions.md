	<script src="https://rawgit.com/spencermountain/nlp_compromise/master/client_side/nlp.min.js"> </script>
<script>
  data[x].sentences[y].tokens = nlp.pos(data[x].sentences[y].content);
  //dinosaurs
</script>
	
	var data = {};

	data.sequences = this.tempseqs;
	data.statistics = this.getSentenceStatistics();
	data.lists = this.getWordFreqLists();


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
			}
			else if (words == high) {
				stats.max.push(this.tempseqs[i].sentences[j]);
			}
			if (words < low) {
				low = words;
				stats.min = [];
				stats.min.push(this.tempseqs[i].sentences[j]);
			}
			else if (words == low) {
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
			}
			else if (key == oldKey) {
				tmp[oldPos].tokens.push(origin[k]);
				tmp[oldPos].amount++;
			}
		}
		// sort by amount
		tmp.sort(function(a, b) {
			return (b.amount) - (a.amount)
		});
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

			// make normList
			var normKeys = this.tempseqs[i].sentences[j].stemmedTokens;
			for (var r = 0; r < normKeys.length; r++) {
				lists.normList.push(normKeys[r]);
			}
			// make verbList
			var verbs = this.tempseqs[i].sentences[j].verbs();
			lists.verbList = lists.verbList.concat(verbs);
			// make adjectiveList
			var adjectives = this.tempseqs[i].sentences[j].adjectives();
			lists.adjectiveList = lists.adjectiveList.concat(adjectives);
			// make adverbList
			var adverbs = this.tempseqs[i].sentences[j].adverbs();
			lists.adverbList = lists.adverbList.concat(adverbs);
			// make nounList
			var nouns = this.tempseqs[i].sentences[j].nouns();
			lists.nounList = lists.nounList.concat(nouns);
			// make valueList
			var values = this.tempseqs[i].sentences[j].values();
			lists.valueList = lists.valueList.concat(values);
			// make entityList
			var entities = this.tempseqs[i].sentences[j].entities();
			lists.entityList = lists.entityList.concat(entities);
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
	return {
		score: score,
		sentiments: arr
	};
};
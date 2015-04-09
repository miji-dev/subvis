var NlProcessor = (function () {
	var that = {},
		nlp = require("nlp_compromise"),
		natural = require('natural'),
		sentiment = require('sentiment'),
		tokenizer,
		stemmer,
		TfIdf,

		init = function() {
			//example data source; not necessary here
			//this.submodel = submodel;
			//this.spokenText = submodel.getAllWordsString();
			//this.sequenceStrings = submodel.getAllSequences();

			this.tokenizer = new natural.WordTokenizer();
			this.stemmer = natural.PorterStemmer;
			this.stemmer.attach();
			this.TfIdf = natural.TfIdf;
			// no need for machine learning so far
			//this.classifier = new natural.BayesClassifier(stemmer);

			return that;
		},

		getSegmentedSentences = function(text) {
			var sentences = nlp.sentences(text);
			return sentences;
		},

		// do this after stemming!
		getSentenceStructure = function(sens) {
			// can we do this with several sentences?
			//if (count == null) count = 0;
			for (var i = 0; i < sens.length; i++) {
				sens[i] = nlp.pos(s[i]).sentences[0];
			}
			return sens;
		},

		// named-entity recognition
		getEntityNames = function(text) {
			var entityNames = nlp.spot(text);
			//eliminate doubles and count
			//2d array?

			return entityNames;
		},

		getTokenizedAndStemmedWords = function(text) {
			//var stm = natural.PorterStemmer;
			//stm.attach();
			//console.log('i stemmed words.', text);
			//.tokenizeAndStem()); 
			return text.tokenizeAndStem();
		},

		getTokenizedWords = function(text) {
			tokenizer = new natural.WordTokenizer();
			return tokenizer.tokenize(text);
		},

		getStemmedWords = function(tokens) {
			var stemmedWords = [];
			for (var i = 0; i < tokens.length; i++) {
				stemmedTokens.push(tokens[i].stem());
			}
			return stemmedWords;
		},

		// docs can be text or array of tokens
		getTfidf = function(docs, terms) {
		    var tfidf = new TfIdf();
		    for (var i = 0; i < docs.length; i++) {
		    	tfidf.addDocument(docs[i]);
		    }
		    /*
		    var str = '';
		    for (var j = 0; j < terms.length; j++) {
		    	if (j != 0) str = str + ' ';
		    	str = str + terms[j];
		    }
		    */
		    var measurements = [];
			tfidf.tfidfs(terms, function(x, measure) {
			    console.log('document #' + x + ' is ' + measure);
			    measurements.push(measure);
			});
			return measurements;
		},

		// input a single subtitle sequence, loop for getting a score per sub
		getSentimentScore = function(sequence) {
			var score = sentiment(sequence);
			//console.dir(score);
			// there r two attributes in score (score and comparative)
			return score;
		};

		/*
		overwriteSentimentRank = function(sequence, wordlist, scores) {
			var injectWords = {};
			// add key values pairs in object based on wordlist and scores
			var result = sentiment(sequence, injectWords);
		};
		*/

	that.init = init;
	that.getSegmentedSentences = getSegmentedSentences;
	that.getSentenceStructure = getSentenceStructure;
	that.getEntityNames = getEntityNames;
	that.getTokenizedAndStemmedWords = getTokenizedAndStemmedWords;
	that.getTokenizedWords = getTokenizedWords;
	that.getStemmedWords = getStemmedWords;
	that.getTfidf = getTfidf;
	that.getSentimentScore = getSentimentScore;
	return that;
})();

module.exports = NlProcessor;
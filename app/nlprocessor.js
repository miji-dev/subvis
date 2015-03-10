NlProcessor = (function () {
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
			stemmer.attach();
			this.TfIdf = natural.TfIdf,;
			// no need for machine learning so far
			//this.classifier = new natural.BayesClassifier(stemmer);

			return that;
		},

		getSegmentedSentences = function(text) {
			var sentences = nlp.sentences(text);
			var count = sentences.length

			return sentences, count;
		},

		// do this after stemming!
		getSentenceStructure = function(sentence) {
			// can we do this with several sentences?
			//if (count == null) count = 0;
			var s = nlp.pos(sentence).sentences[0]
			var text = s.text();
			var tags = s.tags();
			var structure = {
				nouns: s.nouns(),
				adjectives: s.adjectives(),
				adverbs: s.adverbs(),
				verbs: s.verbs(),
				values: s.values()
			}; 
			return structure;
		},

		// named-entity recognition
		getEntityNames = function(text) {
			entityNames = nlp.spot(text);
			//eliminate doubles and count
			//2d array?

			return entityNames;
		},

		getTokenizedAndStemmedWords = function(text) {
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
			console.dir(score);
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

		/** 
		Weitere Ideen zur Analyse:
		
		-	Anzahl der Sätze insgesamt, durchschnittliche Länge von Sätzen, längster vs. kürzester Satz, gesamt Wortanzahl
		-	Grundformenreduktion und Normalisierung: verschiedene Wörter, häufigste Wörter
		-	Verschiedene Wortarten und deren Häufigkeiten  häufigstes Verb, Nomen und soweiter,
		-	Eigennamen und ihre Häufigkeiten
		-	Vorkommen von zahlen (datum, jahreszahl, nummer …)
		-	Wörter/Sätze pro minute (wo wird viel gesprochen wo wenig)
		-	Sentiment Score für bestimmte Passagen (mittelwert berechnen, anzeigen wieviele wörter mit wörterbuchabgeglichen und deren score + gesamtscore)
		-	Tf-Id von häufigsten Wörter vergleichen mit anderem Film (in der vergleichenden Darstellung von zwei (oder mehreren) filmen


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
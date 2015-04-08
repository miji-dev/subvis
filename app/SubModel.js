/**
 * Constructor for SubModel Objects
 * @param {Number} imdb           imdb id of the movie
 * @param {String} title          movie title
 * @param {Number} year           movie year
 * @param {Number} rating         imdb rating
 * @param {Array}  [sequences=[]] array of all sequences.
 */
var SubModel = function(imdb, title, year, rating, sequences) {
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
SubModel.prototype.setSequences = function(sequences) {
	this.sequences = sequences;
	this.update();
};

/**
 * gets all the sequence-objects at once
 */
SubModel.prototype.getSequences = function() {
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
 * returns the text string of the last subtitle sequence
 * @return {String} the movie's last subtitle sequence
 */
SubModel.prototype.getLastText = function () {
	return this.sequences[this.sequences.length - 1].text;
};

/**
 * returns the text string of the first subtitle sequence
 * @return {String} the movie's firt subtitle sequence
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
		str += this.sequences[i].text;
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
		arr.push(this.sequences[i].text);
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
 * @param {Number}	[start]	where to start removing
 * @param {Number}	[count]	how many items should be removed
 */
SubModel.prototype.removePart = function (start, count) {
	start = start || 0;
	count = count || 1;
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


SubModel.prototype.getDataForIntervall = function(intervall) {
	this.update(intervall);
	return this.tempseqs;
};

/**
 *
 */
SubModel.prototype.update = function(intervall) {
	this.intervall = intervall;
	this.setSequencesToIntervall(intervall);
};

/**
 * sets the temp sequences to a sepcific intervall
 * {intervall.start, intervall.end}
 */
SubModel.prototype.setSequencesToIntervall = function(intervall) {
	var seqs = [];
	if (!intervall) {
		seqs = this.sequences;
	}
	else {
		for (var i = 0; i < this.sequences.length; i++) {
			if (this.sequences[i].from >= intervall.from && this.sequences[i].to <= intervall.to) {
				seqs.push(this.sequences[i]);
			}
		}
	}
	this.tempseqs = seqs;
};

module.exports = SubModel;
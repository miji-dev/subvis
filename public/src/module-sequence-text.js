SubVis.ModuleSequenceText = (function () {
	var that = {},
		$el,
		$div,

		init = function (data) {
			$el = $('#module-sequence-text');
			$div = $el.find('#current-sequences');
			initView(data);
			return that;
		},
		
		initView = function(data) {
			render(data);
		},

		render = function (data) {
			var seq = '',
				temp = '',
				nlpArr;
			if(data.fromTo) {
				for(var i = 0; i < data.text.length; i++) {
					nlpArr = nlp.pos(data.text[i].toLowerCase().replace(/-/g, ''));
					temp += '<span class="sequence-text-item"><span class="sequence-text-time">' + formatTime(data.from[i]) + ' > ' + formatTime(data.to[i]) + '</span><br/>';
					for(var j = 0; j < nlpArr.sentences.length; j++) {
						var sentence = nlpArr.sentences[j];
						for(var k = 0; k < sentence.tokens.length; k++) {
							var token = sentence.tokens[k];
							temp += '<span title="' + token.pos.tag + '" class="tok ' + token.pos.tag + '">' + token.text + '</span>';
						}
					}
					temp += '</span>';
				}
				temp += '</span>';
				var mins = Math.floor((data.fromTo.to - data.fromTo.from) / 6e4) || 0;
				var secs = Math.round(((data.fromTo.to - data.fromTo.from) % 6e4) / 1000) || 0;
				seq += 'Sequences from ' + formatTime(data.fromTo.from) + ' to ' + formatTime(data.fromTo.to) + ' | ' + mins + ' min. ' + secs + ' sec. | ';
				seq += (data.count + ' sequences');
			} else {
				seq += 'All Sequences combined';
				var seqs = data.get('sequences');
				for(var i = 0; i < seqs.length; i++) {
					nlpArr = nlp.pos(seqs[i].text.toLowerCase().replace(/-/g, ''));
					temp += '<span class="sequence-text-item"><span class="sequence-text-time">' + formatTime(seqs[i].from) + ' > ' + formatTime(seqs[i].to) + '</span><br/>';
					for(var j = 0; j < nlpArr.sentences.length; j++) {
						var sentence = nlpArr.sentences[j];
						for(var k = 0; k < sentence.tokens.length; k++) {
							var token = sentence.tokens[k];
							temp += '<span title="' + token.pos.tag + '" class="tok ' + token.pos.tag + '">' + token.text + '</span>';
						}
					}
					temp += '</span>';
				}
			}
			$div.html(temp);
			$el.find('.fromto-sequences').html(seq);
		},
		
		formatTime = function(millis) {
			var str = '', hours, mins, secs;
			if(millis) {
				hours = Math.floor(millis / 36e5);
				mins = Math.floor((millis % 36e5) / 6e4);
				secs = Math.floor((millis % 6e4) / 1000);
				str += (hours > 9 ? hours : ('0' + hours));
				str += ':' + (mins > 9 ? mins : ('0' + mins));
				str += ':' + (secs > 9 ? secs : ('0' + secs));
			}
			return str || '00';
		};

	that.init = init;
	that.render = render;

	return that;
})();
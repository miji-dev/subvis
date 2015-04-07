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
			var item,
				seqs = data.get('sequences'),
				seq = data.getAllSequences();
			for(var i = 0; i < seq.length; i++) {
				item = seqs[i];
				seq[i] = '<span class="sequence-text-item"><span class="sequence-text-time">' + formatTime(item.from) + ' > ' + formatTime(item.to) + '</span><span class="sequence-text-text">' + seq[i] + '</span></span>';
			}
			render({text: seq});
		},

		render = function (data) {
			var seq = '',
				temp = '';
			if(data.fromTo) {
				for(var i = 0; i < data.text.length; i++) {
					var item = data.text[i];
					temp += '<span class="sequence-text-item"><span class="sequence-text-time">' + formatTime(data.from[i]) + ' > ' + formatTime(data.to[i]) + '</span><span class="sequence-text-text">' + item + '</span></span>';
				}
				data.text = temp;
				seq += 'Sequences from ' + formatTime(data.fromTo.from) + ' to ' + formatTime(data.fromTo.to) + ' | ' + Math.floor((data.fromTo.to - data.fromTo.from) / 6e4) + ' min. ' + Math.round(((data.fromTo.to - data.fromTo.from) % 6e4) / 1000) + ' sec. | ';
				seq += (data.count + ' sequences combined');
			} else {
				seq += 'All Sequences combined';
			}
			$div.html(data.text);
			$el.find('.fromto-sequences').html(seq);
		},
		
		formatTime = function(millis) {
			var str = '', hours, mins, secs;
			hours = Math.floor(millis / 36e5);
			mins = Math.floor((millis % 36e5) / 6e4);
			secs = Math.floor((millis % 6e4) / 1000);
			str += (hours > 9 ? hours : ('0' + hours));
			str += ':' + (mins > 9 ? mins : ('0' + mins));
			str += ':' + (secs > 9 ? secs : ('0' + secs));
			return str;
		};

	that.init = init;
	that.render = render;

	return that;
})();
SubVis.ModuleTimeline = (function () {
	var that = {},
		$el,
		$box,
		$control,
		$rangeSlider,
		$rangeSliderLabel,
		// constants
		STARTINTERVAL = 1,

		subModel,

		interval = STARTINTERVAL,
		maxMinutes,
		$activeElement = 0,
		chart,

		init = function (data) {
			$el = $('#module-timeline');
			$box = $el.find('#timeline-box');
			$control = $el.find('#timeline-control');
			$rangeSlider = $control.find('#timeline-range');
			$rangeSliderLabel = $control.find('#timeline-interval');

			registerListeners();

			initUI(data);

			return that;
		},

		initUI = function (data) {
			maxMinutes = Math.ceil(data.getLastTime() / 6e4);

			subModel = data;

			$rangeSlider.attr({
				max: maxMinutes,
				value: interval
			});

			$rangeSliderLabel.val(interval);
			render();
		},

		registerListeners = function () {
			$rangeSlider.off().on('change', function () {
				interval = $(this).val();
				$rangeSliderLabel.val(interval);
				render();
			});
			$rangeSliderLabel.off().on('change', function () {
				var val = Number($(this).val());

				if (val > maxMinutes) {
					$(this).val(maxMinutes);
				}
				if (val < 1) {
					$(this).val(1);
				}
				$rangeSlider.val(val);
				interval = val;
				render();
			});
		},

		render = function () {
			var arr = subModel.get('sequences'),
				item,
				xAxis = ['x'],
				dataArray = [],
				// what to display
				sequences = ['sequences'],
				wordCount = ['character count'],
				sequenceCount = ['sequence count'],
				fromTo = ['from to'],
				from = ['from'],
				to = ['to'],
				seqs = ['seqs'],

				intervalMilli = interval * 6e4,
				prefillMax = Math.ceil(maxMinutes / interval),
				i,
				curIndex,
				chart;

			// prefill data arrays
			for (i = 0; i < prefillMax; i++) {
				xAxis[i + 1] = (interval * i) + '-' + (interval * (i + 1));
				if (i == prefillMax - 1) {
					xAxis[i + 1] = (interval * i) + '-' + maxMinutes;
				}

				wordCount[i + 1] = 0;
				sequenceCount[i + 1] = 0;
				sequences[i + 1] = [];
				fromTo[i + 1] = {};
				from[i+1] = [];
				to [i+1] = [];
				seqs[i+1] = [];
			}

			for (i = 0; i < arr.length; i++) {
				item = arr[i];

				curIndex = Math.floor(item.from / intervalMilli) + 1;
				wordCount[curIndex] += item.text.length;
				sequenceCount[curIndex] ++;
				sequences[curIndex].push(item.text);
				fromTo[curIndex].from = fromTo[curIndex].from || item.from;
				fromTo[curIndex].to = item.to;
				from[curIndex].push(item.from);
				to[curIndex].push(item.to);
				seqs[curIndex].push(item);
			}
			
			dataArray.push(xAxis);
			dataArray.push(wordCount);
			dataArray.push(sequenceCount);

			if (chart) {
				chart.load({
					columns: dataArray
				});
			} else {
				chart = c3.generate({
					bindto: '#timeline-box',
					data: {
						onclick: function (d, element) {
							if($activeElement) {
								$activeElement.css({'fill': 'rgb(31,119,180)', 'stroke': 'rgb(31,119,180)'});
							}
							$activeElement = $('.c3-shape-' + d.x);
							$activeElement.css({'fill': 'black', 'stroke': 'black'});
							$box.trigger('timelineElementClicked', {
								text: sequences[d.x + 1],
								fromTo: fromTo[d.x + 1],
								count: sequenceCount[d.x + 1],
								from: from[d.x + 1],
								to: to[d.x + 1],
								seqs: seqs[d.x +1]
							});
						},
						x: 'x',
						columns: dataArray,
						types: {
							'character count': 'bar'
						},
						axes: {
							'character count': 'y',
							'sequence count': 'y2'
						}
					},
					axis: {
						x: {
							label: 'duration in minutes',
							tick: {
								culling: true
							},
							type: 'category'
						},
						y: {
							label: 'Character Count'
						},
						y2: {
							show: true,
							label: 'Sequence Count'
						}
					}
				});
			}
		};

	that.init = init;
	that.initUI = initUI;
	return that;
})();
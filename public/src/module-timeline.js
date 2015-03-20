SubVis.ModuleTimeline = (function () {
	var that = {},
		$el,
		$box,
		$control,
		$rangeSlider,
		$rangeSliderLabel,
		areaChartInstance,
		// constants
		STARTINTERVAL = 1,

		subData,
		interval = STARTINTERVAL,
		maxMinutes,

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

			subData = data;

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
			var arr = subData.get('sequences'),
				item,
				xAxis = ['x'],
				dataArray = [],
				// what to display
				sequences = ['sequences'],
				wordCount = ['word count'],
				sequenceCount = ['sequence count'],

				intervalMilli = interval * 6e4,
				prefillMax = Math.ceil(maxMinutes / interval),
				i,
				chart;

			// prefill data arrays
			for (i = 0; i < prefillMax; i++) {
				xAxis[i + 1] = (interval * i) + ' - ' + (interval * (i + 1));
				if (i == prefillMax - 1) {
					xAxis[i + 1] = (interval * i) + ' - ' + maxMinutes;
				}

				wordCount[i + 1] = 0;
				sequenceCount[i + 1] = 0;
				sequences[i + 1] = '';
			}

			for (i = 0; i < arr.length; i++) {
				item = arr[i];

				curIndex = Math.floor(item.from / intervalMilli) + 1;

				wordCount[curIndex] += item.text.length;
				sequenceCount[curIndex] ++;
				sequences[curIndex] += '<p>' + item.text + '</p>';
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
							$box.trigger('chartMouseover', sequences[d.x + 1]);
						},
						x: 'x',
						columns: dataArray,
						types: {
							'word count': 'bar'
						},
						axes: {
							'word count': 'y',
							'sequence count': 'y2'
						}
					},
					transition: {
						duration: 2000
					},
					axis: {
						x: {
							tick: {
								culling: true
							},
							type: 'category'
						},
						y: {
							label: 'Word Count'
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
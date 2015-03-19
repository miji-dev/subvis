SubVis.ModuleTimeline = (function () {
	var that = {},
		$el,
		$box,
		$control,
		$rangeSlider,
		$rangeSliderLabel,
		areaChartInstance,

		subData,
		interval = 1,
		max,

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
			max = Math.ceil(data.getLastTime() / 6e4);

			subData = data;

			$rangeSlider.attr({
				max: max,
				value: 1
			});

			$rangeSliderLabel.val(1);
			render();
		},

		registerListeners = function () {
			$rangeSlider.on('change', function () {
				interval = $(this).val();
				$rangeSliderLabel.val(interval);
				render();
			});
			$rangeSliderLabel.on('change', function () {
				var val = Number($(this).val());

				if (val > max) {
					$(this).val(max);
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
				values = [],
				intervalMilli = interval * 6e4,
				i;

			for (i = 0; i < Math.ceil(max / interval); i++) {
				values.push({
					x: interval * i,
					y: 0
				});
			}
			for (i = 0; i < arr.length; i++) {
				item = arr[i];

				curIndex = Math.floor(item.from / intervalMilli);
				values[curIndex].y += item.text.length;
			}
			var chartData = [
				{
					label: 'Timeline',
					values: values
				}
			];
			if (areaChartInstance) {
				areaChartInstance.update(chartData);
			} else {
				areaChartInstance = $box.epoch({
					type: 'bar',
					data: chartData
				});
			}
		};

	that.init = init;
	that.initUI = initUI;
	return that;
})();
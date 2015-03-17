SubVis.Timeline = (function () {
	var that = {},
		$el,

		init = function () {
			$el = $('#timeline-box');
			return that;
		},

		d3Stuff = function (data) {
			var arr = data.get('sequences'),
				item,
				values = [];

			$el.height(arr.length);

			for (var i = 0; i < 1000; i++) {
				item = arr[i];
				values.push({
					x: item.from,
					y: item.text.join().split(' ').length
				});
			}
			console.log(values);
			var chartData = [
				{
					label: 'Timeline',
					values: values
				}
			];
			var areaChartInstance = $el.epoch({
				type: 'bar',
				data: chartData,
				orientation: 'horizontal',
				ticks: {left: 10}
			});
		};

	that.init = init;
	that.d3Stuff = d3Stuff;
	return that;
})();
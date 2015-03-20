SubVis.ModuleSequenceText = (function () {
	var that = {},
		$el,
		$div,

		init = function () {
			$el = $('#module-sequence-text');
			$div = $el.find('#current-sequences');
			return that;
		},

		render = function (data) {
			$div.html(data);
		};

	that.init = init;
	that.render = render;

	return that;
})();
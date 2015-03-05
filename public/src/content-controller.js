SubVis.ContentController = (function () {
	var that = {},
		$contentContainer,

		init = function () {
			$contentContainer = $('#content-container');

			return that;
		},

		render = function (el, which) {
			$contentContainer.empty().append($(el).fadeIn());
		};

	that.init = init;
	that.render = render;
	return that;
})();
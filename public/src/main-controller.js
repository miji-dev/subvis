SubVis.MainController = (function () {
	var that = {},
		searchBoxView,
		$body,

		init = function () {
			$body = $('body');

			initViews();
			registerListeners();

			return that;
		},

		registerListeners = function () {
			$body.on('searchSubtitle', onSearchSubtitle);
		},

		onSearchSubtitle = function (event, data) {
			$.get('http://localhost:3000/' + data, function(data) {
				console.log(data);
			})
			console.log(event, data);
		},

		initViews = function () {
			SubVis.SearchBoxView.init();
		};

	that.init = init;
	return that;
})();
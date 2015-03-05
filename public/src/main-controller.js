SubVis.MainController = (function () {
	var that = {},
		searchBoxView,
		contentController,
		$body,

		init = function () {
			$body = $('body');

			initControllers();
			initViews();
			registerListeners();

			return that;
		},

		registerListeners = function () {
			$body.on('searchSubtitle', onSearchSubtitle);
		},
		
		initControllers = function() {
			contentController = SubVis.ContentController.init();
		},

		onSearchSubtitle = function (event, data) {
			$.get('http://localhost:3000/' + data, function(data) {
				searchBoxView.clipToBar();
				contentController.render(data);
			});
		},

		initViews = function () {
			searchBoxView = SubVis.SearchBoxView.init();
		};

	that.init = init;
	return that;
})();
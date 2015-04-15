SubVis.MainController = (function () {
	var that = {},
		searchBoxView,
		contentController,
		$body,
		$spinnerContainer,
		SERVER = 'http://subvis-wiese4-4.c9.io/',

		init = function () {
			$body = $('body');
			$spinnerContainer = $('#spinner-container');

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

		onSearchSubtitle = function (event, id) {
			$spinnerContainer.fadeIn();
			$('.error').fadeOut();
			$.get(SERVER + id, function(data) {
				if(data) {
					contentController.render(data);
				} else {
					$('.error').fadeIn();
				}
				$spinnerContainer.fadeOut();
			});
		},

		initViews = function () {
			searchBoxView = SubVis.SearchBoxView.init();
		};

	that.init = init;
	return that;
})();
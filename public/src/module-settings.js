SubVis.ModuleSettings = (function () {
	var that = {},
		$el,
		$removeBtnFirst,
		$removeBtnLast,

		init = function () {
			$el = $('#module-settings');
			$removeBtnFirst = $el.find('#remove-btn-first');
			$removeBtnLast = $el.find('#remove-btn-last');
			registerListeners();
			return that;
		},

		registerListeners = function () {
			$el.off();
			$el.on('click', '.remove-btn', onRemoveClicked);
		},

		render = function (firstText, lastText) {
			$el.find('#first-text').html(firstText).append($removeBtnFirst);
			$el.find('#last-text').html(lastText).append($removeBtnLast);
		},

		onRemoveClicked = function (event) {
			var target = event.target;
			$el.trigger('removeClicked', target.id.split('-')[2]);
		};

	that.init = init;
	that.render = render;
	return that;
})();
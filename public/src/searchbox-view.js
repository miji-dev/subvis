SubVis.SearchBoxView = (function () {
	var that = {},
		$searchbox,
		$input,
		$options,

		init = function () {
			$searchbox = $('#search-box');
			$input = $searchbox.find('input');
			$options = $searchbox.find('option');

			registerListeners();

			return that;
		},

		registerListeners = function () {
			$searchbox.on('change', 'input', onInputChange);
			$searchbox.on('click', 'button', onButtonClick);
		},

		getInputValue = function () {
			return $input.val();
		},
		
		clipToBar = function() {
			$searchbox.removeClass('search-box-header');
			$searchbox.addClass('search-box-header');
		},
		
		unlockFromBar = function() {
			$searchbox.removeClass('search-box-header');			
		},

		mapInputValue = function () {
			var val = getInputValue(),
				option,
				i;

			for (i = 0; i < $options.length; i++) {
				option = $options[i];
				if (option.value == val) {
					return option.label;
				}
			}
		},

		onInputChange = function (event) {
			$searchbox.trigger('searchSubtitle', mapInputValue());
		},

		onButtonClick = function (event) {
			$searchbox.trigger('searchSubtitle', mapInputValue());
		};

	that.init = init;
	that.clipToBar = clipToBar;
	that.unlockFromBar = unlockFromBar;
	return that;
})();
SubVis.SearchBoxView = (function () {
	var that = {},
		$searchbox,
		$input,

		init = function () {
			$searchbox = $('#search-box');
			$input = $searchbox.find('input');

			initAutocomplete();

			return that;
		},
		
		initAutocomplete = function() {
			var auto = $input.autocomplete({
				minLength: 1,
				source: sub_list,
				select: onItemSelect
			});
			auto.autocomplete('instance')._renderItem = renderItem;
			auto.autocomplete('instance')._renderMenu = renderMenu;
		},
		
		renderMenu = function(ul, items) {
			var that = this;
			if(items.length > 19) {
				items = items.slice(0, 19);
			}
			$.each( items, function( index, item ) {
				that._renderItemData( ul, item );
			});
		},

		renderItem = function(ul, item) {
			var label = '<span class="sb-label">' + item.label + '</span> | ',
				year = '<span class="sb-year"> (' + item.movieYear + ') </span>';

			return $('<li>').append(label + year).appendTo(ul);
		},
		
		onItemSelect = function(event, ui) {
			$searchbox.trigger('searchSubtitle', ui.item.imdbID);
			return false;
		},
		
		clipToBar = function() {
			$searchbox.removeClass('search-box-header');
			$searchbox.addClass('search-box-header');
		},
		
		unlockFromBar = function() {
			$searchbox.removeClass('search-box-header');			
		};

	that.init = init;
	that.clipToBar = clipToBar;
	that.unlockFromBar = unlockFromBar;
	return that;
})();
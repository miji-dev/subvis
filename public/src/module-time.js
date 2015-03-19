SubVis.ModuleTime = (function() {
	var that = {},
		$el,
		$items = [],
		
		init = function() {
			$el = $('#module-time');
			$items = $el.find('.module-item');
			
			return that;
		},
		
		render = function(data) {
			for(var i = 0; i < data.length; i++) {
				$($items[i]).html(data[i]);
			}
		};
	
	that.init = init;
	that.render = render;
	return that;
})();
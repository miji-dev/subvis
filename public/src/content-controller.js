SubVis.ContentController = (function () {
	var that = {},
		$contentContainer,
		timeline,
		subData,

		init = function () {
			$contentContainer = $('#content-container');
			return that;
		},

		initModules = function () {
			timeline = SubVis.Timeline.init();
		},

		transformJSON = function (jsonObj) {
			for (var key in jsonObj) {
				var value = jsonObj[key];
				if (value && (typeof value === 'string') && value.indexOf("function") === 0) {        
					eval("var jsFunc = " + value);
					jsonObj[key] = jsFunc;
				}
			}
			return jsonObj;
		},

		render = function (el, which) {
			$contentContainer.empty().append($(el).fadeIn());
			subData = transformJSON(sub_data);

			initModules();

			timeline.d3Stuff(subData);
		};

	that.init = init;
	that.render = render;
	return that;
})();
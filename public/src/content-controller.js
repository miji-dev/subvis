SubVis.ContentController = (function () {
	var that = {},
		$contentContainer,
		//modules
		moduleTimeline,
		moduleSettings,
		moduleMeta,
		moduleTime,
		moduleSequenceText,

		subData,

		init = function () {
			$contentContainer = $('#content-container');
			return that;
		},

		registerListeners = function () {
			$contentContainer.off();
			$contentContainer.on('removeClicked', onRemoveClicked);
			$contentContainer.on('chartMouseover', function(event, data) {
				moduleSequenceText.render(data)
			})
		},

		onRemoveClicked = function (event, which) {
			if (which == 'first') {
				subData.removePart();
			} else {
				subData.removePart(subData.sequences.length - 1);
			}
			renderModules();
		},

		initModules = function () {
			moduleTimeline = SubVis.ModuleTimeline.init(subData);
			moduleSettings = SubVis.ModuleSettings.init();
			moduleMeta = SubVis.ModuleMeta.init();
			moduleTime = SubVis.ModuleTime.init();
			moduleSequenceText = SubVis.ModuleSequenceText.init();

			registerListeners();
		},

		renderModules = function () {
			moduleSettings.render(subData.getFirstText(), subData.getLastText());

			var timeArray = [subData.getTimeString('length'), subData.getTimeString('first'), subData.getSequenceCount(), subData.getTimeString('speechduration')];
			moduleTime.render(timeArray);
			
			moduleTimeline.initUI(subData);
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
		};

	that.init = init;
	that.render = render;
	return that;
})();
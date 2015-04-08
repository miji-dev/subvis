SubVis.ContentController = (function () {
	var that = {},
		$contentContainer,
		//modules
		moduleTimeline,
		moduleSettings,
		moduleMeta,
		moduleTime,
		moduleSequenceText,
		moduleFinder,
		moduleWordCloud,
		//helpers
		currentIntervalData,

		subModel,

		init = function () {
			$contentContainer = $('#content-container');
			return that;
		},

		registerListeners = function () {
			$contentContainer.off();
			$contentContainer.on('removeClicked', onRemoveClicked);
			$contentContainer.on('timelineElementClicked', onTimelineElementClicked);
			$contentContainer.on('findWords', function(event, data) {
				var str = subModel.getAllWordsString();
				var regExp = new RegExp(data, 'gi');
				var res = (str.match(regExp) || []).length;
				moduleFinder.render(res);
			});
		},
		
		onTimelineElementClicked = function(event, data) {
			currentIntervalData = data;//subModel.getDataForIntervall(data.fromTo);
			moduleSequenceText.render(data);
		},

		onRemoveClicked = function (event, which) {
			if (which == 'first') {
				subModel.removePart();
			} else {
				subModel.removePart(subModel.sequences.length - 1);
			}
			renderModules();
		},

		initModules = function () {
			console.log(subModel)
			moduleTimeline = SubVis.ModuleTimeline.init(subModel);
			moduleSettings = SubVis.ModuleSettings.init();
			moduleMeta = SubVis.ModuleMeta.init();
			moduleTime = SubVis.ModuleTime.init();
			moduleSequenceText = SubVis.ModuleSequenceText.init(subModel);
			moduleFinder = SubVis.ModuleFinder.init();
			moduleWordCloud = SubVis.ModuleWordCloud.init(subModel.getAllWordsString());
			registerListeners();
		},

		renderModules = function () {
			moduleSettings.render(subModel.getFirstText(), subModel.getLastText());

			var timeArray = [subModel.getTimeString('length'), subModel.getTimeString('first'), subModel.getSequenceCount(), subModel.getTimeString('speechduration')];
			moduleTime.render(timeArray);
			
			moduleTimeline.initUI(subModel);
			moduleWordCloud.render(subModel.getAllWordsString());
			
			if(currentIntervalData) {
				moduleSequenceText.render(currentIntervalData);
			}
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
			subModel = transformJSON(sub_data);

			initModules();
		};

	that.init = init;
	that.render = render;
	return that;
})();
SubVis.ContentController = (function () {
	var that = {},
		$contentContainer,
		$spinner,
		//modules
		moduleTimeline,
		moduleSettings,
		moduleMeta,
		moduleTime,
		moduleSequenceText,
		moduleFinder,
		moduleWordCloud,
		moduleTopLists,
		moduleSentiment,
		moduleStatistics,
		//helpers
		currentIntervalData,
		statisticHelper,
		tooltips,

		subModel,

		init = function () {
			$contentContainer = $('#content-container');
			$spinner = $('#spinner-container');

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
			moduleWordCloud.render(data.text.join(' '));
			var seqs = data.text;
			var nlpArr = [];
			for(var i = 0; i < seqs.length; i++) {
				var obj = nlp.pos(normaliseText(seqs[i]));
				obj.duration = data.seqs[i].duration;
				nlpArr.push(obj);
			}
			
			moduleStatistics.render(statisticHelper.getSentenceStatistics(nlpArr));
			moduleTopLists.render(statisticHelper.getWordFreqLists(nlpArr));
			moduleSentiment.render(statisticHelper.getTotalSentimentScore(data.seqs));
		},

		onRemoveClicked = function (event, which) {
			$spinner.show();
			setTimeout(function() {
				if (which == 'first') {
					subModel.removePart();
				} else {
					subModel.removePart(subModel.sequences.length - 1);
				}
				renderModules();
				$spinner.fadeOut();
			}, 100);
		},

		initModules = function () {
			tooltips = SubVis.Tooltips.init();
			statisticHelper = SubVis.StatisticHelper.init();
			moduleTimeline = SubVis.ModuleTimeline.init(subModel);
			moduleSettings = SubVis.ModuleSettings.init();
			moduleMeta = SubVis.ModuleMeta.init();
			moduleTime = SubVis.ModuleTime.init();
			moduleSequenceText = SubVis.ModuleSequenceText.init(subModel);
			moduleFinder = SubVis.ModuleFinder.init();

			var seqs = subModel.get('sequences');
			var nlpArr = [];
			for(var i = 0; i < seqs.length; i++) {
				var obj = nlp.pos(normaliseText(seqs[i].text));
				obj.duration = seqs[i].duration;
				nlpArr.push(obj);
			}

			moduleStatistics = SubVis.ModuleStatistics.init(statisticHelper.getSentenceStatistics(nlpArr));
			moduleSentiment = SubVis.ModuleSentiment.init(statisticHelper.getTotalSentimentScore(seqs));
			moduleTopLists = SubVis.ModuleTopLists.init(statisticHelper.getWordFreqLists(nlpArr));
			moduleWordCloud = SubVis.ModuleWordCloud.init(subModel.getAllWordsString());
			registerListeners();
		},
		
		normaliseText = function(text) {
			var res = text.replace(/\s/g, ' ').replace(/^\s/gm,'').replace(/\s$/gm,'');
			return res;
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
			
			var seqs = subModel.get('sequences');
			var nlpArr = [];
			for(var i = 0; i < seqs.length; i++) {
				var obj = nlp.pos(normaliseText(seqs[i].text));
				obj.duration = seqs[i].duration;
				nlpArr.push(obj);
			}

			moduleStatistics.render(statisticHelper.getSentenceStatistics(nlpArr));
			moduleSentiment.render(statisticHelper.getTotalSentimentScore(seqs));
			moduleTopLists.render(statisticHelper.getWordFreqLists(nlpArr));
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
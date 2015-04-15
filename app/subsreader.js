var fs = require('fs'),
	path = require('path'),
	SUB_LIST_PATH = path.join('app', 'txt', 'sublist.json'),
	SUB_DELIMITER1 = '\n',
	SUB_DELIMITER2 = '\t',
	subs = [],

	init = function () {
		getSubsSync();
	},
	
	getSubsSync = function() {
		subs = JSON.parse(fs.readFileSync(SUB_LIST_PATH, 'utf8'));
	},

	// read and process subtitle infos. ~40000 items
	readFile = function () {
		var data = fs.readFileSync(SUB_LIST_PATH);
		var rows = data.toString().split(SUB_DELIMITER1);

		for (var i = 0; i < rows.length; i++) {
			var r = processRow(rows[i]);
			subs.push(r);
		}
		subs.pop();
	},

	getSubs = function () {
		return subs;
	},

	processRow = function (row) {
		var sub = row.split(SUB_DELIMITER2);
		var obj = {
			id: sub[0],
			value: sub[1],
			year: sub[2],
			imdb: sub[3]
		};
		return obj;
	};

init();

exports.getSubs = getSubs;
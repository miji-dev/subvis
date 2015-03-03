var fs = require('fs'),
	path = require('path'),
	SUB_LIST_PATH = path.join('app', 'txt', 'subs.txt'),
	SUB_DELIMITER1 = '\r\n',
	SUB_DELIMITER2 = '\t',
	subs = [],

	init = function () {
		console.log("start");
		readFile();
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
		console.log("done");
	},

	getSubs = function () {
		return subs;
	},

	processRow = function (row) {
		var sub = row.split(SUB_DELIMITER2);
		var obj = {
			id: sub[0],
			value: sub[1],
			imdb: sub[2]
		};
		return obj;
	};

init();

exports.getSubs = getSubs;
var fs = require('fs'),
	SUB_LIST_PATH = path.join('res', 'txt', 'subtitles.txt'),
	SUB_DELIMITER1 = '\r\n',
	SUB_DELIMITER2 = '\t',

	init = function () {
		readFile();
	},

	// read and process subtitle infos. 142802 items
	readFile = function () {
		fs.readFile(SUB_LIST_PATH, function (err, data) {
			if (err) {
				throw err;
			}
			var subs = [],
				rows = data.toString().split(SUB_DELIMITER1);

			subs.push(rows.forEach(processRow));
			subs.pop();
			// do something ...
		});
	},

	processRow = function (row) {
		var sub = row.split(SUB_DELIMITER2);
		return {
			id: sub[0],
			value: sub[1],
			imdb: sub[2]
		};
	},

	showHome = function (req, res, next) {
		res.render('home');
	};

init();

exports = {
	showHome: showHome
};
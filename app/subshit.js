// This fucking shit is a fucking shit fuck!
var subshit = require('../node_modules/opensubtitles-client/Index.js');
var TOKEN;

subshit.api.on("login", function (token) {
	console.log("login: " + token);
});

subshit.api.on("search", function() {
	console.log("searching ...")
} );

subshit.api.login().done(
	function (token) {
		TOKEN = token;
	}
);

// public method to get a specific subtitle file
var getSubtitle = function (id) {
	subshit.api.searchID(TOKEN, 'eng', id).done(function (results) {
		var bestRating = 0;
		var bestID;
		var subLink;
		for (var i = 0; i < results.length; i++) {
			var sub = results[i],
				rating = Number(sub.SubRating);

			if (rating > bestRating) {
				bestRating = rating;
				bestID = i;
				subLink = sub.SubDownloadLink;
				if (bestRating == 10) {
					break;
				}
			}
		}
		// TODO: actually downloading the subtitle file
		console.log(bestRating, bestID, subLink);
	});
};

exports.getSubtitle = getSubtitle;
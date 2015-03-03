// modules
var xmlrpc = require('xmlrpc');

// constants
var OS_URL = 'api.opensubtitles.org',
	OS_PATH = '/xml-rpc',
	OS_USERAGENT = 'OSTestUserAgent',
	/*'STD3',*/
	TOKEN,
	RESPONSE,
	SUBTITLES,
	METHODS = ['LogIn', 'SearchSubtitles'];

var client = xmlrpc.createClient({
	host: OS_URL,
	path: OS_URL
});

var xmlrpc = function (method, params, callback) {
	console.log(method, params, callback)
	client.methodCall(method, params, callback);
}

var login = function () {
	xmlrpc(METHODS[0], ['', '', 'en', OS_USERAGENT], onLoginSuccess);
}

var onLoginSuccess = function (error, value) {
	console.log("fick dich", error, value)
	if (error) {
		throw error;
	} else {
		RESPONSE = value;
		TOKEN = RESPONSE[0].token;
	}
}

var getMovies = function (id) {
	if (id) {
		xmlrpc(METHODS[1], [TOKEN, [{
			sublanguageid: 'eng',
			imdbid: id
}]], function (response, status, jqXHR) {
			console.log(response, status, jqXHR);
		});
	}
}
login();

exports.getMovies = getMovies;
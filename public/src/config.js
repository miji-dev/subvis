require.config({
	'deps': ['main'],

	'paths': {
		'jquery': '../lib/jquery-2.1.3.min.js',
		'underscore': '../lib/underscore.min.js',
		'backbone': '../lib/backbone.min.js',
		'awesomplete': '../lib/awesomplete.min.js',
		'd3': '../lib/d3.min.js'
	},

	'shim': {
		'backbone': {
			'deps': [
				'jquery',
				'underscore'
			],
			exports: 'Backbone'
		}
	}
});
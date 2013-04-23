var sys = require('util'),
	Jamendo = require('./index.js'),
	assert = require('assert');

// get an API client
var jamendo = new Jamendo({
	client_id: '83039c0d'
});

// track #245 - J.E.T. Apostrophe A.I.M.E by Both
jamendo.tracks({ id: 245 }, function(error, data){

	assert(typeof data.results !== 'undefined');
	assert(data.results[0].id === '245');
	assert(data.results[0].artist_id === '5');
	assert(data.results[0].album_id === '33');
	assert(data.results[0].artist_name === 'Both');
	assert(data.results[0].album_name === 'Simple Exercice');

});

// album #33 - Simple Exercice by Both
jamendo.albums({ id: 33 }, function(error, data){

	assert(typeof data.results !== 'undefined');
	assert(data.results[0].id === '33');
	assert(data.results[0].artist_id === '5');
	assert(data.results[0].artist_name === 'Both');
	assert(data.results[0].name === 'Simple Exercice');

});

// artist #5 - Both
jamendo.artists({ id: 5 }, function(error, data){

	assert(typeof data.results !== 'undefined');
	assert(data.results[0].id === '5');
	assert(data.results[0].name === 'Both');

});

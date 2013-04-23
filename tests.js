var sys = require('util'),
	Jamendo = require('./index.js'),
	assert = require('assert');

// get an API client
var jamendo = new Jamendo({
	debug: false,
	protocole: 'https',
	client_id: 'b6747d04' // b6747d04 is a testing client_id, replace by yours
});

// test tracks method
jamendo.tracks({ id: 245 }, function(error, data){

	assert(typeof data.results !== 'undefined');
	assert(data.results.length === 1);

	assert(data.results[0].id === '245');
	assert(data.results[0].artist_id === '5');
	assert(data.results[0].album_id === '33');
	assert(data.results[0].artist_name === 'Both');
	assert(data.results[0].album_name === 'Simple Exercice');

});

// test albums method
jamendo.albums({ id: 33 }, function(error, data){

	assert(typeof data.results !== 'undefined');
	assert(data.results.length === 1);

	assert(data.results[0].id === '33');
	assert(data.results[0].artist_id === '5');
	assert(data.results[0].artist_name === 'Both');
	assert(data.results[0].name === 'Simple Exercice');

});

// test artists method
jamendo.artists({ id: 5 }, function(error, data){

	assert(typeof data.results !== 'undefined');
	assert(data.results.length === 1);

	assert(data.results[0].id === '5');
	assert(data.results[0].name === 'Both');

});

// test users_favorites_artists method
jamendo.users_favorites_artists({ id: 257235 }, function(error, data){

	assert(data.results !== 'undefined');
	assert(data.results.length === 1);
	assert(data.results[0].artists.length > 1);

});

// test array parameters
jamendo.artists({ id: [ 5, 888 ] }, function(error, data){

	assert(typeof data.results !== 'undefined');
	assert(data.results.length === 2);

});

// test default parameters
jamendo.artists({ }, function(error, data){

	assert(typeof data.results !== 'undefined');
	assert(data.results.length === 10);

});

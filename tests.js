var sys = require('util'),
	Jamendo = require('./index.js'),
	assert = require('assert');

// get an API client
var jamendo = new Jamendo({
	debug: true,
	retry: true,
	protocole: 'https',
	client_id: '83039c0d' // b6747d04 is a testing client_id, replace by yours
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

// test concerts method
jamendo.concerts({ }, function(error, data){

	assert(typeof data.results !== 'undefined');
	assert(data.results.length === 10);

});

// test array params
jamendo.artists({ id: [ 5, 888 ] }, function(error, data){

	assert(typeof data.results !== 'undefined');
	assert(data.results.length === 2);

});

// test default params
jamendo.artists({ }, function(error, data){

	assert(typeof data.results !== 'undefined');
	assert(data.results.length === 10);

});

// test datebetween params, as strings and timestamps
jamendo.tracks({ datebetween: [ 449921044 * 1000, '2011-10-10' ], limit: 10 }, function(error, data){

	assert(typeof data.results !== 'undefined');
	assert(data.results.length === 10);

});

// test datebetween params, as Date objects
jamendo.tracks({ datebetween: [ new Date('1984-04-04'), new Date('2011-10-10') ], limit: 10 }, function(error, data){

	assert(typeof data.results !== 'undefined');
	assert(data.results.length === 10);

});



var util = require('util'),
  fs = require('fs'),
  sys = require('util'),
  Jamendo = require('./index.js'),
  assert = require('assert');

function load_or(filename, defaults) {
  try { return require(filename); } catch (e) { return defaults; }
}

// try to load my own credentials
var client_id = load_or('./.client_id.js', 'b6747d04');
var client_secret = load_or('./.client_secret.js', null);

console.log('using API client_id:', client_id);
console.log('using API client_secret:', client_secret);

// get an API client
var jamendo = new Jamendo({
  debug: true,
  retry: true,
  protocol: 'https',
  client_id: client_id,
  client_secret: client_secret,
  rejectUnauthorized: false
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

/* // TODO
album_tracks
artist_albums
artist_tracks
playlists
playlists_tracks
reviews
reviews_albums
radios
*/

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

// test authorize 
var test_redirect_uri = 'http://localhost/DAT_CODE';
jamendo.authorize({ redirect_uri: test_redirect_uri }, function(error, login_url){

  assert(typeof login_url !== 'undefined');

  var authorization_code = process.env.AUTHORIZATION_CODE;

  // dont have any AUTHORIZATION_CODE to play with ,*__*
  if (!authorization_code) {
    console.log('Open your browser at', login_url, '. Log you in, accept app, and get the auth code');
    console.log('then, in max 30 seconds from now, run me with that string in the AUTHORIZATION_CODE environement variable, like');
    console.log('$> AUTHORIZATION_CODE=mybrandnewauthcode  npm test');
    console.log('');

  // much better !
  } else {

    // get granted 
    jamendo.grant({ redirect_uri: test_redirect_uri, code: authorization_code }, function(error, oauth_data){

      assert(typeof oauth_data !== 'undefined', 'Cannot get oauth data, verify your credentials');

      var refresh_token = oauth_data.refresh_token;
      var access_token = oauth_data.access_token;
      var expires_in = oauth_data.expires_in;
      var token_type = oauth_data.token_type;
      var scope = oauth_data.scope;

      // test setuser_fan
      jamendo.setuser_fan({ access_token: access_token, artist_id: 5 }, function(error, error_message, warnings){
        assert.ok(!error, 'Cannot get be fan of artist Both: ' + error_message);
      });

      // test setuser_favorite
      jamendo.setuser_favorite({ access_token: access_token, track_id: 245 }, function(error, error_message, warnings){
        assert.ok(!error, 'Cannot get be fan of track: ' + error_message);
      });

      // test setuser_like
      jamendo.setuser_like({ access_token: access_token, track_id: 245 }, function(error, error_message, warnings){
        assert.ok(!error, 'Cannot like track: ' + error_message);
      });

      // test setuser_dislike
      jamendo.setuser_dislike({ access_token: access_token, track_id: 245 }, function(error, error_message, warnings){
        assert.ok(!error, 'Cannot dislike track', error_message);
      });

    });

  }
});


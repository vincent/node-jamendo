var request = require('request');
var util = require('util');

/**
* Jamendo API client class
* Use it with 
* var client = new Jamendo({ client_id: XXXXXX })
*
* @param {Object} settings A settings object with a client_id member
* @return object An instanciated Jamendo class
*/
var Jamendo = function(settings) {
  if (!settings || !settings.client_id) {
    throw 'You must provide a client_id setting';
  }

  this.debug = settings.debug;
  this.protocol = settings.protocol || 'http';
  this.base_url = this.protocol + '://api.jamendo.com/' + (settings.version ? settings.version : 'v3.0');
  this.client_id = settings.client_id;

  this.retry = settings.retry || false;
};

module.exports = Jamendo;

/**
* Clean a object parameters according to Jamendo policy
*  - client_id is set if not specified
*  - limit and offset are set if not specified
*  - arrays are converted to space-separated strings
*
* @param {String} path The path parameters will be used against
* @param {Object} object The object parameters to clean
* @return {Object} Cleaned object
*/
Jamendo.prototype.clean_params = function(path, object){
  var param, default_params = {
    limit     : 10,
    offset    : 0,
    format    : 'json',
    client_id : this.client_id, 
  };

  // explicit params
  for (var name in default_params) {
    if (typeof object[name] === 'undefined') {
      object[name] = default_params[name];
    }
  }

  // datebetween params
  if (object.datebetween && util.isArray(object.datebetween) && object.datebetween.length === 2) {
    
    for (var i = 0; i < 2; i++) {
      // perfect
      if (util.isDate(object.datebetween[i])) {

      // a timestamp (milliseconds)
      } else if (parseInt(object.datebetween[i], 0)) {
        object.datebetween[i] = new Date(object.datebetween[i]);
      
      // an IETF-compliant RFC 2822 timestamps string
      } else {
        object.datebetween[i] = new Date(object.datebetween[i]);
      }
    }

    object.datebetween = this.format_date(object.datebetween[0]) + '_' + this.format_date(object.datebetween[1]);
  }

  // arrays as strings
  for (var pname in object) {
    if (util.isArray(object[pname])) {
      object[pname] = object[pname].join(' ');
    }
  }

  return object;
};

/**
* Format a Date according to API
* @param {Date} date Date to format
*/
Jamendo.prototype.format_date = function(date) {
  return date.getFullYear() + '-' + ('0' + date.getMonth()).slice(-2) + '-' + ('0' + (date.getDate() + 1)).slice(-2);
};

/**
* Main request wrapper
*
* @param {String} path The path to the api endpoint
* @param {Object} parameters A query string object
* @param {Function} callback The request callback(error, response_body)
* @return {Request} The request object
*/
Jamendo.prototype.request = function(path, parameters, callback) {
  parameters = this.clean_params(path, parameters || {});

  var self = this;

  var r = request({
    url: this.base_url + path,
    method: 'GET',
    qs: parameters,
    json: true
  }, function(error, response, body){
    if (error && !response && self.retry) {
      if (self.debug) {
        console.log('network error, retry');
      }
      return self.request(path, parameters, callback);
    }

    callback(error, body);
  });

  return r;
};

/**
* Wrapper to the /albums endpoint
*
* @see http://developer.jamendo.com/v3.0/albums
* @param {Object} parameters A query string object
* @param {Function} callback The request callback(error, response_body)
* @return {Request} The request object
*/
Jamendo.prototype.albums = function(parameters, callback) {
  return this.request('/albums', parameters, callback);
};

/**
* Wrapper to the /artists endpoint
*
* @see http://developer.jamendo.com/v3.0/artists
* @param {Object} parameters A query string object
* @param {Function} callback The request callback(error, response_body)
* @return {Request} The request object
*/
Jamendo.prototype.artists = function(parameters, callback) {
  return this.request('/artists', parameters, callback);
};

/**
* Wrapper to the /tracks endpoint
*
* @see http://developer.jamendo.com/v3.0/tracks
* @param {Object} parameters A query string object
* @param {Function} callback The request callback(error, response_body)
* @return {Request} The request object
*/
Jamendo.prototype.tracks = function(parameters, callback) {
  return this.request('/tracks', parameters, callback);
};

/**
* Wrapper to the /album/tracks endpoint
*
* @see http://developer.jamendo.com/v3.0/album_tracks
* @param {Object} parameters A query string object
* @param {Function} callback The request callback(error, response_body)
* @return {Request} The request object
*/
Jamendo.prototype.album_tracks = function(parameters, callback) {
  return this.request('/album/tracks', parameters, callback);
};

/**
* Wrapper to the /artist/albums endpoint
*
* @see http://developer.jamendo.com/v3.0/artist_albums
* @param {Object} parameters A query string object
* @param {Function} callback The request callback(error, response_body)
* @return {Request} The request object
*/
Jamendo.prototype.artist_albums = function(parameters, callback) {
  return this.request('/artist/albums', parameters, callback);
};

/**
* Wrapper to the /artist/tracks endpoint
*
* @see http://developer.jamendo.com/v3.0/artist_tracks
* @param {Object} parameters A query string object
* @param {Function} callback The request callback(error, response_body)
* @return {Request} The request object
*/
Jamendo.prototype.artist_tracks = function(parameters, callback) {
  return this.request('/artist/tracks', parameters, callback);
};

/**
* Wrapper to the /concerts endpoint
*
* @see http://developer.jamendo.com/v3.0/concerts
* @param {Object} parameters A query string object
* @param {Function} callback The request callback(error, response_body)
* @return {Request} The request object
*/
Jamendo.prototype.concerts = function(parameters, callback) {
  return this.request('/concerts', parameters, callback);
};

/**
* Wrapper to the /playlists endpoint
*
* @see http://developer.jamendo.com/v3.0/playlists
* @param {Object} parameters A query string object
* @param {Function} callback The request callback(error, response_body)
* @return {Request} The request object
*/
Jamendo.prototype.playlists = function(parameters, callback) {
  return this.request('/playlists', parameters, callback);
};

/**
* Wrapper to the /playlists/tracks endpoint
*
* @see http://developer.jamendo.com/v3.0/playlists_tracks
* @param {Object} parameters A query string object
* @param {Function} callback The request callback(error, response_body)
* @return {Request} The request object
*/
Jamendo.prototype.playlists_tracks = function(parameters, callback) {
  return this.request('/playlists/tracks', parameters, callback);
};

/**
* Wrapper to the /reviews endpoint
*
* @see http://developer.jamendo.com/v3.0/reviews
* @param {Object} parameters A query string object
* @param {Function} callback The request callback(error, response_body)
* @return {Request} The request object
*/
Jamendo.prototype.reviews = function(parameters, callback) {
  return this.request('/reviews', parameters, callback);
};

/**
* Wrapper to the /reviews/albums endpoint
*
* @see http://developer.jamendo.com/v3.0/reviews_albums
* @param {Object} parameters A query string object
* @param {Function} callback The request callback(error, response_body)
* @return {Request} The request object
*/
Jamendo.prototype.reviews_albums = function(parameters, callback) {
  return this.request('/reviews/albums', parameters, callback);
};

/**
* Wrapper to the /radios endpoint
*
* @see http://developer.jamendo.com/v3.0/radios
* @param {Object} parameters A query string object
* @param {Function} callback The request callback(error, response_body)
* @return {Request} The request object
*/
Jamendo.prototype.radios = function(parameters, callback) {
  return this.request('/radios', parameters, callback);
};

/**
* Wrapper to the /radios/stream endpoint
*
* @see http://developer.jamendo.com/v3.0/radios/stream
* @param {Object} parameters A query string object
* @param {Function} callback The request callback(error, response_body)
* @return {Request} The request object
*/
Jamendo.prototype.radios_stream = function(parameters, callback) {
  return this.request('/radios/stream', parameters, callback);
};

/**
* Wrapper to the /users endpoint
*
* @see http://developer.jamendo.com/v3.0/users
* @param {Object} parameters A query string object
* @param {Function} callback The request callback(error, response_body)
* @return {Request} The request object
*/
Jamendo.prototype.users = function(parameters, callback) {
  return this.request('/users', parameters, callback);
};

/**
* Wrapper to the /users/artists endpoint
*
* @see http://developer.jamendo.com/v3.0/users/artists
* @param {Object} parameters A query string object
* @param {Function} callback The request callback(error, response_body)
* @return {Request} The request object
*/
Jamendo.prototype.users_artists = function(parameters, callback) {
  return this.request('/users/artists', parameters, callback);
};

/**
* Wrapper to the /users/albums endpoint
*
* @see http://developer.jamendo.com/v3.0/users/albums
* @param {Object} parameters A query string object
* @param {Function} callback The request callback(error, response_body)
* @return {Request} The request object
*/
Jamendo.prototype.users_albums = function(parameters, callback) {
  return this.request('/users/albums', parameters, callback);
};

/**
* Wrapper to the /users/tracks endpoint
*
* @see http://developer.jamendo.com/v3.0/users/tracks
* @param {Object} parameters A query string object
* @param {Function} callback The request callback(error, response_body)
* @return {Request} The request object
*/
Jamendo.prototype.users_tracks = function(parameters, callback) {
  return this.request('/users/tracks', parameters, callback);
};

/**
* Wrapper to the /users/artists endpoint, with an explicit 'fan' relation
*
* @see http://developer.jamendo.com/v3.0/users/artists
* @param {Object} parameters A query string object
* @param {Function} callback The request callback(error, response_body)
* @return {Request} The request object
*/
Jamendo.prototype.users_favorites_artists = function(parameters, callback) {
  parameters.relation = 'fan';
  return this.request('/users/artists', parameters, callback);
};

/**
* Wrapper to the /users/albums endpoint, with an explicit 'fan' relation
*
* @see http://developer.jamendo.com/v3.0/users/albums
* @param {Object} parameters A query string object
* @param {Function} callback The request callback(error, response_body)
* @return {Request} The request object
*/
Jamendo.prototype.users_favorites_albums = function(parameters, callback) {
  parameters.relation = 'fan';
  return this.request('/users/albums', parameters, callback);
};

/**
* Wrapper to the /users/tracks endpoint, with an explicit 'fan' relation
*
* @see http://developer.jamendo.com/v3.0/users/tracks
* @param {Object} parameters A query string object
* @param {Function} callback The request callback(error, response_body)
* @return {Request} The request object
*/
Jamendo.prototype.users_favorites_tracks = function(parameters, callback) {
  parameters.relation = 'fan';
  return this.request('/users/tracks', parameters, callback);
};

/**
* Wrapper to the /autocomplete endpoint
*
* @see http://developer.jamendo.com/v3.0/autocomplete
* @param {Object} parameters A query string object
* @param {Function} callback The request callback(error, response_body)
* @return {Request} The request object
*/
Jamendo.prototype.autocomplete = function(parameters, callback) {
  return this.request('/autocomplete', parameters, callback);
};



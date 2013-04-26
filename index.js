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
  this.client_secret = settings.client_secret;
  this.rejectUnauthorized = settings.rejectUnauthorized || false;


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
  var param,
      default_params = {
        limit     : 10,
        offset    : 0,
        format    : 'json',
        client_id : this.client_id, 
      };

  object = object || {};

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
    rejectUnauthorized: this.rejectUnauthorized,
    qs: parameters,
    json: true
  }, function(error, response, body){

    if (error && !response && self.retry) {
      if (self.debug) {
        console.log('network error, retry', error);
      }
      return self.request(path, parameters, callback);
    }

    callback(error, body);
  });

  return r;
};

/**
* Main write request wrapper
*
* @param {String} path The path to the api endpoint
* @param {Object} parameters A query string object, must contain an access_token member
* @param {Function} callback The request callback(error, error_message, warnings)
* @return {Request} The request object
*/
Jamendo.prototype.write_request = function(path, parameters, callback) {
  parameters = parameters || {};

  var self = this;

  var r = request({
    url: this.base_url + path,
    method: 'POST',
    rejectUnauthorized: this.rejectUnauthorized,
    form: parameters,
    json: true
  }, function(error, response, body){
    if (error && !response && self.retry) {
      if (self.debug) {
        console.log('network error, retry', error);
      }
      return self.write_request(path, parameters, callback);
    }

    // http error
    if (error || !response) {
      callback(error, 'network error', null);

    // api error
    } else if (parseInt(response.headers.status, 0) !== 0) {
      callback(response.headers.code, response.headers.error_message, response.headers.warnings);

    // api success ! /me eyebrow
    } else {
      callback(response.headers.code, response.headers.error_message, response.headers.warnings);

    }
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

// albums/file
// albums/musicinfo

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

// /tracks/file

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

// /artists/locations
// /artists/musicinfo

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

// /playlists/file

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


/********************************************/


/**
* Wrapper to the /setuser/fan endpoint
*
* Use this method to let the user identified by 'userid' become a fan of the artist identified 'artistid' (/users/artists?relation='fan').
* Note that if the artist doesn't exist, no error will be raised, but the track will not appear in any read request of api and website.
*
* @see http://developer.jamendo.com/v3.0/setuser/fan
* @param {Object} parameters A query string object ( access_token, artist_id are required )
* @param {Function} callback The request callback(error, error_message, warnings)
* @return {Request} The request object
*/
Jamendo.prototype.setuser_fan = function(parameters, callback) {
  return this.write_request('/setuser/fan', parameters, callback);
};

/**
* Wrapper to the /setuser/favorite endpoint
*
* Use this method to add a given track to the user's preferites (/users/tracks?relation='preferite') (also called 'Favorites' playlist in Jamendo.com).
* Note that if the track doesn't exist, no error will be raised, but the track will not appear in any read request of api and website.
*
* @see http://developer.jamendo.com/v3.0/setuser/favorite
* @param {Object} parameters A query string object ( access_token, track_id are required )
* @param {Function} callback The request callback(error, error_message, warnings)
* @return {Request} The request object
*/
Jamendo.prototype.setuser_favorite = function(parameters, callback) {
  return this.write_request('/setuser/favorite', parameters, callback);
};

/**
* Wrapper to the /setuser/like endpoint
*
* Let this 'userid' like the given 'trackid' (/users/tracks?relation='like').
* Note that if the track doesn't exist, no error will be raised, but the track will not appear in any read request of api and website.
*
* @see http://developer.jamendo.com/v3.0/setuser/like
* @param {Object} parameters A query string object ( access_token, track_id are required )
* @param {Function} callback The request callback(error, error_message, warnings)
* @return {Request} The request object
*/
Jamendo.prototype.setuser_like = function(parameters, callback) {
  return this.write_request('/setuser/like', parameters, callback);
};

/**
* Wrapper to the /setuser/dislike endpoint
*
* As youtube and many other social web site, on Jamendo is possible to 'like' a track, but also to 'dislike' a track.
* This method allow you to such an action.
*
* @see http://developer.jamendo.com/v3.0/setuser/dislike
* @param {Object} parameters A query string object ( access_token, track_id are required )
* @param {Function} callback The request callback(error, error_message, warnings)
* @return {Request} The request object
*/
Jamendo.prototype.setuser_dislike = function(parameters, callback) {
  return this.write_request('/setuser/dislike', parameters, callback);
};


/******************************************/

/**
* Authorize request wrapper
*
* The objective of such a request is to ask the user if he agrees to grant some rights to your application.
*
* @param {Object} parameters A query string object
* @param {Function} callback The request callback(error, login_url)
* @return {Request} The request object
*/
Jamendo.prototype.authorize = function(parameters, callback) {
  parameters = parameters || {};
  parameters.client_id = this.client_id;

  var self = this;

  // send authorize request
  var r = request({
    url: this.base_url + '/oauth/authorize',
    method: 'GET',
    rejectUnauthorized: this.rejectUnauthorized,
    qs: parameters
  }, function(error, response, body){
    if (error && !response && self.retry) {
      if (self.debug) {
        console.log('network error, retry', error);
      }
      return self.authorize(parameters, callback);
    }

    // forward the login url
    callback(null, response.request.href);
  });

  return r;
};

/**
* Grant request wrapper
*
* The main objective of the OAuth2 Grant request is to exchange the authorization code you have received with the OAuth2 Authorize request to get an 'access token'.
*
* @param {Object} parameters A query string object (code is required)
* @param {Function} callback The request callback(error, login_url)
* @return {Request} The request object
*/
Jamendo.prototype.grant = function(parameters, callback) {
  parameters = parameters || {};
  parameters.client_id = this.client_id;
  parameters.client_secret = this.client_secret;
  parameters.grant_type = 'authorization_code';

  if (!parameters.client_secret) {
    return callback('You must provide a client_secret to the constructor', null);
  }

  if (!parameters.code) {
    return callback('You must provide a code in parameters', null);
  }

  var self = this;
  
  // send authorize request
  var r = request({
    url: this.base_url + '/oauth/grant',
    method: 'POST',
    rejectUnauthorized: this.rejectUnauthorized,
    form: parameters,
    json: true
  }, function(error, response, body){
    if (error && !response && self.retry) {
      if (self.debug) {
        console.log('network error, retry', error);
      }
      return self.grant(parameters, callback);
    }

    // forward oauth detail
    callback(null, body);
  });

  return r;
};

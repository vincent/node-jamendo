var request = require('request');


var Jamendo = function(settings) {
	if (!settings || !settings.client_id) {
		throw 'You must provide a client_id setting';
	}

	this.base_url = 'http://api.jamendo.com/' + (settings.version ? settings.version : 'v3.0');
	this.client_id = settings.client_id;
};


Jamendo.prototype.request = function(path, parameters, callback) {
	parameters.client_id = this.client_id;

	return request({
		url: this.base_url + path,
		method: 'GET',
		qs: parameters,
		json: true
	}, function(error, response, body){
		callback(error, body);
	});
};

Jamendo.prototype.albums = function(parameters, callback) {
	return this.request('/albums', parameters, callback);
};
Jamendo.prototype.artists = function(parameters, callback) {
	return this.request('/artists', parameters, callback);
};
Jamendo.prototype.tracks = function(parameters, callback) {
	return this.request('/tracks', parameters, callback);
};
Jamendo.prototype.album_tracks = function(parameters, callback) {
	return this.request('/album/tracks', parameters, callback);
};
Jamendo.prototype.artist_albums = function(parameters, callback) {
	return this.request('/artist/albums', parameters, callback);
};
Jamendo.prototype.artist_tracks = function(parameters, callback) {
	return this.request('/artist/tracks', parameters, callback);
};

module.exports = Jamendo;
# Jamendo API client
```jamendo``` is a simple Jamendo API wrapper.

It only makes HTTP requests with the well known [request](https://github.com/mikeal/request) module.

All *read methods* described at http://developer.jamendo.com/v3.0#readmethods-list are supported.

# Install
```bash
$ npm install jamendo
```

# Use
```javascript
var Jamendo = require('jamendo');

var jamendo = new Jamendo({ ... });

jamendo.albums({ id: 33 }, function(error, data){
    console.log(data.results[0]);
});
```
```
{ id: '33',
  name: 'Simple Exercice',
  releasedate: '2004-12-28',
  artist_id: '5',
  artist_name: 'Both',
  image: 'http://imgjam.com/albums/s0/33/covers/1.200.jpg',
  zip: 'http://storage-new.newjamendo.com/download/a33/mp32/'
}
```

# Supported methods
All read methods are supported, see http://developer.jamendo.com/v3.0#readmethods-list

All write methods are currently not supported.

# Syntax sugar
Jamendo API uses specific formats for some parameters. This wrapper library will take care of formatting for you.

Lists can be specified as arrays, so
```javascript
jamendo.albums({ id: [ 33, 888 ] }, ... 
// is the same as
jamendo.albums({ id: '33,888' }, ... // api required syntax
```

```datebetween``` parameter can be specified as arrays containing two bounds (as timestamps or Date objects), so
```javascript
jamendo.tracks({ datebetween: [ 449921044 * 1000, '2011-10-10' ] }, ... 
// is the same as
jamendo.tracks({ datebetween: [ new Date('1984-04-04'), '2011-10-10' ] }, ... 
// is the same as
jamendo.tracks({ datebetween: '1984-04-04_2011-10-10' ] }, ... // api required syntax
```

Default values will be explicited, according to current API defaults, so
```javascript
jamendo.artists({ }, ... 
// is the same as
jamendo.artists({ offset: 0, limit: 10, format: 'json' }, ... 
```

# Run tests
```bash
$ npm test
```

# Run Grunt (jslint, docs)
```bash
$ grunt
```

# Constructor settings
You can set following options in the ```settings``` parameter
```javascript
var jamendo = new Jamendo({
	client_id : 'no default',     // Specify your client_id
	                             // see http://developer.jamendo.com/v3.0#obtain_client_id
	protocol  : 'http',         // HTTP protocol to use, http or https
	version   : 'v3.0',        // Use the specified API version
	debug     : false         // Print the whole response object and body in the console
});
```

# Documentation
API documentation is built by ```grunt``` and stored in the ```public/docs``` directory

# License
BSD

# Contribute
All comments, patchs and pull requests are welcome, but please ensure you ran ```grunt``` without warnings before creating a pull request.

# Background
Maintainer @vincent (me duh!) was a Jamendo developper for about 4 years and still have relationships with Jamendo staff.


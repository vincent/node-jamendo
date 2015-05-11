# Jamendo API client
```jamendo``` is a simple Jamendo API javascript wrapper.

It only makes HTTP requests with the well known [request](https://github.com/mikeal/request) module.

All methods described at http://developer.jamendo.com/v3.0 are supported.

[![Dependencies](https://david-dm.org/vincent/node-jamendo.png)](https://david-dm.org/vincent/node-jamendo)
[![NPM version](https://badge.fury.io/js/jamendo.png)](http://badge.fury.io/js/jamendo)

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

As methods return a ```request``` object, they are streamable.
```javascript
// write the track #245 in mp3 on disk
jamendo.tracks_file({ id: 245 }).pipe(fs.createWriteStream('Both - J.E.T. Apostrophe A.I.M.E.mp3'));
```

# Supported methods and workflows
All read methods are supported, see http://developer.jamendo.com/v3.0#readmethods-list

Write methods are supported, but this library WILL NOT HANDLE OAUTH2 for you.

You have to handle oAuth2 workflows by yourself.

That said, some methods can help:
```javascript
jamendo.authorize({}, function(error, login_url){
  // redirect yourself the user to login_url ...
  // once your application is accepted, he will be redirected 
  // with an authorization_code, valid for 30 seconds
});

jamendo.grant({ code: 'mysupergreatauthcode' }, function(error, oauth_data){
  /* oauth_data == {
    access_token: 'c2839ba71a1e457e51e9c0d0f12345723e92b1865',
    refresh_token: '46f3fbc0e3fe7627503e3b12345c1e36ca92388b',
    expires_in: 7200,
    token_type: 'bearer',
    scope: 'music'
  }
  */
});
```

Once you have these oauth details, you can use write methods.
```javascript
jamendo.setuser_fan({
  access_token: 'c2839ba71a1e457e51e9c0d0f12345723e92b1865',
  artist_id: 5
}, function(error, error_message, warnings){
  // you are now a fan of the artist Both
});
```

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

Write methods will be tested if you set a valid authorization code in the ```AUTHORIZATION_CODE``` environement variable.
```bash
$ AUTHORIZATION_CODE=1234567890987654321 npm test
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
  protocol  : 'http',           // HTTP protocol to use, http or https
  version   : 'v3.0',           // Use the specified API version

  debug     : false             // Print the whole response object and body in the console

  rejectUnauthorized: false     // Ignore SSL certificates issues
                                // see TLS options http://nodejs.org/docs/v0.7.8/api/https.html
});
```

# Documentation
[API documentation](http://htmlpreview.github.io/?https://raw.github.com/vincent/node-jamendo/master/public/docs/index.html) is built by ```grunt``` and stored in the ```public/docs``` directory

# License
BSD

# Contribute
All comments, patchs and pull requests are welcome, but please ensure you ran ```grunt``` without warnings before creating a pull request.


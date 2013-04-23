# Jamendo API client
```jamendo``` is a simple Jamendo API wrapper.

It only makes HTTP requests with the well known [request](https://github.com/mikeal/request) module.

All read methods, descibed at http://developer.jamendo.com/v3.0#readmethods-list are supported.


# Install
```bash
$ npm install jamendo
```

# Use it
```javascript
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

# Run tests
```bash
$ npm test
```

# Run Grunt (jslint, docs)
```bash
$ grunt
```

# Constructor settings
You can set the following options in the ```settings``` parameter
```javascript
var jamendo = new Jamendo({
 client_id : no default    // Specify your client_id
                           // see http://developer.jamendo.com/v3.0#obtain_client_id
 protocol  : 'http'        // HTTP protocol to use, http or https
 version   : 'v3.0'        // Use the specified API version
 debug     : false         // Print the whole response object and body in the console
});
```

# Documentation
Documentation is built by ```grunt``` and stored in the ```public/docs``` directory
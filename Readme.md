# Simple Jamendo API v3 client

# Install
```bash
$ npm install jamendo
```

# Use it
```javascript
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

# Run tests
```bash
$ npm test
```
var express = require('express')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bacon = require('../lib/Bacon.js');

app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

io.on('connection', socket => {
	bacon.interval(1000, {})
		 .map(randomTweet)
		 .onValue(t => socket.emit('tweet', t));
});

function randomTweet(v){
	return {
		pos: {
			lat: getRandomArbitrary(38.46975,40.46975),
			lng: getRandomArbitrary(-0.7,1.37739),
		},
		text: 'Hola'
	};
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

http.listen(3000, () => console.log("Running on port 3000"));

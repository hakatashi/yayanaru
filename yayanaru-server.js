var SerialPort = require('serialport').SerialPort;
var socketio = require('socket.io');

var http = require('http');
var fs = require('fs');

// HTTP Server

var app = http.createServer(function (req, res) {
	fs.readFile(__dirname + '/index.html', function (error, data) {
		if (error) {
			res.writeHead(500);
			return res.end(error);
		}

		res.writeHead(200);
		return res.end(data);
	});
});

app.listen(10001);

// Serialport Communication

var serialport = new SerialPort('COM3');

serialport.on('open', function () {
	console.log('Serialport is open.');
	serialport.on('data', function (data) {
		var acc = JSON.parse(data.toString().split('\n')[0]);
		io.sockets.emit('data', JSON.stringify(acc));
	});
});

// WebSocket Configuration

var io = socketio(app);

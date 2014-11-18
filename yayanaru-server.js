var SerialPort = require('serialport').SerialPort;
var socketio = require('socket.io');
var express = require('express');
var morgan = require('morgan');

var http = require('http');
var fs = require('fs');

// HTTP Server

var app = express();

app.use(morgan('combined'));
app.use(express.static(__dirname));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: err
	});
});

var server = app.listen(10001, function () {
	console.log('Express server listening on port ' + server.address().port);
});

// Serialport Communication

var serialPath = process.argv[2];
var serialport;

serialport = new SerialPort(serialPath);

serialport.on('open', function () {
	console.log('Serialport is open.');
	serialport.on('data', function (data) {
		var acc = JSON.parse(data.toString().split('\n')[0]);
		io.sockets.emit('data', JSON.stringify(acc));
	});
});

// WebSocket Configuration

var io = socketio(server);

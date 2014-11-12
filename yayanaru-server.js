var SerialPort = require('serialport').SerialPort;
var serialport = new SerialPort('COM3');

serialport.on('open', function () {
	console.log('open');
	serialport.on('data', function (data) {
		var acc = JSON.parse(data);
		console.log(acc);
	});
});

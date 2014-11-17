var socket = io('http://localhost:10001')
socket.on('data', function (data) {
	var acc = JSON.parse(data);
	$('#circle').css({
		top: acc.x + 'px',
		left: acc.y + 'px',
		width: acc.z / 10 + 'px',
		height: acc.z / 10 + 'px',
	});
});

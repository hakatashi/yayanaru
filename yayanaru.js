var socket = io('http://localhost:10001');

socket.on('data', function (data) {
	var acc = JSON.parse(data);
});

function onResize(event) {
	var $svg = $('#svg');
	var width = Math.min($(window).width(), $(window).height() / 9 * 16);
	var height = width / 16 * 9;

	$svg.width(width);
	$svg.height(height);
	$svg.css({
		position: 'absolute',
		top: Math.max(0, (($(window).height() - height) / 2) + $(window).scrollTop()) + 'px',
		left: Math.max(0, (($(window).width() - width) / 2) + $(window).scrollLeft()) + 'px',
	});
}

$(document).ready(function () {
	onResize();
	$(window).resize(onResize);

	var svg = Snap('#svg');

	var circle = svg.circle(150, 150, 100);
})

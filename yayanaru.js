var socket = io('http://localhost:10001');

socket.on('data', function (data) {
	var acc = JSON.parse(data);
});

function onResize(event) {
	var $wrap = $('#gamewrapper');
	var width = Math.min($(window).width(), $(window).height() / 9 * 16);
	var height = width / 16 * 9;

	$wrap.width(width);
	$wrap.height(height);
	$wrap.css({
		position: 'absolute',
		top: Math.max(0, (($(window).height() - height) / 2) + $(window).scrollTop()) + 'px',
		left: Math.max(0, (($(window).width() - width) / 2) + $(window).scrollLeft()) + 'px',
	});
}

function onPlayerReady(event) {
	event.target.playVideo();
}

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		width: '1920',
		height: '1080',
		videoId: 'F9TuIVpBi5I',
		events: {
			'onReady': onPlayerReady
		}
	});
}

$(document).ready(function () {
	onResize();
	$(window).resize(onResize);

	var svg = Snap('#svg');

	var circle = svg.circle(150, 150, 100);
})

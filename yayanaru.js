var socket = io('http://localhost:10001');
var svg;
var title, choices;
var selectedSong = 0;

var RIGHT = 'l'.charCodeAt(0);
var LEFT = 'h'.charCodeAt(0);

var songs = [{
	title: '花ハ踊レヤいろはにほ (難易度: 5)',
	id: 'F9TuIVpBi5I',
}, {
	title: 'YOSAKOIソーラン (難易度: 5)',
	id: 'F9TuIVpBi5I',
}];

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
	title = svg.image('img/title.jpg', 0, 0);
	var choice = svg.text(800, 650, songs[selectedSong].title).attr({
		fill: 'white',
		'font-size': 72,
		'text-anchor': 'middle'
	});

	function onKeypress(event) {
		if (event.which === RIGHT || event.which === LEFT) {
			selectedSong = (selectedSong + songs.length + (event.which === RIGHT ? 1 : -1)) % songs.length;
			var nextSong = songs[selectedSong];
			var nextChoice = svg.text(event.which === RIGHT ? -800 : 2400, 650, nextSong.title).attr({
				fill: 'white',
				'font-size': 72,
				'text-anchor': 'middle'
			});

			$(window).unbind('keypress');

			choice.animate({
				x: event.which === RIGHT ? 2400 : -800
			}, 300, mina.easeinout);
			nextChoice.animate({
				x: 800
			}, 300, mina.easeinout, function () {
				$(window).keypress(onKeypress);
				choice.remove();
				choice = nextChoice;
			});
		}
	}

	$(window).keypress(onKeypress);
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

	$('#player').hide();

	svg = Snap('#svg');

	var pastAcc = null;
	var pastImpact = new Date(0);
	socket.on('data', function (data) {
		var acc = JSON.parse(data);
		var now = new Date();

		if (pastAcc !== null) {
			var diff = {
				x: acc.x - pastAcc.x,
				y: acc.y - pastAcc.y,
				z: acc.z - pastAcc.z
			};

			var impact = Math.sqrt(diff.x * diff.x + diff.y * diff.y + diff.z * diff.z);
			if (impact > 250 && now - pastImpact > 200) {
				jQuery.event.trigger({
					type: 'keypress',
					which: 'l'.charCodeAt(0)
				});
				pastImpact = now;
			}
		}
		pastAcc = acc;
	});
})

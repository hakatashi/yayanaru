var socket = io('http://localhost:10001');
var svg;
var title, choices;
var selectedSong = 0, song;
var intervalID, intervalFrameID;
var hitRight, hitLeft, scoreText;

var RIGHT = 'l'.charCodeAt(0);
var LEFT = 'h'.charCodeAt(0);
var ENTER = 32;
var ESCAPE = 0;
var HIT_X = 1400;
var HITRIGHT_Y = 550;
var HITLEFT_Y = 200;
var HITRADIUS = 50;

var enableEnter = true;
var waitingEnter = false;
var timeoutID;
var score = 0;
var scorePad = 0;
var scoreBook = {
	good: 0,
	great: 0,
	perfect: 0
};
var combo = 0;

var songs = [{
	title: '花ハ踊レヤいろはにほ (難易度: 5)',
	id: 'F9TuIVpBi5I',
	offset: 0,
	correction: 10,
	volume: 50,
	notes: {
		left: [24695, 25445, 26195, 26945, 27695, 28445, 29195, 29945, 30695, 31445, 32195, 32945, 33695, 34445, 35195, 35945, 36320, 36695, 37820, 39320, 40820, 42320, 42695, 43445, 44195, 44945, 45695, 46445, 47195, 47945, 48695, 49070, 49445, 49820, 50195, 50570, 52445, 53195, 53945, 54695, 55445, 56195, 56945, 57695, 58070, 58445, 59195, 59945, 60695, 61445, 62195, 62945, 63320, 63695, 64445, 65195, 65945, 66695, 67445, 68195, 68945, 69507, 69695, 70070, 70445, 70820, 71195, 71570, 71945, 72320, 72695, 73070, 73445, 73820, 74195, 74945, 75320, 75695, 76070, 77945, 78882, 79445, 80195, 80945, 81882, 82445, 83195, 83945, 84882, 85445, 86195, 86945, 87882, 88445, 89195],
		right: [7070, 7445, 7820, 8195, 8570, 8945, 9320, 9695, 10070, 10445, 10820, 11195, 11570, 11945, 12320, 12695, 13070, 13445, 13820, 14195, 14570, 14945, 15320, 15695, 16070, 16445, 16820, 17195, 17570, 17945, 18320, 18695, 19070, 19445, 19820, 20195, 20570, 20945, 21320, 21695, 22070, 22445, 22820, 23195, 23570, 23945, 24320, 24695, 25070, 25820, 26007, 26570, 27320, 27507, 28070, 28820, 29007, 29570, 30320, 30507, 30882, 31070, 31820, 32007, 32570, 33320, 33507, 34070, 34820, 35007, 35570, 35945, 36320, 36695, 37070, 37445, 37820, 38195, 38570, 38945, 39320, 39695, 40070, 40445, 40820, 41195, 41570, 41945, 42320, 42695, 43070, 43820, 44007, 44570, 45320, 45507, 45882, 46070, 46820, 47007, 47570, 48320, 48507, 48882, 49632, 50007, 50382, 51695, 52070, 52445, 52820, 53195, 53570, 53945, 54320, 54695, 55070, 55445, 55820, 56195, 56570, 56945, 57320, 57695, 58070, 58445, 58820, 59195, 59570, 59945, 60320, 60695, 61070, 61445, 61820, 62195, 62570, 62945, 63320, 63695, 64070, 64445, 64820, 65195, 65570, 65945, 66320, 66695, 67070, 67445, 67820, 68195, 68570, 68945, 69320, 69882, 71007, 71382, 72132, 72507, 72882, 74007, 74382, 74570, 74945, 75320, 75695, 76070, 77570, 78320, 78507, 79257, 79820, 80007, 80570, 81320, 81507, 82257, 82820, 83007, 83570, 84320, 84507, 85257, 85820, 86007, 86570, 87320, 87507, 88257, 88820, 89007]
	}
}, {
	title: 'YOSAKOIソーラン (難易度: 3)',
	id: 'r-rtRIppOxk',
	offset: 30,
	correction: -450,
	volume: 100,
	end: 228,
	notes: {
		left: [38499,38931,39362,39794,40657,41089,41521,42384,42816,43247,44111,44542,44974,45837,46269,46701,47564,47995,48427,49290,49722,50154,51017,51880,52744,54470,56197,57924,59650,60513,61377,61808,63103,64830,66557,68283,70442,71305,74326,75190,75621,76053,78643,79075,79506,79938,82096,82528,82960,83391,84254,85118,85981,86844,87276,88139,89003,89866,91161,92024,92888,93751,94183,95046,95909,97204,97636,99362,101089,102816,104542,105406,106269,106701,107995,109722,111449,113175,115334,116197,119218,120082,120513,120945,123535,123967,124398,124830,126988,127420,127852,128283],
		right: [38499,40226,41952,43679,45406,47132,48859,50585,51880,54039,55765,57492,59218,60082,60945,61377,61808,64398,66125,67852,69578,70010,70873,73031,75190,75621,76053,76916,77780,80370,81233,83823,84686,85549,86413,87708,88571,89434,90298,90729,91593,92456,93319,94614,95477,96341,97204,98931,100657,102384,104111,104974,105837,106269,106701,109290,111017,112744,114470,114902,115765,117492,120082,120513,120945,121808,122672,125262,126125]
	}
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
		} else if (event.which === ENTER) {
			$(window).unbind('keypress');

			enableEnter = false;

			var titleGroup = svg.group(choice, title).animate({
				opacity: 0
			}, 1000, function () {
				song = songs[selectedSong];
				correction = song.correction + song.offset * 1000;

				titleGroup.remove();
				player.loadVideoById({
					videoId: song.id,
					startSeconds: song.offset
				});
				player.playVideo();
				player.setVolume(song.volume);

				intervalID = setInterval(gameLoop, 10);
				intervalFrameID = setInterval(onFrame, 13.333);

				$(window).keypress(function (event) {
					if (event.which === RIGHT) onHit('right');
					else if (event.which === LEFT) onHit('left');
				});

				var hitAttr = {
					fill: 'none',
					stroke: 'blue',
					strokeWidth: 10
				};
				hitRight = svg.circle(HIT_X + 75, HITRIGHT_Y + 75, HITRADIUS).attr(hitAttr);
				hitLeft = svg.circle(HIT_X + 75, HITLEFT_Y + 75, HITRADIUS).attr(hitAttr);

				scoreText = svg.text(1500, 800, '0').attr({
					fill: 'black',
					'font-size': 72,
					'text-anchor': 'end'
				});

				$('#player').css({opacity: selectedSong === 0 ? 0.5 : 0});
			});
		}
	}

	$(window).keypress(onKeypress);
}

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.ENDED) {
		onResult();
	}
}

function onResult() {
	var cover = svg.rect(0, 0, 1600, 900).attr({
		fill: 'black',
		opacity: 0
	}).animate({
		opacity: 1
	}, 2000, function () {
		enableEnter = true;
		[
			['good', 'blue'],
			['great', 'green'],
			['perfect', 'yellow']
		].forEach(function (judge, index) {
			svg.text(700, 150 * (index + 1), judge[0]).attr({
				fill: judge[1],
				'font-size': 120,
				'text-anchor': 'end'
			});
			svg.text(800, 150 * (index + 1), scoreBook[judge[0]]).attr({
				fill: 'white',
				'font-size': 120,
				'text-anchor': 'start'
			});
		});
		svg.text(700, 750, 'score').attr({
			fill: 'white',
			'font-size': 180,
			'text-anchor': 'end'
		});
		svg.text(800, 750, Math.floor(score / (song.notes.right.length + song.notes.left.length) * 100000)).attr({
			fill: 'white',
			'font-size': 180,
			'text-anchor': 'start'
		});

		$(window).keypress(function (event) {
			if (event.which === ENTER) {
				setTimeout(function () {
					reset();
				}, 300);
			}
		});
	});
}

var currentTime = 0;
var estimatedZero = 0;
var estimateSamples = [];
var zeroTime = 0;
var zeroTimePad = 0;
var correction = 0;
var time = 0;
var noteImg;

var gameLoop = function () {
	var now = window.performance.now();
	var gotCurrentTime = player.getCurrentTime();
	var gotPlayerState = player.getPlayerState();

	if (gotPlayerState === YT.PlayerState.PLAYING) {
		if (currentTime !== gotCurrentTime
			&& gotCurrentTime > song.offset) { // if Current Time jumped
			currentTime = gotCurrentTime;
			estimatedZero = now - currentTime * 1000;

			estimateSamples.push(estimatedZero);
			if (estimateSamples.length > 16) {
				estimateSamples.shift();
			}
			var estimatedSum = estimateSamples.reduce(function (previous, current) {
				return previous + current;
			});

			zeroTimePad = estimatedSum / estimateSamples.length + song.correction;

			if (song.stop !== 0 && gotCurrentTime > song.stop) {
				player.stopVideo();
			}
		}
		// if player is playing, set youTyping.time according to zero time,
		// against the case when player is stopping.
		time = now - zeroTime;
		// pad zero time on every frames
		zeroTime = (zeroTime - zeroTimePad) * 0.9 + zeroTimePad;

		if (song.end && time > song.end * 1000) onResult();
	} else if (gotPlayerState === YT.PlayerState.ENDED) {
		// if video ended and game is still playing, zeroTime is fixed. nothing to do here.
	} else {
		// if player is stopping, we're waiting for starting video.
		// set zero time according to youTyping.time, against the case when player is playing.
		zeroTime = zeroTimePad = now - song.offset * 1000 + correction - time;
	}
};

var notes = {};
var clearedNotes = {};

function onFrame() {
	var time = window.performance.now() - zeroTime;

	function processNote(naruko, note, id) {
		var eta = note - time;
		var y = naruko === 'right' ? HITRIGHT_Y : HITLEFT_Y;
		if (-400 < eta && eta < 2000 && !clearedNotes[id]) {
			if (notes[id]) {
				notes[id].attr({x: HIT_X - eta, y: y});
			} else {
				notes[id] = svg.image('img/narukoNote.png', HIT_X - eta, y, 150, 150);
			}
		} else {
			if (notes[id]) {
				notes[id].remove();
				delete notes[id];
			}
		}
	}

	var cnt = 0;
	song.notes.right.forEach(function (note) {
		processNote('right', note, cnt);
		cnt++;
	});
	song.notes.left.forEach(function (note) {
		processNote('left', note, cnt);
		cnt++;
	});

	var pointScore = score / (song.notes.right.length + song.notes.left.length) * 100000;
	scorePad = (pointScore - scorePad) * 0.5 + scorePad;
	scoreText.attr({
		text: Math.floor(scorePad)
	});
}

function onHit(hitNaruko) {
	var time = window.performance.now() - zeroTime;

	function processNote(naruko, note, id) {
		var eta = note - time;
		var y = (naruko === 'right' ? HITRIGHT_Y : HITLEFT_Y);

		var judge = null;
		if (!clearedNotes[id] && hitNaruko === naruko) {
			if (-50 < eta && eta < 50) {
				judge = 'perfect';
				score += 10;
			} else if (-100 < eta && eta < 100) {
				judge = 'great';
				score += 6;
			} else if (-200 < eta && eta < 150) {
				judge = 'good';
				score += 3;
			}
		}

		if (judge) {
			var hitEffect = svg.text(HIT_X, y - 100, judge).attr({
				fill: 'red',
				'font-size': 48,
				'text-anchor': 'middle'
			}).animate({
				y: y - 300,
				opacity: 0
			}, 1000, function () {
				hitEffect.remove();
			});

			scoreBook[judge]++;
			clearedNotes[id] = true;
		}
	}

	var cnt = 0;
	song.notes.right.forEach(function (note) {
		processNote('right', note, cnt);
		cnt++;
	});
	song.notes.left.forEach(function (note) {
		processNote('left', note, cnt);
		cnt++;
	});
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
			onReady : onPlayerReady,
			onStateChange: onPlayerStateChange
		},
		playerVars: {
			rel: 0,
			controls: 0,
			showinfo: 0,
			modestbranding: 1
		},
	});
}

function reset() {
	svg.clear();
	player.stopVideo();
	notes = {};
	clearedNotes = {};
	currentTime = 0;
	estimatedZero = 0;
	estimateSamples = [];
	zeroTime = 0;
	zeroTimePad = 0;
	correction = 0;
	time = 0;
	enableEnter = true;
	waitingEnter = false;
	score = 0;
	scoreBook = {
		good: 0,
		great: 0,
		perfect: 0
	};
	combo = 0;
	$(window).unbind('keypress');
	clearInterval(intervalID);
	clearInterval(intervalFrameID);
	onPlayerReady();
}

$(document).ready(function () {
	onResize();
	$(window).resize(onResize);

	$('#player').css({opacity: 0.5});

	$(window).keypress(function (event) {
		if (event.which === ESCAPE) {
			reset();
		}
	});

	svg = Snap('#svg');

	var pastAcc = [null, null];
	var pastImpact = [new Date(0), new Date(0)];
	socket.on('data', function (data) {
		var acc = JSON.parse(data);
		var now = new Date();

		if (pastAcc[acc.id] !== null) {
			var diff = {
				x: acc.x - pastAcc[acc.id].x,
				y: acc.y - pastAcc[acc.id].y,
				z: acc.z - pastAcc[acc.id].z
			};

			var impact = Math.sqrt(diff.x * diff.x + diff.y * diff.y + diff.z * diff.z);
			if (impact > 250 && now - pastImpact[acc.id] > 200) {
				if (enableEnter) {
					if (waitingEnter && waitingEnter !== (acc.id ? RIGHT : LEFT)) {
						clearTimeout(timeoutID);
						jQuery.event.trigger({
							type: 'keypress',
							which: ENTER
						});
						waitingEnter = false;
					} else {
						timeoutID = setTimeout(function () {
							jQuery.event.trigger({
								type: 'keypress',
								which: acc.id ? RIGHT : LEFT
							});
							waitingEnter = false;
						}, 200);
						waitingEnter = acc.id ? RIGHT : LEFT;
					}
				} else {
					jQuery.event.trigger({
						type: 'keypress',
						which: acc.id ? RIGHT : LEFT
					});
				}
				pastImpact[acc.id] = now;
			}
		}
		pastAcc[acc.id] = acc;
	});
})

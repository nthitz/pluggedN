

var voteTimeout = null;
var djCheckTimeout = null;
var user = null;
var themes = [];

themes.push({name: 'none', url: null})
themes.push({name: 'Chillout Mixer Theme', url: 'nptZvUk'});
themes.push({name: 'Chillout Mixer Theme II', url: 'mL0fuwb'});
themes.push({name: 'Digital Dungeon Theme', url: 'WTylHRy'});
themes.push({name: 'TT.fm Red Theme', url: 'u36VR4n'});
themes.push({name: 'TT.fm After Party Theme', url: 'GZKgCpk'});
themes.push({name: 'Red Rocks Theme', url: 'lK4GttQ'});

themes.push({name: 'Orbital Lounge', url: 'EFXFnql'});
themes.push({name: 'Bomb Shelter', url: 'XjiQctM'});
themes.push({name: 'Christmas Classic', url: '2Q89Rn2'});
themes.push({name: 'Chillout Mixer Christmas', url: 'ILrUcVK'});
themes.push({name: 'Chillout Mixer Christmas Lite', url: 'nb4ibg4'});
themes.push({name: 'plug.dj Christmas Classic', url: 'P4GVhF4'});
themes.push({name: 'plug.dj Christmas Ice', url: 'M0CeHah'});

var settings = {
	showAudience: false,
	videoOpacity: 0,
	autowoot: true,
	inlineImages: true,
	theme:0,
	spaceMute: true,
	autoWootMinTime: 10,
	autoWootMaxTime: 30
}
var KEYS = {
	SPACE: 32
}
var gui = new dat.GUI();
gui.remember(settings);
gui.add(settings, 'showAudience').onChange(showHideAudience);
gui.add(settings, 'videoOpacity',0,1).onChange(showHideVideo);
gui.add(settings, 'autowoot').onChange(setWootBehavior);
gui.add(settings, 'inlineImages').onChange(doInlineImages);
var themeSettingsObject = {}
for(var i = 0; i < themes.length; i++) {
	var theme = themes[i];
	themeSettingsObject[theme.name] = i;
}
gui.add(settings, 'theme', themeSettingsObject).onChange(showTheme)

var advanced = gui.addFolder('advanced')
advanced.add(settings,'spaceMute')
advanced.add(settings,'autoWootMinTime',0,120)
advanced.add(settings,'autoWootMaxTime',0,120)

$('.dg').css("z-index",30).css('right','auto').css('top','65px')
$('.dg .save-row').hide()
$('.dg select').css('width', '130px')
//$('body').css('background-size', '100%')
var originalTheme = null;
var inlineImagesInterval = null;
$(once);
function once() {
	if(typeof ran !== "undefined") {
		return;
	}
	ran = true;
	user = API.getUser();
	API.on(API.DJ_ADVANCE,advance);
	$('body').append('<style type="text/css">#volume .slider { display: block !important; }</style>')
	console.log('window key handler');
	window.addEventListener('keydown', documentKeyDown)
	showHideAudience();

	showHideVideo();

	doInlineImages();

	showTheme();

	setWootBehavior()
}
function documentKeyDown(event) {
	var target = event.target.tagName.toLowerCase()
	if(target === 'input') {
		return;
	}
	if(event.which === KEYS.SPACE && settings.spaceMute) {
		$('#volume .button').click()
	}

}
function showHideAudience() {
	if(settings.showAudience) {
		$('#audience').show()
	} else {
		$('#audience').hide()	
	}
}
function showHideVideo() {
	$('#playback').css('opacity',settings.videoOpacity)

}
function advance(obj)
{
	clearTimeout(voteTimeout);
	clearTimeout(djCheckTimeout);
	if (obj == null) return; // no dj

	if(settings.autowoot) {
		var minTime = settings.autoWootMinTime * 1000;
		var maxTime = settings.autoWootMaxTime * 1000;
		if(maxTime < minTime) {
			maxTime = minTime;
		}
		var diffTime = maxTime - maxTime;
		var timer = minTime + diffTime * Math.random();
		voteTimeout = setTimeout(vote,timer);
	}
}
function setWootBehavior() {
	if(settings.autowoot) {
		voteTimeout = setTimeout(vote,10000);
	} else {
		clearTimeout(voteTimeout)
	}

}
function vote() {
	$('#room #woot').click();
}
function checkIfDJing() {
	return;
	
	var curDJs = API.getDJs();
	var djing = false;
	for(var i = 0; i < curDJs.length; i++) {
		var dj = curDJs[i];
		if(dj.id === user.id) {
			djing = true;
			break;
		}
	}
	if(djing) {
		return;
	}
	var inWaitList = API.getWaitListPosition();
	if(inWaitList != -1) {
		return;
	}
	$('.button-dj:visible').click();
}function showTheme() {
	if(originalTheme === null) {
		originalTheme = $('body').css('background-image');
	}
	var theme = themes[settings.theme];

	if(theme.name === 'none') {
		$('body').css('background-image', originalTheme);
		$('#playback .background').show();
	} else {
		$('body').css('background-image', 'url(http://i.imgur.com/'+theme.url+'.png)');
		$('#playback .background').hide()
	}
}

function doInlineImages() {
	if(settings.inlineImages) {
		console.log('set interval');
		inlineImagesInterval = setInterval(function() {
		    $(".closeImage").off("click");
		    $(".closeImage").on("click", function () {
		        var e = $(this).parent();
		        var t = $(this).next("img");
		        var n = t.attr("src");
		        $(this).remove();
		        t.remove();
		        e.append("<a href=" + n + ' class="ignore" target="_blank">' + n + "</a>")
		    });
		    return $("#chat-messages span.text a").each(function (e, t) {
		    	if (t.href.match(/.png|.gif|.jpg/) && !$(t).hasClass("ignore")) {
		            return t.outerHTML = "<img class='closeImage' style='position: absolute; right: 0px; cursor: pointer;' src='http://i.imgur.com/JvlpEy9.png' /><img style='width: 100%' src='" + t.href + "' />"
		        }
		    })
		},1e3)
	} else {
		clearInterval(inlineImagesInterval)
	}
}


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

var settings = {
	showAudience: false,
	videoOpacity: 0,
	autowoot: true,
	inlineImages: true,
	theme:0
}
var gui = new dat.GUI();
gui.remember(settings);
gui.add(settings, 'showAudience').onChange(showHideAudience);
gui.add(settings, 'videoOpacity',0,1).onChange(showHideVideo);
gui.add(settings, 'autowoot');
gui.add(settings, 'inlineImages').onChange(doInlineImages);

var themeSettingsObject = {}
for(var i = 0; i < themes.length; i++) {
	var theme = themes[i];
	themeSettingsObject[theme.name] = i;
}
gui.add(settings, 'theme', themeSettingsObject).onChange(showTheme)

$('.dg').css("z-index",30).css('right','auto').css('top','65px')
$('.dg .save-row').hide()
$('.dg select').css('width', '130px')

var originalTheme = null;
var inlineImagesInterval = null;

once();
function once() {
	if(typeof ran !== "undefined") {
		return;
	}
	ran = true;
	user = API.getUser();
	API.on(API.DJ_ADVANCE,advance);

	showHideAudience();

	showHideVideo();

	doInlineImages();

	showTheme();

	if(settings.autowoot) {
		voteTimeout = setTimeout(vote,10000);
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
	var timer = 10000 + 20000 * Math.random();
	if(settings.autowoot) {
		voteTimeout = setTimeout(vote,timer);
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
		console.log(originalTheme)
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
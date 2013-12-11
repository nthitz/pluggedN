

var voteTimeout = null;
var djCheckTimeout = null;
var user = null;
var themes = [];
var autoResponseSentTimes = {}
var largeVideoControlsFadeTimeout = null;
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
themes.push({name: 'Digital Dungeon Lite', url: 'zSMRtE6'});
themes.push({name: 'Fairy Tale Land', url: 'XZNVZmj'});


var settings = {
	audienceOpacity: 1.0,
	djOpacity: 1.0,
	videoOpacity: 0.7,
	autowoot: false,
	inlineImages: true,
	theme:0,
	spaceMute: true,
	autoWootMinTime: 10,
	autoWootMaxTime: 30,
	frontOfLineMessage:true,
	autoRespond: false,
	autoRespondMsg: "I'm away from plug.dj at the moment.",
	disableOnChat: true,
	chatReplacement: true,
	videoSize: 'normal'
}
var KEYS = {
	SPACE: 32
}
var gui = new dat.GUI();
gui.remember(settings);	
gui.add(settings, 'videoOpacity',0,1).onChange(showHideVideo);
gui.add(settings, 'autowoot').onChange(setWootBehavior);
gui.add(settings, 'inlineImages').onChange(doInlineImages);

gui.add(settings,'videoSize', ['normal','large']).onChange(updateVideoSize)
var themeSettingsObject = {}
for(var i = 0; i < themes.length; i++) {
	var theme = themes[i];
	themeSettingsObject[theme.name] = i;
}
gui.add(settings, 'theme', themeSettingsObject).onChange(showTheme)
var afk = gui.addFolder('autoRespond')
afk.add(settings, "autoRespond")
afk.add(settings, "autoRespondMsg")
afk.add(settings, "disableOnChat") //listen didn't seem to work


var advanced = gui.addFolder('advanced')
var showHide = advanced.addFolder('hide stuff')
showHide.add(settings, 'audienceOpacity',0,1).onChange(showHideAudience);
showHide.add(settings, 'djOpacity',0,1).onChange(showHideDJ)
advanced.add(settings,'spaceMute')
advanced.add(settings,'autoWootMinTime',0,120)
advanced.add(settings,'autoWootMaxTime',0,120)
advanced.add(settings,'frontOfLineMessage')
advanced.add(settings, "chatReplacement")
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
	API.on(API.CHAT, chatReceived);

	$('body').append('<style type="text/css">#volume .slider { display: block !important; }' +
		'#room.largePlayer #dj-button { z-index:10; -webkit-transition:opacity 0.8s; transition: opacity 0.8s; }' +
		'#room.largePlayer #vote { z-index:10; -webkit-transition:opacity 0.8s; transition: opacity 0.8s; }' + 
		'#room.largePlayer #playback { width: 100% !important; height: 101% !important; left:0 !important; pointer-events:none !important; }' + 
		'#room.largePlayer #playback-container { width: 100% !important; height: 100% !important; pointer-events:none !important; }' + 
		'#room.largePlayer #yt-frame { pointer-events: none !important; }' + 

		+ '</style>')
	$('#meh').on('click', mehClicked);
	console.log('window key handler');
	window.addEventListener('keyup', documentKeyDown)
	showHideAudience();

	showHideVideo();

	doInlineImages();

	showTheme();

	setWootBehavior();

	updateVideoSize()
}
function documentKeyDown(event) {
	var target = event.target.tagName.toLowerCase()
	if(target === 'input') {
		if($(event.target).attr('id') === 'chat-input-field' && settings.chatReplacement) {
			replaceText(event.target)
		}
		return;
	}
	if(event.which === KEYS.SPACE && settings.spaceMute) {
		$('#volume .button').click()
	}

}
function replaceText(ele) {
	var replacements = {
		'/whatever': '¯\\_(ツ)_/¯',
		'/tableflip': '(╯°□°）╯︵ ┻━┻',
		'/tablefix': '┬─┬ノ( º _ ºノ)'
	}
	$ele = $(ele);
	var curText = $ele.val();
	var newText = "" + curText;
	for(var replacement in replacements) {
		var replacementText = replacements[replacement];
		var reg = new RegExp(replacement,'gi');
		newText = newText.replace(reg,replacementText)
	}
	if(curText !== newText) {
		$ele.val(newText)
	}
}
function showHideAudience() {
	if(settings.audienceOpacity === 0) {
		$('#audience').hide();	
	} else {
		$('#audience').show().css('opacity',settings.audienceOpacity)
	}
}
function showHideVideo() {
	$('#playback').css('opacity',settings.videoOpacity)

}
function showHideDJ() {
	$('#dj-canvas').css('opacity',settings.djOpacity)
}

function chatReceived(data) {
	var msg = data.message;
	var username = API.getUser().username;
	if(username === data.from) {
		//from self
		if(settings.disableOnChat && settings.autoRespond) {
			settings.autoRespond = false;
			updateGUI()

		}
		return;
	}
	if(msg.indexOf(username) !== -1) {
		//mentioned
		if(settings.autoRespond) {
			var timeLimitPerUser = 1000 * 60 * 3;
			var now = new Date().getTime();
			var validTime = now - timeLimitPerUser;
			if(typeof autoResponseSentTimes[data.from] === 'undefined' || autoResponseSentTimes[data.from] < validTime) {
				var response = '@' + data.from + ' ' + settings.autoRespondMsg;
				API.sendChat(response);
				autoResponseSentTimes[data.from] = now;
			}
		}
	}
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
	if(settings.videoSize === 'large') {
		setTimeout(insertLargeCSS, 200)
	}
	if(settings.frontOfLineMessage) {
		if(API.getWaitListPosition() === 0) {
			API.chatLog("@" + API.getUser().username + " you are next in line, hope you got a good song ready!", true);
			if($('#chat-sound-button .icon').hasClass('icon-chat-sound-on')) {
				document.getElementById("chat-sound").playMentionSound()
			}
		}
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
function mehClicked() {
	clearTimeout(voteTimeout)
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
}
function showTheme() {
	if(originalTheme === null) {
		originalTheme = $('body').css('background-image');
	}
	var theme = themes[settings.theme];
	if(settings.videoSize === 'normal') {
		if(theme.name === 'none') {
			$('body').css('background-image', originalTheme);
			$('#playback .background').show();
		} else {
			$('body').css('background-image', 'url(http://i.imgur.com/'+theme.url+'.png)');
			$('#playback .background').hide()
		}
	} else {
		$('body').css('background-image','none');
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
		    function imageLoaded() {
				var objDiv = document.getElementById("chat-messages");
				objDiv.scrollTop = objDiv.scrollHeight;
		    }
		    return $("#chat-messages span.text a").each(function (e, t) {
		    	if (t.href.match(/.png|.gif|.jpg/) && !$(t).hasClass("ignore")) {
		    		var img = new Image()
		    		img.onload = imageLoaded;
		    		img.src = t.href
		            return t.outerHTML = "<img class='closeImage' style='position: absolute; right: 0px; cursor: pointer;' src='http://i.imgur.com/JvlpEy9.png' /><img style='width: 100%' src='" + t.href + "' />"
		        }
		    })
		},1e3)
	} else {
		clearInterval(inlineImagesInterval)
	}
}

function updateGUI() {
	updateControllers(gui)
	updateFolders(gui);
}
function updateFolders(f) {
	if(typeof f === 'undefined') {
		return;
	}
	for(var folderName in f.__folders) {
		var folder = f.__folders[folderName];
		updateControllers(folder);
		updateFolders(folder);
	}
}
function updateVideoSize() {
	if(settings.videoSize === 'normal') {
		applyNormalVideo()
	} else if(settings.videoSize === 'large') {
		applyLargeVideo()

	}
}
function applyNormalVideo() {
	//$('#playback').css('width', '').css('height', '')
	showHideDJ()
	showHideAudience()
	showTheme()
	$('#room').removeClass('largePlayer')
	$('#room').off('mousemove.largeVideoFade', fadeInLargeVideoControls)
	clearTimeout(largeVideoControlsFadeTimeout);
	$('#dj-button, #vote').css('opacity',1)
	
	$(window).resize();
}
function applyLargeVideo() {
	clearTimeout(largeVideoControlsFadeTimeout)
	var playback = $('#playback')

	$('#dj-canvas, #audience').show().css('opacity',0)
	$('#room').addClass('largePlayer')
	showTheme(); //#hide bg image
	insertLargeCSS()
	largeVideoControlsFadeTimeout = setTimeout(function() {
		$('#dj-button, #vote').css('opacity',0)
	},1000)
	$('#room').on('mousemove.largeVideoFade', fadeInLargeVideoControls)

}
 
function fadeInLargeVideoControls() {
	clearTimeout(largeVideoControlsFadeTimeout)
	$('#dj-button, #vote').css('opacity',1)
	largeVideoControlsFadeTimeout = setTimeout(function() {
		$('#dj-button, #vote').css('opacity',0)
	},2000)

}

function insertLargeCSS() {
	var src = $('#yt-frame').attr('src')
	if(src.indexOf('http') === 0) {
		return;
	}
	var cssLink = document.createElement("style") 
	cssLink.textContent = "canvas { width: 100% !important; height: 100% !important; left: 0 !important; top: 0 !important; margin:0 !important; }"
	cssLink.type = "text/css"; 
	frames['yt-frame'].document.body.appendChild(cssLink);	
}
function updateControllers(o) {
	for (var i in o.__controllers) {
		o.__controllers[i].updateDisplay();
	}
}
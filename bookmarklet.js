

var voteTimeout = null;
var djCheckTimeout = null;
var user = null;
var settings = {
	showAudience: false,
	videoOpacity: 0,
	autowoot: true,
	inlineImages: true

}
var gui = new dat.GUI();
gui.remember(settings);
gui.add(settings, 'showAudience').onChange(showHideAudience);
gui.add(settings, 'videoOpacity',0,1).onChange(showHideVideo);
gui.add(settings, 'autowoot');
gui.add(settings, 'inlineImages').onChange(doInlineImages);

$('.dg').css("z-index",30).css('right','auto').css('top','65px')
$('.dg .save-row').hide()
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
}
var inlineImagesInterval = null;
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
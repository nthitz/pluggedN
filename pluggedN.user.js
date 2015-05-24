// ==UserScript==
// @name        pluggedN
// @namespace   pluggedN.nthitz.github.com
// @description Enhance your Plug.dj Experience
// @include     https://plug.dj/*
// @version     1
// @grant       none
// ==/UserScript==

function bookmarklet () {
    var devMode = false;
    var tries = 10;
    function waitForAPI() {
        if(typeof API === 'undefined') {
            tries --;
            if(tries > 0) {
                setTimeout(waitForAPI,1000)
            }
        } else {
            init();
        }
    }
    var scripts = [];
    function init() {
        console.log('init');
        var server = null;
        if(devMode) {
            server = 'http://localhost:8000/';
        } else {
            server = 'https://nthitz.github.io/pluggedN/';
        }
        scripts = [
            server + 'dat.gui.js',
            server + 'theme.js',
            server + 'bookmarklet.js'
        ]
        loadScripts()
        /*
        $.getScript(server + 'dat.gui.js',function() {
            $.getScript(server + 'theme.js', function() {
                $.getScript(server + 'bookmarklet.js');
            });
        })
        */
    }
    function loadScripts() {
        if(scripts.length > 0) {
            var script = scripts.shift()
            $.getScript(script, loadScripts)
        }
    }
    waitForAPI()
}

bookmarklet();

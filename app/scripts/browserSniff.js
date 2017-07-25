// Taken from https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
// Note to would-be view-source folks - browser sniffing like this is not a good idea. Use feature detection if you are taking it more serious than I

// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]" 
var isSafari = /constructor/i.test(window.HTMLElement) || (function(p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/ false || !!document.documentMode;

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

// Blink 
var isBlink = (isChrome || isOpera) && !!window.CSS;

let theBrowser =
    isOpera ? 'Opera' :
    isFirefox ? 'Firefox' :
    isSafari ? 'Safari' :
    isChrome ? 'Chrome' :
    isIE ? 'IE' :
    isEdge ? 'Edge' :
    "Unknown Browser";
module.exports = theBrowser;
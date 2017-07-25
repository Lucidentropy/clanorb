"use strict";
import './index.scss';
import './scripts/prototypes.js';
let browser = require('./scripts/browserSniff');

$(function() {
    console.log("Document Ready", '$', $.fn.jquery, browser);

    // convert svg images into inline svg so they're easier to manipulate in css
    require('./scripts/inlineSVG')();

    $('#container .go').click(() => {
        $('#container .message').text('Switching to highlight reel').fadeIn();
        setTimeout(() => {
            $('#container .message, #container .header').fadeOut(1000, function() {
                $('#vid-container').css('opacity', 1);
                $('#container').fadeOut();
            });
        }, 800);
    });

    // background video player
    let bgVideo = require('./scripts/bgVideo');
    bgVideo.init();

    // It's easter somewhere
    require('./scripts/easterEggs');
});
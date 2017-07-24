"use strict";
import './index.scss';

$(function() {
    console.log("Document Ready", '$',$.fn.jquery);
    // It's easter somewhere
    require('./scripts/easterEggs');


    $('.go').click(() => {
        $('.message').text('Switching to highlight reel').fadeIn();
        setTimeout(() => {
            $('.message, .header').fadeOut(1000, function() {
                $('#vid-container').css('opacity', 1);
                $('#container').fadeOut();
            });
        }, 800);
    });

    // background video player
    let bgVideo = require('./scripts/bgVideo');
    bgVideo.init();

});

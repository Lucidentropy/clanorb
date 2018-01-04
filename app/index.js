"use strict";
import './index.scss';
import './scripts/prototypes.js';
let browser = require('./scripts/browserSniff');

$(function() {
    console.log("Document Ready", '$', $.fn.jquery, browser);
    // convert svg images into inline svg so they're easier to manipulate in css
    require('./scripts/inlineSVG')();

    // It's easter somewhere
    require('./scripts/easterEggs');

    
    $('nav .leader a').click(e => {
        e.stopPropagation();
        e.preventDefault();
        return false;
    })
});
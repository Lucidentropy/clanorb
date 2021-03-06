"use strict";
import './layout.scss';
const browser = require('./scripts/includes/browserSniff');
require('particles.js');
 
$(function () {
    console.log("Ready", '$', $.fn.jquery, browser);
    // convert svg images into inline svg so they're easier to manipulate in css
    require('./scripts/includes/inlineSVG')();
 
    // It's easter somewhere
    require('./scripts/includes/easterEggs');
    let page = (window.location.pathname || "/").split("/")[1];
    switch (page) {
        case "about" :
            require('./scripts/about.js');
        break;
        case "" : 
            require('./scripts/index.js');
        break;
    }

    particlesJS("particles-js", {
        "particles": {
            "number": {
                "value": 400,
                "density": {
                    "enable": true,
                    "value_area": 3000
                }
            },
            "color": {
                "value": "#fff"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#fff"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#0cf",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": .25,
                "direction": "up",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });

    $('nav .leader a').click(e => {
        e.stopPropagation();
        e.preventDefault();
        return false;
    })

    $.get('/api/discord?cache=' + Date.now(), data => {
        $('nav li.discord ul li').not('.leader').remove();

        data.members.forEach(member => {
            let li = $("<li />");
            li.attr('class', 'duser');
            // li.append('<span class="status ' + member.status + '"/>');
            li.append('<img src="' + member.avatar_url + '" class="avatar ' + member.status + '" />')

            let username = member.nick ? member.nick : member.username;

            li.append('<span class="username"> ' + username + '</span>');
            if ( member.game ) {
                li.append('<span class="game">' + member.game.name + '</span>');
            }
            $('nav li.discord ul').append(li);
        });

        $('nav li.discord > a, nav li.discord li.leader > a').html('Discord<br>' + data.members.length + ' online');
    })
});
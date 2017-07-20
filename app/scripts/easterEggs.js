    // Konami Code
    let kkeys = [],
        konami = "38,38,40,40,37,39,37,39,66,65";
    $(document).keydown((e) => {
        kkeys.push(e.keyCode);
        if (kkeys.toString().indexOf(konami) >= 0) {
            kkeys = [];
            let audio = new Audio('./audio/OOT_Secret.wav');
            audio.play();

            $('body').fadeOut(2000, () => {
                window.location = 'http://www.clanorb.com/mood.html';
            });
        }
    });

    // For curious visitors
    console.groupCollapsed(
        `%c Clanorb.com website information. Click to expand in Chrome.`,
        'color:#6CF; background:#000 url(http://www.clanorb.com/images/icon_b0x0rz.gif) no-repeat 5px 50%;padding:5px 5px 5px 20px;line-height:20px;');
    console.log('The orb website is written in javascript using Node and Express. HTML written in pug. Css written in scss. Javascript dependencies, html, and scss compiled by webpack. ES2015 transpiling done by babel-core.');
    console.log('Learning front-end web development? Get started with this guide : http://jstherightway.org/');
    console.log('If you still have questions about web development for gaming websites, feel free to contact me : lucid@clanorb.com ');
    console.log('▲,▲,▼,▼,◄,►,◄,►,(B),(A)');
    console.log('https://github.com/Lucidentropy/clanorb');
    console.groupEnd();
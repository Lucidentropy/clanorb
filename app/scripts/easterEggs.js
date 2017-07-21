    /*
                                                     ,  ,
                                                   / \/ \
                                                  (/ //_ \_
         .-._                                      \||  .  \
          \  '-._                            _,:__.-"/---\_ \
     ______/___  '.    .--------------------'~-'--.)__( , )\ \
    `'--.___  _\  /    |             Here        ,'    \)|\ `\|
         /_.-' _\ \ _:,_          Be Dragons           " ||   (
       .'__ _.' \'-/,`-~`                                |/
           '. ___.> /=,|                                 |
            / .-'/_ )  '---------------------------------'
            )'  ( /(/
                 \\ "
                  '=='
        */


    // Easter Egg effects
    const effects = {
        konami() {
            let audio = new Audio('./audio/OOT_Secret.wav');
            audio.play();

            $('body').fadeOut(2000, () => {
                window.location = 'http://www.clanorb.com/mood.html';
            });
        },
        doom1() {
            console.info('DOOM GOD MODE ENABLED')
        },
        doom2() {
            console.info('DOOM ALL WEAPONS ENABLED')
        },
        zelda() {
            console.info('PRINCESS LINK');
        },
        tribes1() {
            console.info('Shazbot');
        }
    }

    // keycode listener
    let globalKeys = [];
    const codeListener = (cb, keys) => {
        if (globalKeys.toString().indexOf(keys) >= 0) {
            cb();
            globalKeys = [];
        }
    }
    const stringToKeyCode = (string) => {
        let set = [];
        string.toUpperCase().split('').forEach((c) => { 
            set.push(c.charCodeAt(0)) 
        });
        return set.toString();
    }

    document.addEventListener('keydown', (e) => {
        globalKeys.push(e.keyCode);
        globalKeys = globalKeys.slice(-10);

        codeListener(effects.konami, "38,38,40,40,37,39,37,39,66,65");
        codeListener(effects.doom1, stringToKeyCode('IDDQD'));
        codeListener(effects.doom2, stringToKeyCode('IDKFA'));
        codeListener(effects.zelda, stringToKeyCode('zelda'));
        codeListener(effects.tribes1, stringToKeyCode('vga'));
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

    // How did they build stack overflow before there was stack oveflow?
    const oneTrueJavascriptExceptionHandler = (cb) => {
        try {
            cb();
        } catch (e) {
            window.location.href = "http://stackoverflow.com/search?q=[js] + " + e.message;
        }
    }
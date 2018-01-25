let express = require('express');
let router = express.Router();
let request = require('superagent');

require('./router-api')(router);

// home page
router.get('/', function (req, res, next) {
    res.render('index', {
        environment: express().get('env'),
    });
});

router.get('/about/:section?', function (req, res, next) {
    let section = req.params.section;
    res.render('about-' + section);
});

router.get('/game/:section?', function (req, res, next) {
    let section = req.params.section;
    let data = {};
    switch (section) {
        case "wow":
            request.get('localhost:8080/api/wow/guild/stormreaver/orb', (error, response, body) => {
                if (!error) {
                    let guild = response.body;
                    let members = response.body.members;
                    res.render('game-wow', {
                        guild,
                        members
                    });
                }
            });
            break;
        case 'tribes' :
            request.get('localhost:8080/api/tribes/master', (error, response, body) => {
                if (!error) {
                    let masterList = response.body;
                    res.render('game-tribes', {
                        masterList : masterList.servers
                    });
                }
            });
            break;
        default:
            res.render('game-' + section, data);
    }
});

module.exports = router;
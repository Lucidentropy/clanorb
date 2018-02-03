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

router.get('/steam/:section?', function (req, res, next) {
    let section = req.params.section;
    request.get('localhost:8080/api/steam/orb', (error, response, body) => {

        res.render('steam-' + section, {
            steamData : response.body
        });
    });
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
        case 'diablo' :
            let d3Userids = ['lucid-1878','bloodyhead-1202','templetonjax-1957'];
            request.get('localhost:8080/api/d3/profile', (error, response, body) => {
                if (!error) {
                    let masterList = response.body;
                    res.render('game-diablo', {
                        masterList : masterList.servers
                    });
                }
            });
            break;      
        case 'overwatch' :
            let owUserids = ['lucid-1878','treshnell-1307','murrdyn-1466','Monky-1309','baconsquid-1932','templetonjax-1957','udienow-1939'];
            request.get('localhost:8080/api/overwatch/orb', (error, response, body) => {
                if (!error) {
                    let masterList = response.body;
                    res.render('game-overwatch', {
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
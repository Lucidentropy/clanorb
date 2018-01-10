let express = require('express');
let router = express.Router();
// let fs = require('fs');
let request = require('superagent');
const parseString = require('xml2js').parseString;
const cheerio = require('cheerio');
const keys = require('./apik');

// home page
router.get('/', function (req, res, next) {
    res.render('index', {});
});

router.get('/about/:section?', function (req, res, next) {
    let section = req.params.section;
    res.render('about', {
        section
    });
});

router.get('/api/steam/:section?', function (req, res, next) {
    let section = req.params.section;

    const steamK = keys.steam;
    const group = 'orb';

    let apiUrl = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + steamK + '&steamids={STEAMIDS}';

    let recentlyPlayedGamesUrl = 'http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=' + steamK + '&steamid={STEAMID}&format=json';
    let ownedGamesUrl = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + steamK + '&steamid={STEAMID}&format=json';
    let groupMemberListUrl = 'http://steamcommunity.com/groups/' + group + '/memberslistxml/';
    let playerSummaryUrl = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + steamK + '&steamids={STEAMIDS}';

    request.get(groupMemberListUrl)
        .end((err, response) => {
            // Do something

            parseString(response.text, (err, result) => {
                //console.log('result', result.memberList.members[0].steamID64.length)
                res.json(result);
            });

        });
});

router.get('/api/overwatch/:tag?', function (req, res, next) {

    const tag = req.params.tag.replace('#', '-');
    if (!tag) {
        res.json({
            error: 'No tag provided'
        });
    } else {
        request.get('https://playoverwatch.com/en-us/career/pc/' + tag).end((err, response) => {
            const $ = cheerio.load(response.text);
            const user = $('.header-masthead').text();
            const level = $('.player-level div').first().text();
            const portrait = $('.player-portrait').attr('src');

            res.json({
                user,
                level,
                portrait
            });
        });
    }
});
router.get('/api/discord', function (req, res, next) {
    let url = 'https://discordapp.com/api/guilds/259097331046023168/widget.json';
    request.get(url).end((err, response) => {
        res.json(JSON.parse(response.text));
    });
});




// router.get('/pano', function(req, res, next) {
//     res.render('panorama', {});
// });

module.exports = router;
const keys = require('./apik');
let request = require('superagent');
const parseString = require('xml2js').parseString;
const cheerio = require('cheerio');
let exec = require('child_process').exec;

module.exports = function (router) {
    // Steam
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

    // rockstar social club

    router.get('/api/gta/:something?', function (req, res, next) {

    })

    // tribes server status
    router.get('/api/tribes/:serverip', function (req, res, next) {
        let host =  req.params.serverip.replace(/[^0-9\.\: -]/g, '');

        execute("quakestat -tbs " + host + " -P -R -raw ,", function (output) {
            if ( output == "" ) {
                res.json({ error : 'Output was empty' });
                return;
            }
            let data = output.split("\n");

            let game;
            let gamedata = data[1];
            gamedata = gamedata = ",";
            let gameStatus = gamedata.match(/(\w*)\=(.*?)\,/g);
            console.log('game status', gameStatus);
            if ( gameStatus ) {

                gameStatus.forEach(row => {
                    let [attr, val] = row.split('=');
                    game[attr] = val;
                });
            }
            
            let status = data[0].split(',');

            res.json({
                server : {
                    game : status[0],
                    address : status[1],
                    name : status[2],
                    map : status[3],
                    maxPlayers : status[4],
                    currentPlayers : status[5],
                    ping : status[6]
                },
                game : gameStatus,
                teams : {

                },
                players :{

                },
                raw : data
            });
        });
    })

    // Overwatch
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

    // Discord
    router.get('/api/discord', function (req, res, next) {
        let url = 'https://discordapp.com/api/guilds/259097331046023168/widget.json';
        fetch(url, res);
    });

    // World of Warcraft API
    router.get('/api/wow/?*', function (req, res, next) {
        if (req.params[0] === '') {
            res.send(getRouteList());
            return false;
        }
        let [api, param2, param3, param4] = req.params[0].split('/');
        let fields;
        let url = 'https://us.api.battle.net/wow/' + api + '/';

        if (param2) {
            url += param2;
            if (param3) url += '/';
        }
        if (param3) {
            url += param3;
        }

        url += '?';

        if (api === "character") {
            fields = 'guild,items,progression,stats,talents';
        }
        if (api === "guild") {
            fields = 'members,news';
        }
        if (fields) {
            if (param4) fields = param4;
            url += 'fields=' + fields + '&';
        }
        url += `locale=en_US&apikey=${keys.blizzard}`;
        fetch(url, res);
    });

    // diablo 3
    router.get('/api/d3/profile/:battletag/:heroid?', function (req, res, next) {
        let hero = req.params.heroid ? '/hero/' + req.params.heroid : '';
        let url = `https://us.api.battle.net/d3/profile/${req.params.battletag}/${hero}?locale=en_US&apikey=${keys.blizzard}`;
        fetch(url, res);
    });

    function fetch(url, res) {

        request.get(url).end((err, response) => {
            if (response && response.text) {


                let parsed = JSON.parse(response.text);
                if (parsed.status === 'nok') {
                    res.json({
                        error: {
                            status: 'nok',
                            url: url.split('?')[0],
                            reason: parsed.reason
                        }
                    })
                } else {
                    res.json(parsed);
                }
            } else {
                res.json({
                    error: {
                        reason: 'Response.text was empty',
                        url: url.split('?')[0],
                        response
                    }
                })
            }
        });
    }

    function getRouteList() {
        let validEndpoints = {
            '/wow/achievement/:id': '/wow/achievement/2144',
            '/wow/auction/data/:realm': '/wow/auction/data/stormreaver',
            '/wow/boss/': '/wow/boss/',
            '/wow/boss/:bossid': '/wow/boss/24723',
            '/wow/challenge/:realm': '/wow/challenge/stormreaver',
            '/wow/challenge/region': '/wow/challenge/region',
            '/wow/character/:realm/:charactername': '/wow/character/stormreaver/lucid',
            '/wow/data/battlegroups/': '/wow/data/battlegroups/',
            '/wow/data/character/achievements': '/wow/data/character/achievements',
            '/wow/data/character/classes': '/wow/data/character/classes',
            '/wow/data/character/races': '/wow/data/character/races',
            '/wow/data/guild/achievements': '/wow/data/guild/achievements',
            '/wow/data/guild/perks': '/wow/data/guild/perks',
            '/wow/data/guild/rewards': '/wow/data/guild/rewards',
            '/wow/data/item/classes': '/wow/data/item/classes',
            '/wow/data/pet/types': '/wow/data/pet/types',
            '/wow/data/talents': '/wow/data/talents',
            '/wow/guild/:realm/:guildname': '/wow/guild/stormreaver/orb',
            '/wow/item/:itemid': '/wow/item/18803',
            '/wow/item/set/:setid': '/wow/item/set/1060',
            '/wow/leaderboard/:bracket': '/wow/leaderboard/2v2',
            '/wow/mount/': '/wow/mount/',
            '/wow/pet/': '/wow/pet/',
            '/wow/pet/ability/:abilityid': '/wow/pet/ability/640',
            '/wow/pet/species/:speciesid': '/wow/pet/species/258',
            '/wow/quest/:questid': '/wow/quest/13146',
            '/wow/realm/status': '/wow/realm/status',
            '/wow/recipe/:recipeid': '/wow/recipe/123899',
            '/wow/spell/:spellid': '/wow/spell/169824',
            '/wow/zone/': '/wow/zone/',
            '/wow/zone/:zoneid': '/wow/zone/6912'
        };

        let html = '<htm><body><h2>World of Warcraft API Endpoints</h2><ul style="font-family:Courier">';
        Object.keys(validEndpoints).forEach(key => {
            html += '<li><a href="/api' + validEndpoints[key] + '" target="_blank" style="text-decoration:none;">' + key + '</a></li>';
        });
        html += '</ul></body></html>';

        return html;
    }

    function execute(command, callback) {
        exec(command, function (error, stdout, stderr) {
            callback(stdout);
        });
    };
}
let exec = require('child_process').exec;
var dgram = require('dgram');

let tribes = {
    fetchHost(host) {
        return new Promise(resolve => {
            this.qstatex("quakestat -tbs " + host + " -P -R -raw ,,,", function (output) {

                if (output == "") {
                    output = [
                        'TBS,,,208.100.45.12:28001,,,Annihilation Community <!> LM {O,,,Turbulence CTF,,,32,,,14,,,53,,,0',
                        'gamename=Tribes,,,version=1.0,,,dedicated=1,,,needpass=0,,,cpu=0,,,mods=Annihilation,,,game=Open Cal,,,numteams=3',
                        'Coke,,,0,,,0,,,0,,,0',
                        'Pepsi,,,0,,,0,,,1,,,0',
                        'Subversion,,,0,,,0,,,2,,,0',
                        'Marcus,,,0,,,60,,,0,,,0',
                        'modborg,,,0,,,96,,,1,,,0',
                        '<!> z00m^,,,-1,,,248,,,0,,,0',
                        '<!> JUDAH,,,0,,,28,,,1,,,0',
                        'Ben,,,0,,,28,,,1,,,0',
                        'Chaka_Cent,,,0,,,28,,,1,,,0',
                        'derass,,,6,,,60,,,0,,,0',
                        'LM|| Warcon+,,,0,,,28,,,255,,,0',
                        'cmonBruh,,,0,,,60,,,255,,,0',
                        'LM||TribesPlayer,,,0,,,104,,,1,,,0',
                        'IRON MAN,,,2,,,44,,,0,,,0',
                        'ReV|St0ned,,,0,,,56,,,255,,,0',
                        'Blink,,,0,,,32,,,255,,,0',
                        '<!>Azul,,,9,,,32,,,0,,,0',

                    ].join("\n");

                }
                let data = output.split("\n");
                data = data.filter(data => data);

                let game = {};
                let gameStatus = data[1].split(',,,');
                if (gameStatus) {
                    gameStatus.forEach(row => {
                        let [attr, val] = row.split('=');
                        if (attr === "dedicated" || attr === "needpass") {
                            val = val === "1";
                        }
                        if (attr === "numteams") {
                            val = parseInt(val);
                        }
                        if (attr === "cpu" && val === "0") {
                            val = "N/A"
                        }
                        game[attr] = val;
                    });
                }

                let players = [];
                let playerStatus = data.slice(game.numteams + 2);
                if (playerStatus) {
                    playerStatus.forEach(row => {
                        let [name, score, ping, team, packetLoss] = row.split(',,,');

                        if (name)
                            players.push({
                                name,
                                score: parseInt(score),
                                team: parseInt(team),
                                ping: parseInt(ping),
                                packetLoss: parseInt(packetLoss)
                            });
                    });
                }

                let teams = [];
                let teamStatus = data.slice(2, game.numteams + 2);
                if (teamStatus) {
                    teams.push({
                        id: 255,
                        name: 'Observer',
                        score: 0,
                        playercount: 0
                    })

                    teamStatus.forEach(row => {
                        let [name, score, playercount, id] = row.split(',,,');
                        let teamsPlayers = players.filter(player => player.team === parseInt(id));

                        teams.push({
                            id: parseInt(id),
                            name,
                            score: parseInt(score),
                            playercount: parseInt(teamsPlayers.length)
                        });

                    });
                }
                let status = data[0].split(',,,');

                tribes.getUDPData(host, status[3]).then(updData => {
                    let json = {
                        server: {
                            game: status[0],
                            description: updData.serverInfo,
                            address: status[1],
                            name: status[2],
                            map: status[3],
                            maxPlayers: parseInt(status[4]),
                            currentPlayers: parseInt(status[5]),
                            ping: parseInt(status[6]),
                            packetLoss: parseInt(status[7])
                        },
                        game,
                        teams,
                        players,
                        raw: output,
                        udp: updData
                    };
                    resolve(json);
                });
            });
        });
    },
    fetchMaster(res) {
        return new Promise(resolve => {
            let servers = [];
            this.qstatex('quakestat -tbm t1m1.pu.net:28000 -R -raw ,', function (output) {
                if (output === "") {
                    output = require('./mock-t1master.raw');
                }
                let data = output.split("\n");

                for (let i = 0; i < data.length; i++) {
                    let row = data[i];
                    if (row.trim() === "") continue;
                    if (row.startsWith('TBS')) {

                        let game = {};
                        let gameStatus = data[i + 1].split(',');
                        if (gameStatus) {
                            gameStatus.forEach(row => {
                                let [attr, val] = row.split('=');
                                if (attr === "dedicated" || attr === "needpass") {
                                    val = val === "1";
                                }
                                if (attr === "numteams") {
                                    val = parseInt(val);
                                }
                                if (attr === "cpu" && val === "0") {
                                    val = "N/A"
                                }
                                game[attr] = val;
                            });
                        }

                        let server = row.split(',');
                        servers.push({
                            game: server[0],
                            address: server[1],
                            name: server[2],
                            map: server[3],
                            maxPlayers: parseInt(server[4]),
                            currentPlayers: parseInt(server[5]),
                            ping: parseInt(server[6]),
                            packetLoss: parseInt(server[7]),
                            server: game
                        });
                    }
                }
                resolve({
                    servers,
                    raw: output
                });
            });
        });
    },
    qstatex(command, callback) {
        exec(command, function (error, stdout, stderr) {
            callback(stdout);
        });
    },
    getUDPData(uri, preTokenSplit) {
        return new Promise(resolve => {
            let [host, port] = uri.split(':');
            var client = dgram.createSocket('udp4');

            client.on('listening', function () {
                var address = client.address();
                // console.log('UDP Server listening on ' + address.address + ":" + address.port);
            });

            client.on('message', function (message, remote) {
                let buffer = Buffer.from(message);
                let serverInfo = buffer.toString().split('')[0]

                if (preTokenSplit) {
                    serverInfo = serverInfo.split(preTokenSplit)[1];
                }

                client.close();
                resolve({
                    string: buffer.toString(),
                    serverInfo: serverInfo
                });
            });

            client.send("\x62\x01\x02", 0, 3, port, host, function (err, bytes) {
                console.log('UDP message sent to ' + host + ':' + port);
                if (err) throw err;
            });
        });
    }
}

module.exports = tribes;
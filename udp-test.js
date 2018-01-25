let PORT = '28001';
let HOST = '208.100.45.12';
var dgram = require('dgram');

var client = dgram.createSocket('udp4');

client.on('listening', function () {
    var address = client.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

client.on('message', function (message, remote) {
    console.log(message.toString());
    client.close();
});

client.send("\x62\x01\x02", 0, 3, PORT, HOST, function(err, bytes) {
    if (err) throw err;
    console.log('UDP message sent to ' + HOST +':'+ PORT);
});
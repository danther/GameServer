/**
 * Created by Danther on 30/04/2015.
 */

var http = require('http');
var WebSocketServer = require('websocket').server;

function createWS(server) {
    wsServer = new WebSocketServer({
        httpServer: server
    });

    wsServer.on('request', function (r) {
        var connection = r.accept('lobby-call', r.origin);
        console.log((new Date()) + ' Connection accepted');

        connection.on('message', function (message) {
            var msgString = 'Connection received';
            connection.sendUTF(msgString);

            /* Cuando el lobby especifique como van a ser sus llamadas, entonces se cambiara el contenido
            de este metodo para atenderlo y recuperar los datos que nos pase */
        });

        connection.on('close', function (reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });

    });
}

module.exports = createWS;
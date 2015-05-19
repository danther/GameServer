/**
 * Created by Danther on 30/04/2015.
 */

var http = require('http');
var WebSocketServer = require('websocket').server;
var clientMain = require('./client.js');

var matchList = [];

function createWS(server) {

    var wsServer = new WebSocketServer({
        httpServer: server
        //TODO: Cuando añadamos verificacion
            //autoAcceptConnections: false
    });

    wsServer.on('request', function (r) {
        switch (r.requestedProtocols.toString()) {
            case "playgame": playGameProtocol(r); break;
            default: r.reject(); console.log((new Date()) + ' Connection Rejected. Format unrecognized');
        }
    });
}


/*
 * This function is what accepts and manages the client connection until it log in
 * Under our playgame websocket protocol
 */
function playGameProtocol(r){
    try {
        var connection = r.accept('playgame', r.origin);

        console.log((new Date()) + ' Client ' + connection.remoteAddress + ' Connection accepted');

        //All listeners are overridden by the client class when its created or rewired
        connection.on('message', function (message) {
            var parsedMessage = JSON.parse(message.utf8Data);

            if (parsedMessage.command == "login") {
                var clientMatch = matchList[parsedMessage.arg1];
                var idClient = parsedMessage.arg2;
                var tokenClient = parsedMessage.arg3;

                if (clientMatch != undefined && idClient != undefined && tokenClient != undefined) {

                    if (clientMatch.getClient(idClient) == undefined){
                        var client = new clientMain(connection, idClient, clientMatch, tokenClient);

                        clientMatch.addClient(connection, client, idClient, tokenClient);

                    }else{
                        if (clientMatch.getClient(idClient).getTokenClient() == tokenClient) {
                            clientMatch.getClient(idClient).rewireClient(connection);
                            var msg_toBroadcast = JSON.stringify({response: idClient + ' has reconnected'});

                            clientMatch.broadcastMSG(msg_toBroadcast);

                        } else {
                            var msg_toSend = JSON.stringify({
                                response: 'Error: wrong token in reconnection attempt' });

                            connection.sendUTF(msg_toSend);
                        }
                    }
                } else {
                    var msg_toSend = JSON.stringify({
                        response: 'Error: Missing or wrong arguments. Bad URL?' });

                    connection.sendUTF(msg_toSend);
                }
            } else {
                var msg_toSend = JSON.stringify({ response: 'Error: Command unrecognized' });

                connection.sendUTF(msg_toSend);
            }
        });

        connection.on('close', function (reasonCode, description) {
            console.log((new Date()) + ' Client ' + connection.remoteAddress + ' disconnected.');
        });

    } catch (except) {
        console.log((new Date()) + ' Connection aborted. ' + except.toString());
        connection.close();
    }
}

module.exports = {
    createWS: createWS,
    matchList: matchList
};
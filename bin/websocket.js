/**
 * Created by Danther on 30/04/2015.
 */

//var http = require('http');
var WebSocketServer = require('websocket').server;

var matchMain = require('./match.js');
var clientMain = require('./client.js');

var matchesList = [];

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

/*function createMatchProtocol(r){
    try {
        var connection = r.accept('creatematch', r.origin);
        console.log((new Date()) + ' Lobby ' + connection.remoteAddress + ' Connection accepted');

        connection.on('message', function (message) {
            try {
                var jsonMessage = JSON.parse(message.utf8Data);

                if (jsonMessage.command == "create") {
                    //TODO: Esto habra que generarlo en la siguiente version
                    // O quiza que el lobby sea quien envie el especificador
                    var matchID = 'idFijo';
                    if (matchesList[matchID] == undefined) {
                        var match = new matchMain(matchID);
                        matchesList[matchID] = match;
                        var response = JSON.stringify({response: 'identifier', arg1: matchID});
                        connection.sendUTF(response);
                    } else {
                        var response = JSON.stringify({response: 'error'});
                        connection.sendUTF(response);
                    }
                } else if (jsonMessage.command == "closeall") {
                    for (var mtc in matchesList){
                        matchesList[mtc].closeAll();
                    }
                    matchesList = matchesList.splice(0, matchesList.length);
                    var response = JSON.stringify({response: 'Matches closed'});
                    connection.sendUTF(response);
                }else{
                    var response = JSON.stringify({response: 'error'});
                    connection.sendUTF(response);
                }
            } catch (except) {
                console.log((new Date()) + ' Connection Aborted. ' + except.toString());
                connection.close();
            }
        });

        connection.on('close', function (reasonCode, description) {
            console.log((new Date()) + ' Lobby ' + connection.remoteAddress + ' disconnected.');
        });

        var partida = new matchMain(connection);

    } catch (except) {
        console.log((new Date()) + ' Connection aborted. ' + except.toString());
        connection.close();
    }
}*/

/*
 * This function is what accepts and manages the client connection until it log in
 * Under our playgame websocket protocol
 */
function playGameProtocol(r){
    try {
        var connection = r.accept('playgame', r.origin);

        console.log((new Date()) + ' Client ' + connection.remoteAddress + ' Connection accepted');

        //All listeners are overridden by the client class when its created
        connection.on('message', function (message) {
            var parsedMessage = JSON.parse(message.utf8Data);

            if (parsedMessage.command == "login") {
                var clientMatch = matchesList[parsedMessage.arg1];
                var idClient = parsedMessage.arg2;

                if (clientMatch != undefined && idClient != undefined) {
                    var client = new clientMain(connection, idClient, clientMatch);
                    var msg_toBroadcast = JSON.stringify({response: idClient + ' has logged in'});

                    clientMatch.addClient(connection, client, idClient);
                    clientMatch.broadcastMSG(msg_toBroadcast);

                } else {
                    var msg_toSend = JSON.stringify({ response: 'error'});

                    connection.sendUTF(response);
                }

            } else {
                var msg_toSend = JSON.stringify({ response: 'error'});

                connection.sendUTF(response);
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

module.exports = createWS;
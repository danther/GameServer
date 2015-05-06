/**
 * Created by Danther on 30/04/2015.
 */

var http = require('http');
var WebSocketServer = require('websocket').server;
var matchMain = require('./match.js');
var clientMain = require('./client.js');

var matchesMap = [];

function createWS(server) {
    wsServer = new WebSocketServer({
        httpServer: server
        //TODO: Cuando añadamos verificacion
        //autoAcceptConnections: false
    });

    wsServer.on('request', function (r) {
        switch (r.requestedProtocols.toString()) {
            case "creatematch": createMatchProtocol(r); break;
            case "playgame": playGameProtocol(r); break;
            default: r.reject(); console.log((new Date()) + ' Connection Rejected. Format unrecognized');
        }
    });
}

function createMatchProtocol(r){
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
                    if (matchesMap[matchID] == undefined) {
                        var match = new matchMain(matchID);
                        matchesMap[matchID] = match;
                        var response = JSON.stringify({response: 'identifier', arg1: matchID});
                        connection.sendUTF(response);
                    } else {
                        var response = JSON.stringify({response: 'error'});
                        connection.sendUTF(response);
                    }
                } else if (jsonMessage.command == "closeall") {
                    for (var mtc in matchesMap){
                        matchesMap[mtc].closeAll();
                    }
                    matchesMap = matchesMap.splice(0, matchesMap.length);
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
}

function playGameProtocol(r){
    try {
        var connection = r.accept('playgame', r.origin);
        console.log((new Date()) + ' Client ' + connection.remoteAddress + ' Connection accepted');

        connection.on('message', function (message) {
            var jsonMessage = JSON.parse(message.utf8Data);

            if (jsonMessage.command == "login"){
                var specMatch = matchesMap[jsonMessage.arg1];
                var clientID = jsonMessage.arg2;
                if (specMatch != undefined && clientID != undefined){
                    var client = new clientMain(connection, clientID, specMatch);
                    specMatch.addClient(connection, client, clientID);
                    var msg_toBroadcast = JSON.stringify({response: clientID + ' has logged in'});
                    specMatch.broadcastMSG(msg_toBroadcast);
                }else{
                    var response = JSON.stringify({ response: 'error'});
                    connection.sendUTF(response);
                }
            } else {
                var response = JSON.stringify({ response: 'error'});
                connection.sendUTF(response);
            }
        });

        connection.on('close', function (reasonCode, description) {
            console.log((new Date()) + ' Lobby ' + connection.remoteAddress + ' disconnected.');
        });

    } catch (except) {
        connection.close();
        console.log((new Date()) + ' Connection aborted. ' + except.toString());
    }
}

module.exports = createWS;
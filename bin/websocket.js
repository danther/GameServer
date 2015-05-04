/**
 * Created by Danther on 30/04/2015.
 */

var http = require('http');
var WebSocketServer = require('websocket').server;
var matchMain = require('./Match.js');

function createWS(server) {
    wsServer = new WebSocketServer({
        httpServer: server
        //Cuando añadamos verificacion
        //autoAcceptConnections: false
    });

    wsServer.on('request', function (r) {
        switch (r.requestedProtocols.toString()) {
            case "test-creatematch": createMatchProtocol(r); break;
            case "test-playGame": playGameProtocol(r); break;
            default: r.reject(); console.log((new Date()) + ' Connection Rejected. Format unrecognized');
        }
    });
}

function createMatchProtocol(r){
    try {
        var connection = r.accept('test-creatematch', r.origin);
        console.log((new Date()) + ' Connection accepted');
        var partida = new matchMain(connection);
    } catch (except) {
        console.log((new Date()) + ' Connection Rejected. ' + except.toString());
    }
}

function playGameProtocol(r){
    try {
        var connection = r.accept('test-playgame', r.origin);
        console.log((new Date()) + ' Connection accepted');
    } catch (except) {
        console.log((new Date()) + ' Connection Rejected. ' + except.toString());
    }
}

module.exports = createWS;
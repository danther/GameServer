/**
 * Created by Danther on 04/05/2015.
 */

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

function createMatch(connection){

    this.connection = connection;
    var state = "connected";
    var identifier;

    connection.on('message', function (message) {
        stateMachine(message);
    });

    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });

    function stateMachine(message){
        switch (state) {
            case "connected": stateConnected(message); break;
            default: console.log("States error"); break;
        }
    }


    function stateConnected(message){
        var jsonMessage = JSON.parse(message.utf8Data);

        if (jsonMessage.command == "create"){
            identifier = 'idFijo';
            state = 'created';
            var response = JSON.stringify({ response: 'identifier', arg1: identifier});
            connection.sendUTF(response);
        } else {
            var response = JSON.stringify({ response: 'error'});
            connection.sendUTF(response);
        }

        //var jsonMessage = JSON.parse(message.body);
        //console.log(String(jsonMessage[0].command));
        //connection.writeHead(200, { 'Content-Type': 'application/json' });
        //connection.write(JSON.stringify({ response: 'created', arg1: 'idFijo' }));

        identifier = 'idFijo';
        state = 'created';
    }

}

module.exports = createMatch;
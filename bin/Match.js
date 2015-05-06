/**
 * Created by Danther on 04/05/2015.
 */

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var clientMain = require('./client.js');

var app = express();
app.use(bodyParser.json());

function createMatch(matchID){
    var matchState = "created";
    var matchID = matchID;
    var clientsList = [];
    var slots = 4;

    function stateMachine(message){
        switch (matchState) {
            case "created": break;
            default: console.log("States error"); break;
        }
    }

    this.addClient = function(connection, client, clientID){
        if (slots > 0){
            slots--;
            if (clientsList[clientID] == undefined){
                clientsList[clientID] = client;
                if (slots == 0){
                    state = "slotsFull";
                }
            }else{
                var response = JSON.stringify({ response: 'Client ID already in use.'});
                connection.sendUTF(response);
            }
        }else{
            var response = JSON.stringify({ response: 'Match Full'});
            connection.sendUTF(response);
            connection.close();
        }
    }

    this.broadcastMSG = function(msg){
        for (var clt in clientsList){
            clientsList[clt].sendMSGClient(msg);
        }
    }

    this.closeAll = function (){
        for (clt in clientsList){
            clientsList[clt].forceClose();
        }
    }

}

module.exports = createMatch;
/**
 * Created by Danther on 04/05/2015.
 */

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var clientMain = require('./client.js');

var app = express();
app.use(bodyParser.json());

function createMatch(matchID, clientsData){
    var matchState = "created";
    var matchID = matchID;
    var clientsData = clientsData;
    var clientsList = [];
    var slots = 2;


    /*
     * Game variables
     */
    var turn;

    var cardDeck = [];
    var discardDeck = [];

    var client1Hand = [];
    var client2Hand = [];

    var hop1;
    var hop2;
    var hop3;
    var hop4;

    var hopCubes = [];
    var discardCubes = [];

    var hop1Cubes = [];
    var hop2Cubes = [];
    var hop3Cubes = [];
    var hop4Cubes = [];

    var hop1Client1Stack = [];
    var hop1Client2Stack = [];

    var hop2Client1Stack = [];
    var hop2Client2Stack = [];

    var hop3Client1Stack = [];
    var hop3Client2Stack = [];

    var hop4Client1Stack = [];
    var hop4Client2Stack = [];

    var client1Trophies = [];
    var client2Trophies = [];
    /*****************************/

    function stateMachine(message){
        switch (matchState) {
            case "created": break;
            case "started": break;
            default: console.log("States error"); break;
        }
    }

    function startMatch(){
        turn = clientsData['idClient1'];

        cardDeck = ['Red 1','Red 2','Red 3','Red 4','Red 5','Red 6','Red 7','Red 8','Red 9','Red 10','Red 11',
            'Red 12','Red 13','Yellow 1','Yellow 2','Yellow 3','Yellow 4','Yellow 5','Yellow 6','Yellow 7',
            'Yellow 8','Yellow 9','Yellow 10','Yellow 11','Blue 1','Blue 2','Blue 3','Blue 4','Blue 5','Blue 6',
            'Blue 7', 'Gray 1','Gray 2','Gray 3','Gray 4','Gray 5'];
        shuffle(cardDeck);

        hopCubes = ['Red 1','Red 2','Red 3','Red 4','Red 5','Red 6','Red 7','Red 8','Red 9','Red 10','Red 11',
            'Red 12','Red 13','Yellow 1','Yellow 2','Yellow 3','Yellow 4','Yellow 5','Yellow 6','Yellow 7',
            'Yellow 8','Yellow 9','Yellow 10','Yellow 11','Blue 1','Blue 2','Blue 3','Blue 4','Blue 5','Blue 6',
            'Blue 7', 'Gray 1','Gray 2','Gray 3','Gray 4','Gray 5'];
        shuffle(hopCubes);

        for (var i = 0; i < 8; i++){
            client1Hand.push(cardDeck.pop());
            client2Hand.push(cardDeck.pop());
        }

        hop1Cubes.push(hopCubes.pop());
        hop2Cubes.push(hopCubes.pop());
        hop3Cubes.push(hopCubes.pop());
        hop4Cubes.push(hopCubes.pop());

        hop1 = 'flatland';
        hop2 = 'mountain';
        hop3 = 'flatland';
        hop4 = 'mountain';
    }

    this.actualize = function actualize(message, idClient) {
        this.sendState(idClient);
    }

    this.sendState = function sendState(idClient) {

        var msg_toBroadcast = JSON.stringify({state: 'Turn', arg1: turn});
        this.broadcastMSG(msg_toBroadcast);

        var msg_toClient = JSON.stringify({state: 'Hand', arg1: client1Hand});
        clientsList[clientsData['idClient1']].sendMSGClient(msg_toClient);

        msg_toClient = JSON.stringify({state: 'Hand', arg1: client2Hand});
        clientsList[clientsData['idClient2']].sendMSGClient(msg_toClient);

        msg_toBroadcast = JSON.stringify({state: 'Hop 1', arg1: hop1 + ' Cubes: ' + hop1Cubes});
        this.broadcastMSG(msg_toBroadcast);
        msg_toBroadcast = JSON.stringify({state: 'Hop 2', arg1: hop2 + ' Cubes: ' + hop2Cubes});
        this.broadcastMSG(msg_toBroadcast);
        msg_toBroadcast = JSON.stringify({state: 'Hop 3', arg1: hop3 + ' Cubes: ' + hop3Cubes});
        this.broadcastMSG(msg_toBroadcast)
        msg_toBroadcast = JSON.stringify({state: 'Hop 4', arg1: hop4 + ' Cubes: ' + hop4Cubes});
        this.broadcastMSG(msg_toBroadcast);

        msg_toBroadcast = JSON.stringify({state: 'Hop 1 ' + clientsData['idClient1'] + ' side', arg1: hop1Client1Stack});
        this.broadcastMSG(msg_toBroadcast);
        msg_toBroadcast = JSON.stringify({state: 'Hop 1 ' + clientsData['idClient2'] + ' side', arg1: hop1Client2Stack});
        this.broadcastMSG(msg_toBroadcast);

        msg_toBroadcast = JSON.stringify({state: 'Hop 2 ' + clientsData['idClient1'] + ' side', arg1: hop2Client1Stack});
        this.broadcastMSG(msg_toBroadcast);
        msg_toBroadcast = JSON.stringify({state: 'Hop 2 ' + clientsData['idClient2'] + ' side', arg1: hop2Client2Stack});
        this.broadcastMSG(msg_toBroadcast);

        msg_toBroadcast = JSON.stringify({state: 'Hop 3 ' + clientsData['idClient1'] + ' side', arg1: hop3Client1Stack});
        this.broadcastMSG(msg_toBroadcast);
        msg_toBroadcast = JSON.stringify({state: 'Hop 3 ' + clientsData['idClient2'] + ' side', arg1: hop3Client2Stack});
        this.broadcastMSG(msg_toBroadcast);

        msg_toBroadcast = JSON.stringify({state: 'Hop 4 ' + clientsData['idClient1'] + ' side', arg1: hop4Client1Stack});
        this.broadcastMSG(msg_toBroadcast);
        msg_toBroadcast = JSON.stringify({state: 'Hop 4 ' + clientsData['idClient2'] + ' side', arg1: hop4Client2Stack});
        this.broadcastMSG(msg_toBroadcast);

        msg_toBroadcast = JSON.stringify({state: clientsData['idClient1'] + ' trophies', arg1: client1Trophies});
        this.broadcastMSG(msg_toBroadcast);
        msg_toBroadcast = JSON.stringify({state: clientsData['idClient2'] + ' trophies', arg1: client2Trophies});
        this.broadcastMSG(msg_toBroadcast);
    }

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex ;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    this.addClient = function(connection, client, idClient, tokenClient){
        if (slots > 0){

            if (clientsList[idClient] == undefined) {
                if ( ((idClient == clientsData['idClient1']) && (tokenClient == clientsData['tokenClient1'])) ||
                    ((idClient == clientsData['idClient2']) && (tokenClient == clientsData['tokenClient2'])) ) {
                    clientsList[idClient] = client;
                    slots--;

                    var msg_toBroadcast = JSON.stringify({response: idClient + ' has logged in'});

                    this.broadcastMSG(msg_toBroadcast);

                    if (slots == 0){
                        matchState = "started";
                        startMatch();

                        msg_toBroadcast = JSON.stringify({response: 'Match start! '
                        + clientsData['idClient1'] + ' turn!'});

                        this.broadcastMSG(msg_toBroadcast);
                    }
                } else {
                    var response = JSON.stringify({ response: 'Error: Wrong client id or token'});
                    connection.sendUTF(response);
                }
            }else{
                var response = JSON.stringify({ response: 'Error: Client ID already in use.'});
                connection.sendUTF(response);
            }

        }else{
            var response = JSON.stringify({ response: 'Error: Match Full'});
            connection.sendUTF(response);
            connection.close();
        }
    }

    this.getClient = function(clientID){
        return clientsList[clientID];
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
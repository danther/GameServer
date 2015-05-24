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
    var finalMSG;


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

    var client1Cubes = [];
    var client2Cubes = [];

    var trophies = [];

    var client1Trophies = [];
    var client2Trophies = [];
    /*****************************/

    function stateMachine(message){
        switch (matchState) {
            case "created": break;
            case "started": break;
            case "finished": break;
            default: console.log("States error"); break;
        }
    }

    this.startMatch = function startMatch(){
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
        hop2Cubes.push(hopCubes.pop());
        hop3Cubes.push(hopCubes.pop());
        hop3Cubes.push(hopCubes.pop());
        hop3Cubes.push(hopCubes.pop());
        hop4Cubes.push(hopCubes.pop());
        hop4Cubes.push(hopCubes.pop());
        hop4Cubes.push(hopCubes.pop());
        hop4Cubes.push(hopCubes.pop());

        hop1 = 'flatland';
        hop2 = 'mountain';
        hop3 = 'flatland';
        hop4 = 'mountain';

        trophies = ['red', 'blue', 'yellow', 'gray'];

        clientsList[clientsData["idClient1"]].setToPlay();
        clientsList[clientsData["idClient2"]].setToPlay();

        this.sendState();
    }

    this.actualize = function actualize(message, idClient) {
        if (matchState == "finished"){
            clientsList[idClient].sendMSGClient(finalMSG);

            return "";
        }

        if (idClient == turn){
            var parsedMessage = JSON.parse(message.utf8Data);

            if (parsedMessage.arg1 != undefined && parsedMessage.arg2 != undefined) {
                var hopTC;
                var hopTCStack1;
                var hopTCStack2;
                var hopCubesTC;

                switch (parsedMessage.arg1.toLowerCase()){
                    case 'hop1jug':
                        addCardHop(hop1Client1Stack, hop1Client2Stack, idClient, parsedMessage, true);
                        hopTC = hop1;
                        hopTCStack1 = hop1Client1Stack;
                        hopTCStack2 = hop1Client2Stack;
                        hopCubesTC = hop1Cubes;
                        break;
                    case 'hop2jug':
                        addCardHop(hop2Client1Stack, hop2Client2Stack, idClient, parsedMessage, true);
                        hopTC = hop2;
                        hopTCStack1 = hop2Client1Stack;
                        hopTCStack2 = hop2Client2Stack;
                        hopCubesTC = hop2Cubes;
                        break;
                    case 'hop3jug':
                        addCardHop(hop3Client1Stack, hop3Client2Stack, idClient, parsedMessage, true);
                        hopTC = hop3;
                        hopTCStack1 = hop3Client1Stack;
                        hopTCStack2 = hop3Client2Stack;
                        hopCubesTC = hop3Cubes;
                        break;
                    case 'hop4jug':
                        addCardHop(hop4Client1Stack, hop4Client2Stack, idClient, parsedMessage, true);
                        hopTC = hop4;
                        hopTCStack1 = hop4Client1Stack;
                        hopTCStack2 = hop4Client2Stack;
                        hopCubesTC = hop4Cubes;
                        break;
                    case 'hop1cont':
                        addCardHop(hop1Client1Stack, hop1Client2Stack, idClient, parsedMessage, false);
                        hopTC = hop1;
                        hopTCStack1 = hop1Client1Stack;
                        hopTCStack2 = hop1Client2Stack;
                        hopCubesTC = hop1Cubes;
                        break;
                    case 'hop2cont':
                        addCardHop(hop2Client1Stack, hop2Client2Stack, idClient, parsedMessage, false);
                        hopTC = hop2;
                        hopTCStack1 = hop2Client1Stack;
                        hopTCStack2 = hop2Client2Stack;
                        hopCubesTC = hop2Cubes;
                        break;
                    case 'hop3cont':
                        addCardHop(hop3Client1Stack, hop3Client2Stack, idClient, parsedMessage, false);
                        hopTC = hop3;
                        hopTCStack1 = hop3Client1Stack;
                        hopTCStack2 = hop3Client2Stack;
                        hopCubesTC = hop3Cubes;
                        break;
                    case 'hop4cont':
                        addCardHop(hop4Client1Stack, hop4Client2Stack, idClient, parsedMessage, false);
                        hopTC = hop4;
                        hopTCStack1 = hop4Client1Stack;
                        hopTCStack2 = hop4Client2Stack;
                        hopCubesTC = hop4Cubes;
                        break;
                    default: break;
                }

                checkHop(hopCubesTC, hopTCStack1, hopTCStack2, hopTC);

                checkCubes();

                this.checkVictory();

                if (turn == clientsData['idClient1']){
                    turn = clientsData['idClient2'];
                } else {
                    turn = clientsData['idClient1'];
                }

                this.sendState();

            } else {
                var msg_toClient = JSON.stringify({response: 'Bad play message.'});

                clientsList[idClient].sendMSGClient(msg_toClient);
            }

        } else {
            var msg_toClient = JSON.stringify({response: 'Its not your turn, sorry'});

            clientsList[idClient].sendMSGClient(msg_toClient);
        }
    }

    this.checkVictory = function checkVictory() {
        if (client1Trophies.length >= 3){
            finalMSG = JSON.stringify({response: 'The winner is: ' + clientsData['idClient1'] + '!!!'});
            matchState = "finished";

            this.broadcastMSG(finalMSG);

        } else if (client2Trophies.length >= 3){
            finalMSG = JSON.stringify({response: 'The winner is: ' + clientsData['idClient1'] + '!!!'});
            matchState = "finished";

            this.broadcastMSG(finalMSG);
        }
    }

    function checkCubes() {
        var red = 0, yellow = 0, gray = 0, blue = 0;
        var cubeTemp = [];

        for (var cube in client1Cubes){
            var f3l = client1Cubes[cube].substr(0, 3);
            switch (f3l.toLowerCase()){
                case 'red': red++; break;
                case 'blu': blue++; break;
                case 'yel': yellow++; break;
                case 'gra': gray++; break;
                default: break;
            }
        }

        if (red > 2){
            red = 3;

            for (var cube in client1Cubes){
                var f3l = client1Cubes[cube].substr(0, 3);
                if (f3l == 'red' && red > 0) {
                    discardCubes.push(client1Cubes[cube]);
                    red--;
                } else {
                    cubeTemp.push(client1Cubes[cube]);
                }
            }
            client1Cubes = [];
            while(cubeTemp.length > 0){
                client1Cubes.push(cubeTemp.pop());
            }

            if (trophies.indexOf('red') >= 0){
                client1Trophies.push('red');
                removeElement(trophies, trophies.indexOf('red'), trophies.indexOf('red'));
            }
        }

        if (blue > 2){
            blue = 3;
            for (var cube in client1Cubes){
                var f3l = client1Cubes[cube].substr(0, 3);
                if (f3l == 'blu' && blue > 0) {
                    discardCubes.push(client1Cubes[cube]);
                    blue--;
                } else {
                    cubeTemp.push(client1Cubes[cube]);
                }
            }
            client1Cubes = [];
            while(cubeTemp.length > 0){
                client1Cubes.push(cubeTemp.pop());
            }

            if (trophies.indexOf('blue') >= 0){
                client1Trophies.push('blue');
                removeElement(trophies, trophies.indexOf('blue'), trophies.indexOf('blue'));
            }
        }

        if (yellow > 2){
            yellow = 3;
            for (var cube in client1Cubes){
                var f3l = client1Cubes[cube].substr(0, 3);
                if (f3l == 'yel' && yellow > 0) {
                    discardCubes.push(client1Cubes[cube]);
                    yellow--;
                } else {
                    cubeTemp.push(client1Cubes[cube]);
                }
            }
            client1Cubes = [];
            while(cubeTemp.length > 0){
                client1Cubes.push(cubeTemp.pop());
            }

            if (trophies.indexOf('yellow') >= 0){
                client1Trophies.push('yellow');
                removeElement(trophies, trophies.indexOf('yellow'), trophies.indexOf('yellow'));
            }
        }

        if (gray > 2){
            gray = 3;
            for (var cube in client1Cubes){
                var f3l = client1Cubes[cube].substr(0, 3);
                if (f3l == 'gra' && gray > 0) {
                    discardCubes.push(client1Cubes[cube]);
                    gray--;
                } else {
                    cubeTemp.push(client1Cubes[cube]);
                }
            }
            client1Cubes = [];
            while(cubeTemp.length > 0){
                client1Cubes.push(cubeTemp.pop());
            }

            if (trophies.indexOf('gray') >= 0){
                client1Trophies.push('gray');
                removeElement(trophies, trophies.indexOf('gray'), trophies.indexOf('gray'));
            }
        }

        red = 0;
        blue = 0;
        yellow = 0;
        gray = 0;

        for (var cube in client2Cubes){
            var f3l = client2Cubes[cube].substr(0, 3);
            switch (f3l.toLowerCase()){
                case 'red': red++; break;
                case 'blu': blue++; break;
                case 'yel': yellow++; break;
                case 'gra': gray++; break;
                default: break;
            }
        }

        if (red > 2){
            red = 3;
            for (var cube in client2Cubes){
                var f3l = client2Cubes[cube].substr(0, 3);
                if (f3l == 'red' && red > 0) {
                    discardCubes.push(client1Cubes[cube]);
                    red--;
                } else {
                    cubeTemp.push(client2Cubes[cube]);
                }
            }
            client2Cubes = [];
            while(cubeTemp.length > 0){
                client2Cubes.push(cubeTemp.pop());
            }

            if (trophies.indexOf('red') >= 0){
                client2Trophies.push('red');
                removeElement(trophies, trophies.indexOf('red'), trophies.indexOf('red'));
            }
        }

        if (blue > 2){
            for (var cube in client2Cubes){
                var f3l = client2Cubes[cube].substr(0, 3);
                if (f3l == 'blu' && blue > 0) {
                    discardCubes.push(client1Cubes[cube]);
                    blue--;
                } else {
                    cubeTemp.push(client2Cubes[cube]);
                }
            }
            client2Cubes = [];
            while(cubeTemp.length > 0){
                client2Cubes.push(cubeTemp.pop());
            }

            if (trophies.indexOf('blue') >= 0){
                client2Trophies.push('blue');
                removeElement(trophies, trophies.indexOf('blue'), trophies.indexOf('blue'));
            }
        }

        if (yellow > 2){
            yellow = 3;
            for (var cube in client2Cubes){
                var f3l = client2Cubes[cube].substr(0, 3);
                if (f3l == 'yel' && yellow > 0) {
                    discardCubes.push(client1Cubes[cube]);
                    yellow--;
                } else {
                    cubeTemp.push(client2Cubes[cube]);
                }
            }
            client2Cubes = [];
            while(cubeTemp.length > 0){
                client2Cubes.push(cubeTemp.pop());
            }

            if (trophies.indexOf('yellow') >= 0){
                client2Trophies.push('yellow');
                removeElement(trophies, trophies.indexOf('yellow'), trophies.indexOf('yellow'));
            }
        }

        if (gray > 2){
            gray = 3;
            for (var cube in client2Cubes){
                var f3l = client2Cubes[cube].substr(0, 3);
                if (f3l == 'gra' && gray > 0) {
                    discardCubes.push(client1Cubes[cube]);
                    gray--;
                } else {
                    cubeTemp.push(client2Cubes[cube]);
                }
            }
            client2Cubes = [];
            while(cubeTemp.length > 0){
                client2Cubes.push(cubeTemp.pop());
            }

            if (trophies.indexOf('gray') >= 0){
                client2Trophies.push('gray');
                removeElement(trophies, trophies.indexOf('gray'), trophies.indexOf('gray'));
            }
        }
    }

    function checkHop(hopCubesTC, hopTCStack1, hopTCStack2, hopTC){
        var red = 0, yellow = 0, gray = 0, blue = 0;
        var redTemp, yellowTemp, grayTemp, blueTemp;
        var sumPlayer1 = 0;
        var sumPlayer2 = 0;


        for (var cube in hopCubesTC) {
            var f3l = hopCubesTC[cube].substr(0, 3);
            switch (f3l.toLowerCase()){
                case 'red': red++; break;
                case 'blu': blue++; break;
                case 'yel': yellow++; break;
                case 'gra': gray++; break;
                default: break;
            }
        }

        redTemp = red;
        yellowTemp = yellow;
        grayTemp = gray;
        blueTemp = blue;

        for (var card in hopTCStack1){
            var f3l = hopTCStack1[card].substr(0, 3);

            sumPlayer1 += parseInt(hopTCStack1[card].substr(-1 , 2));

            switch (f3l.toLowerCase()){
                case 'red': red--; break;
                case 'blu': blue--; break;
                case 'yel': yellow--; break;
                case 'gra': gray--; break;
                default: break;
            }
        }

        for (var card in hopTCStack2){
            var f3l = hopTCStack2[card].substr(0, 3);

            sumPlayer2 += parseInt(hopTCStack2[card].substr(-1 , 2));

            switch (f3l.toLowerCase()){
                case 'red': redTemp--; break;
                case 'blu': blueTemp--; break;
                case 'yel': yellowTemp--; break;
                case 'gra': grayTemp--; break;
                default: break;
            }
        }

        if (red <= 0 && redTemp <= 0 && yellow <= 0 && yellowTemp <= 0
            && gray <= 0 && grayTemp <= 0 && blue <= 0 && blueTemp <= 0){

            if (hopCubes.length < 4){
                while (discardCubes.length > 0){
                    hopCubes.push(discardCubes.pop());
                }
                shuffle(hopCubes);
            }

            while (hopTCStack1.length > 0){
                discardDeck.push(hopTCStack1.pop());
            }

            while (hopTCStack2.length > 0){
                discardDeck.push(hopTCStack2.pop());
            }

            var cubesToAdd = 0;
            if (hopTC == 'mountain'){
                if (sumPlayer1 >= sumPlayer2){
                    while (hopCubesTC.length > 0){
                        client1Cubes.push(hopCubesTC.pop());
                        cubesToAdd++;
                    }

                } else {
                    while (hopCubesTC.length > 0){
                        client2Cubes.push(hopCubesTC.pop());
                        cubesToAdd++;
                    }
                }

                hopTC = 'flatland';

            } else {
                if (sumPlayer1 >= sumPlayer2){
                    while (hopCubesTC.length > 0){
                        client2Cubes.push(hopCubesTC.pop());
                        cubesToAdd++;
                    }

                } else {
                    while (hopCubesTC.length > 0){
                        client1Cubes.push(hopCubesTC.pop());
                        cubesToAdd++;
                    }
                }

                hopTC = 'mountain';
            }

            while (cubesToAdd > 0){
                hopCubesTC.push(hopCubes.pop());
                cubesToAdd--;
            }
        }
    }

    function addCardHop (client1Stack, client2Stack, idClient, parsedMessage, side){
        var ownStack;
        var vsStack;
        var msg_toClient;
        var hand;
        var cardIndex;

        if (idClient == clientsData['idClient1']){
            ownStack = client1Stack;
            vsStack = client2Stack;
            hand = client1Hand;

        } else {
            ownStack = client2Stack;
            vsStack = client1Stack;
            hand = client2Hand;
        }

        cardIndex = parseInt(parsedMessage.arg2) - 1;

        if (cardIndex < 0 || cardIndex > 7){
            msg_toClient = 'Bad argument. Card doesnt exist';

            clientsList[idClient].sendMSGClient(msg_toClient);

        } else {

            if (cardDeck == 0) {
                while (discardDeck.length > 0) {
                    cardDeck.push(discardDeck.pop())
                }
                shuffle(cardDeck)
            }

            if (side){
                ownStack.push(hand[cardIndex]);
            } else {
                vsStack.push(hand[cardIndex]);
            }

            removeElement(hand, cardIndex, cardIndex);
            hand.push(cardDeck.pop());
        }
    }

    this.sendState = function sendState() {

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

        msg_toBroadcast = JSON.stringify({state: clientsData['idClient1'] + ' cubes', arg1: client1Cubes});
        this.broadcastMSG(msg_toBroadcast);
        msg_toBroadcast = JSON.stringify({state: clientsData['idClient2'] + ' cubes', arg1: client2Cubes});
        this.broadcastMSG(msg_toBroadcast);

        msg_toBroadcast = JSON.stringify({state: 'Trophies', arg1: trophies});
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
                        this.startMatch();

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
        for (var clt in clientsList){
            clientsList[clt].forceClose();
        }
    }

    function removeElement (array, from, to) {
        var rest = array.slice((to || from) + 1 || array.length);
        array.length = from < 0 ? array.length + from : from;
        array.push.apply(array, rest);
    };

}

module.exports = createMatch;
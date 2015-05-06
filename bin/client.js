/**
 * Created by Danther on 05/05/2015.
 */


function createClient(connection, idClient, match){

    var connection = connection;
    var idClient = idClient;
    var clientState= "connected";
    var myMatch = match;

    connection.removeAllListeners();

    connection.on('message', function (message) {
        stateMachine(message);
    });

    connection.on('close', function (reasonCode, description) {
        var msg = JSON.stringify({ response: idClient + ' disconnected'});
        myMatch.broadcastMSG();
        console.log((new Date()) + ' Client' + connection.remoteAddress + ' disconnected.');
    });

    function stateMachine(message){
        switch (clientState) {
            case "connected": stateConnected(message); break;
            default: console.log("States error"); break;
        }
    }


    function stateConnected(message){
        var jsonMessage = JSON.parse(message.utf8Data);
        switch(jsonMessage.command){
            case "chat": myMatch.broadcastMSG(JSON.stringify({ response: jsonMessage.arg1, msgID: idClient})); break;
            case "close": myMatch.broadcastMSG(JSON.stringify({ response: idClient + ' left the match'}));
                connection.close(); break;
            default: connection.sendUTF(JSON.stringify({response: 'error'})); break;
        }
    }

    this.sendMSGClient = function(msg){
        connection.sendUTF(msg);
    }

    this.forceClose = function(){
        connection.close();
    }

}

module.exports = createClient;
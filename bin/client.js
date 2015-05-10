/**
 * Created by Danther on 05/05/2015.
 */

// Exported function/class
function clientMain(connection, idClient, match){

    var connection = connection;
    var idClient = idClient;
    var myMatch = match;

    var clientState= "connected"; //Initial state of the class

    // Here we delete listeners previously created by the websocket class to accept the client connection
    connection.removeAllListeners();

    /**
     * Class listeners
     */

    connection.on('message', function (message) {
        stateMachine(message);
    });

    connection.on('close', function (reasonCode, description) {
        var msg = JSON.stringify({ response: idClient + ' disconnected'});
        console.log((new Date()) + ' Client' + connection.remoteAddress + ' disconnected.');

        myMatch.broadcastMSG(msg);
    });

    // This is used to change the connection on a client so clients can be able to reconnect
    this.rewireClient = function rewireClient(newConnection) {
        connection.removeAllListeners();
        newConnection.removeAllListeners();
        connection = newConnection;

        connection.on('message', function (message) {
            stateMachine(message);
        });

        connection.on('close', function (reasonCode, description) {
            var msg = JSON.stringify({ response: idClient + ' disconnected'});
            console.log((new Date()) + ' Client' + connection.remoteAddress + ' disconnected.');

            myMatch.broadcastMSG(msg);
        });
    }


    /**
     * States logic
     */

    // Its called when a message is received through the client connection.
    // The message is parsed and used according the client state
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

    /**
     * Auxiliary functions
     */

    // Public function so the match can send individual messages to clients
    this.sendMSGClient = function(msg){
        connection.sendUTF(msg);
    }

    // Public function so the match can kill clients to its needs, it seems deleting the listeners is not necessary
    this.forceClose = function(){
        connection.close();
    }

}

module.exports = clientMain;
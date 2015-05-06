/**
 * Created by Danther on 05/05/2015.
 */


function createClient(connection, idClient){

    var connection = connection;
    var idClient = idClient;
    var clientState= "connected";

    connection.removeAllListeners();

    connection.on('message', function (message) {
        stateMachine(message);
    });

    connection.on('close', function (reasonCode, description) {
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

        if (jsonMessage.command == "responde"){
            var response = JSON.stringify({ response: 'identifier', arg1: idClient});
            connection.sendUTF(response);
        } else {
            var response = JSON.stringify({response: 'error'});
            connection.sendUTF(response);
        }
    }

}

module.exports = createClient;
/**
 * Created by Danther on 08/05/2015.
 */

var express = require('express');
var router = express.Router();

var matchMain = require('../bin/match.js');
var wsMain = require('../bin/websocket.js');

var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

/*
 * All routes in this file are relative to /creatematch/
 *
 * Since our creatematch protocol is external, all code here should be double checked to ensure its compliant with
 *   our public documentation
 */

/* GET matchIdentifier */
router.post('/', function(req, res, next) {
    var matchID = generateID();

    var idClient1 = req.body. idClient1;
    var tokenClient1 = req.body.tokenClient1;

    var idClient2 = req.body. idClient2;
    var tokenClient2 = req.body.tokenClient2;

    // Check for collision (improbable)
    if (wsMain.matchList[matchID] == undefined) {

        //Catch errors, usually a bad formatted json body
        try {

            //Check if all arguments are defined
            if (idClient1 != undefined && tokenClient1 != undefined && idClient2 != undefined && tokenClient2 != undefined
            && idClient1 != idClient2 && tokenClient1 != tokenClient2) {
                var clientsData = [];

                clientsData['idClient1'] = idClient1;
                clientsData['idClient2'] = idClient2;
                clientsData['tokenClient1'] = tokenClient1;
                clientsData['tokenClient2'] = tokenClient2;

                var match = new matchMain(matchID, clientsData);

                //Add the created match to main list
                wsMain.matchList[matchID] = match;

                var msg_toEnd = JSON.stringify({response: matchID});

                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(msg_toEnd);

            } else {
                var msg_toEnd = JSON.stringify({response: 'Error: Bad arguments'});

                res.writeHead(500, {"Content-Type": "application/json"});
                res.end(msg_toEnd, "utf8");
            }

        } catch (error){
            var msg_toEnd = JSON.stringify({response: 'Error: Error on process, bad format?'});

            res.writeHead(500, {"Content-Type": "application/json"});
            res.end(msg_toEnd, "utf8");
        }

        } else {
            var msg_toEnd = JSON.stringify({response: 'Error: ID collision'});

            res.writeHead(500, {"Content-Type": "application/json"});
            res.end(msg_toEnd, "utf8");
        }

    function generateID(){
        var identifier = String('xxxx-xxxx-xxxx-xxxx');
        identifier = identifier.replace(/x/g, function () { return '' + Math.floor(Math.random() * 0x1000); });
        return identifier;
    }

});

module.exports = router;
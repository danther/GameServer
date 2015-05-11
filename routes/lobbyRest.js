/**
 * Created by Danther on 08/05/2015.
 */

var express = require('express');
var router = express.Router();

var matchMain = require('../bin/match.js');
var wsMain = require('../bin/websocket.js');

/*
 * All routes in this file are relative to /creatematch/
 *
 * Since our creatematch protocol is external, all code here should be double checked to ensure its compliant with
 *   our public documentation
 */

/* GET matchIdentifier */
router.get('/', function(req, res, next) {
    var matchID = generateID();

    if (wsMain.matchList[matchID] == undefined) {
        var match = new matchMain(matchID);
        wsMain.matchList[matchID] = match;
        var msg_toEnd = JSON.stringify({ response: matchID});

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(msg_toEnd);
    } else {
        var msg_toEnd = JSON.stringify({ response: 'Error: ID collision'});

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(msg_toEnd, "utf8");
    }

    function generateID(){
        var identifier = String('xxxx-xxxx-xxxx-xxxx');
        identifier = identifier.replace(/x/g, function () { return '' + Math.floor(Math.random() * 0x1000); });
        return identifier;
    }

});

module.exports = router;
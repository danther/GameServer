/**
 * Created by Danther on 08/05/2015.
 */

var express = require('express');
var router = express.Router();

/*
 * All routes in this file are relative to /creatematch/
 *
 * Since our creatematch protocol is external, all code here should be double checked to ensure its compliant with
 *   our public documentation
 */

/* GET matchIdentifier */
router.get('/', function(req, res, next) {
    var matchID = generateID();

    if (matchList[matchID] == undefined) {
      createMatch(matchID);
      var msg_toEnd = JSON.stringify({ response: matchID});

      res.end(msg_toEnd);
    } else {
        var msg_toEnd = JSON.stringify({ response: 'Error: ID collision', msgID: 'debug'});

        res.end(msg_toEnd);
    }

    function generateID(){
        var identifier = 'xxxx-xxxx-xxxx-xxxx';
        identifier.replace('x', '' + Math.floor(Math.random() * 0x10000));
        console.log(identifier);
        return identifier;
    }

});

module.exports = router;
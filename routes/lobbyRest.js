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
    // TODO: match identifier should be generated randomly
    var matchID = 'idFijo';

    // TODO: Collisions between identifiers should be checked and avoided transparently to user
    if (matchList['idFijo'] == undefined) {
      createMatch(matchID);
      var msg_toEnd = JSON.stringify({ response: matchID});

      res.end(msg_toEnd);
    } else {
        var msg_toEnd = JSON.stringify({ response: 'error', errorCode: 'idFijo already in use', msgID: 'debug'});

        res.end(msg_toEnd);
    }

});

module.exports = router;
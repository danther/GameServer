'use strict';

var url = require('url');


var Default = require('./DefaultService');


module.exports.creatematchPost = function creatematchPost (req, res, next) {
  var body = req.swagger.params['body'].value;
  

  var result = Default.creatematchPost(body);

  if(typeof result !== 'undefined') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
  }
  else
    res.end();
};

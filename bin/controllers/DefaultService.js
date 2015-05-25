'use strict';

exports.creatematchPost = function(body) {

  var examples = {};
  
  examples['application/json'] = {
  "response" : "aeiou"
};
  

  
  if(Object.keys(examples).length > 0)
    return examples[Object.keys(examples)[0]];
  
}

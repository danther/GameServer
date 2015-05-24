var express = require('express');
var router = express.Router();

/* GET client page */
router.get('/', function(req, res, next) {
  if (isEmpty(req.query)){
    res.writeHead(302, {"Location": "http://localhost:8080/docs"});
    res.end();

    //res.render('route', { title: 'Swagger Doc' });
  } else {
    res.render('index', { title: 'Grupo 05' });
  }
});

function isEmpty(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop))
      return false;
  }

  return true;
}

module.exports = router;
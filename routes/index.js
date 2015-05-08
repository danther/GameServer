var express = require('express');
var router = express.Router();

/* GET client page */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Grupo 05' });
});

module.exports = router;

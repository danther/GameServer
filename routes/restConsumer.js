/**
 * Created by Danther on 30/04/2015.
 */

var express = require('express');
var router = express.Router();
var bParser = require('body-parser');
var app = express();
app.use(bParser.json());


/* PUT rest request to process */
router.put('/', function(req, res, next) {
    var request = String(req.body.request);
    var result;

    switch (request) {
        case 'achievement': result = processAchievements(req); break;
        default: result = 'No existe el modulo';
    }

    res.send(result);
});

/* Esta parte se completara cuando los demas modulos especifiquen que servicios ofrecen */
/* Aqui abajo van los metodos necesarios para atender las peticiones a nivel de clientes */

function processAchievements(req){
    var funct = String(req.body.function);
    var result;
    switch (funct) {
        case 'addAchievement': result = addAchievement(req); break;
        default: 'No existe la funcion';
    }
    return result;
}

/* Aqui abajo van los metodos necesarios para atender las peticiones a nivel de funciones */

function addAchievement(req) {
    var gameID = String(req.body.arg1);
    var achievementName = String(req.body.arg2);
    var linkAchievement = String(req.body.arg3);

    /* Aqui debe ir ahora la llamada al servicio rest del modulo de logros cuando se implemente */

    /* Mientras, mostraremos los argumentos como prueba. */
    var result = 'addAchievement(' + gameID + ', ' + achievementName + ', ' + linkAchievement +')';
    console.log(result);
    return result;
}

module.exports = router;
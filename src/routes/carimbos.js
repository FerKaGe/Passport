var express = require("express");
var router = express.Router();

var carimboController = require("../controllers/carimboController");

router.post("/registrar", function (req, res) {
    carimboController.registrar(req, res);
});

router.get("/skins/:idUsuario", function (req, res) {
    carimboController.listarSkins(req, res);
});

module.exports = router;

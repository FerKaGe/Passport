var express = require("express");
var router = express.Router();

var viagemController = require("../controllers/viagemController");

router.get("/tipos", function (req, res) {
    viagemController.listarTipos(req, res);
});

router.get("/destinos", function (req, res) {
    viagemController.listarDestinos(req, res);
});

router.get("/custos/:idTipoViagem", function (req, res) {
    viagemController.listarCustos(req, res);
});

module.exports = router;

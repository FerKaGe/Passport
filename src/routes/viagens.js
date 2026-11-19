var express = require("express");
var router = express.Router();

var viagemController = require("../controllers/viagemController");

// Os 3 tipos de viagem (aventura, low cost, exclusiva).
// Usada pelo cadastro, pela Dashboard e pela Calculadora.
router.get("/tipos", function (req, res) {
    viagemController.listarTipos(req, res);
});

// As 7 viagens para a linha do tempo da Home: país, cidades e datas.
// É uma rota pública (a Home não exige login), por isso NÃO devolve preços.
router.get("/destinos", function (req, res) {
    viagemController.listarDestinos(req, res);
});

// Os 7 destinos com o voo e a diária de um tipo de viagem.
// Ex.: /viagens/custos/2 devolve os custos do low cost.
router.get("/custos/:idTipoViagem", function (req, res) {
    viagemController.listarCustos(req, res);
});

module.exports = router;

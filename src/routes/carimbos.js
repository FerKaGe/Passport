var express = require("express");
var router = express.Router();

var carimboController = require("../controllers/carimboController");

// Chamada pelo jogo quando o jogador ganha o carimbo de um destino
router.post("/registrar", function (req, res) {
    carimboController.registrar(req, res);
});

// As 7 skins, cada uma dizendo se está liberada para este usuário.
// Usada pela barra lateral (seletor de skins) e pela Dashboard.
router.get("/skins/:idUsuario", function (req, res) {
    carimboController.listarSkins(req, res);
});

module.exports = router;

var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

// PUT = alterar algo que já existe. Salva o tipo de viagem preferido
// (chamada pela Dashboard quando o usuário troca o filtro).
router.put("/tipo/:idUsuario", function (req, res) {
    usuarioController.salvarTipoViagem(req, res);
});

// Salva a skin escolhida (chamada pelo seletor de skins da barra lateral)
router.put("/skin/:idUsuario", function (req, res) {
    usuarioController.salvarSkin(req, res);
});

module.exports = router;
var carimboModel = require("../models/carimboModel");

function registrar(req, res) {
    var idUsuario = Number(req.body.idUsuarioServer);
    var idDestino = Number(req.body.idDestinoServer);
    var pontuacao = Number(req.body.pontuacaoServer);

    if (isNaN(idUsuario) || isNaN(idDestino) || isNaN(pontuacao)) {
        res.status(400).send("Usuário, destino e pontuação precisam ser números");
        return;
    }

    // Primeiro pergunta se o carimbo já existe, para avisar o jogo se é novo
    // (o jogo mostra "SKIN LIBERADA!" só na primeira vez).
    carimboModel.buscar(idUsuario, idDestino)
        .then(function (carimbosEncontrados) {
            var novo = carimbosEncontrados.length == 0;

            // Depois grava. Se já existia, o banco guarda a maior pontuação.
            carimboModel.registrar(idUsuario, idDestino, pontuacao)
                .then(function () {
                    res.json({ novo: novo });
                })
                .catch(function (erro) {
                    console.log("\nHouve um erro ao registrar o carimbo! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                });
        })
        .catch(function (erro) {
            console.log("\nHouve um erro ao buscar o carimbo! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function listarSkins(req, res) {
    var idUsuario = Number(req.params.idUsuario);

    if (isNaN(idUsuario)) {
        res.status(400).send("O id do usuário precisa ser um número");
    } else {
        carimboModel.listarSkins(idUsuario)
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                console.log("\nHouve um erro ao listar as skins! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    registrar,
    listarSkins
};

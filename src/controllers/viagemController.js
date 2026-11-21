var viagemModel = require("../models/viagemModel");

function listarTipos(req, res) {
    viagemModel.listarTipos()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log("\nHouve um erro ao listar os tipos de viagem! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function listarDestinos(req, res) {
    viagemModel.listarDestinos()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log("\nHouve um erro ao listar os destinos! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function listarCustos(req, res) {
    // req.params traz o pedaço variável do endereço (o :idTipoViagem da rota).
    // Number() transforma o texto em número; se não for número, vira NaN.
    var idTipoViagem = Number(req.params.idTipoViagem);

    // Conferir ANTES de montar o SQL: um texto que não é número para aqui
    // e nunca chega ao banco (proteção contra SQL injection).
    if (isNaN(idTipoViagem)) {
        res.status(400).send("O tipo de viagem precisa ser um número");
    } else {
        viagemModel.listarCustos(idTipoViagem)
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                console.log("\nHouve um erro ao listar os custos! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    listarTipos,
    listarDestinos,
    listarCustos
};

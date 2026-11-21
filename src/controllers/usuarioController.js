var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        // Achou exatamente um usuário: devolve os dados que o
                        // login.html guarda na sessão (a senha não volta).
                        // tipoViagem e skin: o login.html guarda os dois para as outras telas.
                        // A skin vem com as cores e a fonte para a página já abrir com ela.
                        res.json({
                            id: resultadoAutenticar[0].id,
                            email: resultadoAutenticar[0].email,
                            nome: resultadoAutenticar[0].nome,
                            tipoViagem: resultadoAutenticar[0].fk_tipo_viagem,
                            skin: {
                                id: resultadoAutenticar[0].fk_skin,
                                corFundo: resultadoAutenticar[0].cor_fundo,
                                corBotao: resultadoAutenticar[0].cor_botao,
                                fonte: resultadoAutenticar[0].fonte
                            }
                        });
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var tipoViagem = Number(req.body.tipoViagemServer);

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (isNaN(tipoViagem)) {
        res.status(400).send("Escolha um tipo de viagem!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrar(nome, email, senha, tipoViagem)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function salvarTipoViagem(req, res) {
    var idUsuario = Number(req.params.idUsuario);
    var tipoViagem = Number(req.body.tipoViagemServer);

    if (isNaN(idUsuario) || isNaN(tipoViagem)) {
        res.status(400).send("Usuário e tipo de viagem precisam ser números");
    } else {
        usuarioModel.salvarTipoViagem(idUsuario, tipoViagem)
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                console.log("\nHouve um erro ao salvar o tipo de viagem! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function salvarSkin(req, res) {
    var idUsuario = Number(req.params.idUsuario);
    var idDestino = Number(req.body.idDestinoServer);  // 0 = skin padrão

    if (isNaN(idUsuario) || isNaN(idDestino)) {
        res.status(400).send("Usuário e skin precisam ser números");
        return;
    }

    // A skin padrão está sempre liberada: só apaga a escolha (NULL).
    // As outras passam pela conferência do carimbo, dentro do próprio SQL.
    var promessa;
    if (idDestino == 0) {
        promessa = usuarioModel.limparSkin(idUsuario);
    } else {
        promessa = usuarioModel.salvarSkin(idUsuario, idDestino);
    }

    promessa
        .then(function (resultado) {
            // affectedRows = quantas linhas o UPDATE alcançou.
            // 0 quer dizer que o EXISTS deu falso: o usuário não tem o carimbo.
            if (resultado.affectedRows == 0) {
                res.status(403).send("Essa skin ainda está bloqueada: ganhe o carimbo do destino no jogo.");
            } else {
                res.json({ idDestino: idDestino });
            }
        })
        .catch(function (erro) {
            console.log("\nHouve um erro ao salvar a skin! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    autenticar,
    cadastrar,
    salvarTipoViagem,
    salvarSkin
}

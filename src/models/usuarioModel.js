var database = require("../database/config")

function autenticar(email, senha) {
        var instrucaoSql= `
        SELECT u.id, u.nome, u.email, u.fk_tipo_viagem, u.fk_skin,
               d.cor_fundo, d.cor_botao, d.fonte
        FROM usuario AS u
        LEFT JOIN destino AS d ON u.fk_skin = d.id
        WHERE u.email = ? AND u.senha = ?;
    `;
    console.log("Executando a instrução SQL de login para o e-mail: " + email);
    return database.executar(instrucaoSql, [email, senha]);
}

function cadastrar(nome, email, senha, tipoViagem) {
        var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, fk_tipo_viagem) VALUES (?, ?, ?, ?);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [nome, email, senha, tipoViagem]);
}

function salvarTipoViagem(idUsuario, tipoViagem) {
    var instrucaoSql = `
        UPDATE usuario SET fk_tipo_viagem = ${tipoViagem} WHERE id = ${idUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function salvarSkin(idUsuario, idDestino) {
    var instrucaoSql = `
        UPDATE usuario SET fk_skin = ${idDestino}
        WHERE id = ${idUsuario}
          AND EXISTS (SELECT 1 FROM carimbo WHERE fk_usuario = ${idUsuario} AND fk_destino = ${idDestino});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function limparSkin(idUsuario) {
    var instrucaoSql = `
        UPDATE usuario SET fk_skin = NULL WHERE id = ${idUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar,
    salvarTipoViagem,
    salvarSkin,
    limparSkin
};

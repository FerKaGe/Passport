var database = require("../database/config");

function buscar(idUsuario, idDestino) {
    var instrucaoSql = `
        SELECT fk_destino FROM carimbo
        WHERE fk_usuario = ${idUsuario} AND fk_destino = ${idDestino};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function registrar(idUsuario, idDestino, pontuacao) {
    var instrucaoSql = `
        INSERT INTO carimbo (fk_usuario, fk_destino, pontuacao)
        VALUES (${idUsuario}, ${idDestino}, ${pontuacao})
        ON DUPLICATE KEY UPDATE pontuacao = GREATEST(pontuacao, ${pontuacao});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarSkins(idUsuario) {
    var instrucaoSql = `
        SELECT d.id, d.pais, d.cor_fundo, d.cor_botao, d.fonte,
               c.fk_destino IS NOT NULL AS liberada
        FROM destino AS d
        LEFT JOIN carimbo AS c ON c.fk_destino = d.id AND c.fk_usuario = ${idUsuario}
        ORDER BY d.id;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscar,
    registrar,
    listarSkins
};

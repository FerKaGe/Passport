var database = require("../database/config");

function listarTipos() {
    var instrucaoSql = `
        SELECT id, nome, descricao FROM tipo_viagem ORDER BY id;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Só o que a linha do tempo da Home mostra. YEAR() tira o ano de uma data:
// a página do Sobre mim usa os anos para contar desde quando você viaja.
function listarDestinos() {
    var instrucaoSql = `
        SELECT id, pais, cidades,
               DATE_FORMAT(inicio_viagem, '%m/%Y') AS ida,
               DATE_FORMAT(fim_viagem, '%m/%Y') AS volta,
               YEAR(inicio_viagem) AS ano
        FROM destino
        ORDER BY inicio_viagem;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// JOIN junta cada linha de custo com o destino dela (c.fk_destino = d.id).
// DATE_FORMAT entrega a data já como texto "mês/ano": se a data viesse
// como data, o fuso horário poderia mudar o dia na tela.
function listarCustos(idTipoViagem) {
    var instrucaoSql = `
        SELECT d.id, d.pais, d.cidades, d.melhor_epoca, d.moeda, d.cotacao_real,
               DATE_FORMAT(d.inicio_viagem, '%m/%Y') AS ida,
               DATE_FORMAT(d.fim_viagem, '%m/%Y') AS volta,
               c.valor_voo, c.valor_diaria
        FROM custo AS c
        JOIN destino AS d ON c.fk_destino = d.id
        WHERE c.fk_tipo_viagem = ${idTipoViagem}
        ORDER BY d.inicio_viagem;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarTipos,
    listarDestinos,
    listarCustos
};

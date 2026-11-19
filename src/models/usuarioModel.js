var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    // LEFT JOIN com destino: traz as cores e a fonte da skin escolhida.
    // Quem está na skin padrão (fk_skin vazio) volta com essas colunas vazias.
    var instrucaoSql = `
        SELECT u.id, u.nome, u.email, u.fk_tipo_viagem, u.fk_skin,
               d.cor_fundo, d.cor_botao, d.fonte
        FROM usuario AS u
        LEFT JOIN destino AS d ON u.fk_skin = d.id
        WHERE u.email = '${email}' AND u.senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function cadastrar(nome, email, senha, tipoViagem) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha);

    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, fk_tipo_viagem) VALUES ('${nome}', '${email}', '${senha}', ${tipoViagem});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function salvarTipoViagem(idUsuario, tipoViagem) {
    var instrucaoSql = `
        UPDATE usuario SET fk_tipo_viagem = ${tipoViagem} WHERE id = ${idUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Só troca a skin se o usuário tiver o carimbo daquele destino.
// EXISTS (...) é verdadeiro quando a consulta de dentro acha alguma linha.
// Sem carimbo, o WHERE dá falso e nenhuma linha muda (affectedRows = 0).
// Assim ninguém libera uma skin chamando a rota na mão, pelo F12.
function salvarSkin(idUsuario, idDestino) {
    var instrucaoSql = `
        UPDATE usuario SET fk_skin = ${idDestino}
        WHERE id = ${idUsuario}
          AND EXISTS (SELECT 1 FROM carimbo WHERE fk_usuario = ${idUsuario} AND fk_destino = ${idDestino});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Volta para a skin padrão: NULL quer dizer "nenhuma skin de destino"
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

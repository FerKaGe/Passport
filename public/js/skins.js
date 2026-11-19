/*
 * Skins do Passport: a lista, a troca, o bloqueio e o seletor da barra lateral.
 *
 * De onde vem cada coisa:
 *   - cores e fonte das 7 skins de destino: do BANCO (tabela destino),
 *     pela rota GET /carimbos/skins/:idUsuario;
 *   - se a skin está liberada: a mesma rota (coluna "liberada": 1 quando o
 *     usuário tem o carimbo do destino);
 *   - a skin padrão ("Passaporte"): não é um destino, então fica aqui
 *     (SKIN_PADRAO) e no :root de css/skins.css;
 *   - a skin escolhida: no banco (usuario.fk_skin, rota PUT /usuarios/skin)
 *     e uma cópia no localStorage, para a página já abrir com ela.
 *
 * Como a aparência muda: aplicarSkin() troca os valores das variáveis CSS
 * --cor-fundo, --cor-destaque e --fonte-texto direto na tag <html>.
 * Todo o CSS do site usa essas variáveis.
 */

// Nomes com que a skin escolhida fica guardada no localStorage do navegador
var CHAVE_SKIN_ID = "PASSPORT_SKIN_ID";
var CHAVE_SKIN_FUNDO = "PASSPORT_SKIN_FUNDO";
var CHAVE_SKIN_BOTAO = "PASSPORT_SKIN_BOTAO";
var CHAVE_SKIN_FONTE = "PASSPORT_SKIN_FONTE";

// A skin padrão: id 0, sempre liberada. Os mesmos valores do :root de css/skins.css.
var SKIN_PADRAO = { id: 0, nome: "Passaporte", corFundo: "#0B132B", corBotao: "#E0B04A", fonte: "VT323", liberada: true };

// Vetor de objetos com todas as skins. Começa só com a padrão;
// as 7 dos destinos chegam do banco (carregarSkins).
var skins = [SKIN_PADRAO];

// ---------------------------------------------------------------------------
// Aplicar e guardar
// ---------------------------------------------------------------------------

// Troca a aparência. document.documentElement é a tag <html>.
//   setProperty    - muda o valor de uma variável CSS só neste elemento
//   removeProperty - tira essa mudança: volta a valer o que está no CSS
// O atributo data-skin (com o id) serve para o ajuste fino de css/skins.css.
function aplicarSkin(skin) {
    var html = document.documentElement;

    html.setAttribute("data-skin", skin.id);

    if (skin.id == SKIN_PADRAO.id) {
        html.style.removeProperty("--cor-fundo");
        html.style.removeProperty("--cor-destaque");
        html.style.removeProperty("--fonte-texto");
    } else {
        html.style.setProperty("--cor-fundo", skin.corFundo);
        html.style.setProperty("--cor-destaque", skin.corBotao);
        html.style.setProperty("--fonte-texto", `"${skin.fonte}", sans-serif`);
    }
}

// Guarda no navegador a skin escolhida (o id e os três valores).
// Chamada no login (login.html) e quando o usuário troca de skin.
function guardarSkin(skin) {
    localStorage.setItem(CHAVE_SKIN_ID, skin.id);
    localStorage.setItem(CHAVE_SKIN_FUNDO, skin.corFundo);
    localStorage.setItem(CHAVE_SKIN_BOTAO, skin.corBotao);
    localStorage.setItem(CHAVE_SKIN_FONTE, skin.fonte);
}

// Lê a skin guardada no navegador. Sem nada guardado, devolve a padrão.
function lerSkinGuardada() {
    var id = localStorage.getItem(CHAVE_SKIN_ID);

    if (id == null || id == SKIN_PADRAO.id) {
        return SKIN_PADRAO;
    }

    return {
        id: Number(id),
        corFundo: localStorage.getItem(CHAVE_SKIN_FUNDO),
        corBotao: localStorage.getItem(CHAVE_SKIN_BOTAO),
        fonte: localStorage.getItem(CHAVE_SKIN_FONTE)
    };
}

// Procura no vetor a skin com esse id. Se não achar, devolve a padrão.
function buscarSkin(id) {
    for (var i = 0; i < skins.length; i++) {
        if (skins[i].id == id) {
            return skins[i];
        }
    }

    return SKIN_PADRAO;
}

// ---------------------------------------------------------------------------
// Seletor da barra lateral
// ---------------------------------------------------------------------------

// Escreve o seletor dentro do espaço reservado na barra lateral
// (<div id="div_seletor_skins">, criada pelo montarSidebar() de js/sidebar.js)
// e busca no banco quais skins o usuário tem.
// Também é chamada pelo jogo quando uma skin nova é liberada.
function montarSeletorDeSkins() {
    div_seletor_skins.innerHTML = `
        <div class="skins__atual">
            <span id="span_globo_atual" class="skins__globo" style="background-color: ${lerSkinGuardada().corBotao}">
                <img src="../jogo/img/interface/globo.png" alt="" />
            </span>
            <span id="span_skin_atual" class="glass-sidebar__label">Skins: carregando...</span>
        </div>
        <div id="div_lista_skins" class="skins__lista"></div>
        <p id="p_skin_aviso" class="skins__aviso glass-sidebar__label" aria-live="polite"></p>
        <button type="button" id="btn_skin_voltar" class="skins__padrao" onclick="trocarSkin(${SKIN_PADRAO.id})" hidden>
            Voltar para a padrão
        </button>
    `;

    carregarSkins();
}

function carregarSkins() {
    var idUsuario = sessionStorage.ID_USUARIO;

    // Sem login não há carimbos (o validarSessao() vai mandar para o login)
    if (idUsuario == undefined) {
        return;
    }

    fetch("/carimbos/skins/" + idUsuario)
        .then(function (resposta) {
            if (!resposta.ok) {
                throw "Erro " + resposta.status;
            }
            return resposta.json();
        })
        .then(function (lista) {
            // Recomeça o vetor com a padrão e acrescenta as 7 do banco
            skins = [SKIN_PADRAO];

            for (var i = 0; i < lista.length; i++) {
                skins.push({
                    id: lista[i].id,
                    nome: lista[i].pais,
                    corFundo: lista[i].cor_fundo,
                    corBotao: lista[i].cor_botao,
                    fonte: lista[i].fonte,
                    liberada: lista[i].liberada == 1
                });
            }

            escreverBotoes();
            conferirSkinAtual();
        })
        .catch(function (erro) {
            console.log("Não foi possível buscar as skins: ", erro);
            span_skin_atual.innerHTML = "Skins indisponíveis";
        });
}

// Um botão-globo por skin. O "mar" do globo é a cor do botão da skin.
function escreverBotoes() {
    var html = "";

    for (var i = 0; i < skins.length; i++) {
        var skin = skins[i];

        if (skin.liberada) {
            html += `
                <button type="button" id="btn_skin_${skin.id}" class="skins__botao"
                    style="background-color: ${skin.corBotao}"
                    aria-label="Skin ${skin.nome}" title="${skin.nome}"
                    onclick="trocarSkin(${skin.id})">
                    <img src="../jogo/img/interface/globo.png" alt="" />
                </button>
            `;
        } else {
            // Bloqueada: o globo fica cinza (CSS) e ganha um cadeado.
            // aria-disabled avisa o leitor de tela que o botão não funciona,
            // mas deixa ele no Tab: assim quem usa o teclado também descobre
            // como liberar a skin.
            html += `
                <button type="button" id="btn_skin_${skin.id}" class="skins__botao bloqueada"
                    style="background-color: ${skin.corBotao}"
                    aria-disabled="true"
                    aria-label="Skin ${skin.nome}: bloqueada. Ganhe o carimbo de ${skin.nome} no jogo."
                    title="${skin.nome}: ganhe o carimbo no jogo"
                    onclick="trocarSkin(${skin.id})">
                    <img src="../jogo/img/interface/globo.png" alt="" />
                    <img class="skins__cadeado" src="../jogo/img/interface/cadeado.png" alt="" />
                </button>
            `;
        }
    }

    div_lista_skins.innerHTML = html;
}

// Confere a skin guardada no navegador com o que veio do banco:
// se ela foi bloqueada (por exemplo, outro usuário entrou neste navegador),
// volta para a padrão. Se as cores mudaram no banco, usa as novas.
function conferirSkinAtual() {
    var atual = buscarSkin(lerSkinGuardada().id);

    if (!atual.liberada) {
        atual = SKIN_PADRAO;
    }

    aplicarSkin(atual);
    guardarSkin(atual);
    marcarSkinAtual();
}

// Chamada pelos botões do seletor (onclick)
function trocarSkin(id) {
    var skin = buscarSkin(id);

    // Skin bloqueada: só explica como liberar
    if (!skin.liberada) {
        p_skin_aviso.innerHTML = `Ganhe o carimbo de ${skin.nome} no jogo para liberar esta skin.`;
        return;
    }

    aplicarSkin(skin);
    guardarSkin(skin);
    salvarSkinNoBanco(skin.id);

    // Põe o foco no globo escolhido. Só faz diferença para quem clicou em
    // "Voltar para a padrão": esse botão vai sumir logo abaixo e, sem isto,
    // quem usa o teclado ficaria sem saber onde está.
    document.getElementById("btn_skin_" + skin.id).focus();

    p_skin_aviso.innerHTML = "";
    marcarSkinAtual();

    // A Dashboard redesenha o gráfico com as cores novas. Nas outras páginas
    // a função não existe: typeof devolve "undefined" e nada acontece.
    if (typeof aoTrocarSkin == "function") {
        aoTrocarSkin();
    }
}

// Grava a escolha no banco, para ela voltar no próximo login.
// O banco confere de novo se o usuário tem o carimbo (usuarioModel.salvarSkin).
function salvarSkinNoBanco(idDestino) {
    fetch("/usuarios/skin/" + sessionStorage.ID_USUARIO, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idDestinoServer: idDestino })
    }).catch(function (erro) {
        console.log("Não foi possível salvar a skin no banco: ", erro);
    });
}

// Atualiza o seletor para mostrar qual skin está em uso, sem reescrever os
// botões (reescrever apagaria o botão que está com o foco do teclado).
function marcarSkinAtual() {
    var atual = buscarSkin(lerSkinGuardada().id);

    span_skin_atual.innerHTML = "Skin: " + atual.nome;
    span_globo_atual.style.backgroundColor = atual.corBotao;

    // aria-pressed diz aos leitores de tela qual botão está escolhido;
    // o CSS usa o mesmo atributo para desenhar o anel em volta do globo.
    for (var i = 0; i < skins.length; i++) {
        var botao = document.getElementById("btn_skin_" + skins[i].id);

        if (skins[i].id == atual.id) {
            botao.setAttribute("aria-pressed", "true");
        } else {
            botao.setAttribute("aria-pressed", "false");
        }
    }

    // "Voltar para a padrão" só aparece quando a skin atual não é a padrão.
    btn_skin_voltar.hidden = (atual.id == SKIN_PADRAO.id);
}

// Esta linha fica fora de qualquer função: roda assim que o arquivo é lido,
// ainda no <head>, antes de a página aparecer. Por isso a página já abre
// com a skin guardada, sem "piscar" na skin padrão enquanto espera o banco.
aplicarSkin(lerSkinGuardada());

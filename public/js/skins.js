var CHAVE_SKIN_ID = "PASSPORT_SKIN_ID";
var CHAVE_SKIN_FUNDO = "PASSPORT_SKIN_FUNDO";
var CHAVE_SKIN_BOTAO = "PASSPORT_SKIN_BOTAO";
var CHAVE_SKIN_FONTE = "PASSPORT_SKIN_FONTE";

var SKIN_PADRAO = { id: 0, nome: "Passaporte", corFundo: "#0B132B", corBotao: "#E0B04A", fonte: "VT323", liberada: true };

var skins = [SKIN_PADRAO];

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

function guardarSkin(skin) {
    localStorage.setItem(CHAVE_SKIN_ID, skin.id);
    localStorage.setItem(CHAVE_SKIN_FUNDO, skin.corFundo);
    localStorage.setItem(CHAVE_SKIN_BOTAO, skin.corBotao);
    localStorage.setItem(CHAVE_SKIN_FONTE, skin.fonte);
}

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

function buscarSkin(id) {
    for (var i = 0; i < skins.length; i++) {
        if (skins[i].id == id) {
            return skins[i];
        }
    }

    return SKIN_PADRAO;
}

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

function conferirSkinAtual() {
    var atual = buscarSkin(lerSkinGuardada().id);

    if (!atual.liberada) {
        atual = SKIN_PADRAO;
    }

    aplicarSkin(atual);
    guardarSkin(atual);
    marcarSkinAtual();
}

function trocarSkin(id) {
    var skin = buscarSkin(id);

    if (!skin.liberada) {
        p_skin_aviso.innerHTML = `Ganhe o carimbo de ${skin.nome} no jogo para liberar esta skin.`;
        return;
    }

    aplicarSkin(skin);
    guardarSkin(skin);
    salvarSkinNoBanco(skin.id);

    document.getElementById("btn_skin_" + skin.id).focus();

    p_skin_aviso.innerHTML = "";
    marcarSkinAtual();

    if (typeof aoTrocarSkin == "function") {
        aoTrocarSkin();
    }
}

function salvarSkinNoBanco(idDestino) {
    fetch("/usuarios/skin/" + sessionStorage.ID_USUARIO, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idDestinoServer: idDestino })
    }).catch(function (erro) {
        console.log("Não foi possível salvar a skin no banco: ", erro);
    });
}

function marcarSkinAtual() {
    var atual = buscarSkin(lerSkinGuardada().id);

    span_skin_atual.innerHTML = "Skin: " + atual.nome;
    span_globo_atual.style.backgroundColor = atual.corBotao;

    for (var i = 0; i < skins.length; i++) {
        var botao = document.getElementById("btn_skin_" + skins[i].id);

        if (skins[i].id == atual.id) {
            botao.setAttribute("aria-pressed", "true");
        } else {
            botao.setAttribute("aria-pressed", "false");
        }
    }

    btn_skin_voltar.hidden = (atual.id == SKIN_PADRAO.id);
}

aplicarSkin(lerSkinGuardada());

/*
 * Skins do Passport: a lista, a troca e o seletor da barra lateral.
 *
 * As cores e fontes de cada skin estão em css/skins.css. Este arquivo:
 *   1. guarda a lista de skins num vetor de objetos;
 *   2. coloca o atributo data-skin na tag <html> (é isso que troca a aparência);
 *   3. lembra a skin escolhida no localStorage;
 *   4. escreve os botões do seletor dentro da barra lateral.
 *
 * Por enquanto todas as skins estão liberadas. Na próxima etapa, cada skin
 * será liberada pelo carimbo do destino dela, e a escolha vai para o banco
 * (plano em docs/refatoracao/03-imagens-e-skins.md).
 */

// Nome com que a escolha fica guardada no localStorage do navegador
var CHAVE_DA_SKIN = "PASSPORT_SKIN";

// Vetor de objetos: cada objeto é uma skin.
//   id        - valor do atributo data-skin (igual ao seletor em css/skins.css)
//   nome      - nome que aparece para o usuário
//   idDestino - destino cujo carimbo vai liberar a skin (0 = sempre liberada).
//               É o mesmo idDestino do vetor fases (js/fases.js).
//   corFundo, corBotao, fonte - os campos cor_fundo, cor_botao e fonte da
//               tabela destino. Precisam ser iguais aos valores de css/skins.css.
var skins = [
    { id: "padrao",     nome: "Passaporte", idDestino: 0, corFundo: "#0B132B", corBotao: "#E0B04A", fonte: "VT323" },
    { id: "atacama",    nome: "Atacama",    idDestino: 1, corFundo: "#2B1A12", corBotao: "#E76F51", fonte: "Jersey 20" },
    { id: "mendoza",    nome: "Mendoza",    idDestino: 2, corFundo: "#2A0C1B", corBotao: "#74ACDF", fonte: "Jersey 15" },
    { id: "espanha",    nome: "Espanha",    idDestino: 3, corFundo: "#2A0A0A", corBotao: "#F1BF00", fonte: "Silkscreen" },
    { id: "portugal",   nome: "Portugal",   idDestino: 4, corFundo: "#0A1F3D", corBotao: "#6FB1E8", fonte: "Jersey 10" },
    { id: "gibraltar",  nome: "Gibraltar",  idDestino: 5, corFundo: "#1C1F26", corBotao: "#F25C5C", fonte: "Handjet" },
    { id: "mocambique", nome: "Moçambique", idDestino: 6, corFundo: "#06282B", corBotao: "#1CC5B7", fonte: "Pixelify Sans" },
    { id: "orlando",    nome: "Orlando",    idDestino: 7, corFundo: "#120B3A", corBotao: "#FF7AB6", fonte: "Jersey 25" }
];

// Procura no vetor a skin com esse id e devolve o objeto dela.
// Se não achar (id errado ou vazio), devolve a primeira: a padrão.
function buscarSkin(id) {
    for (var i = 0; i < skins.length; i++) {
        if (skins[i].id == id) {
            return skins[i];
        }
    }

    return skins[0];
}

// Devolve o id da skin que está guardada neste navegador.
// Passar pelo buscarSkin() garante que o valor guardado ainda existe na lista.
function lerSkinSalva() {
    var idSalvo = localStorage.getItem(CHAVE_DA_SKIN);

    return buscarSkin(idSalvo).id;
}

// Troca a aparência: coloca o atributo data-skin na tag <html>.
// document.documentElement é a tag <html>. A partir daqui, o seletor
// [data-skin="..."] de css/skins.css passa a valer e as variáveis mudam.
function aplicarSkin(id) {
    document.documentElement.setAttribute("data-skin", id);
}

// Chamada pelos botões do seletor (onclick)
function trocarSkin(id) {
    var skin = buscarSkin(id);

    aplicarSkin(skin.id);
    localStorage.setItem(CHAVE_DA_SKIN, skin.id);

    // Põe o foco no globo da skin escolhida. Só faz diferença para quem
    // clicou em "Voltar para a padrão": esse botão vai sumir logo abaixo e,
    // sem isto, quem usa o teclado ficaria sem saber onde está.
    document.getElementById("btn_skin_" + skin.id).focus();

    marcarSkinAtual();
}

// Escreve o seletor dentro do espaço reservado na barra lateral
// (<div id="div_seletor_skins">, criada pelo montarSidebar() de js/sidebar.js).
// Roda uma vez por página; depois disso, quem atualiza é o marcarSkinAtual().
function montarSeletorDeSkins() {
    var html = "";

    // Linha que aparece com a barra fechada: o globo e o nome da skin atual
    html += `
        <div class="skins__atual">
            <span id="span_globo_atual" class="skins__globo">
                <img src="../jogo/img/interface/globo.png" alt="" />
            </span>
            <span id="span_skin_atual" class="glass-sidebar__label"></span>
        </div>
    `;

    // Um botão-globo por skin. O "mar" do globo é a cor do botão da skin.
    html += `<div class="skins__lista">`;

    for (var i = 0; i < skins.length; i++) {
        var skin = skins[i];

        html += `
            <button type="button" id="btn_skin_${skin.id}" class="skins__botao"
                style="background-color: ${skin.corBotao}"
                aria-label="Skin ${skin.nome}" title="${skin.nome}"
                onclick="trocarSkin('${skin.id}')">
                <img src="../jogo/img/interface/globo.png" alt="" />
            </button>
        `;
    }

    html += `</div>`;

    // Atalho para desfazer a escolha (skins[0] é a skin padrão)
    html += `
        <button type="button" id="btn_skin_voltar" class="skins__padrao" onclick="trocarSkin('${skins[0].id}')">
            Voltar para a padrão
        </button>
    `;

    div_seletor_skins.innerHTML = html;

    marcarSkinAtual();
}

// Atualiza o seletor para mostrar qual skin está em uso, sem reescrever os
// botões (reescrever apagaria o botão que está com o foco do teclado).
function marcarSkinAtual() {
    var atual = buscarSkin(lerSkinSalva());

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

    // "Voltar para a padrão" só faz sentido quando a skin atual não é a padrão.
    // hidden = true esconde o elemento, como display: none.
    btn_skin_voltar.hidden = (atual.id == skins[0].id);
}

// Esta linha fica fora de qualquer função: roda assim que o arquivo é lido,
// ainda no <head>, antes de a página aparecer. Por isso a página já abre
// com a skin certa, sem "piscar" na skin padrão.
aplicarSkin(lerSkinSalva());

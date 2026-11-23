var PASTA_ICONES = "../jogo/img/interface/";

var itensDaSidebar = [
    { id: "dashboard",   nome: "Dashboard",   icone: "icone-globo.png",      link: "../dashboard/dashboard.html" },
    { id: "calculadora", nome: "Calculadora", icone: "icone-mala.png",       link: "../dashboard/calculadora.html" },
    { id: "jogo",        nome: "Jogo",        icone: "icone-aviao.png",      link: "../jogo/inicio.html" },
    { id: "sobre",       nome: "Sobre mim",   icone: "icone-passaporte.png", link: "../dashboard/sobre.html" }
];

function montarSidebar(paginaAtual) {
    var html = "";

    html += `
        <a href="../dashboard/dashboard.html" class="glass-sidebar__brand">
            <img class="glass-sidebar__icon" src="${PASTA_ICONES}favicon.png" alt="" />
            <span class="glass-sidebar__label">Passport</span>
        </a>
        <div class="glass-sidebar__usuario glass-sidebar__label">
            Olá, <b id="b_usuario">viajante</b>!
        </div>
    `;

    html += `<nav class="glass-sidebar__nav" aria-label="Menu principal">`;

    for (var i = 0; i < itensDaSidebar.length; i++) {
        var item = itensDaSidebar[i];

        var classes = "glass-sidebar__item";
        if (item.id == paginaAtual) {
            classes += " is-active";
        }

        html += `
            <a href="${item.link}" class="${classes}" title="${item.nome}">
                <img class="glass-sidebar__icon" src="${PASTA_ICONES}${item.icone}" alt="" />
                <span class="glass-sidebar__label">${item.nome}</span>
            </a>
        `;
    }

    html += `</nav>`;

    html += `
        <div class="glass-sidebar__bottom">

            <div id="div_seletor_skins" class="glass-sidebar__skins"></div>

            <button type="button" class="glass-sidebar__item is-danger" onclick="limparSessao()" title="Sair">
                <img class="glass-sidebar__icon" src="${PASTA_ICONES}icone-portao.png" alt="" />
                <span class="glass-sidebar__label">Sair</span>
            </button>
        </div>
    `;

    barra_lateral.innerHTML = html;

    montarSeletorDeSkins();
}

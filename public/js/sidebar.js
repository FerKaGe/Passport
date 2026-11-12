/*
 * Sidebar das páginas logadas.
 * O desenho da barra (css/sidebar.css) e a estrutura do menu foram adaptados
 * da Glass Sidebar, de Igor Fuchs Pereira (licença MIT).
 * Copyright (c) 2026 Igor Fuchs Pereira
 * Licença completa: docs/licencas/glass-sidebar-LICENSE.txt
 *
 * Por que este arquivo existe: a barra é igual em todas as páginas logadas.
 * Em vez de copiar o mesmo HTML em cada uma, a página só tem um <aside> vazio
 * e chama montarSidebar(), que escreve o menu lá dentro.
 */

// Vetor de objetos: cada objeto é um item do menu.
// Para criar uma página nova no menu, basta acrescentar uma linha aqui.
// Os links começam com "../" porque toda página logada fica uma pasta abaixo
// de public/ (em public/dashboard/ ou em public/jogo/).
var itensDaSidebar = [
    { id: "dashboard",   nome: "Dashboard",   icone: "📊", link: "../dashboard/dashboard.html" },
    { id: "calculadora", nome: "Calculadora", icone: "🧮", link: "../dashboard/calculadora.html" },
    { id: "jogo",        nome: "Jogo",        icone: "🏃", link: "../jogo/inicio.html" },
    { id: "sobre",       nome: "Sobre mim",   icone: "🙋", link: "../dashboard/sobre.html" }
];

// Escreve a barra dentro do <aside id="barra_lateral">.
// paginaAtual é o id do item que deve aparecer marcado (por exemplo "jogo").
function montarSidebar(paginaAtual) {
    var html = "";

    // Topo: nome do site e saudação.
    // O <b id="b_usuario"> é preenchido pelo validarSessao() do sessao.js,
    // por isso montarSidebar() precisa ser chamada ANTES de validarSessao().
    html += `
        <a href="../dashboard/dashboard.html" class="glass-sidebar__brand">
            <span class="glass-sidebar__icon" aria-hidden="true">🛂</span>
            <span class="glass-sidebar__label">Passport</span>
        </a>
        <div class="glass-sidebar__usuario glass-sidebar__label">
            Olá, <b id="b_usuario">viajante</b>!
        </div>
    `;

    // Menu: um link para cada objeto do vetor
    html += `<nav class="glass-sidebar__nav" aria-label="Menu principal">`;

    for (var i = 0; i < itensDaSidebar.length; i++) {
        var item = itensDaSidebar[i];

        // O item da página em que estamos ganha a classe is-active (fica destacado)
        var classes = "glass-sidebar__item";
        if (item.id == paginaAtual) {
            classes += " is-active";
        }

        html += `
            <a href="${item.link}" class="${classes}" title="${item.nome}">
                <span class="glass-sidebar__icon" aria-hidden="true">${item.icone}</span>
                <span class="glass-sidebar__label">${item.nome}</span>
            </a>
        `;
    }

    html += `</nav>`;

    // Parte de baixo: espaço do seletor de skins e botão de sair
    html += `
        <div class="glass-sidebar__bottom">

            <!-- ESPAÇO DO SELETOR DE SKINS (ainda não implementado).
                 Na próxima etapa, os botões das skins liberadas pelos carimbos
                 do jogo vão ser escritos dentro desta div. -->
            <div id="div_seletor_skins" class="glass-sidebar__skins" title="Skins (em breve)">
                <span class="glass-sidebar__icon" aria-hidden="true">🎨</span>
                <span class="glass-sidebar__label">Skins: em breve</span>
            </div>

            <button type="button" class="glass-sidebar__item is-danger" onclick="limparSessao()" title="Sair">
                <span class="glass-sidebar__icon" aria-hidden="true">⏻</span>
                <span class="glass-sidebar__label">Sair</span>
            </button>
        </div>
    `;

    barra_lateral.innerHTML = html;
}

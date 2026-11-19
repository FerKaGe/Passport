/*
 * Dashboard do Passport: quanto custaria fazer as minhas viagens hoje,
 * saindo de São Paulo, para cada tipo de viagem e número de dias.
 *
 * Dados que vêm da API:
 *   GET /viagens/tipos               - os 3 tipos de viagem (para o filtro)
 *   GET /viagens/custos/:idTipo      - os 7 destinos com voo e diária do tipo
 *   GET /carimbos/skins/:idUsuario   - quais destinos o usuário já carimbou
 *   PUT /usuarios/tipo/:idUsuario    - salva o tipo escolhido no filtro
 *
 * As contas usam as funções de js/custos.js.
 */

var destinos = [];      // os 7 destinos do tipo de viagem escolhido (vêm da API)
var grafico = null;     // o gráfico do Chart.js, guardado para poder ser redesenhado

// Chamada pelo onload da página
function carregarDashboard() {
    carregarTiposDeViagem();
    carregarCarimbos();
}

// ---------------------------------------------------------------------------
// Buscar os dados
// ---------------------------------------------------------------------------

function carregarTiposDeViagem() {
    fetch("/viagens/tipos")
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (tipos) {
            // O filtro começa no tipo preferido do usuário (guardado no login)
            var tipoPreferido = Number(sessionStorage.TIPO_VIAGEM_USUARIO);
            var html = "";

            for (var i = 0; i < tipos.length; i++) {
                if (tipos[i].id == tipoPreferido) {
                    html += `<option value="${tipos[i].id}" selected>${tipos[i].nome}</option>`;
                } else {
                    html += `<option value="${tipos[i].id}">${tipos[i].nome}</option>`;
                }
            }

            select_tipo.innerHTML = html;
            carregarCustos(select_tipo.value);
        })
        .catch(function (erro) {
            mostrarAviso("Não foi possível buscar os dados no banco. O servidor está ligado?");
            console.log(erro);
        });
}

function carregarCustos(idTipoViagem) {
    fetch("/viagens/custos/" + idTipoViagem)
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (resultado) {
            destinos = resultado;
            mostrarDados();
        })
        .catch(function (erro) {
            mostrarAviso("Não foi possível buscar os custos no banco.");
            console.log(erro);
        });
}

// Conta quantos destinos têm carimbo e pinta os quadradinhos do indicador
function carregarCarimbos() {
    fetch("/carimbos/skins/" + sessionStorage.ID_USUARIO)
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (lista) {
            var quantos = 0;
            var quadradinhos = "";

            for (var i = 0; i < lista.length; i++) {
                if (lista[i].liberada == 1) {
                    quantos++;
                    quadradinhos += `<span class="selo-mini cheio" title="${lista[i].pais}"></span>`;
                } else {
                    quadradinhos += `<span class="selo-mini" title="${lista[i].pais}"></span>`;
                }
            }

            span_kpi_carimbos.innerHTML = quantos + " de " + lista.length;
            div_kpi_selos.innerHTML = quadradinhos;
        })
        .catch(function (erro) {
            span_kpi_carimbos.innerHTML = "?";
            console.log(erro);
        });
}

// ---------------------------------------------------------------------------
// Filtros
// ---------------------------------------------------------------------------

// Chamada quando o usuário troca o tipo de viagem (onchange do <select>)
function trocarTipo() {
    var idTipoViagem = select_tipo.value;

    // Guarda a escolha: na sessão (para as outras telas) e no banco (para o próximo login)
    sessionStorage.TIPO_VIAGEM_USUARIO = idTipoViagem;

    fetch("/usuarios/tipo/" + sessionStorage.ID_USUARIO, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipoViagemServer: idTipoViagem })
    }).catch(function (erro) {
        console.log("Não foi possível salvar o tipo de viagem: ", erro);
    });

    carregarCustos(idTipoViagem);
}

// Devolve o número de dias escolhido nos botões 7, 15 e 30.
// Os três são <input type="radio"> com o mesmo name: só um fica marcado.
function lerDias() {
    var opcoes = document.getElementsByName("dias");

    for (var i = 0; i < opcoes.length; i++) {
        if (opcoes[i].checked) {
            return Number(opcoes[i].value);
        }
    }

    return 7;
}

// ---------------------------------------------------------------------------
// Mostrar: indicadores, gráfico e tabela
// ---------------------------------------------------------------------------

// Chamada quando os custos chegam e quando os dias mudam (onchange dos botões)
function mostrarDados() {
    if (destinos.length == 0) {
        return;
    }

    var dias = lerDias();

    // Vetores para o gráfico: um valor por destino, na mesma ordem
    var nomes = [];
    var voos = [];
    var hospedagens = [];

    // Para achar o mais barato: começa supondo que é o primeiro e,
    // a cada destino, troca se encontrar um menor.
    var indiceMaisBarato = 0;
    var menorCusto = calcularCustoPorPessoa(destinos[0].valor_voo, destinos[0].valor_diaria, dias);
    var indiceVooMaisBarato = 0;

    var linhasDaTabela = "";

    for (var i = 0; i < destinos.length; i++) {
        var destino = destinos[i];
        var hospedagem = Number(destino.valor_diaria) * dias;
        var porPessoa = calcularCustoPorPessoa(destino.valor_voo, destino.valor_diaria, dias);
        var naMoedaLocal = converterParaMoedaLocal(porPessoa, destino.cotacao_real);

        // Viagem que começou e terminou no mesmo mês aparece só com um mês
        var quando = destino.ida;
        if (destino.volta != destino.ida) {
            quando += " a " + destino.volta;
        }

        nomes.push(destino.pais);
        voos.push(Number(destino.valor_voo));
        hospedagens.push(hospedagem);

        if (porPessoa < menorCusto) {
            menorCusto = porPessoa;
            indiceMaisBarato = i;
        }

        if (Number(destino.valor_voo) < Number(destinos[indiceVooMaisBarato].valor_voo)) {
            indiceVooMaisBarato = i;
        }

        linhasDaTabela += `
            <tr>
                <th scope="row">${destino.pais}<small>${destino.cidades}</small></th>
                <td>${quando}</td>
                <td>${destino.melhor_epoca}</td>
                <td class="numero">${formatarDinheiro(Number(destino.valor_voo), "BRL")}</td>
                <td class="numero">${formatarDinheiro(hospedagem, "BRL")}</td>
                <td class="numero"><b>${formatarDinheiro(porPessoa, "BRL")}</b></td>
                <td class="numero">${formatarDinheiro(naMoedaLocal, destino.moeda)}</td>
            </tr>
        `;
    }

    // Indicadores (KPIs)
    var maisBarato = destinos[indiceMaisBarato];
    var vooMaisBarato = destinos[indiceVooMaisBarato];

    b_kpi_barato.innerHTML = maisBarato.pais;
    span_kpi_barato.innerHTML = formatarDinheiro(menorCusto, "BRL") + " por pessoa";

    b_kpi_voo.innerHTML = vooMaisBarato.pais;
    span_kpi_voo.innerHTML = formatarDinheiro(Number(vooMaisBarato.valor_voo), "BRL") + " ida e volta";

    b_kpi_epoca.innerHTML = maisBarato.melhor_epoca;
    span_kpi_epoca.innerHTML = "para ir a " + maisBarato.pais;

    // Tabela e títulos
    th_hospedagem.innerHTML = "Hospedagem (" + dias + " dias)";
    tbody_destinos.innerHTML = linhasDaTabela;
    h2_grafico.innerHTML = "Custo por pessoa em " + dias + " dias";

    desenharGrafico(nomes, voos, hospedagens, dias);
    mostrarAviso("");
}

// Lê o valor atual de uma variável CSS (as cores e a fonte da skin)
function lerVariavelCss(nome) {
    return getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
}

// Desenha o gráfico de barras deitadas e empilhadas: em cada destino,
// a primeira parte da barra é o voo e a segunda é a hospedagem.
function desenharGrafico(nomes, voos, hospedagens, dias) {
    // Se já existe um gráfico, apaga antes de desenhar o novo
    if (grafico != null) {
        grafico.destroy();
    }

    // As cores vêm da skin: trocou a skin, o gráfico acompanha (aoTrocarSkin, abaixo)
    var corTexto = lerVariavelCss("--cor-texto");
    var corGrade = lerVariavelCss("--cor-borda");

    Chart.defaults.font.family = lerVariavelCss("--fonte-texto");
    Chart.defaults.font.size = 16;
    Chart.defaults.color = corTexto;

    grafico = new Chart(canvas_custos, {
        type: "bar",
        data: {
            labels: nomes,
            datasets: [
                { label: "Voo (ida e volta)", data: voos, backgroundColor: lerVariavelCss("--cor-destaque") },
                { label: "Hospedagem (" + dias + " dias)", data: hospedagens, backgroundColor: lerVariavelCss("--cor-texto-apagado") }
            ]
        },
        options: {
            indexAxis: "y",              // barras deitadas: os destinos ficam no eixo vertical
            responsive: true,
            maintainAspectRatio: false,  // a altura vem do CSS (.area-grafico)
            scales: {
                x: {
                    stacked: true,       // empilhadas: voo e hospedagem na mesma barra
                    grid: { color: corGrade },
                    ticks: {
                        callback: function (valor) {
                            return formatarDinheiro(valor, "BRL");
                        }
                    }
                },
                y: {
                    stacked: true,
                    grid: { color: corGrade }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        // Texto que aparece ao passar o mouse numa parte da barra
                        label: function (contexto) {
                            return contexto.dataset.label + ": " + formatarDinheiro(contexto.parsed.x, "BRL");
                        }
                    }
                }
            }
        }
    });
}

// Chamada pelo seletor de skins (js/skins.js) depois de trocar a skin:
// redesenha o gráfico com as cores novas.
function aoTrocarSkin() {
    mostrarDados();
}

function mostrarAviso(texto) {
    p_aviso.innerHTML = texto;
}

/*
 * Sobre mim: os números das viagens e o mapa dos carimbos.
 *
 * Dados que vêm da API:
 *   GET /viagens/destinos            - as viagens (para os números)
 *   GET /carimbos/skins/:idUsuario   - quais destinos quem está logado já carimbou
 *
 * As imagens dos carimbos vêm do vetor fases (js/fases.js), pelo buscarFase().
 */

// Chamada pelo onload da página
function carregarSobre() {
    carregarNumeros();
    carregarMapaDeCarimbos();
}

// Conta as viagens e acha o ano da primeira e o da última.
// Os números mudam sozinhos se um destino novo entrar no banco.
function carregarNumeros() {
    fetch("/viagens/destinos")
        .then(function (resposta) {
            if (!resposta.ok) {
                throw "Erro " + resposta.status;
            }
            return resposta.json();
        })
        .then(function (destinos) {
            if (destinos.length == 0) {
                return;
            }

            // Começa supondo que a primeira viagem da lista é a mais antiga
            // e também a mais recente; o laço corrige os dois.
            var primeiroAno = destinos[0].ano;
            var ultimoAno = destinos[0].ano;

            for (var i = 0; i < destinos.length; i++) {
                if (destinos[i].ano < primeiroAno) {
                    primeiroAno = destinos[i].ano;
                }
                if (destinos[i].ano > ultimoAno) {
                    ultimoAno = destinos[i].ano;
                }
            }

            b_paises.innerHTML = destinos.length;
            b_primeiro_ano.innerHTML = primeiroAno;
            b_ultimo_ano.innerHTML = ultimoAno;
        })
        .catch(function (erro) {
            console.log("Erro ao buscar as viagens: ", erro);
        });
}

// Escreve os 7 carimbos: coloridos os que quem está logado já ganhou no
// jogo, apagados os que faltam.
function carregarMapaDeCarimbos() {
    fetch("/carimbos/skins/" + sessionStorage.ID_USUARIO)
        .then(function (resposta) {
            if (!resposta.ok) {
                throw "Erro " + resposta.status;
            }
            return resposta.json();
        })
        .then(function (lista) {
            var html = "";
            var ganhos = 0;

            for (var i = 0; i < lista.length; i++) {
                var fase = buscarFase(lista[i].id);
                var imagem = "";
                if (fase != null) {
                    imagem = fase.carimbo;
                }

                if (lista[i].liberada == 1) {
                    ganhos++;
                    html += `
                        <li class="carimbo-do-mapa">
                            <img src="${imagem}" alt="" />
                            <span>${lista[i].pais}</span>
                        </li>
                    `;
                } else {
                    html += `
                        <li class="carimbo-do-mapa falta">
                            <img src="${imagem}" alt="" />
                            <span>${lista[i].pais}: falta</span>
                        </li>
                    `;
                }
            }

            ul_mapa_carimbos.innerHTML = html;
            span_carimbos_ganhos.innerHTML = ganhos + " de " + lista.length;
        })
        .catch(function (erro) {
            console.log("Erro ao buscar os carimbos: ", erro);
            span_carimbos_ganhos.innerHTML = "?";
        });
}

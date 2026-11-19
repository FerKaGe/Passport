/*
 * Home: a linha do tempo das viagens.
 *
 * As viagens vêm do banco pela rota pública GET /viagens/destinos
 * (país, cidades e datas; sem preços). As imagens do carimbo e do
 * cartão-postal de cada destino vêm do vetor fases (js/fases.js),
 * ligadas pelo id do destino (buscarFase, em js/fases.js).
 */

// Chamada pelo onload da página
function carregarLinhaDoTempo() {
    fetch("/viagens/destinos")
        .then(function (resposta) {
            if (!resposta.ok) {
                throw "Erro " + resposta.status;
            }
            return resposta.json();
        })
        .then(function (destinos) {
            var html = "";

            for (var i = 0; i < destinos.length; i++) {
                var destino = destinos[i];
                var fase = buscarFase(destino.id);

                // Viagem que começou e terminou no mesmo mês aparece só com um mês
                var quando = destino.ida;
                if (destino.volta != destino.ida) {
                    quando += " a " + destino.volta;
                }

                // Imagens só se o destino tiver uma fase no jogo
                var carimbo = "";
                var cartao = "";
                if (fase != null) {
                    carimbo = `<img class="viagem-carimbo" src="${fase.carimbo}" alt="" />`;
                    cartao = `<img class="viagem-cartao" src="${fase.cartao}" alt="Cartão-postal de ${fase.nome}" />`;
                }

                html += `
                    <li class="viagem">
                        ${carimbo}
                        <div class="viagem-texto">
                            <span class="viagem-data">${quando}</span>
                            <h3>${destino.pais}</h3>
                            <p>${destino.cidades}</p>
                        </div>
                        ${cartao}
                    </li>
                `;
            }

            ol_linha_do_tempo.innerHTML = html;
        })
        .catch(function (erro) {
            console.log("Erro ao buscar as viagens: ", erro);
            ol_linha_do_tempo.innerHTML = `<li class="aviso">Não foi possível carregar as viagens. O servidor está ligado?</li>`;
        });
}

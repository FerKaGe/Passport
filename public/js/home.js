/*
 * Home: os cartões dos países.
 *
 * As viagens vêm do banco pela rota pública GET /viagens/destinos
 * (país, cidades e datas; sem preços). A bandeira de cada destino vem do
 * vetor fases (js/fases.js), ligada pelo id do destino (buscarFase).
 */

// Os meses abreviados, na ordem: a posição 0 é janeiro.
var MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

// Transforma "11/2016" em "nov/2016".
// split("/") quebra o texto na barra: "11/2016" vira ["11", "2016"].
// O mês 11 fica na posição 10 do vetor MESES, por isso o "- 1".
function nomeDoMes(mesAno) {
    var partes = mesAno.split("/");
    var mes = Number(partes[0]);

    return MESES[mes - 1];
}

function anoDe(mesAno) {
    return mesAno.split("/")[1];
}

// Escreve o período da viagem do jeito mais curto:
//   mesmo mês            "07/2024" e "07/2024" -> "jul/2024"
//   mesmo ano            "06/2024" e "07/2024" -> "jun a jul/2024"
//   anos diferentes      "11/2016" e "02/2017" -> "nov/2016 a fev/2017"
function formatarPeriodo(ida, volta) {
    if (ida == volta) {
        return nomeDoMes(ida) + "/" + anoDe(ida);
    }

    if (anoDe(ida) == anoDe(volta)) {
        return nomeDoMes(ida) + " a " + nomeDoMes(volta) + "/" + anoDe(volta);
    }

    return nomeDoMes(ida) + "/" + anoDe(ida) + " a " + nomeDoMes(volta) + "/" + anoDe(volta);
}

// Chamada pelo onload da página
function carregarPaises() {
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

                var bandeira = "";
                if (fase != null) {
                    bandeira = `<img src="${fase.bandeira}" alt="" />`;
                }

                // Cada cartão é um link para a viagem no Sobre mim:
                // "#viagem-1" faz a página descer até o elemento com id="viagem-1".
                html += `
                    <li>
                        <a class="pais" href="dashboard/sobre.html#viagem-${destino.id}">
                            ${bandeira}
                            <span class="pais-nome">${destino.pais}</span>
                            <span class="pais-lugares">${destino.cidades}</span>
                            <span class="pais-periodo">${formatarPeriodo(destino.ida, destino.volta)}</span>
                        </a>
                    </li>
                `;
            }

            ul_paises.innerHTML = html;
        })
        .catch(function (erro) {
            console.log("Erro ao buscar os países: ", erro);
            ul_paises.innerHTML = `<li class="aviso">Não foi possível carregar os países. O servidor está ligado?</li>`;
        });
}

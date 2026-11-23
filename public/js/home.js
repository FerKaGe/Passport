var MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function nomeDoMes(mesAno) {
    var partes = mesAno.split("/");
    var mes = Number(partes[0]);

    return MESES[mes - 1];
}

function anoDe(mesAno) {
    return mesAno.split("/")[1];
}

function formatarPeriodo(ida, volta) {
    if (ida == volta) {
        return nomeDoMes(ida) + "/" + anoDe(ida);
    }

    if (anoDe(ida) == anoDe(volta)) {
        return nomeDoMes(ida) + " a " + nomeDoMes(volta) + "/" + anoDe(volta);
    }

    return nomeDoMes(ida) + "/" + anoDe(ida) + " a " + nomeDoMes(volta) + "/" + anoDe(volta);
}

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

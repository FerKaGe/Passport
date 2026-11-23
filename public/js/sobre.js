function carregarSobre() {
    carregarNumeros();
    carregarMapaDeCarimbos();
}

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

var DIAS_MINIMO = 1;
var DIAS_MAXIMO = 90;
var PESSOAS_MINIMO = 1;
var PESSOAS_MAXIMO = 10;

var custos = [];

function carregarCalculadora() {
    fetch("/viagens/tipos")
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (tipos) {
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
            carregarCustos();
        })
        .catch(function (erro) {
            mostrarMensagem("Não foi possível buscar os dados no banco. O servidor está ligado?");
            console.log(erro);
        });
}

function carregarCustos() {
    var destinoEscolhido = select_destino.value;

    fetch("/viagens/custos/" + select_tipo.value)
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (resultado) {
            custos = resultado;

            var html = `<option value="">Escolha um destino</option>`;

            for (var i = 0; i < custos.length; i++) {
                if (custos[i].id == destinoEscolhido) {
                    html += `<option value="${custos[i].id}" selected>${custos[i].pais}</option>`;
                } else {
                    html += `<option value="${custos[i].id}">${custos[i].pais}</option>`;
                }
            }

            select_destino.innerHTML = html;

            div_recibo.innerHTML = "";
        })
        .catch(function (erro) {
            mostrarMensagem("Não foi possível buscar os custos no banco.");
            console.log(erro);
        });
}

function buscarDestino(idDestino) {
    for (var i = 0; i < custos.length; i++) {
        if (custos[i].id == idDestino) {
            return custos[i];
        }
    }

    return null;
}

function ehInteiroEntre(texto, minimo, maximo) {
    if (texto == "") {
        return false;
    }

    var numero = Number(texto);

    return Number.isInteger(numero) && numero >= minimo && numero <= maximo;
}

function calcular() {
    var idDestino = select_destino.value;
    var textoDias = input_dias.value;
    var textoPessoas = input_pessoas.value;

    if (idDestino == "") {
        mostrarMensagem("Escolha um destino.");
        div_recibo.innerHTML = "";
        return;
    }

    if (!ehInteiroEntre(textoDias, DIAS_MINIMO, DIAS_MAXIMO)) {
        mostrarMensagem(`Os dias precisam ser um número inteiro de ${DIAS_MINIMO} a ${DIAS_MAXIMO}.`);
        div_recibo.innerHTML = "";
        return;
    }

    if (!ehInteiroEntre(textoPessoas, PESSOAS_MINIMO, PESSOAS_MAXIMO)) {
        mostrarMensagem(`As pessoas precisam ser um número inteiro de ${PESSOAS_MINIMO} a ${PESSOAS_MAXIMO}.`);
        div_recibo.innerHTML = "";
        return;
    }

    var destino = buscarDestino(idDestino);
    var dias = Number(textoDias);
    var pessoas = Number(textoPessoas);

    var voo = Number(destino.valor_voo);
    var diaria = Number(destino.valor_diaria);
    var hospedagem = diaria * dias;
    var porPessoa = calcularCustoPorPessoa(destino.valor_voo, destino.valor_diaria, dias);
    var total = calcularCustoTotal(porPessoa, pessoas);
    var naMoedaLocal = converterParaMoedaLocal(total, destino.cotacao_real);

    var palavraDias = "dias";
    if (dias == 1) {
        palavraDias = "dia";
    }
    var palavraPessoas = "pessoas";
    if (pessoas == 1) {
        palavraPessoas = "pessoa";
    }

    var nomeDoTipo = select_tipo.options[select_tipo.selectedIndex].text;

    div_recibo.innerHTML = `
        <h2>Recibo da viagem</h2>
        <p class="recibo-destino">${destino.pais} · ${nomeDoTipo}</p>
        <table class="recibo-tabela">
            <tr><th scope="row">Voo, por pessoa</th><td>${formatarDinheiro(voo, "BRL")}</td></tr>
            <tr><th scope="row">Diária</th><td>${formatarDinheiro(diaria, "BRL")}</td></tr>
            <tr><th scope="row">Hospedagem: ${dias} ${palavraDias}</th><td>${formatarDinheiro(hospedagem, "BRL")}</td></tr>
            <tr class="recibo-subtotal"><th scope="row">Por pessoa</th><td>${formatarDinheiro(porPessoa, "BRL")}</td></tr>
            <tr><th scope="row">× ${pessoas} ${palavraPessoas}</th><td></td></tr>
            <tr class="recibo-total"><th scope="row">Total</th><td>${formatarDinheiro(total, "BRL")}</td></tr>
            <tr><th scope="row">Na moeda local</th><td>${formatarDinheiro(naMoedaLocal, destino.moeda)}</td></tr>
        </table>
        <p class="recibo-rodape">Cotação usada: 1 ${destino.moeda} = ${formatarCotacao(destino.cotacao_real)}</p>
    `;

    mostrarMensagem("");
}

function mostrarMensagem(texto) {
    p_mensagem.innerHTML = texto;
}

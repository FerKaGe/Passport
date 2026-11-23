function calcularCustoPorPessoa(valorVoo, valorDiaria, dias) {
    return Number(valorVoo) + Number(valorDiaria) * Number(dias);
}

function calcularCustoTotal(custoPorPessoa, pessoas) {
    return custoPorPessoa * Number(pessoas);
}

function converterParaMoedaLocal(valorEmReais, cotacao) {
    return valorEmReais / Number(cotacao);
}

function formatarDinheiro(valor, moeda) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: moeda });
}

function formatarCotacao(cotacao) {
    return Number(cotacao).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 4 });
}

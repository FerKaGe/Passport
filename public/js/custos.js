/*
 * Contas de custo de viagem do Passport.
 * Usado pela Dashboard (js/dashboard.js) e pela Calculadora (js/calculadora.js):
 * a fórmula fica escrita num lugar só.
 *
 * Fórmula (README, seção "Como o custo é calculado"):
 *   custo por pessoa = valor do voo + valor da diária × número de dias
 *   custo total      = custo por pessoa × número de pessoas
 *
 * Os valores chegam do banco como TEXTO ("1900.00"), porque é assim que a
 * biblioteca mysql2 entrega o tipo DECIMAL. Somar texto em JavaScript cola
 * em vez de somar ("1900.00" + 230 = "1900.00230"), por isso tudo passa
 * por Number() antes da conta.
 */

function calcularCustoPorPessoa(valorVoo, valorDiaria, dias) {
    return Number(valorVoo) + Number(valorDiaria) * Number(dias);
}

function calcularCustoTotal(custoPorPessoa, pessoas) {
    return custoPorPessoa * Number(pessoas);
}

// A cotação diz quanto vale 1 unidade da moeda em reais (1 euro = 6,20 reais).
// Para saber quantos euros cabem num valor em reais, divide pela cotação.
function converterParaMoedaLocal(valorEmReais, cotacao) {
    return valorEmReais / Number(cotacao);
}

// Escreve o valor no formato de dinheiro brasileiro, na moeda pedida:
// formatarDinheiro(2590, "BRL") = "R$ 2.590,00"; formatarDinheiro(3258.06, "EUR") = "€ 3.258,06".
// toLocaleString é uma função do próprio JavaScript; "pt-BR" pede o jeito
// brasileiro de escrever (ponto no milhar e vírgula nos centavos).
function formatarDinheiro(valor, moeda) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: moeda });
}

var PASTA_IMG = "../jogo/img/";
var PASTA_FUNDOS = PASTA_IMG + "fundos/";
var PASTA_OBSTACULOS = PASTA_IMG + "obstaculos/";
var PASTA_CARIMBOS = PASTA_IMG + "carimbos/";
var PASTA_INICIO = PASTA_IMG + "inicio/";
var PASTA_BANDEIRAS = PASTA_IMG + "bandeiras/";

var obstaculoCacto = { nome: "cacto", imagem: PASTA_OBSTACULOS + "cacto.gif", largura: 72, altura: 135, folga: 16 };
var obstaculoPedra = { nome: "pedra vulcânica", imagem: PASTA_OBSTACULOS + "pedra-vulcanica.gif", largura: 90, altura: 72, folga: 14 };
var obstaculoBarril = { nome: "barril de vinho", imagem: PASTA_OBSTACULOS + "barril.gif", largura: 90, altura: 99, folga: 16 };
var obstaculoUvas = { nome: "cacho de uvas", imagem: PASTA_OBSTACULOS + "uvas.gif", largura: 81, altura: 117, folga: 16 };
var obstaculoTouro = { nome: "touro", imagem: PASTA_OBSTACULOS + "touro.gif", largura: 90, altura: 90, folga: 14 };
var obstaculoOliveira = { nome: "oliveira", imagem: PASTA_OBSTACULOS + "oliveira.gif", largura: 90, altura: 126, folga: 18 };
var obstaculoAzulejo = { nome: "azulejo", imagem: PASTA_OBSTACULOS + "azulejo.gif", largura: 81, altura: 81, folga: 12 };
var obstaculoSardinha = { nome: "sardinha", imagem: PASTA_OBSTACULOS + "sardinha.gif", largura: 63, altura: 126, folga: 12 };
var obstaculoMacaco = { nome: "macaco do Rochedo", imagem: PASTA_OBSTACULOS + "macaco.gif", largura: 81, altura: 117, folga: 16 };
var obstaculoCabine = { nome: "cabine telefônica", imagem: PASTA_OBSTACULOS + "cabine.gif", largura: 63, altura: 135, folga: 16 };
var obstaculoCoqueiro = { nome: "coqueiro", imagem: PASTA_OBSTACULOS + "coqueiro.gif", largura: 90, altura: 135, folga: 20 };
var obstaculoCaranguejo = { nome: "caranguejo", imagem: PASTA_OBSTACULOS + "caranguejo.gif", largura: 90, altura: 63, folga: 12 };
var obstaculoJacare = { nome: "jacaré", imagem: PASTA_OBSTACULOS + "jacare.gif", largura: 90, altura: 72, folga: 12 };
var obstaculoCone = { nome: "cone de obra", imagem: PASTA_OBSTACULOS + "cone.gif", largura: 72, altura: 99, folga: 14 };

var fases = [
    {
        idDestino: 1,
        nome: "Atacama",
        pais: "Chile",
        fundo: PASTA_FUNDOS + "atacama.png",
        carimbo: PASTA_CARIMBOS + "atacama.png",
        bandeira: PASTA_BANDEIRAS + "atacama.png",
        cartao: PASTA_INICIO + "cartao-atacama.png",
        tempoTravessia: 1800,
        meta: 5,
        obstaculos: [obstaculoCacto, obstaculoPedra]
    },
    {
        idDestino: 2,
        nome: "Mendoza",
        pais: "Argentina",
        fundo: PASTA_FUNDOS + "mendoza.png",
        carimbo: PASTA_CARIMBOS + "mendoza.png",
        bandeira: PASTA_BANDEIRAS + "mendoza.png",
        cartao: PASTA_INICIO + "cartao-mendoza.png",
        tempoTravessia: 1650,
        meta: 5,
        obstaculos: [obstaculoBarril, obstaculoUvas]
    },
    {
        idDestino: 3,
        nome: "Espanha",
        pais: "Espanha",
        fundo: PASTA_FUNDOS + "espanha.png",
        carimbo: PASTA_CARIMBOS + "espanha.png",
        bandeira: PASTA_BANDEIRAS + "espanha.png",
        cartao: PASTA_INICIO + "cartao-espanha.png",
        tempoTravessia: 1500,
        meta: 6,
        obstaculos: [obstaculoTouro, obstaculoOliveira]
    },
    {
        idDestino: 4,
        nome: "Portugal",
        pais: "Portugal",
        fundo: PASTA_FUNDOS + "portugal.png",
        carimbo: PASTA_CARIMBOS + "portugal.png",
        bandeira: PASTA_BANDEIRAS + "portugal.png",
        cartao: PASTA_INICIO + "cartao-portugal.png",
        tempoTravessia: 1400,
        meta: 6,
        obstaculos: [obstaculoAzulejo, obstaculoSardinha]
    },
    {
        idDestino: 5,
        nome: "Gibraltar",
        pais: "Gibraltar",
        fundo: PASTA_FUNDOS + "gibraltar.png",
        carimbo: PASTA_CARIMBOS + "gibraltar.png",
        bandeira: PASTA_BANDEIRAS + "gibraltar.png",
        cartao: PASTA_INICIO + "cartao-gibraltar.png",
        tempoTravessia: 1300,
        meta: 7,
        obstaculos: [obstaculoMacaco, obstaculoCabine]
    },
    {
        idDestino: 6,
        nome: "Moçambique",
        pais: "Moçambique",
        fundo: PASTA_FUNDOS + "mocambique.png",
        carimbo: PASTA_CARIMBOS + "mocambique.png",
        bandeira: PASTA_BANDEIRAS + "mocambique.png",
        cartao: PASTA_INICIO + "cartao-mocambique.png",
        tempoTravessia: 1200,
        meta: 7,
        obstaculos: [obstaculoCoqueiro, obstaculoCaranguejo]
    },
    {
        idDestino: 7,
        nome: "Orlando",
        pais: "Estados Unidos",
        fundo: PASTA_FUNDOS + "orlando.png",
        carimbo: PASTA_CARIMBOS + "orlando.png",
        bandeira: PASTA_BANDEIRAS + "orlando.png",
        cartao: PASTA_INICIO + "cartao-orlando.png",
        tempoTravessia: 1100,
        meta: 8,
        obstaculos: [obstaculoJacare, obstaculoCone]
    }
];

function buscarFase(idDestino) {
    for (var i = 0; i < fases.length; i++) {
        if (fases[i].idDestino == idDestino) {
            return fases[i];
        }
    }

    return null;
}

/*
 * Fases do Jogo do Passaporte.
 *
 * "fases" é um vetor de objetos: cada objeto é um destino da viagem, na ordem
 * em que aparece no jogo. O jogo (js/jogo.js) não tem nenhum número de fase
 * escrito no meio do código: ele lê tudo daqui. Para deixar uma fase mais
 * difícil, trocar um fundo ou criar um obstáculo, basta mexer neste arquivo.
 *
 * Campos de cada fase:
 *   idDestino      - número do destino (vai ser o id da tabela destino do banco)
 *   nome           - nome que aparece no painel do jogo
 *   pais           - país que aparece no carimbo
 *   fundo          - imagem de fundo do tabuleiro
 *   carimbo        - imagem do carimbo que o jogador ganha ao terminar a fase
 *   cartao         - cartão-postal que aparece na tela de início
 *   tempoTravessia - quantos milissegundos o obstáculo leva para cruzar a tela
 *                    (quanto MENOR, mais rápido e mais difícil)
 *   meta           - quantos obstáculos pular para ganhar o carimbo
 *   obstaculos     - vetor de objetos com os obstáculos que podem aparecer
 *
 * Campos de cada obstáculo:
 *   nome            - só para a gente saber qual é
 *   imagem          - arquivo da imagem
 *   largura, altura - tamanho na tela, em pixels
 *   folga           - quantos pixels de cada lado NÃO contam na colisão
 *                     (dá uma tolerância ao jogador)
 *
 * Todas as imagens são geradas pelos scripts de ferramentas/sprites/.
 * Os obstáculos são desenhados com pontos de 6 px e aparecem na tela com
 * 3/4 do tamanho do arquivo (a mesma proporção da latinha do JumpGoat:
 * 120 px no arquivo, 90 px na tela). Ex.: cacto.gif tem 96 x 180 px e
 * aparece com 72 x 135 px.
 */

// Os caminhos começam com "../" porque são lidos a partir das páginas,
// que ficam em public/jogo/ e public/dashboard/ (e não a partir deste arquivo).
var PASTA_IMG = "../jogo/img/";
var PASTA_FUNDOS = PASTA_IMG + "fundos/";
var PASTA_OBSTACULOS = PASTA_IMG + "obstaculos/";
var PASTA_CARIMBOS = PASTA_IMG + "carimbos/";
var PASTA_INICIO = PASTA_IMG + "inicio/";

// Obstáculos. Cada fase escolhe os seus no vetor "obstaculos".
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
        cartao: PASTA_INICIO + "cartao-orlando.png",
        tempoTravessia: 1100,
        meta: 8,
        obstaculos: [obstaculoJacare, obstaculoCone]
    }
];

// Procura no vetor fases a fase de um destino (pelo id da tabela destino).
// Devolve null se não achar. Usada pela Home (js/home.js) e pelo
// Sobre mim (js/sobre.js) para achar o carimbo e o cartão de cada destino.
function buscarFase(idDestino) {
    for (var i = 0; i < fases.length; i++) {
        if (fases[i].idDestino == idDestino) {
            return fases[i];
        }
    }

    return null;
}

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
 *                     (desconta a borda do desenho e dá uma tolerância ao jogador)
 *
 * ARTE PROVISÓRIA: os fundos são o céu antigo do JumpGoat com outra cor e quase
 * todos os obstáculos são a lata antiga. A arte de cada destino entra na próxima
 * etapa; os nomes dos arquivos de fundo já são os definitivos.
 */

// Os caminhos começam com "../" porque são lidos a partir das páginas,
// que ficam em public/jogo/ (e não a partir deste arquivo).
var PASTA_FUNDOS = "../assets/jogo/fundos/";
var PASTA_OBSTACULOS = "../assets/jogo/obstaculos/";

// Obstáculos que já existem. Cada fase escolhe os seus no vetor "obstaculos".
var obstaculoCacto = { nome: "cacto", imagem: PASTA_OBSTACULOS + "cacto.png", largura: 60, altura: 92, folga: 8 };
var obstaculoLata = { nome: "lata", imagem: PASTA_OBSTACULOS + "lata.gif", largura: 90, altura: 135, folga: 20 };

var fases = [
    {
        idDestino: 1,
        nome: "Atacama",
        pais: "Chile",
        fundo: PASTA_FUNDOS + "atacama.png",
        tempoTravessia: 1800,
        meta: 5,
        obstaculos: [obstaculoCacto, obstaculoLata]
    },
    {
        idDestino: 2,
        nome: "Mendoza",
        pais: "Argentina",
        fundo: PASTA_FUNDOS + "mendoza.png",
        tempoTravessia: 1650,
        meta: 5,
        obstaculos: [obstaculoLata]
    },
    {
        idDestino: 3,
        nome: "Espanha",
        pais: "Espanha",
        fundo: PASTA_FUNDOS + "espanha.png",
        tempoTravessia: 1500,
        meta: 6,
        obstaculos: [obstaculoLata]
    },
    {
        idDestino: 4,
        nome: "Portugal",
        pais: "Portugal",
        fundo: PASTA_FUNDOS + "portugal.png",
        tempoTravessia: 1400,
        meta: 6,
        obstaculos: [obstaculoLata]
    },
    {
        idDestino: 5,
        nome: "Gibraltar",
        pais: "Gibraltar",
        fundo: PASTA_FUNDOS + "gibraltar.png",
        tempoTravessia: 1300,
        meta: 7,
        obstaculos: [obstaculoLata]
    },
    {
        idDestino: 6,
        nome: "Moçambique",
        pais: "Moçambique",
        fundo: PASTA_FUNDOS + "mocambique.png",
        tempoTravessia: 1200,
        meta: 7,
        obstaculos: [obstaculoLata]
    },
    {
        idDestino: 7,
        nome: "Orlando",
        pais: "Estados Unidos",
        fundo: PASTA_FUNDOS + "orlando.png",
        tempoTravessia: 1100,
        meta: 8,
        obstaculos: [obstaculoLata]
    }
];

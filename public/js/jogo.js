/*
 * Jogo do Passaporte
 * Adaptado do JumpGoat, de Fabricio Lima (licença MIT).
 * Copyright (c) 2026 Fabricio Lima
 * Licença completa: docs/licencas/JumpGoat-LICENSE.txt
 *
 * A mecânica é a mesma do JumpGoat:
 *   - quem MOVE as coisas é o CSS (css/jogo.css): uma animação faz o obstáculo
 *     atravessar a tela e outra faz o viajante pular;
 *   - o JavaScript só liga e desliga essas animações e, a cada quadro,
 *     pergunta onde cada um está para saber se bateu.
 *
 * O que este arquivo acrescenta: as fases (vêm do vetor "fases", em js/fases.js),
 * os checkpoints com carimbo e o recomeço na fase em que o jogador perdeu.
 *
 * Os elementos da página (img_viajante, div_tabuleiro, btn_embarcar...) são
 * usados direto pelo id, como a web-data-viz faz com os campos de formulário.
 */

// ---------------------------------------------------------------------------
// Configurações (valores que não mudam durante a partida)
// ---------------------------------------------------------------------------

var MILHAS_POR_SEGUNDO = 100;   // pontuação: quantas milhas o viajante ganha por segundo
var FOLGA_VIAJANTE = 35;        // pixels de cada lado do viajante que não contam na colisão
var TEMPO_DO_CARIMBO = 2000;    // milissegundos que o carimbo fica na tela entre duas fases

// Os três desenhos do viajante (PASTA_IMG vem de js/fases.js)
var IMAGEM_CORRENDO = PASTA_IMG + "personagem/correndo.gif";
var IMAGEM_PULANDO = PASTA_IMG + "personagem/pulando.gif";
var IMAGEM_TONTO = PASTA_IMG + "personagem/tonto.gif";

// ---------------------------------------------------------------------------
// Estado da partida (valores que mudam enquanto o jogo roda)
// ---------------------------------------------------------------------------

// Em que momento o jogo está. Só pode ser um destes textos:
//   "inicio"   - esperando o primeiro clique em EMBARCAR
//   "jogando"  - obstáculo andando, colisão valendo
//   "carimbo"  - passou de fase, carimbo na tela
//   "pausado"  - o jogador trocou de aba do navegador
//   "gameover" - bateu
//   "fim"      - ganhou os 7 carimbos
var estado = "inicio";

var indiceFase = 0;             // posição da fase atual dentro do vetor fases (0 é a primeira)
var obstaculosPulados = 0;      // quantos obstáculos já passaram nesta fase
var obstaculoAtual = fases[0].obstaculos[0];  // o objeto do obstáculo que está na tela
var milhas = 0;                 // pontuação
var milhasNoCheckpoint = 0;     // pontuação guardada no último carimbo (para recomeçar dali)
var carimbos = [];              // vetor com os países já carimbados nesta viagem
var pulando = false;            // true enquanto a animação do pulo está rodando
var lacoLigado = false;         // true enquanto o laço do jogo está rodando
var horarioAnterior = 0;        // horário do quadro anterior, para contar as milhas

// ---------------------------------------------------------------------------
// Preparação: roda UMA vez, quando a página abre (onload do <body>)
// ---------------------------------------------------------------------------

function prepararJogo() {
    // Os "ouvintes" são registrados uma única vez, aqui.
    // (No JumpGoat o ouvinte do teclado era criado de novo a cada partida.)
    document.addEventListener("keydown", aoApertarTecla);
    div_tabuleiro.addEventListener("mousedown", pular);

    // Eventos que o próprio navegador dispara por causa das animações CSS:
    //   animationend       - a animação do pulo terminou
    //   animationiteration - o obstáculo terminou uma volta e vai recomeçar
    img_viajante.addEventListener("animationend", aoTerminarPulo);
    img_obstaculo.addEventListener("animationiteration", aoObstaculoDarVolta);

    // Disparado quando o jogador sai da aba do navegador ou volta para ela
    document.addEventListener("visibilitychange", aoTrocarDeAba);

    preCarregarImagens();
    carregarFase(0);
}

// Pede ao navegador para baixar todas as imagens das fases antes de precisar
// delas, para não aparecer um obstáculo "em branco" na primeira vez.
function preCarregarImagens() {
    for (var i = 0; i < fases.length; i++) {
        var imagemFundo = new Image();          // cria uma imagem só na memória
        imagemFundo.src = fases[i].fundo;

        // laço dentro de laço: para cada fase, passa por cada obstáculo dela
        for (var j = 0; j < fases[i].obstaculos.length; j++) {
            var imagemObstaculo = new Image();
            imagemObstaculo.src = fases[i].obstaculos[j].imagem;
        }
    }

    var imagemPulando = new Image();
    imagemPulando.src = IMAGEM_PULANDO;

    var imagemTonto = new Image();
    imagemTonto.src = IMAGEM_TONTO;

    // O passaporte aberto só aparece com o mouse em cima do botão;
    // baixando antes, ele não "pisca" na primeira vez.
    var imagemPassaporteAberto = new Image();
    imagemPassaporteAberto.src = PASTA_IMG + "interface/passaporte-aberto.png";
}

// ---------------------------------------------------------------------------
// Começar e recomeçar
// ---------------------------------------------------------------------------

// Chamado pelo botão EMBARCAR / NOVO VOO / VIAJAR DE NOVO (onclick no HTML)
function iniciarJogo() {
    // Se já existe uma partida rodando, não começa outra por cima
    if (estado == "jogando" || estado == "carimbo" || estado == "pausado") {
        return;
    }

    // Depois de completar o passaporte, a viagem recomeça do zero.
    // Depois de um game over, continua na fase em que perdeu, com os carimbos.
    if (estado == "fim") {
        indiceFase = 0;
        carimbos = [];
        milhasNoCheckpoint = 0;
    }

    milhas = milhasNoCheckpoint;
    obstaculosPulados = 0;

    // Desfaz o que o game over deixou na tela
    img_viajante.src = IMAGEM_CORRENDO;
    img_viajante.classList.remove("pulando");
    img_viajante.classList.remove("pausado");
    img_obstaculo.classList.remove("pausado");
    pulando = false;

    div_aviso.style.display = "none";
    div_carimbo.style.display = "none";
    btn_embarcar.style.display = "none";

    // Se o jogador começou pelo teclado, o foco estava no botão que acabou de
    // sumir. blur() solta o foco, para a tecla Espaço servir só para pular.
    btn_embarcar.blur();

    carregarFase(indiceFase);
    soltarObstaculo();

    estado = "jogando";
    ligarLaco();
}

// Coloca na tela tudo que é da fase: fundo, velocidade e textos do painel
function carregarFase(indice) {
    var fase = fases[indice];

    div_tabuleiro.style.backgroundImage = `url(${fase.fundo})`;

    // --tempo-travessia é uma variável CSS. A animação do obstáculo, em
    // css/jogo.css, usa var(--tempo-travessia) como duração. Mudando a
    // variável aqui, a velocidade muda sem tocar no CSS.
    div_tabuleiro.style.setProperty("--tempo-travessia", fase.tempoTravessia + "ms");

    atualizarPainel();
}

// Escolhe um obstáculo da fase e faz a animação dele começar do início
function soltarObstaculo() {
    sortearObstaculo();
    reiniciarAnimacao(img_obstaculo, "andando");
}

// Sorteia um dos obstáculos do vetor da fase atual e coloca a imagem dele na tela
function sortearObstaculo() {
    var lista = fases[indiceFase].obstaculos;

    // Math.random() devolve um número entre 0 e 1 (nunca chega em 1).
    // Multiplicado pelo tamanho do vetor e arredondado para baixo, vira
    // uma posição válida: 0, 1, 2... até a última.
    var posicao = Math.floor(Math.random() * lista.length);

    obstaculoAtual = lista[posicao];

    img_obstaculo.src = obstaculoAtual.imagem;
    img_obstaculo.style.width = obstaculoAtual.largura + "px";
    img_obstaculo.style.height = obstaculoAtual.altura + "px";
}

// Faz uma animação CSS recomeçar do zero: tira a classe e coloca de novo.
function reiniciarAnimacao(elemento, classe) {
    elemento.classList.remove(classe);

    // Se eu só tirar e recolocar a classe, o navegador nem percebe a mudança
    // e a animação continua de onde estava. Ler offsetWidth obriga o navegador
    // a aplicar a remoção agora; aí a recolocação conta como animação nova.
    var larguraLida = elemento.offsetWidth;

    elemento.classList.add(classe);
}

// ---------------------------------------------------------------------------
// Pulo
// ---------------------------------------------------------------------------

function aoApertarTecla(evento) {
    // Fora da partida o teclado fica livre (para rolar a página, usar a barra lateral...)
    if (estado != "jogando") {
        return;
    }

    // Só Espaço e Seta para cima pulam (no JumpGoat qualquer tecla pulava)
    if (evento.code == "Space" || evento.code == "ArrowUp") {
        evento.preventDefault();    // não deixa essas teclas rolarem a página

        // Tecla segurada: o navegador repete o keydown sozinho, com repeat = true.
        // Essas repetições são ignoradas: um aperto, um pulo.
        if (!evento.repeat) {
            pular();
        }
    }
}

function pular() {
    // Só pula durante a partida, e não começa um pulo no meio de outro
    if (estado != "jogando" || pulando) {
        return;
    }

    pulando = true;
    img_viajante.src = IMAGEM_PULANDO;        // troca o desenho: pernas encolhidas
    img_viajante.classList.add("pulando");   // liga a animação "pulo" do CSS
}

// Chamada pelo navegador quando a animação do pulo acaba (evento animationend).
// No JumpGoat isso era um setTimeout de 700 ms, que precisava ter o mesmo
// número escrito no CSS. Agora a duração fica só no CSS.
function aoTerminarPulo() {
    pulando = false;
    img_viajante.classList.remove("pulando");
    img_viajante.src = IMAGEM_CORRENDO;       // de volta ao chão: volta a correr
}

// ---------------------------------------------------------------------------
// Laço do jogo: roda uma vez por quadro desenhado na tela
// ---------------------------------------------------------------------------

// Liga o laço, tomando cuidado para nunca existirem dois laços ao mesmo tempo
// (dois laços contariam as milhas em dobro).
function ligarLaco() {
    horarioAnterior = 0;

    if (lacoLigado) {
        return;
    }

    lacoLigado = true;

    // requestAnimationFrame: "navegador, chame lacoDoJogo logo antes de
    // desenhar o próximo quadro". A tela desenha uns 60 quadros por segundo.
    requestAnimationFrame(lacoDoJogo);

    // OUTRO JEITO DE FAZER, que era o do JumpGoat (com setInterval):
    //
    //     var laco = setInterval(lacoDoJogo, 10);   // chama a cada 10 ms
    //     ...
    //     clearInterval(laco);                      // para o laço
    //
    // Diferença entre os dois:
    //   - setInterval chama a função de tantos em tantos milissegundos, sem
    //     saber quando a tela vai ser desenhada. Com 10 ms ele roda ~100 vezes
    //     por segundo, mas a tela só muda ~60 vezes: medimos que 41% das
    //     leituras de posição vinham repetidas (trabalho jogado fora).
    //   - requestAnimationFrame roda exatamente uma vez por quadro, para
    //     sozinho quando a aba fica escondida e ainda entrega o horário exato
    //     (o parâmetro "horario" abaixo), o que deixa contar as milhas pelo
    //     tempo real em vez de contar "voltas do laço".
    //   - setInterval repete sozinho até alguém chamar clearInterval;
    //     requestAnimationFrame chama uma vez só, por isso lacoDoJogo
    //     termina pedindo o próximo quadro.
}

// horario: momento deste quadro, em milissegundos (quem informa é o navegador)
function lacoDoJogo(horario) {
    // Se a partida parou (bateu, carimbo, pausa), o laço desliga
    if (estado != "jogando") {
        lacoLigado = false;
        return;
    }

    // Milhas pelo tempo que passou desde o quadro anterior
    if (horarioAnterior != 0) {
        var segundos = (horario - horarioAnterior) / 1000;
        milhas += segundos * MILHAS_POR_SEGUNDO;
    }
    horarioAnterior = horario;

    span_milhas.innerHTML = Math.floor(milhas);

    if (houveColisao()) {
        gameOver();
        lacoLigado = false;
        return;
    }

    requestAnimationFrame(lacoDoJogo);   // pede o próximo quadro
}

// ---------------------------------------------------------------------------
// Colisão
// ---------------------------------------------------------------------------

// Devolve true se o viajante e o obstáculo estão se tocando.
// Em vez dos números fixos do JumpGoat (120 e 120), as medidas são lidas
// dos próprios elementos e do objeto do obstáculo (largura, altura e folga).
function houveColisao() {
    // offsetLeft: distância da borda esquerda do elemento até a borda
    // esquerda do tabuleiro. offsetWidth: largura do elemento na tela.
    // A folga encolhe cada caixa, porque o desenho não ocupa a imagem inteira.
    var viajanteEsquerda = img_viajante.offsetLeft + FOLGA_VIAJANTE;
    var viajanteDireita = img_viajante.offsetLeft + img_viajante.offsetWidth - FOLGA_VIAJANTE;

    var obstaculoEsquerda = img_obstaculo.offsetLeft + obstaculoAtual.folga;
    var obstaculoDireita = img_obstaculo.offsetLeft + img_obstaculo.offsetWidth - obstaculoAtual.folga;

    // Altura do viajante em relação ao chão, neste instante.
    // getComputedStyle devolve o valor que a animação está usando agora,
    // como texto ("137.5px"); o replace tira o "px" e o Number vira número.
    var alturaDoPulo = Number(window.getComputedStyle(img_viajante).bottom.replace("px", ""));

    // Altura que o viajante precisa ultrapassar para passar por cima
    var alturaDoObstaculo = obstaculoAtual.altura - obstaculoAtual.folga;

    // As duas caixas se cruzam na horizontal?
    var cruzouNaHorizontal = obstaculoEsquerda < viajanteDireita && obstaculoDireita > viajanteEsquerda;

    // O viajante está baixo demais para passar por cima?
    var estaBaixo = alturaDoPulo < alturaDoObstaculo;

    return cruzouNaHorizontal && estaBaixo;
}

function gameOver() {
    estado = "gameover";

    // Congela as duas animações onde estão. No JumpGoat a posição era copiada
    // para o estilo do elemento, e a cabra voltava a subir sozinha depois.
    img_obstaculo.classList.add("pausado");
    img_viajante.classList.add("pausado");

    img_viajante.src = IMAGEM_TONTO;

    div_aviso.innerHTML = "VOO CANCELADO!";
    div_aviso.style.display = "block";

    mostrarBotao("NOVO VOO", "botao-aviao");
}

// Mostra o botão do tabuleiro com o texto e o desenho pedidos.
// tipo é o nome da classe CSS que escolhe o desenho (css/tema.css):
//   "botao-passaporte" - passaporte que abre (começar a viagem)
//   "botao-aviao"      - avião que decola (tentar de novo)
function mostrarBotao(texto, tipo) {
    span_botao.innerHTML = texto;
    btn_embarcar.className = "botao-tema " + tipo;
    btn_embarcar.style.display = "flex";
}

// ---------------------------------------------------------------------------
// Checkpoints: obstáculos pulados, carimbo e troca de fase
// ---------------------------------------------------------------------------

// Chamada pelo navegador cada vez que o obstáculo termina uma volta
// (evento animationiteration). Se o jogo ainda está valendo nessa hora,
// é porque o viajante passou por ele.
function aoObstaculoDarVolta() {
    if (estado != "jogando") {
        return;
    }

    obstaculosPulados++;

    if (obstaculosPulados >= fases[indiceFase].meta) {
        darCarimbo();
    } else {
        // Nesta hora o obstáculo está fora da tela, à direita: dá para trocar
        // a imagem sem o jogador ver a troca.
        sortearObstaculo();
    }

    atualizarPainel();
}

function darCarimbo() {
    var fase = fases[indiceFase];

    carimbos.push(fase.pais);           // guarda o país no vetor de carimbos
    milhasNoCheckpoint = milhas;        // um game over daqui para frente volta com estas milhas

    img_obstaculo.classList.remove("andando");   // tira o obstáculo de cena

    // O carimbo do destino "bate" na tela (a animação está em css/jogo.css)
    div_carimbo.innerHTML = `
        <img src="${fase.carimbo}" alt="" />
        <p id="p_carimbo">CARIMBADO!<br><b>${fase.pais.toUpperCase()}</b></p>
    `;
    div_carimbo.style.display = "block";

    // Grava no banco. O jogo não espera a resposta: continua na hora.
    registrarCarimbo(fase.idDestino, Math.floor(milhas));

    // Era a última fase do vetor?
    if (indiceFase == fases.length - 1) {
        estado = "fim";

        div_aviso.innerHTML = "PASSAPORTE COMPLETO!";
        div_aviso.style.display = "block";

        mostrarBotao("VIAJAR DE NOVO", "botao-passaporte");
    } else {
        estado = "carimbo";

        // Deixa o carimbo um tempo na tela e depois segue viagem
        setTimeout(proximaFase, TEMPO_DO_CARIMBO);
    }
}

// Grava o carimbo no banco (rota POST /carimbos/registrar).
// A resposta diz se o carimbo é novo: na primeira vez que o jogador vence
// um destino, a skin desse destino é liberada.
// Se o banco não responder, o jogo segue: o carimbo desta partida vale igual.
function registrarCarimbo(idDestino, pontuacao) {
    fetch("/carimbos/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            idUsuarioServer: sessionStorage.ID_USUARIO,
            idDestinoServer: idDestino,
            pontuacaoServer: pontuacao
        })
    })
        .then(function (resposta) {
            if (!resposta.ok) {
                throw "Erro " + resposta.status;
            }
            return resposta.json();
        })
        .then(function (resultado) {
            if (resultado.novo) {
                p_carimbo.innerHTML += `<br><span class="skin-liberada">SKIN LIBERADA!</span>`;

                // Atualiza a barra lateral: o globo deste destino perde o cadeado
                montarSeletorDeSkins();
            }
        })
        .catch(function (erro) {
            console.log("Não foi possível gravar o carimbo no banco: ", erro);
        });
}

function proximaFase() {
    indiceFase++;
    obstaculosPulados = 0;

    div_carimbo.style.display = "none";

    carregarFase(indiceFase);
    soltarObstaculo();

    estado = "jogando";
    ligarLaco();

    // Se o jogador trocou de aba enquanto o carimbo estava na tela,
    // a fase nova já começa pausada.
    if (document.hidden) {
        pausarJogo();
    }
}

// Escreve no painel o destino, o progresso da fase e os carimbos ganhos
function atualizarPainel() {
    var fase = fases[indiceFase];

    span_milhas.innerHTML = Math.floor(milhas);
    span_destino.innerHTML = fase.nome.toUpperCase();
    span_progresso.innerHTML = obstaculosPulados + "/" + fase.meta;

    // O aviãozinho do cartão de embarque anda conforme a fase avança:
    // 0% no começo da linha, 100% quando a meta é atingida.
    var porcentagem = obstaculosPulados / fase.meta * 100;
    img_aviaozinho.style.left = porcentagem + "%";

    // Página do passaporte: um espaço para cada fase do vetor.
    // Fase já vencida mostra o carimbo dela; as outras ficam vazias.
    var html = "";

    for (var i = 0; i < fases.length; i++) {
        if (i < carimbos.length) {
            html += `<img class="selo carimbado" src="${fases[i].carimbo}" alt="Carimbo: ${fases[i].pais}" title="${fases[i].pais}" />`;
        } else {
            html += `<span class="selo" title="${fases[i].pais}: falta carimbar"></span>`;
        }
    }

    div_passaporte.innerHTML = html;
}

// ---------------------------------------------------------------------------
// Pausa quando o jogador troca de aba
// ---------------------------------------------------------------------------

// Com a aba escondida o navegador para de chamar o laço, mas a animação do
// obstáculo continuaria andando sem ninguém conferir a colisão. Por isso o
// jogo pausa ao sair da aba e continua ao voltar.
function aoTrocarDeAba() {
    if (document.hidden && estado == "jogando") {
        pausarJogo();
    } else if (!document.hidden && estado == "pausado") {
        img_obstaculo.classList.remove("pausado");
        img_viajante.classList.remove("pausado");

        estado = "jogando";
        ligarLaco();
    }
}

function pausarJogo() {
    estado = "pausado";

    img_obstaculo.classList.add("pausado");
    img_viajante.classList.add("pausado");
}

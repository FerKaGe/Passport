var MILHAS_POR_SEGUNDO = 100;
var FOLGA_VIAJANTE = 35;
var TEMPO_DO_CARIMBO = 2000;

var IMAGEM_CORRENDO = PASTA_IMG + "personagem/correndo.gif";
var IMAGEM_PULANDO = PASTA_IMG + "personagem/pulando.gif";
var IMAGEM_TONTO = PASTA_IMG + "personagem/tonto.gif";

var estado = "inicio";

var indiceFase = 0;
var obstaculosPulados = 0;
var obstaculoAtual = fases[0].obstaculos[0];
var milhas = 0;
var milhasNoCheckpoint = 0;
var carimbos = [];
var pulando = false;
var lacoLigado = false;
var horarioAnterior = 0;

function prepararJogo() {
    document.addEventListener("keydown", aoApertarTecla);
    div_tabuleiro.addEventListener("mousedown", pular);

    img_viajante.addEventListener("animationend", aoTerminarPulo);
    img_obstaculo.addEventListener("animationiteration", aoObstaculoDarVolta);

    document.addEventListener("visibilitychange", aoTrocarDeAba);

    preCarregarImagens();
    carregarFase(0);
}

function preCarregarImagens() {
    for (var i = 0; i < fases.length; i++) {
        var imagemFundo = new Image();
        imagemFundo.src = fases[i].fundo;

        for (var j = 0; j < fases[i].obstaculos.length; j++) {
            var imagemObstaculo = new Image();
            imagemObstaculo.src = fases[i].obstaculos[j].imagem;
        }
    }

    var imagemPulando = new Image();
    imagemPulando.src = IMAGEM_PULANDO;

    var imagemTonto = new Image();
    imagemTonto.src = IMAGEM_TONTO;

    var imagemPassaporteAberto = new Image();
    imagemPassaporteAberto.src = PASTA_IMG + "interface/passaporte-aberto.png";
}

function iniciarJogo() {
    if (estado == "jogando" || estado == "carimbo" || estado == "pausado") {
        return;
    }

    if (estado == "fim") {
        indiceFase = 0;
        carimbos = [];
        milhasNoCheckpoint = 0;
    }

    milhas = milhasNoCheckpoint;
    obstaculosPulados = 0;

    img_viajante.src = IMAGEM_CORRENDO;
    img_viajante.classList.remove("pulando");
    img_viajante.classList.remove("pausado");
    img_obstaculo.classList.remove("pausado");
    pulando = false;

    div_aviso.style.display = "none";
    div_carimbo.style.display = "none";
    btn_embarcar.style.display = "none";

    btn_embarcar.blur();

    carregarFase(indiceFase);
    soltarObstaculo();

    estado = "jogando";
    ligarLaco();
}

function carregarFase(indice) {
    var fase = fases[indice];

    div_tabuleiro.style.backgroundImage = `url(${fase.fundo})`;

    div_tabuleiro.style.setProperty("--tempo-travessia", fase.tempoTravessia + "ms");

    atualizarPainel();
}

function soltarObstaculo() {
    sortearObstaculo();
    reiniciarAnimacao(img_obstaculo, "andando");
}

function sortearObstaculo() {
    var lista = fases[indiceFase].obstaculos;

    var posicao = Math.floor(Math.random() * lista.length);

    obstaculoAtual = lista[posicao];

    img_obstaculo.src = obstaculoAtual.imagem;
    img_obstaculo.style.width = obstaculoAtual.largura + "px";
    img_obstaculo.style.height = obstaculoAtual.altura + "px";
}

function reiniciarAnimacao(elemento, classe) {
    elemento.classList.remove(classe);

    var larguraLida = elemento.offsetWidth;

    elemento.classList.add(classe);
}

function aoApertarTecla(evento) {
    if (estado != "jogando") {
        return;
    }

    if (evento.code == "Space" || evento.code == "ArrowUp") {
        evento.preventDefault();

        if (!evento.repeat) {
            pular();
        }
    }
}

function pular() {
    if (estado != "jogando" || pulando) {
        return;
    }

    pulando = true;
    img_viajante.src = IMAGEM_PULANDO;
    img_viajante.classList.add("pulando");
}

function aoTerminarPulo() {
    pulando = false;
    img_viajante.classList.remove("pulando");
    img_viajante.src = IMAGEM_CORRENDO;
}

function ligarLaco() {
    horarioAnterior = 0;

    if (lacoLigado) {
        return;
    }

    lacoLigado = true;

    requestAnimationFrame(lacoDoJogo);
}

function lacoDoJogo(horario) {
    if (estado != "jogando") {
        lacoLigado = false;
        return;
    }

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

    requestAnimationFrame(lacoDoJogo);
}

function houveColisao() {
    var viajanteEsquerda = img_viajante.offsetLeft + FOLGA_VIAJANTE;
    var viajanteDireita = img_viajante.offsetLeft + img_viajante.offsetWidth - FOLGA_VIAJANTE;

    var obstaculoEsquerda = img_obstaculo.offsetLeft + obstaculoAtual.folga;
    var obstaculoDireita = img_obstaculo.offsetLeft + img_obstaculo.offsetWidth - obstaculoAtual.folga;

    var alturaDoPulo = Number(window.getComputedStyle(img_viajante).bottom.replace("px", ""));

    var alturaDoObstaculo = obstaculoAtual.altura - obstaculoAtual.folga;

    var cruzouNaHorizontal = obstaculoEsquerda < viajanteDireita && obstaculoDireita > viajanteEsquerda;

    var estaBaixo = alturaDoPulo < alturaDoObstaculo;

    return cruzouNaHorizontal && estaBaixo;
}

function gameOver() {
    estado = "gameover";

    img_obstaculo.classList.add("pausado");
    img_viajante.classList.add("pausado");

    img_viajante.src = IMAGEM_TONTO;

    div_aviso.innerHTML = "VOO CANCELADO!";
    div_aviso.style.display = "block";

    mostrarBotao("NOVO VOO", "botao-aviao");
}

function mostrarBotao(texto, tipo) {
    span_botao.innerHTML = texto;
    btn_embarcar.className = "botao-tema " + tipo;
    btn_embarcar.style.display = "flex";
}

function aoObstaculoDarVolta() {
    if (estado != "jogando") {
        return;
    }

    obstaculosPulados++;

    if (obstaculosPulados >= fases[indiceFase].meta) {
        darCarimbo();
    } else {
        sortearObstaculo();
    }

    atualizarPainel();
}

function darCarimbo() {
    var fase = fases[indiceFase];

    carimbos.push(fase.pais);
    milhasNoCheckpoint = milhas;

    img_obstaculo.classList.remove("andando");

    div_carimbo.innerHTML = `
        <img src="${fase.carimbo}" alt="" />
        <p id="p_carimbo">CARIMBADO!<br><b>${fase.pais.toUpperCase()}</b></p>
    `;
    div_carimbo.style.display = "block";

    registrarCarimbo(fase.idDestino, Math.floor(milhas));

    if (indiceFase == fases.length - 1) {
        estado = "fim";

        div_aviso.innerHTML = "PASSAPORTE COMPLETO!";
        div_aviso.style.display = "block";

        mostrarBotao("VIAJAR DE NOVO", "botao-passaporte");
    } else {
        estado = "carimbo";

        setTimeout(proximaFase, TEMPO_DO_CARIMBO);
    }
}

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

    if (document.hidden) {
        pausarJogo();
    }
}

function atualizarPainel() {
    var fase = fases[indiceFase];

    span_milhas.innerHTML = Math.floor(milhas);
    span_destino.innerHTML = fase.nome.toUpperCase();
    span_progresso.innerHTML = obstaculosPulados + "/" + fase.meta;

    var porcentagem = obstaculosPulados / fase.meta * 100;
    img_aviaozinho.style.left = porcentagem + "%";

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

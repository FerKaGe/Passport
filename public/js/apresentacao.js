var LARGURA_DO_PALCO = 1920;
var ALTURA_DO_PALCO = 1080;
var TEMPO_DE_ATENCAO = 8 * 60;
var TEMPO_MAXIMO = 10 * 60;

var slides = [];
var slideAtual = 0;
var segundos = 0;
var cronometroLigado = false;
var idDoCronometro = null;
var ultimaRolagem = 0;

function iniciarApresentacao() {
    slides = document.querySelectorAll(".slide");

    numerarPaginas();
    montarProgresso();
    ajustarPalco();
    mostrarSlide(lerSlideDoEndereco());

    window.addEventListener("resize", ajustarPalco);
    document.addEventListener("keydown", aoApertarTecla);
    window.addEventListener("wheel", aoRolar, { passive: true });
}

function numerarPaginas() {
    for (var i = 0; i < slides.length; i++) {
        var numeros = slides[i].querySelectorAll(".numero-pagina");

        for (var j = 0; j < numeros.length; j++) {
            var numero = i + 1;
            numeros[j].innerHTML = numero < 10 ? "0" + numero : numero;
        }
    }
}

function montarProgresso() {
    var html = "";

    for (var i = 0; i < slides.length; i++) {
        html += "<span></span>";
    }

    div_progresso.innerHTML = html;
}

function ajustarPalco() {
    var escala = Math.min(window.innerWidth / LARGURA_DO_PALCO, window.innerHeight / ALTURA_DO_PALCO);
    var x = (window.innerWidth - LARGURA_DO_PALCO * escala) / 2;
    var y = (window.innerHeight - ALTURA_DO_PALCO * escala) / 2;

    palco.style.transform = `translate(${x}px, ${y}px) scale(${escala})`;
}

function lerSlideDoEndereco() {
    var numero = Number(window.location.hash.replace("#", ""));

    if (Number.isInteger(numero) && numero >= 1) {
        return numero - 1;
    }

    return 0;
}

function mostrarSlide(indice) {
    slideAtual = Math.max(0, Math.min(indice, slides.length - 1));

    for (var i = 0; i < slides.length; i++) {
        var ehOAtual = i == slideAtual;
        slides[i].classList.toggle("active", ehOAtual);
        slides[i].classList.toggle("visible", ehOAtual);
    }

    var quadradinhos = div_progresso.children;
    for (var i = 0; i < quadradinhos.length; i++) {
        quadradinhos[i].classList.toggle("feito", i <= slideAtual);
    }

    history.replaceState(null, "", "#" + (slideAtual + 1));
}

function avancar() {
    if (!cronometroLigado && slideAtual == 0) {
        ligarCronometro();
    }

    mostrarSlide(slideAtual + 1);
}

function voltar() {
    mostrarSlide(slideAtual - 1);
}

function aoApertarTecla(evento) {
    var estaEditando = document.body.classList.contains("modo-edicao");

    if ((evento.ctrlKey || evento.metaKey) && evento.key.toLowerCase() == "s") {
        evento.preventDefault();
        baixarApresentacao();
        return;
    }

    if (estaEditando && evento.key != "Escape") {
        return;
    }

    var tecla = evento.key;

    if (tecla == "ArrowRight" || tecla == "ArrowDown" || tecla == " " || tecla == "PageDown" || tecla == "Enter") {
        evento.preventDefault();
        avancar();
    } else if (tecla == "ArrowLeft" || tecla == "ArrowUp" || tecla == "PageUp" || tecla == "Backspace") {
        evento.preventDefault();
        voltar();
    } else if (tecla == "Home") {
        mostrarSlide(0);
    } else if (tecla == "End") {
        mostrarSlide(slides.length - 1);
    } else if (tecla == "f" || tecla == "F") {
        alternarTelaCheia();
    } else if (tecla == "t" || tecla == "T") {
        alternarCronometro();
    } else if (tecla == "r" || tecla == "R") {
        zerarCronometro();
    } else if (tecla == "e" || tecla == "E" || tecla == "Escape") {
        alternarEdicao();
    }
}

function aoRolar(evento) {
    var agora = Date.now();

    if (agora - ultimaRolagem < 700 || Math.abs(evento.deltaY) < 20) {
        return;
    }

    ultimaRolagem = agora;

    if (evento.deltaY > 0) {
        avancar();
    } else {
        voltar();
    }
}

function alternarTelaCheia() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
    }
}

function ligarCronometro() {
    if (cronometroLigado) {
        return;
    }

    cronometroLigado = true;
    idDoCronometro = setInterval(contarSegundo, 1000);
}

function contarSegundo() {
    segundos++;
    atualizarCronometro();
}

function alternarCronometro() {
    div_cronometro.classList.toggle("ligado");
    ligarCronometro();
    atualizarCronometro();
}

function zerarCronometro() {
    clearInterval(idDoCronometro);
    cronometroLigado = false;
    segundos = 0;
    atualizarCronometro();
}

function atualizarCronometro() {
    var minutos = Math.floor(segundos / 60);
    var resto = segundos % 60;

    div_cronometro.innerHTML = `${minutos}:${resto < 10 ? "0" + resto : resto} / 10:00`;
    div_cronometro.classList.toggle("atencao", segundos >= TEMPO_DE_ATENCAO && segundos < TEMPO_MAXIMO);
    div_cronometro.classList.toggle("estourou", segundos >= TEMPO_MAXIMO);
}

function alternarEdicao() {
    var ligar = !document.body.classList.contains("modo-edicao");
    var textos = palco.querySelectorAll("h1, h2, h3, p, li, td, th, strong, .preencher");

    document.body.classList.toggle("modo-edicao", ligar);

    for (var i = 0; i < textos.length; i++) {
        if (ligar) {
            textos[i].setAttribute("contenteditable", "true");
        } else {
            textos[i].removeAttribute("contenteditable");
        }
    }
}

function baixarApresentacao() {
    var copia = document.documentElement.cloneNode(true);
    var editaveis = copia.querySelectorAll("[contenteditable]");

    for (var i = 0; i < editaveis.length; i++) {
        editaveis[i].removeAttribute("contenteditable");
    }

    var slidesDaCopia = copia.querySelectorAll(".slide");
    for (var i = 0; i < slidesDaCopia.length; i++) {
        slidesDaCopia[i].classList.remove("active", "visible");
    }

    copia.querySelector("body").classList.remove("modo-edicao");
    copia.querySelector("#palco").removeAttribute("style");
    copia.querySelector("#div_progresso").innerHTML = "";
    copia.querySelector("#div_cronometro").className = "cronometro";
    copia.querySelector("#div_cronometro").innerHTML = "";

    var arquivo = new Blob(["<!DOCTYPE html>\n" + copia.outerHTML], { type: "text/html" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(arquivo);
    link.download = "apresentacao.html";
    link.click();
    URL.revokeObjectURL(link.href);
}

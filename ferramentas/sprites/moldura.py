"""
Moldura de fliperama do Jogo do Passaporte.

Gera public/jogo/img/moldura/moldura.gif: 8 quadros de 180 ms, como a
moldura do JumpGoat (moldura_fliperama_animada_tela_transparente.gif).

Desenho de 400 x 253 pontos, ampliado 3 vezes = 1200 x 759 px.
O "buraco" transparente, onde o jogo aparece, tem 320 x 160 pontos
(960 x 480 px) e começa no ponto (40, 32), ou seja, em 120 px da
esquerda e 96 px do topo. Essas medidas estão repetidas em css/jogo.css.

O que se mexe entre os quadros:
  - as luzes do letreiro (acendem alternadas);
  - o texto "INSIRA O PASSAPORTE" (pisca);
  - o passaporte na fenda (sobe e desce);
  - o avião que cruza o painel de baixo.

Como rodar:  python ferramentas/sprites/moldura.py
"""

from PIL import ImageDraw

from pixel import (CREME, DOURADO, DOURADO_CLARO, DOURADO_ESCURO, MARINHO, MARINHO_CLARO,
                   TINTA_VERMELHA, TRANSPARENTE, ampliar, caminho, contornar, cor, desenhar_mapa, escrever,
                   largura_do_texto, nova_imagem, salvar_gif)
from viajante import CABECA
from viajante import PALETA as PALETA_VIAJANTE

LARGURA = 400
ALTURA = 253
ESCALA = 3

# O buraco da tela (em pontos)
TELA_X = 40
TELA_Y = 32
TELA_LARGURA = 320
TELA_ALTURA = 160

PRETO_AZULADO = "#060A18"

PALETA = {
    "D": DOURADO,
    "d": DOURADO_ESCURO,
    "C": CREME,
    "M": MARINHO_CLARO,
    "V": TINTA_VERMELHA,
    "v": "#8A0D16",
    "P": "#F08A96",
    "G": "#3E8E4A",
    "g": "#286834",
    "L": "#76C46A",
}

AVIAO = [
    ".....CC.......",
    "C....CCC......",
    "CC...CCCC.....",
    "CCCCCCCCCCCC..",
    "CCMCMCMCMCCCC.",
    "CCCCCCCCCCCC..",
    "CC...CCCC.....",
    "C....CCC......",
    ".....CC.......",
]

GLOBO = [
    "...CCCCC...",
    ".CCMMCMMCC.",
    ".CMMCCCMMC.",
    "CMMMCCCMMMC",
    "CCCCCCCCCCC",
    "CMMMCCCMMMC",
    "CCCCCCCCCCC",
    "CMMMCCCMMMC",
    ".CMMCCCMMC.",
    ".CCMMCMMCC.",
    "...CCCCC...",
]

PASSAPORTE = [
    "DDDDDDDDDDDD",
    "DMMMMMMMMMMD",
    "DMMMMDDMMMMD",
    "DMMMDMMDMMMD",
    "DMMMDMMDMMMD",
    "DMMMMDDMMMMD",
    "DMMMMMMMMMMD",
    "DMMDDDDDDMMD",
    "DMMMMMMMMMMD",
]

CACTO_PEQUENO = [
    "...GL....",
    "...GL..G.",
    "G..GL.GL.",
    "GL.GLGGL.",
    "GLGGLgg..",
    ".ggGL....",
    "...GL....",
    "...GL....",
    "...GL....",
]


def retangulo(desenho, x, y, largura, altura, cor_de_dentro):
    """Retângulo pintado. Recebe canto, largura e altura (mais fácil de ler que dois cantos)."""
    desenho.rectangle([x, y, x + largura - 1, y + altura - 1], fill=cor(cor_de_dentro))


def moldura_de_linha(desenho, x, y, largura, altura, cor_da_linha):
    """Só o contorno de um retângulo, com 1 ponto de espessura."""
    desenho.rectangle([x, y, x + largura - 1, y + altura - 1], outline=cor(cor_da_linha))


def titulo(imagem, texto, x, y):
    """
    Título em letras de 16 pontos com 3 tons: creme em cima, dourado claro
    no meio e dourado embaixo, e uma sombra escura deslocada 1 ponto.
    """
    escrever(imagem, texto, x + 1, y + 1, DOURADO_ESCURO, 16)

    # Escreve o texto numa imagem separada e copia ponto a ponto,
    # escolhendo a cor pela altura da linha.
    letras = nova_imagem(largura_do_texto(texto, 16), 16)
    escrever(letras, texto, 0, 0, "#FFFFFF", 16)
    for ly in range(letras.height):
        if ly < 5:
            tom = CREME
        elif ly < 10:
            tom = DOURADO_CLARO
        else:
            tom = DOURADO
        for lx in range(letras.width):
            if letras.getpixel((lx, ly))[3] != 0:
                imagem.putpixel((x + lx, y + ly), cor(tom))


def desenhar_quadro(numero):
    """Desenha um dos 8 quadros. "numero" vai de 0 a 7."""
    # A imagem começa transparente: em volta do gabinete aparece o fundo da
    # página, que muda de cor com a skin.
    imagem = nova_imagem(LARGURA, ALTURA)
    desenho = ImageDraw.Draw(imagem)

    # --- gabinete ---
    retangulo(desenho, 26, 2, 348, 249, PRETO_AZULADO)
    retangulo(desenho, 28, 4, 344, 245, MARINHO)

    # --- letreiro ---
    retangulo(desenho, 34, 5, 332, 24, PRETO_AZULADO)
    moldura_de_linha(desenho, 34, 5, 332, 24, DOURADO)
    moldura_de_linha(desenho, 36, 7, 328, 20, DOURADO_ESCURO)
    # luzes: uma acesa, uma apagada; a cada quadro a posição acesa troca
    for posicao in range(0, 40):
        x = 44 + posicao * 8
        acesa = (posicao + numero) % 2 == 0
        if acesa:
            retangulo(desenho, x, 9, 2, 1, DOURADO_CLARO)
            retangulo(desenho, x, 24, 2, 1, DOURADO_CLARO)
        else:
            retangulo(desenho, x, 9, 2, 1, MARINHO_CLARO)
            retangulo(desenho, x, 24, 2, 1, MARINHO_CLARO)

    texto = "JOGO DO PASSAPORTE"
    x_titulo = (LARGURA - largura_do_texto(texto, 16)) // 2
    titulo(imagem, texto, x_titulo, 9)

    # --- tela: bordas em volta do buraco ---
    retangulo(desenho, TELA_X - 6, TELA_Y - 2, TELA_LARGURA + 12, TELA_ALTURA + 6, PRETO_AZULADO)
    moldura_de_linha(desenho, TELA_X - 3, TELA_Y - 1, TELA_LARGURA + 6, TELA_ALTURA + 3, DOURADO_ESCURO)
    moldura_de_linha(desenho, TELA_X - 1, TELA_Y - 1, TELA_LARGURA + 2, TELA_ALTURA + 2, DOURADO)
    for x in range(190, 212, 5):
        retangulo(desenho, x, TELA_Y + TELA_ALTURA + 2, 2, 1, DOURADO)

    # o buraco: tudo que está dentro da tela fica transparente
    desenho.rectangle(
        [TELA_X, TELA_Y, TELA_X + TELA_LARGURA - 1, TELA_Y + TELA_ALTURA - 1],
        fill=TRANSPARENTE,
    )

    # --- painel de controle ---
    retangulo(desenho, 22, 200, 356, 51, PRETO_AZULADO)
    retangulo(desenho, 24, 202, 352, 2, DOURADO)
    retangulo(desenho, 24, 205, 352, 44, MARINHO)
    for x, y in [(28, 209), (369, 209), (28, 243), (369, 243)]:
        retangulo(desenho, x, y, 2, 2, MARINHO_CLARO)   # parafusos

    # trilho por onde o avião passa
    for x in range(30, 370, 6):
        retangulo(desenho, x, 243, 3, 1, MARINHO_CLARO)

    # mascote: a cabeça do corgi (o mesmo desenho do personagem)
    escrever(imagem, "VAMOS!", 30, 207, DOURADO_CLARO, 8)
    cabeca = nova_imagem(32, 24)
    desenhar_mapa(cabeca, CABECA, PALETA_VIAJANTE, 1, 1)
    cabeca = contornar(cabeca, PALETA_VIAJANTE["K"])
    imagem.alpha_composite(cabeca, (40, 215))

    # "INSIRA O PASSAPORTE" pisca: some nos quadros 3 e 7
    if numero != 3 and numero != 7:
        texto = "INSIRA O PASSAPORTE"
        escrever(imagem, texto, (LARGURA - largura_do_texto(texto)) // 2, 207, DOURADO, 8)

    # alavanca
    desenho.ellipse([138, 233, 162, 240], fill=cor(PRETO_AZULADO), outline=cor(DOURADO_ESCURO))
    retangulo(desenho, 149, 226, 3, 11, CREME)
    desenho.ellipse([144, 218, 156, 230], fill=cor(DOURADO), outline=cor(PRETO_AZULADO))
    retangulo(desenho, 147, 221, 3, 2, DOURADO_CLARO)

    # fenda com o passaporte, que sobe e desce 1 ponto
    retangulo(desenho, 190, 224, 20, 14, PRETO_AZULADO)
    moldura_de_linha(desenho, 190, 224, 20, 14, MARINHO_CLARO)
    if numero % 4 < 2:
        subida = 0
    else:
        subida = 1
    desenhar_mapa(imagem, PASSAPORTE, PALETA, 194, 221 - subida)

    # botão de pular: redondo e vermelho, como um carimbo
    desenho.ellipse([230, 225, 256, 239], fill=cor(PRETO_AZULADO))
    desenho.ellipse([232, 223, 254, 235], fill=cor("#8A0D16"))
    desenho.ellipse([232, 221, 254, 233], fill=cor(TINTA_VERMELHA))
    retangulo(desenho, 238, 223, 8, 1, "#F08A96")
    escrever(imagem, "PULAR", 262, 226, CREME, 8)

    # cacto do Atacama
    escrever(imagem, "OPA!", 334, 221, "#FF6B6B", 8)
    cacto = nova_imagem(11, 11)
    desenhar_mapa(cacto, CACTO_PEQUENO, PALETA, 1, 1)
    cacto = contornar(cacto, PRETO_AZULADO)
    imagem.alpha_composite(cacto, (318, 219))

    # avião cruzando o painel: anda 40 pontos por quadro
    aviao = nova_imagem(16, 11)
    desenhar_mapa(aviao, AVIAO, PALETA, 1, 1)
    aviao = contornar(aviao, PRETO_AZULADO)
    imagem.alpha_composite(aviao, (34 + numero * 40, 238))

    # ícones do letreiro
    desenhar_mapa(imagem, AVIAO, PALETA, 40, 12)
    desenhar_mapa(imagem, GLOBO, PALETA, 347, 11)

    return imagem


def gerar():
    quadros = []
    for numero in range(8):
        quadros.append(ampliar(desenhar_quadro(numero), ESCALA))
    salvar_gif(quadros, 180, caminho("moldura", "moldura.gif"), apagar_entre_quadros=False)


if __name__ == "__main__":
    gerar()

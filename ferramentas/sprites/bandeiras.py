"""
Bandeiras dos 7 destinos, em pixel art, para os cartões de países da Home
e a linha da vida do Sobre mim.

Gera public/jogo/img/bandeiras/<destino>.png (7 arquivos).
Desenho de 24 x 16 pontos (proporção 3:2, a de quase todas as bandeiras),
com 1 ponto de contorno em volta: 26 x 18 pontos, ampliado 4 vezes = 104 x 72 px.

Por que não usar os emojis de bandeira (🇨🇱): o Windows não tem desenho
para eles, e o navegador mostra só as duas letras do país ("CL").

As bandeiras são SIMPLIFICADAS: brasões e escudos viraram poucos pontos,
como num jogo de fliperama. A de Moçambique fica sem os objetos do emblema
(só a estrela).

Como rodar:  python ferramentas/sprites/bandeiras.py
"""

from PIL import ImageDraw

from pixel import ampliar, caminho, contornar, cor, nova_imagem, salvar_png

LARGURA = 24
ALTURA = 16
ESCALA = 4

BRANCO = "#FFFFFF"
VERMELHO = "#D52B1E"
AZUL = "#0039A6"
CELESTE = "#74ACDF"
AMARELO = "#F6B40E"
VERDE = "#007A3D"
PRETO = "#1A1420"
VERMELHO_ESPANHA = "#AA151B"
AMARELO_ESPANHA = "#F1BF00"
VERDE_PORTUGAL = "#046A38"
VERMELHO_PORTUGAL = "#DA291C"
AZUL_EUA = "#3C3B6E"
VERMELHO_EUA = "#B22234"


def faixa(desenho, x0, y0, x1, y1, cor_da_faixa):
    """Retângulo do ponto (x0, y0) até o (x1, y1), incluindo os dois."""
    desenho.rectangle([x0 + 1, y0 + 1, x1 + 1, y1 + 1], fill=cor(cor_da_faixa))


def ponto(desenho, x, y, cor_do_ponto):
    desenho.point((x + 1, y + 1), fill=cor(cor_do_ponto))


def estrela(desenho, cx, cy, cor_da_estrela):
    """Estrela pequena: uma cruz de 5 pontos."""
    for dx, dy in [(0, 0), (-1, 0), (1, 0), (0, -1), (0, 1)]:
        ponto(desenho, cx + dx, cy + dy, cor_da_estrela)


# O "+1" de faixa() e ponto() é o espaço do contorno: o desenho começa
# no ponto (1, 1) da imagem, e o contorno fica na borda.

def chile(d):
    faixa(d, 0, 0, 23, 7, BRANCO)
    faixa(d, 0, 8, 23, 15, VERMELHO)
    faixa(d, 0, 0, 7, 7, AZUL)
    estrela(d, 3, 3, BRANCO)
    ponto(d, 4, 4, BRANCO)


def argentina(d):
    faixa(d, 0, 0, 23, 4, CELESTE)
    faixa(d, 0, 5, 23, 10, BRANCO)
    faixa(d, 0, 11, 23, 15, CELESTE)
    faixa(d, 11, 6, 12, 9, AMARELO)      # o sol de maio
    ponto(d, 10, 7, AMARELO)
    ponto(d, 13, 8, AMARELO)


def espanha(d):
    faixa(d, 0, 0, 23, 3, VERMELHO_ESPANHA)
    faixa(d, 0, 4, 23, 11, AMARELO_ESPANHA)
    faixa(d, 0, 12, 23, 15, VERMELHO_ESPANHA)
    faixa(d, 5, 5, 8, 10, VERMELHO_ESPANHA)   # o escudo, simplificado
    faixa(d, 6, 6, 7, 9, AMARELO_ESPANHA)
    ponto(d, 4, 6, VERMELHO_ESPANHA)          # as colunas dos lados
    ponto(d, 4, 9, VERMELHO_ESPANHA)
    ponto(d, 9, 6, VERMELHO_ESPANHA)
    ponto(d, 9, 9, VERMELHO_ESPANHA)


def portugal(d):
    faixa(d, 0, 0, 9, 15, VERDE_PORTUGAL)
    faixa(d, 10, 0, 23, 15, VERMELHO_PORTUGAL)
    # a esfera armilar: um anel amarelo em volta do escudo
    d.ellipse([6 + 1, 4 + 1, 13 + 1, 11 + 1], fill=cor(AMARELO))
    faixa(d, 8, 6, 11, 10, BRANCO)            # o escudo
    faixa(d, 9, 6, 10, 9, VERMELHO_PORTUGAL)
    faixa(d, 9, 7, 10, 8, AZUL)


def gibraltar(d):
    faixa(d, 0, 0, 23, 10, BRANCO)
    faixa(d, 0, 11, 23, 15, VERMELHO)
    # o castelo vermelho: três torres e o muro
    faixa(d, 8, 5, 15, 9, VERMELHO)
    faixa(d, 8, 2, 9, 4, VERMELHO)
    faixa(d, 11, 1, 12, 4, VERMELHO)
    faixa(d, 14, 2, 15, 4, VERMELHO)
    faixa(d, 11, 7, 12, 9, PRETO)             # o portão
    ponto(d, 11, 13, AMARELO)                 # a chave de ouro
    faixa(d, 12, 13, 13, 13, AMARELO)


def mocambique(d):
    faixa(d, 0, 0, 23, 3, VERDE)
    faixa(d, 0, 4, 23, 4, BRANCO)
    faixa(d, 0, 5, 23, 10, PRETO)
    faixa(d, 0, 11, 23, 11, BRANCO)
    faixa(d, 0, 12, 23, 15, AMARELO)
    # o triângulo vermelho do lado do mastro: cada coluna um pouco mais curta
    for x in range(0, 10):
        meio = x * 8 // 10
        faixa(d, x, meio, x, 15 - meio, VERMELHO)
    estrela(d, 3, 7, AMARELO)
    ponto(d, 3, 8, AMARELO)


def estados_unidos(d):
    # 13 listras não cabem em 16 pontos: ficam 8 listras de 2 pontos
    for numero in range(8):
        if numero % 2 == 0:
            cor_da_listra = VERMELHO_EUA
        else:
            cor_da_listra = BRANCO
        faixa(d, 0, numero * 2, 23, numero * 2 + 1, cor_da_listra)
    faixa(d, 0, 0, 10, 8, AZUL_EUA)
    for y in range(1, 8, 2):                  # as estrelas viram pontos
        for x in range(1, 10, 2):
            ponto(d, x, y, BRANCO)


# Um dicionário por destino: o nome do arquivo e a função que desenha
BANDEIRAS = [
    {"nome": "atacama", "desenhar": chile},
    {"nome": "mendoza", "desenhar": argentina},
    {"nome": "espanha", "desenhar": espanha},
    {"nome": "portugal", "desenhar": portugal},
    {"nome": "gibraltar", "desenhar": gibraltar},
    {"nome": "mocambique", "desenhar": mocambique},
    {"nome": "orlando", "desenhar": estados_unidos},
]


def gerar():
    for bandeira in BANDEIRAS:
        imagem = nova_imagem(LARGURA + 2, ALTURA + 2)
        desenho = ImageDraw.Draw(imagem)
        bandeira["desenhar"](desenho)
        imagem = contornar(imagem)
        salvar_png(ampliar(imagem, ESCALA), caminho("bandeiras", bandeira["nome"] + ".png"))


if __name__ == "__main__":
    gerar()

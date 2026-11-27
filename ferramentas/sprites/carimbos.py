"""
Carimbos de passaporte: um por destino do jogo.

Gera public/jogo/img/carimbos/<destino>.png (7 arquivos).
Desenho de 40 x 40 pontos, ampliado 4 vezes = 160 x 160 px.

Cada carimbo tem: uma forma (círculo, retângulo ou hexágono) com duas
linhas de borda, um desenho no meio e a sigla do lugar, tudo numa cor
só, como tinta de carimbo sobre papel.

Como rodar:  python ferramentas/sprites/carimbos.py
"""

from PIL import ImageDraw

from pixel import PAPEL, ampliar, caminho, cor, desenhar_mapa, escrever, nova_imagem, salvar_png

TAMANHO = 40
ESCALA = 4

# Desenhos do meio: "T" é tinta, "." deixa o papel aparecer
CACTO = [
    "....TT.....",
    "....TT..T..",
    ".T..TT..T..",
    ".T..TT..T..",
    ".T..TTTTT..",
    ".TTTTT.....",
    "....TT.....",
    "....TT.....",
    "....TT.....",
    "..TTTTTT...",
]

UVAS = [
    "......T....",
    ".....T.TT..",
    "..TT.TTT...",
    ".TTTTTTTT..",
    ".TT.TT.TT..",
    ".TTTTTTTT..",
    "..TT.TT.T..",
    "..TTTTTT...",
    "...TT.T....",
    "....TT.....",
]

TOURO = [
    "T.........T",
    "TT.......TT",
    ".TTTTTTTTT.",
    "..TTTTTTT..",
    "..T.TTT.T..",
    "..TTTTTTT..",
    "...TTTTT...",
    "...T.T.T...",
    "...TTTTT...",
    "....TTT....",
]

AZULEJO = [
    "TTTTTTTTTTT",
    "T....T....T",
    "T.T.TTT.T.T",
    "T..TT.TT..T",
    "T.TT...TT.T",
    "TTT..T..TTT",
    "T.TT...TT.T",
    "T..TT.TT..T",
    "T.T.TTT.T.T",
    "TTTTTTTTTTT",
]

ROCHEDO = [
    "...TT......",
    "..TTTT.....",
    "..TTTTT....",
    ".TTTTTTT...",
    ".TTTTTTTT..",
    "TTTTTTTTTT.",
    "TTTTTTTTTTT",
    "...........",
    "T.TT.TT.TT.",
    ".TT.TT.TT.T",
]

COQUEIRO = [
    "..TT...TT..",
    ".TTTT.TTTT.",
    "T..TTTTT..T",
    "..TTTTTTT..",
    ".TT.TT..TT.",
    ".T..TT...T.",
    "....TT.....",
    "...TT......",
    "...TT......",
    "..TTTT.....",
]

CASTELO = [
    ".....T.....",
    "....TTT....",
    ".T..TTT..T.",
    "TTT.TTT.TTT",
    "TTT.TTT.TTT",
    "TTTTTTTTTTT",
    "TTTT.T.TTTT",
    "TTTTTTTTTTT",
    "TTTT...TTTT",
    "TTTT...TTTT",
]

# Lista de carimbos: um dicionário por destino
CARIMBOS = [
    {"nome": "atacama", "sigla": "ATA", "tinta": "#B5451F", "forma": "circulo", "desenho": CACTO},
    {"nome": "mendoza", "sigla": "MDZ", "tinta": "#8A1F3D", "forma": "retangulo", "desenho": UVAS},
    {"nome": "espanha", "sigla": "ESP", "tinta": "#B5121B", "forma": "hexagono", "desenho": TOURO},
    {"nome": "portugal", "sigla": "PRT", "tinta": "#1A5C96", "forma": "retangulo", "desenho": AZULEJO},
    {"nome": "gibraltar", "sigla": "GIB", "tinta": "#4A5568", "forma": "circulo", "desenho": ROCHEDO},
    {"nome": "mocambique", "sigla": "MOZ", "tinta": "#0E7C74", "forma": "hexagono", "desenho": COQUEIRO},
    {"nome": "orlando", "sigla": "ORL", "tinta": "#B8327A", "forma": "circulo", "desenho": CASTELO},
]


def desenhar_forma(desenho, forma, margem, cor_de_dentro, cor_da_linha):
    """Desenha a forma do carimbo deixando "margem" pontos livres em volta."""
    fim = TAMANHO - 1 - margem
    meio = TAMANHO // 2
    if forma == "circulo":
        desenho.ellipse([margem, margem, fim, fim], fill=cor_de_dentro, outline=cor_da_linha)
    elif forma == "retangulo":
        desenho.rectangle([margem, margem + 3, fim, fim - 3], fill=cor_de_dentro, outline=cor_da_linha)
    else:
        # hexágono: 6 pontos ligados
        pontos = [(meio, margem), (fim, margem + 9), (fim, fim - 9), (meio, fim), (margem, fim - 9), (margem, margem + 9)]
        desenho.polygon(pontos, fill=cor_de_dentro, outline=cor_da_linha)


def gerar_carimbo(carimbo):
    imagem = nova_imagem(TAMANHO, TAMANHO)
    desenho = ImageDraw.Draw(imagem)
    tinta = cor(carimbo["tinta"])

    # borda grossa: a forma cheia de tinta e, por cima, a forma menor cheia de papel
    desenhar_forma(desenho, carimbo["forma"], 0, tinta, tinta)
    desenhar_forma(desenho, carimbo["forma"], 2, cor(PAPEL), cor(PAPEL))
    # segunda linha, fina, mais para dentro
    desenhar_forma(desenho, carimbo["forma"], 4, cor(PAPEL), tinta)

    paleta = {"T": carimbo["tinta"]}
    desenhar_mapa(imagem, carimbo["desenho"], paleta, 15, 8)
    escrever(imagem, carimbo["sigla"], 8, 22, carimbo["tinta"], 8)

    salvar_png(ampliar(imagem, ESCALA), caminho("carimbos", carimbo["nome"] + ".png"))


if __name__ == "__main__":
    for carimbo in CARIMBOS:
        gerar_carimbo(carimbo)

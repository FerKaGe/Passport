"""
Viajante do Jogo do Passaporte: um corgi bípede, de cachecol e mochila.

Gera, em public/jogo/img/personagem/:
  correndo.gif - 6 quadros de 90 ms   (substitui luna_correndo.gif)
  pulando.gif  - 2 quadros de 120 ms  (novo: a Luna não tinha desenho de pulo)
  tonto.gif    - 32 quadros de 70 ms  (substitui lunaGameOver.gif)

As medidas são as mesmas da Luna, para o CSS e a colisão não mudarem:
desenho de 42 x 49 pontos, ampliado 6 vezes = 252 x 294 px.

O corgi é montado em PARTES (cabeça, tronco, pernas, braço, cachecol).
Cada quadro da corrida junta as mesmas partes em posições diferentes.

Como rodar:  python ferramentas/sprites/viajante.py
"""

import math

from pixel import ampliar, caminho, contornar, desenhar_mapa, nova_imagem, salvar_gif

LARGURA = 42
ALTURA = 49
ESCALA = 6

# ---------------------------------------------------------------------------
# Paleta: cada letra dos mapas é uma destas cores
# ---------------------------------------------------------------------------

PALETA = {
    "K": "#2B1C16",  # contorno de dentro do desenho (marrom quase preto)
    "L": "#D07F3E",  # laranja do pelo
    "l": "#EBA35D",  # laranja claro (luz)
    "D": "#9C5526",  # laranja escuro (sombra)
    "W": "#FBF7F0",  # branco do focinho, do peito e das patas
    "w": "#DED6CA",  # branco na sombra
    "R": "#E89696",  # rosa de dentro da orelha e da bochecha
    "N": "#1A1420",  # preto do olho e do nariz
    "H": "#FFFFFF",  # brilho do olho
    "A": "#1E88E5",  # azul do cachecol
    "a": "#1260AA",  # azul escuro
    "C": "#6BB8F5",  # azul claro
    "M": "#1B2A4A",  # colete azul-marinho
    "m": "#141C2C",  # colete na sombra
    "Y": "#F2B632",  # botões dourados e estrelas
    "B": "#8A5630",  # mochila
    "b": "#5C3A22",  # mochila na sombra
    "T": "#B5652C",  # perna e braço de trás (mais escuros, parecem mais longe)
    "t": "#C9C0B2",  # pata de trás
    "V": "#C1121F",  # língua
}

# ---------------------------------------------------------------------------
# Partes do corpo
# ---------------------------------------------------------------------------

CABECA = [
    "......LL.........DD...........",
    ".....LLLL.......DDDD..........",
    ".....LRRLL.....DDRRD..........",
    "....LLRRRL.....DRRRDD.........",
    "....LRRRRLL...DDRRRRD.........",
    "....LRRRRRL...DRRRRRD.........",
    "....LRRRRRLLLLKDRRRRDD........",
    "....LLRRRRLlllLKDRRDDLL.......",
    "....LLLRRLLllllLKDDDLLLL......",
    "...LLLLLLLLlllllLLLLLLLLL.....",
    "..LLLLLLLLLLlllLLLLLLLLLLW....",
    "..LLLLLLLLLLLLLLLLHNNLLLWW....",
    "..LLLLLLLLLLLLLLLLNNNLLWWWWW..",
    "..LLLLLLLLLLLLLLLLNNNLWWWWWNNN",
    "..DLLLLLLLLLLLLLLLNNNWWWWWWNNN",
    "..DLLLLLLLLLLLLLWWLLWWWWWWWWWW",
    "..DDLLLLLLLLLLWWWRRWWWWWWWWWWw",
    "...DLLLLLLLLLWWWWRRWWWWWKWWWw.",
    "...DDLLLLLLLWWWWWWWWWWWKKKKw..",
    "....DDLLLLLWWWWWWWWWWWWWVVw...",
    ".....DDDLLWWWWWWWWWWWWwwVV....",
    ".......DDDwwwwwwwwwwww........",
]

TRONCO = [
    "...AAAAAAAAAAA..",
    "..AAAAAAAAAAAAA.",
    "..aaAAAAAAAAAaa.",
    ".BBMMMMMMMWWWW..",
    "BBBMMMMMMMMWWWW.",
    "BBBMMMMMMMMWWWW.",
    "BBbMMMMMMMMYWWW.",
    "BBbMMMMMMMMWWWW.",
    "BBbMMMMMMMMWWWW.",
    "BBbMMMMMMMMYWWW.",
    "BBbMMMMMMMMWWWW.",
    "bbbmMMMMMMMWWWW.",
    ".LmmmMMMMMMYWWW.",
    "lLLmmmmMMMMWWWW.",
    "lLLLLLLLLLWWWWW.",
    "LLLLLLLLLLWWWWW.",
    "LLLLLLLLLLLWWWW.",
    "DLLLLLLLLLLWWWW.",
    ".DDLLLLLLLLWWW..",
]

# Pernas: F = perna da frente, T = perna de trás, W/t = patas
PERNAS_ABERTAS = [
    "...TTTTT...FFFFF..",
    "..TTTTT.....FFFFF.",
    ".TTTTT.......FFFFF",
    "tttTT.........FFFF",
    "ttt...........WWWW",
    "..............WWWW",
]

PERNAS_MEIO = [
    "....TTTTFFFF......",
    "....TTTTFFFF......",
    "...TTTT.FFFF......",
    "...tttt.FFFF......",
    "........WWWW......",
    "........WWWWW.....",
]

PERNAS_JUNTAS = [
    "....TTTT.FFFFF....",
    "...TTTT...FFFFF...",
    "..TTTT.....FFFWW..",
    "..TTT.......WWW...",
    "..ttt.............",
    "..tttt............",
]

BRACO_FRENTE = [
    "KLLLK....",
    "KLLLLK...",
    ".KLLLLK..",
    "..KLLLLK.",
    "...KKWWWK",
    ".....KWWK",
    ".....KKK.",
]

BRACO_MEIO = [
    "KLLLK",
    "KLLLK",
    "KLLLK",
    "KLLLK",
    "KLLLK",
    "KWWWK",
    "KWWWK",
    ".KKK.",
]

BRACO_TRAS = [
    "...KLLLK",
    "..KLLLLK",
    ".KLLLLK.",
    "KLLLLK..",
    "KWWWK...",
    "KWWK....",
    ".KK.....",
]

# Pontas do cachecol voando para trás (3 posições, para parecer vento)
CACHECOL_1 = [
    "..AAAAAAA",
    "AAAAACCAA",
    "aAAAAAAAA",
    ".aaa..aaa",
]

CACHECOL_2 = [
    "A.....AAA",
    "AAAAAAACA",
    ".aAAAAAAA",
    "...aaaaaa",
]

CACHECOL_3 = [
    ".......AA",
    "..AAAAACA",
    "AAAAAAAAA",
    "aaa.aaaaa",
]

# Partes que só aparecem no pulo
PERNAS_PULO = [
    "....TTTT.FFFFF....",
    "...TTTTT..FFFFFF..",
    "...ttTT.....FFWWW.",
    "...tt.........WWW.",
]

BRACO_CIMA = [
    ".....KKK.",
    "....KWWWK",
    "....KWWWK",
    "...KLLLK.",
    "..KLLLK..",
    ".KLLLK...",
    "KLLLK....",
    "KLLK.....",
]

CACHECOL_CAINDO = [
    "......AAA",
    "...AAAACA",
    ".AAAAAAAA",
    "AAAAa.aaa",
    "aaa......",
]

# Partes que só aparecem no game over
OLHO_TONTO = [
    "LLL",
    "NLN",
    "LNL",
    "NLN",
]

ESTRELA = [
    ".Y.",
    "YYY",
    ".Y.",
]


def montar(pernas, troca_pernas, braco, cachecol, descida):
    """
    Junta as partes num quadro de 42 x 49 pontos.

    pernas       - um dos mapas de pernas
    troca_pernas - True inverte qual perna é a da frente (segunda metade do passo)
    braco        - um dos mapas de braço
    cachecol     - um dos mapas da ponta do cachecol
    descida      - quantos pontos o corpo desce neste quadro (balanço da corrida)
    """
    quadro = nova_imagem(LARGURA, ALTURA)

    # Cores das pernas: a da frente é clara, a de trás é escura.
    # Na segunda metade do passo elas trocam de lugar, então trocam de cor.
    paleta = dict(PALETA)
    if troca_pernas:
        paleta["F"] = PALETA["T"]
        paleta["T"] = PALETA["L"]
        paleta["W"] = PALETA["t"]
        paleta["t"] = PALETA["W"]
    else:
        paleta["F"] = PALETA["L"]

    # A ordem importa: o que é desenhado depois fica por cima.
    desenhar_mapa(quadro, pernas, paleta, 12, 42)
    desenhar_mapa(quadro, cachecol, PALETA, 4, 24 + descida)
    desenhar_mapa(quadro, TRONCO, PALETA, 12, 23 + descida)
    desenhar_mapa(quadro, CABECA, PALETA, 7, 1 + descida)
    desenhar_mapa(quadro, braco, PALETA, 18, 27 + descida)

    return contornar(quadro, PALETA["K"])


def quadros_da_corrida():
    """Os 6 quadros da corrida, na ordem."""
    return [
        montar(PERNAS_ABERTAS, False, BRACO_TRAS, CACHECOL_1, 0),
        montar(PERNAS_MEIO, False, BRACO_MEIO, CACHECOL_2, 1),
        montar(PERNAS_JUNTAS, False, BRACO_FRENTE, CACHECOL_3, 0),
        montar(PERNAS_ABERTAS, True, BRACO_FRENTE, CACHECOL_1, 0),
        montar(PERNAS_MEIO, True, BRACO_MEIO, CACHECOL_2, 1),
        montar(PERNAS_JUNTAS, True, BRACO_TRAS, CACHECOL_3, 0),
    ]


def quadros_do_pulo():
    """2 quadros: pernas encolhidas, braço para cima; só o cachecol mexe."""
    quadros = []
    for cachecol in [CACHECOL_CAINDO, CACHECOL_3]:
        quadro = nova_imagem(LARGURA, ALTURA)
        paleta = dict(PALETA)
        paleta["F"] = PALETA["L"]
        desenhar_mapa(quadro, PERNAS_PULO, paleta, 12, 42)
        desenhar_mapa(quadro, cachecol, PALETA, 4, 25)
        desenhar_mapa(quadro, TRONCO, PALETA, 12, 23)
        desenhar_mapa(quadro, CABECA, PALETA, 7, 1)
        desenhar_mapa(quadro, BRACO_CIMA, PALETA, 18, 21)
        quadros.append(contornar(quadro, PALETA["K"]))
    return quadros


def quadros_do_tonto():
    """
    32 quadros: o corgi parado, com olho em X, e 3 estrelas girando em
    volta da cabeça. As estrelas andam sobre uma circunferência achatada:
    x usa o cosseno do ângulo e y usa o seno.
    """
    total = 32
    quadros = []
    for numero in range(total):
        # O corpo balança: desce 1 ponto na segunda e na quarta parte do giro
        if (numero // 8) % 2 == 1:
            descida = 1
        else:
            descida = 0

        if (numero // 4) % 2 == 0:
            cachecol = CACHECOL_CAINDO
        else:
            cachecol = CACHECOL_3

        quadro = montar(PERNAS_MEIO, False, BRACO_MEIO, cachecol, descida)
        desenhar_mapa(quadro, OLHO_TONTO, PALETA, 7 + 18, 1 + 11 + descida)

        for estrela in range(3):
            # Cada estrela começa um terço de volta depois da anterior
            volta = numero / total + estrela / 3
            angulo = volta * 2 * math.pi
            x = round(21 + 14 * math.cos(angulo))
            y = round(4 + 3 * math.sin(angulo))
            desenhar_mapa(quadro, ESTRELA, PALETA, x - 1, y - 1)

        quadros.append(quadro)
    return quadros


def gerar():
    corrida = []
    for quadro in quadros_da_corrida():
        corrida.append(ampliar(quadro, ESCALA))
    salvar_gif(corrida, 90, caminho("personagem", "correndo.gif"))

    pulo = []
    for quadro in quadros_do_pulo():
        pulo.append(ampliar(quadro, ESCALA))
    salvar_gif(pulo, 120, caminho("personagem", "pulando.gif"))

    tonto = []
    for quadro in quadros_do_tonto():
        tonto.append(ampliar(quadro, ESCALA))
    salvar_gif(tonto, 70, caminho("personagem", "tonto.gif"))


if __name__ == "__main__":
    gerar()

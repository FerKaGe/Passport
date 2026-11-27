"""
Peças de interface do Passport, no mesmo pixel art do jogo.

Gera, em public/jogo/img/interface/:
  logo.png                 - logo do Passport (substitui gymfabs_logo_header@4x.png)
  favicon.png              - ícone da aba do navegador
  passaporte-fechado.png   - botão de jogar
  passaporte-aberto.png    - botão de jogar com o mouse em cima ou em foco
  aviao.png                - botão de recomeçar
  aviao-tinta.png          - avião escuro, que marca o progresso no cartão de embarque
  globo.png                - botão do seletor de skins (o mar é transparente:
                             a cor vem do CSS, uma para cada skin)
  icone-globo.png, icone-mala.png, icone-aviao.png,
  icone-passaporte.png, icone-portao.png - ícones da barra lateral
  cadeado.png              - cadeado em cima dos globos das skins bloqueadas

Como rodar:  python ferramentas/sprites/interface.py
"""

from pixel import (CREME, DOURADO, DOURADO_CLARO, DOURADO_ESCURO, MARINHO, MARINHO_CLARO, MARINHO_ESCURO, PAPEL,
                   PAPEL_SOMBRA, TINTA_VERDE, TINTA_VERMELHA, ampliar, caminho, contornar, desenhar_mapa, escrever,
                   largura_do_texto, nova_imagem, salvar_png)

PALETA = {
    "M": MARINHO,
    "m": MARINHO_ESCURO,
    "A": MARINHO_CLARO,
    "D": DOURADO,
    "d": DOURADO_ESCURO,
    "L": DOURADO_CLARO,
    "C": CREME,
    "P": PAPEL,
    "p": PAPEL_SOMBRA,
    "V": TINTA_VERMELHA,
    "T": TINTA_VERDE,
    "S": "#8CC4EE",
    "K": "#1A1420",
}

# ----- botões -----

PASSAPORTE_FECHADO = [
    "....................",
    "..MMMMMMMMMMMMMMMM..",
    "..MMMMMMMMMMMMMMMA..",
    "..MMDDDDDDDDDDDMMA..",
    "..MMMMMMMMMMMMMMMA..",
    "..MMMMMMDDDDMMMMMA..",
    "..MMMMMDLMDMDMMMMA..",
    "..MMMMDMLDDDMDMMMA..",
    "..MMMMDDDDDDDDMMMA..",
    "..MMMMDMMDDMMDMMMA..",
    "..MMMMDDDDDDDDMMMA..",
    "..MMMMMDMMDMDMMMMA..",
    "..MMMMMMDDDDMMMMMA..",
    "..MMMMMMMMMMMMMMMA..",
    "..MMMDDDDDDDDDDMMA..",
    "..MMMMMMMMMMMMMMMA..",
    "..MMMMDDDDDDDDMMMA..",
    "..MMMMMMMMMMMMMMMA..",
    "..MAAAAAAAAAAAAAAA..",
    "....................",
]

PASSAPORTE_ABERTO = [
    "....................",
    "PPPPPPPPPpPPPPPPPPPP",
    "PPPPPPPPPpPPPPPPPPPP",
    "PMMMMPPPPpPPVVVVVPPP",
    "PMCCMPPPPpPVPPPPPVPP",
    "PMCCMPAAPpPVPVVVPVPP",
    "PMCCMPPPPpPVPVPVPVPP",
    "PMMMMPAAPpPVPVVVPVPP",
    "PPPPPPPPPpPVPPPPPVPP",
    "PAAAAAAPPpPPVVVVVPPP",
    "PPPPPPPPPpPPPPPPPPPP",
    "PAAAAAPPPpPPPTTTTTPP",
    "PPPPPPPPPpPPTPPPPPTP",
    "PAAAAAAPPpPPTPTTTPTP",
    "PPPPPPPPPpPPTPPPPPTP",
    "PKAKKAKAPpPPPTTTTTPP",
    "PKAKKAKAPpPPPPPPPPPP",
    "PPPPPPPPPpPPPPPPPPPP",
    "pppppppppppppppppppp",
    "....................",
]

AVIAO = [
    "....................",
    ".........CC.........",
    ".........CCC........",
    "..........CCC.......",
    "..C.......CCCC......",
    "..CC.......CCCC.....",
    "..CCC......CCCCC....",
    "..CCCCCCCCCCCCCCCC..",
    "..CVVCSCSCSCSCCCCCC.",
    "..CCCCCCCCCCCCCCCC..",
    "..CCC......CCCCC....",
    "..CC.......CCCC.....",
    "..C.......CCCC......",
    "..........CCC.......",
    ".........CCC........",
    ".........CC.........",
    "....................",
]

# O globo dos botões de skin. O "." de DENTRO do círculo é o mar:
# fica transparente e mostra a cor de fundo que o CSS der ao botão.
GLOBO = [
    ".....KKKKKK.....",
    "...KK..CC..KK...",
    "..K...CCCC...K..",
    ".K..CCCCC.....K.",
    ".K.CCCCCC..CC.K.",
    "K..CCCCC...CCC.K",
    "K...CCC....CC..K",
    "K....CC.........K",
    "K....CCC...C...K",
    "K.....CCC.CCC..K",
    "K.....CCC.CCCC.K",
    ".K....CC...CC.K.",
    ".K....C.......K.",
    "..K..........K..",
    "...KK......KK...",
    ".....KKKKKK.....",
]

# ----- ícones da barra lateral (16 x 16) -----

ICONE_GLOBO = [
    ".....DDDDDD.....",
    "...DDCCDDCCDD...",
    "..DCCCDCCDCCCD..",
    ".DCCCDCCCCDCCCD.",
    ".DCCDCCCCCCDCCD.",
    "DDDDDDDDDDDDDDDD",
    "DCCDCCCCCCCCDCCD",
    "DCCDCCCCCCCCDCCD",
    "DDDDDDDDDDDDDDDD",
    "DCCDCCCCCCCCDCCD",
    ".DCCDCCCCCCDCCD.",
    ".DCCCDCCCCDCCCD.",
    "..DCCCDCCDCCCD..",
    "...DDCCDDCCDD...",
    ".....DDDDDD.....",
    "................",
]

ICONE_MALA = [
    "................",
    ".....DDDDDD.....",
    "....DD....DD....",
    "....D......D....",
    ".DDDDDDDDDDDDDD.",
    "DCCCCCCCCCCCCCCD",
    "DCCCCCCCCCCCCCCD",
    "DCCDCCCCCCCCDCCD",
    "DDDDDDDLLDDDDDDD",
    "DCCDCCCLLCCCDCCD",
    "DCCDCCCCCCCCDCCD",
    "DCCCCCCCCCCCCCCD",
    "DCCCCCCCCCCCCCCD",
    ".DDDDDDDDDDDDDD.",
    "..DD........DD..",
    "................",
]

ICONE_AVIAO = [
    "................",
    ".......CC.......",
    ".......CCC......",
    "........CCC.....",
    ".C......CCCC....",
    ".CC......CCCC...",
    ".CCCCCCCCCCCCCC.",
    ".CDDCDCDCDCCCCCC",
    ".CCCCCCCCCCCCCC.",
    ".CC......CCCC...",
    ".C......CCCC....",
    "........CCC.....",
    ".......CCC......",
    ".......CC.......",
    "................",
    "................",
]

ICONE_PASSAPORTE = [
    "................",
    "..DDDDDDDDDDDD..",
    "..DCCCCCCCCCCD..",
    "..DCCCDDDDCCCD..",
    "..DCCDCDDCDCCD..",
    "..DCDCCDDCCDCD..",
    "..DCDDDDDDDDCD..",
    "..DCDCCDDCCDCD..",
    "..DCCDCDDCDCCD..",
    "..DCCCDDDDCCCD..",
    "..DCCCCCCCCCCD..",
    "..DCCDDDDDDCCD..",
    "..DCCCCCCCCCCD..",
    "..DDDDDDDDDDDD..",
    "................",
    "................",
]

ICONE_PORTAO = [
    "................",
    ".DDDDDDDDDD.....",
    ".DCCCCCCCCD.....",
    ".DCCCCCCCCD..C..",
    ".DCCCCCCCCD..CC.",
    ".DCCCCCCCCD..CCC",
    ".DCCCCCCCCCCCCCC",
    ".DCCCCCLCCCCCCCC",
    ".DCCCCCCCCCCCCCC",
    ".DCCCCCCCCD..CCC",
    ".DCCCCCCCCD..CC.",
    ".DCCCCCCCCD..C..",
    ".DCCCCCCCCD.....",
    ".DDDDDDDDDD.....",
    "................",
    "................",
]

# Cadeado das skins bloqueadas (12 x 12), por cima do globo
CADEADO = [
    "...KKKKKK...",
    "..KK....KK..",
    "..K......K..",
    "..K......K..",
    "KKKKKKKKKKKK",
    "KDDDDDDDDDDK",
    "KDDDDKKDDDDK",
    "KDDDDKKDDDDK",
    "KDDDDDKDDDDK",
    "KDDDDDKDDDDK",
    "KddddddddddK",
    "KKKKKKKKKKKK",
]

# ----- favicon (16 x 16): passaporte com globo dourado -----

FAVICON = [
    "................",
    "..MMMMMMMMMMMA..",
    "..MMMMMMMMMMMA..",
    "..MMMMDDDDMMMA..",
    "..MMMDMDDMDMMA..",
    "..MMDMMDDMMDMA..",
    "..MMDDDDDDDDMA..",
    "..MMDMMDDMMDMA..",
    "..MMMDMDDMDMMA..",
    "..MMMMDDDDMMMA..",
    "..MMMMMMMMMMMA..",
    "..MMMDDDDDDMMA..",
    "..MMMMMMMMMMMA..",
    "..MAAAAAAAAAAA..",
    "................",
    "................",
]


def trocar_letras(mapa, de, para):
    """Devolve uma cópia do mapa com uma letra trocada por outra (muda a cor)."""
    novo = []
    for linha in mapa:
        novo.append(linha.replace(de, para))
    return novo


def gerar_do_mapa(mapa, nome, escala, com_contorno):
    """Desenha um mapa, põe o contorno escuro (se pedido), amplia e grava."""
    imagem = nova_imagem(len(mapa[0]), len(mapa))
    desenhar_mapa(imagem, mapa, PALETA)
    if com_contorno:
        imagem = contornar(imagem, PALETA["K"])
    salvar_png(ampliar(imagem, escala), caminho("interface", nome + ".png"))


def gerar_logo():
    """
    Logo: o passaporte, o nome do site e um avião com o rastro pontilhado.
    169 x 43 pontos, ampliado 4 vezes = 676 x 172 px (o tamanho do logo antigo).
    """
    imagem = nova_imagem(169, 43)

    desenhar_mapa(imagem, PASSAPORTE_FECHADO, PALETA, 0, 11)

    nome = "PASSPORT"
    escrever(imagem, nome, 25, 13, DOURADO_ESCURO, 16)   # sombra
    escrever(imagem, nome, 24, 12, CREME, 16)
    escrever(imagem, "CARIMBE O MUNDO", 25, 31, DOURADO, 8)

    # rastro pontilhado subindo até o avião
    x = 24 + largura_do_texto(nome, 16) - 30
    y = 9
    for passo in range(6):
        imagem.putpixel((x + passo * 4, y - passo), (224, 176, 74, 255))
        imagem.putpixel((x + passo * 4 + 1, y - passo), (224, 176, 74, 255))
    desenhar_mapa(imagem, ICONE_AVIAO, PALETA, 150, 0)

    imagem = contornar(imagem, MARINHO_ESCURO)
    salvar_png(ampliar(imagem, 4), caminho("interface", "logo.png"))


def gerar():
    gerar_logo()
    gerar_do_mapa(FAVICON, "favicon", 2, False)
    gerar_do_mapa(PASSAPORTE_FECHADO, "passaporte-fechado", 4, True)
    gerar_do_mapa(PASSAPORTE_ABERTO, "passaporte-aberto", 4, True)
    gerar_do_mapa(AVIAO, "aviao", 4, True)
    # o mesmo avião do ícone, com o creme (C) trocado por azul-marinho (M)
    gerar_do_mapa(trocar_letras(ICONE_AVIAO, "C", "M"), "aviao-tinta", 2, False)
    gerar_do_mapa(GLOBO, "globo", 3, False)
    gerar_do_mapa(ICONE_GLOBO, "icone-globo", 2, False)
    gerar_do_mapa(ICONE_MALA, "icone-mala", 2, False)
    gerar_do_mapa(ICONE_AVIAO, "icone-aviao", 2, False)
    gerar_do_mapa(ICONE_PASSAPORTE, "icone-passaporte", 2, False)
    gerar_do_mapa(ICONE_PORTAO, "icone-portao", 2, False)
    gerar_do_mapa(CADEADO, "cadeado", 2, False)


if __name__ == "__main__":
    gerar()

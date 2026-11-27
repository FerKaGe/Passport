"""
Imagens da tela de início do jogo.

Gera, em public/jogo/img/inicio/:
  previa.png            - cena do jogo (substitui xlurp-previa-jogo.png)
  cartao-<destino>.png  - 7 cartões-postais que contam a viagem
                          (substituem os 6 quadros xlurp-quadro-N.png)

Este script não desenha nada novo: ele MONTA cenas com as imagens que os
outros scripts já geraram (fundos, obstáculos e carimbos) e com o corgi.
Por isso precisa rodar depois deles.

Prévia: 280 x 177 pontos, ampliada 4 vezes = 1120 x 708 px.
Cartão: 280 x 187 pontos, ampliado 4 vezes = 1120 x 748 px.

Como rodar:  python ferramentas/sprites/inicio.py
"""

from PIL import Image, ImageDraw

from pixel import (CREME, DOURADO, DOURADO_ESCURO, MARINHO, MARINHO_ESCURO, PAPEL, PAPEL_SOMBRA, ampliar, caminho,
                   cor, escrever, largura_do_texto, nova_imagem, salvar_png)
from viajante import quadros_da_corrida

ESCALA = 4

# Um dicionário por destino: o que aparece no cartão-postal
CARTOES = [
    {"nome": "atacama", "titulo": "1. ATACAMA - CHILE", "obstaculo": "cacto",
     "linhas": ["PRIMEIRA PARADA: O DESERTO.", "CUIDADO COM OS CACTOS!"]},
    {"nome": "mendoza", "titulo": "2. MENDOZA - ARGENTINA", "obstaculo": "barril",
     "linhas": ["DIANTE DOS ANDES, BARRIS", "E UVAS PELO CAMINHO."]},
    {"nome": "espanha", "titulo": "3. ESPANHA", "obstaculo": "touro",
     "linhas": ["TOUROS E OLIVEIRAS SOB O", "SOL DA MANCHA."]},
    {"nome": "portugal", "titulo": "4. PORTUGAL", "obstaculo": "sardinha",
     "linhas": ["EM LISBOA, AZULEJOS E", "SARDINHAS PELAS RUAS."]},
    {"nome": "gibraltar", "titulo": "5. GIBRALTAR", "obstaculo": "macaco",
     "linhas": ["NO ROCHEDO, OS MACACOS", "MANDAM NA ESTRADA."]},
    {"nome": "mocambique", "titulo": "6. MOÇAMBIQUE", "obstaculo": "caranguejo",
     "linhas": ["NA PRAIA, COQUEIROS E", "CARANGUEJOS NA AREIA."]},
    {"nome": "orlando", "titulo": "7. ORLANDO - EUA", "obstaculo": "jacare",
     "linhas": ["CARIMBO FINAL: A NOITE DOS", "PARQUES E DOS FOGOS."]},
]


def abrir_reduzida(partes, escala):
    """
    Abre uma imagem já gerada e volta para o tamanho do desenho original
    (o contrário de ampliar). Para GIF, usa o primeiro quadro.
    """
    imagem = Image.open(caminho(*partes)).convert("RGBA")
    return imagem.resize((imagem.width // escala, imagem.height // escala), Image.NEAREST)


def montar_cena(destino, obstaculo):
    """Fundo do destino + corgi correndo + um obstáculo. 256 x 120 pontos."""
    cena = abrir_reduzida(["fundos", destino + ".png"], 6)
    corgi = quadros_da_corrida()[0]
    inimigo = abrir_reduzida(["obstaculos", obstaculo + ".gif"], 6)

    # alpha_composite cola respeitando a transparência da imagem colada
    cena.alpha_composite(corgi, (14, cena.height - corgi.height))
    cena.alpha_composite(inimigo, (170, cena.height - inimigo.height))
    return cena


def gerar_previa():
    imagem = nova_imagem(280, 177, MARINHO_ESCURO)
    desenho = ImageDraw.Draw(imagem)

    titulo = "JOGO DO PASSAPORTE"
    escrever(imagem, titulo, (280 - largura_do_texto(titulo)) // 2, 8, DOURADO, 8)

    # moldura dourada em volta da cena
    desenho.rectangle([9, 21, 270, 146], fill=cor(DOURADO_ESCURO))
    desenho.rectangle([10, 22, 269, 145], fill=cor(DOURADO))
    cena = montar_cena("atacama", "cacto")
    imagem.alpha_composite(cena, (12, 24))

    # o placar, como aparece no jogo
    escrever(imagem, "MILHAS 0420", 17, 29, MARINHO_ESCURO, 8)
    escrever(imagem, "MILHAS 0420", 16, 28, CREME, 8)
    escrever(imagem, "ATACAMA 2/5", 177, 29, MARINHO_ESCURO, 8)
    escrever(imagem, "ATACAMA 2/5", 176, 28, CREME, 8)

    rodape = "7 DESTINOS, 7 CARIMBOS"
    escrever(imagem, rodape, (280 - largura_do_texto(rodape)) // 2, 157, CREME, 8)

    salvar_png(ampliar(imagem, ESCALA), caminho("inicio", "previa.png"))


def gerar_cartao(cartao):
    imagem = nova_imagem(280, 187, PAPEL)
    desenho = ImageDraw.Draw(imagem)

    # borda do cartão
    desenho.rectangle([0, 0, 279, 186], outline=cor(PAPEL_SOMBRA), width=2)

    # a "foto"
    desenho.rectangle([11, 11, 268, 132], fill=cor(MARINHO))
    cena = montar_cena(cartao["nome"], cartao["obstaculo"])
    imagem.alpha_composite(cena, (12, 12))

    escrever(imagem, cartao["titulo"], 12, 141, MARINHO, 8)
    escrever(imagem, cartao["linhas"][0], 12, 157, "#6B5B3E", 8)
    escrever(imagem, cartao["linhas"][1], 12, 169, "#6B5B3E", 8)

    # o carimbo do destino no canto (40 x 40 pontos)
    carimbo = abrir_reduzida(["carimbos", cartao["nome"] + ".png"], 4)
    imagem.alpha_composite(carimbo, (232, 140))

    salvar_png(ampliar(imagem, ESCALA), caminho("inicio", "cartao-" + cartao["nome"] + ".png"))


if __name__ == "__main__":
    gerar_previa()
    for cartao in CARTOES:
        gerar_cartao(cartao)

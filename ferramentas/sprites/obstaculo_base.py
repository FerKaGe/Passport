"""
Parte comum dos obstáculos do Jogo do Passaporte.

Cada destino tem o seu script (obstaculos_atacama.py, obstaculos_mendoza.py...)
com os desenhos. Este arquivo guarda o que é igual para todos:
  - a paleta de cores;
  - os olhos (olhando para um lado, para o outro e fechados);
  - a função que transforma um desenho num GIF de 6 quadros.

A animação copia a da latinha do JumpGoat (latinha.gif):
  6 quadros, com 220 ou 440 ms cada, e ponto de 6 px.
  Nos quadros 1, 3 e 4 o obstáculo fica 1 ponto mais baixo ("respira").
"""

from pixel import ampliar, caminho, contornar, desenhar_mapa, nova_imagem, salvar_gif

ESCALA = 6

# Quanto tempo cada um dos 6 quadros fica na tela (igual à latinha)
DURACOES = [220, 440, 440, 220, 220, 220]

# O que os olhos fazem em cada quadro
OLHAR = ["esquerda", "direita", "esquerda", "direita", "fechado", "esquerda"]

# Em quais quadros o obstáculo fica achatado
ACHATADO = [False, True, False, True, True, False]

PALETA = {
    "K": "#1E0C14",  # contorno e traços do rosto
    "N": "#1A1420",  # preto
    "W": "#FFFFFF",  # branco
    "w": "#D8D8E4",  # branco na sombra
    "G": "#3E8E4A",  # verde
    "g": "#286834",  # verde escuro
    "V": "#76C46A",  # verde claro
    "R": "#DC2832",  # vermelho
    "r": "#961428",  # vermelho escuro
    "P": "#F2A0A8",  # rosa
    "O": "#F08A24",  # laranja
    "o": "#C0601A",  # laranja escuro
    "Y": "#FFD23F",  # amarelo
    "y": "#D9A020",  # amarelo escuro
    "M": "#8A5630",  # marrom
    "m": "#5C3A22",  # marrom escuro
    "B": "#C99A5B",  # madeira clara
    "C": "#8A8A9A",  # cinza
    "c": "#55556A",  # cinza escuro
    "S": "#C9D2DE",  # prata
    "A": "#1F6FB2",  # azul
    "a": "#144A80",  # azul escuro
    "L": "#8CC4EE",  # azul claro
    "U": "#7B3FA0",  # roxo de uva
    "u": "#4E2670",  # roxo escuro
    "X": "#B07AD6",  # lilás (brilho da uva)
    "T": "#B89A6A",  # pelo do macaco
    "t": "#8C7248",  # pelo na sombra
    "E": "#7D9A6A",  # verde de oliveira
    "e": "#5A7450",  # verde de oliveira escuro
    "D": "#3A3340",  # pedra escura
    "d": "#26212C",  # pedra mais escura
}


def mapa_do_olho(olhar, letra_da_palpebra):
    """Devolve o desenho de um olho (2 x 2 pontos) para o quadro pedido."""
    if olhar == "esquerda":
        return ["NW", "NW"]
    if olhar == "direita":
        return ["WN", "WN"]
    # fechado: a pálpebra tem a cor do obstáculo e embaixo fica um traço
    return [letra_da_palpebra * 2, "KK"]


def achatar(mapa, linha):
    """
    Devolve o desenho 1 ponto mais baixo: tira a linha de número "linha"
    e põe uma linha vazia no topo. O desenho continua com a mesma altura
    total, então o "pé" do obstáculo não sai do chão.
    """
    vazio = "." * len(mapa[0])
    return [vazio] + mapa[:linha] + mapa[linha + 1:]


def gerar_obstaculo(obstaculo, pasta):
    """
    Gera o GIF de um obstáculo.

    obstaculo é um dicionário com:
      nome     - nome do arquivo, sem ".gif"
      mapa     - o desenho, uma letra por ponto
      olhos    - lista com a posição (x, y) de cada olho dentro do mapa
      palpebra - letra da cor que cobre o olho quando ele pisca
      linha    - qual linha do mapa some no quadro achatado
    """
    mapa = obstaculo["mapa"]

    # +2 porque o contorno ocupa 1 ponto de cada lado
    largura = len(mapa[0]) + 2
    altura = len(mapa) + 2

    quadros = []
    for numero in range(6):
        quadro = nova_imagem(largura, altura)

        if ACHATADO[numero]:
            desenho = achatar(mapa, obstaculo["linha"])
        else:
            desenho = mapa
        desenhar_mapa(quadro, desenho, PALETA, 1, 1)

        for x, y in obstaculo["olhos"]:
            # no quadro achatado, o que fica acima da linha tirada desce 1 ponto
            if ACHATADO[numero] and y < obstaculo["linha"]:
                y = y + 1
            olho = mapa_do_olho(OLHAR[numero], obstaculo["palpebra"])
            desenhar_mapa(quadro, olho, PALETA, 1 + x, 1 + y)

        quadro = contornar(quadro, PALETA["K"])
        quadros.append(ampliar(quadro, ESCALA))

    salvar_gif(quadros, DURACOES, caminho(pasta, obstaculo["nome"] + ".gif"))


def conferir(obstaculo):
    """Avisa se alguma linha do mapa tem tamanho diferente das outras."""
    largura = len(obstaculo["mapa"][0])
    for numero in range(len(obstaculo["mapa"])):
        if len(obstaculo["mapa"][numero]) != largura:
            raise ValueError(f'{obstaculo["nome"]}: a linha {numero} não tem {largura} letras')


def gerar_todos(obstaculos):
    """Gera todos os obstáculos de uma lista."""
    for obstaculo in obstaculos:
        conferir(obstaculo)
        gerar_obstaculo(obstaculo, "obstaculos")

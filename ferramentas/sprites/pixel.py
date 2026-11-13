"""
Funções que todos os scripts de sprite usam.

A ideia da pixel art feita por código:
  1. o desenho é feito PEQUENO (por exemplo 42 x 49 pontos);
  2. cada ponto é pintado com uma cor de uma paleta curta;
  3. no fim a imagem é AMPLIADA sem suavizar (vizinho mais próximo),
     então cada ponto vira um quadrado: o "pixel" da pixel art.

Biblioteca usada: Pillow (PIL). Só é usada aqui, para gerar as imagens;
o site não depende dela.
"""

import os

from PIL import Image, ImageDraw, ImageFont

# Pasta deste arquivo, para os caminhos funcionarem de qualquer lugar
PASTA_SPRITES = os.path.dirname(os.path.abspath(__file__))
PASTA_PROJETO = os.path.dirname(os.path.dirname(PASTA_SPRITES))

# Onde as imagens geradas são gravadas
PASTA_IMG = os.path.join(PASTA_PROJETO, "public", "jogo", "img")

# A fonte de fliperama do site. No tamanho 8 (ou 16, 24...) cada letra
# ocupa exatamente 8 x 8 pontos, sem borrão.
ARQUIVO_FONTE = os.path.join(PASTA_PROJETO, "public", "assets", "fontes", "PressStart2P-Regular.ttf")

TRANSPARENTE = (0, 0, 0, 0)

# Paleta do Passport.
# Os scripts usam estes nomes em vez de repetir o código da cor.
MARINHO_ESCURO = "#0B132B"
MARINHO = "#14213D"
MARINHO_CLARO = "#2B3A5C"
DOURADO = "#E0B04A"
DOURADO_ESCURO = "#A9782A"
DOURADO_CLARO = "#F6D98A"
PAPEL = "#F4E9D0"
PAPEL_SOMBRA = "#D9C9A3"
CREME = "#F8F4E8"
TINTA_VERMELHA = "#C1121F"
TINTA_VERDE = "#1F7A6E"
CONTORNO = "#1A1420"


def cor(texto):
    """Transforma "#RRGGBB" em (vermelho, verde, azul, opacidade)."""
    vermelho = int(texto[1:3], 16)
    verde = int(texto[3:5], 16)
    azul = int(texto[5:7], 16)
    return (vermelho, verde, azul, 255)


def nova_imagem(largura, altura, fundo=None):
    """Cria uma imagem vazia. Sem fundo, ela começa toda transparente."""
    if fundo is None:
        return Image.new("RGBA", (largura, altura), TRANSPARENTE)
    return Image.new("RGBA", (largura, altura), cor(fundo))


def desenhar_mapa(imagem, mapa, paleta, x0=0, y0=0):
    """
    Pinta na imagem um desenho escrito em texto.

    mapa   - lista de linhas; cada LETRA é um ponto do desenho
    paleta - dicionário que diz a cor de cada letra, ex.: {"L": "#E69C58"}
    x0, y0 - onde o canto de cima, à esquerda, do desenho vai ficar

    O ponto "." não pinta nada (fica o que já estava na imagem).
    """
    for y in range(len(mapa)):
        linha = mapa[y]
        for x in range(len(linha)):
            letra = linha[x]
            if letra == "." or letra == " ":
                continue
            dentro = 0 <= x0 + x < imagem.width and 0 <= y0 + y < imagem.height
            if dentro:
                imagem.putpixel((x0 + x, y0 + y), cor(paleta[letra]))


def contornar(imagem, cor_contorno=CONTORNO):
    """
    Desenha o contorno escuro em volta do desenho.

    Para cada ponto transparente, olha os 4 vizinhos (cima, baixo, esquerda,
    direita). Se algum deles está pintado, o ponto vira contorno.
    Devolve uma imagem nova; a original não muda.
    """
    saida = imagem.copy()
    for y in range(imagem.height):
        for x in range(imagem.width):
            if imagem.getpixel((x, y))[3] != 0:
                continue  # já está pintado
            vizinhos = [(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)]
            for vx, vy in vizinhos:
                dentro = 0 <= vx < imagem.width and 0 <= vy < imagem.height
                if dentro and imagem.getpixel((vx, vy))[3] != 0:
                    saida.putpixel((x, y), cor(cor_contorno))
                    break
    return saida


def ampliar(imagem, escala):
    """Aumenta a imagem "escala" vezes. NEAREST = sem suavizar: cada ponto vira um quadrado."""
    return imagem.resize((imagem.width * escala, imagem.height * escala), Image.NEAREST)


def escrever(imagem, texto, x, y, cor_texto, tamanho=8):
    """Escreve com a fonte Press Start 2P, sem suavizar as bordas das letras."""
    fonte = ImageFont.truetype(ARQUIVO_FONTE, tamanho)
    desenho = ImageDraw.Draw(imagem)
    desenho.fontmode = "1"  # "1" = liga/desliga: nenhum ponto meio transparente
    desenho.text((x, y), texto, font=fonte, fill=cor(cor_texto))


def largura_do_texto(texto, tamanho=8):
    """Na Press Start 2P todas as letras têm a mesma largura: o tamanho da fonte."""
    return len(texto) * tamanho


def caminho(*partes):
    """Monta o caminho de um arquivo dentro de public/jogo/img e cria a pasta se faltar."""
    destino = os.path.join(PASTA_IMG, *partes)
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    return destino


def _tabela_de_cores(quadros):
    """Junta as cores usadas em todos os quadros. A posição 0 é a transparente."""
    cores = [TRANSPARENTE]
    for quadro in quadros:
        for _, c in quadro.getcolors(quadro.width * quadro.height):
            if c[3] == 0:
                continue
            if c not in cores:
                cores.append(c)
    if len(cores) > 256:
        raise ValueError("Mais de 255 cores: um GIF/PNG de paleta não aguenta")
    return cores


def _com_paleta(quadro, cores):
    """Troca cada ponto pelo NÚMERO da cor na tabela (imagem de paleta, modo "P")."""
    numero_da_cor = {}
    for i in range(len(cores)):
        numero_da_cor[cores[i]] = i

    numeros = []
    for c in quadro.getdata():
        if c[3] == 0:
            numeros.append(0)
        else:
            numeros.append(numero_da_cor[c])

    saida = Image.new("P", quadro.size)
    saida.putdata(numeros)

    tabela = []
    for c in cores:
        tabela.extend([c[0], c[1], c[2]])
    saida.putpalette(tabela)
    return saida


def salvar_png(imagem, destino):
    """
    Grava um PNG leve: em vez de guardar 4 números por ponto (vermelho, verde,
    azul, opacidade), guarda uma tabela de cores e 1 número por ponto.
    """
    cores = _tabela_de_cores([imagem])
    com_paleta = _com_paleta(imagem, cores)
    tem_transparencia = imagem.getextrema()[3][0] == 0
    if tem_transparencia:
        com_paleta.save(destino, optimize=True, transparency=0)
    else:
        com_paleta.save(destino, optimize=True)
    mostrar(destino, imagem, 1)


def salvar_gif(quadros, duracoes, destino, apagar_entre_quadros=True):
    """
    Grava um GIF animado.

    quadros  - lista de imagens do mesmo tamanho, na ordem em que aparecem
    duracoes - quanto tempo cada quadro fica na tela, em milissegundos
               (um número só vale para todos os quadros)
    apagar_entre_quadros - True apaga o quadro anterior antes de desenhar o
               próximo (disposal=2). É o certo para personagens: senão, nas
               partes transparentes, um quadro ficaria por cima do outro.
               False (disposal=1) deixa o quadro anterior na tela e o arquivo
               só guarda o pedaço que mudou. Serve para a moldura, em que a
               parte transparente é sempre a mesma: o arquivo fica bem menor.

    loop=0 repete para sempre.
    """
    cores = _tabela_de_cores(quadros)
    com_paleta = []
    for quadro in quadros:
        com_paleta.append(_com_paleta(quadro, cores))

    if apagar_entre_quadros:
        descarte = 2
    else:
        descarte = 1

    # save_all + append_images: grava o primeiro quadro e, em seguida, os outros.
    # transparency=0: a cor de número 0 da tabela é a transparente.
    com_paleta[0].save(
        destino,
        save_all=True,
        append_images=com_paleta[1:],
        duration=duracoes,
        loop=0,
        transparency=0,
        disposal=descarte,
        optimize=False,
    )
    mostrar(destino, quadros[0], len(quadros))


def mostrar(destino, imagem, quantos_quadros):
    """Escreve no terminal o que foi gravado."""
    nome = os.path.relpath(destino, PASTA_PROJETO)
    kb = os.path.getsize(destino) / 1024
    print(f"{nome}: {imagem.width}x{imagem.height} px, {quantos_quadros} quadro(s), {kb:.1f} KB")

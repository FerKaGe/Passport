"""
Fundos das 7 fases do Jogo do Passaporte.

Gera public/jogo/img/fundos/<destino>.png, um por destino.

O formato é o do céu do JumpGoat (ceu_sem_nuvens_grande.png):
desenho de 256 x 120 pontos, ampliado 6 vezes = 1536 x 720 px,
com o céu em faixas e uma tira "quadriculada" entre uma faixa e outra.

Diferente dos personagens, aqui o desenho não é escrito letra por letra:
é feito com formas (retângulos, triângulos, círculos) em coordenadas.
A coordenada (0, 0) é o canto de cima, à esquerda; x cresce para a
direita e y cresce para BAIXO.

Como rodar:  python ferramentas/sprites/fundos.py
"""

import random

from PIL import ImageDraw

from pixel import ampliar, caminho, cor, nova_imagem, salvar_png

LARGURA = 256
ALTURA = 120
ESCALA = 6
CHAO = 108  # linha onde o chão começa (os 12 pontos de baixo são chão)


# ---------------------------------------------------------------------------
# Peças que vários fundos usam
# ---------------------------------------------------------------------------

def pintar_ceu(imagem, cores):
    """
    Pinta o céu em faixas, de cima para baixo, uma cor por faixa.
    Entre duas faixas fica uma tira em xadrez com as duas cores, que de
    longe parece uma cor intermediária (isso se chama "dithering").
    """
    desenho = ImageDraw.Draw(imagem)
    altura_da_faixa = CHAO // len(cores)
    tira = 6  # altura da tira em xadrez

    for numero in range(len(cores)):
        topo = numero * altura_da_faixa
        desenho.rectangle([0, topo, LARGURA, CHAO], fill=cor(cores[numero]))

        if numero > 0:
            for y in range(topo - tira // 2, topo + tira // 2):
                for x in range(LARGURA):
                    if (x + y) % 2 == 0:
                        imagem.putpixel((x, y), cor(cores[numero - 1]))
                    else:
                        imagem.putpixel((x, y), cor(cores[numero]))


def pintar_estrelas(imagem, quantidade, cores, semente, ate_y):
    """
    Espalha estrelas pela parte de cima do céu.
    random.seed(semente) faz o sorteio dar sempre o mesmo resultado:
    rodar o script de novo gera exatamente a mesma imagem.
    """
    random.seed(semente)
    for numero in range(quantidade):
        x = random.randint(2, LARGURA - 3)
        y = random.randint(2, ate_y)
        c = cor(random.choice(cores))
        imagem.putpixel((x, y), c)
        # uma em cada seis estrelas é maior, em forma de cruz
        if numero % 6 == 0:
            for vx, vy in [(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)]:
                imagem.putpixel((vx, vy), c)


def pintar_chao(imagem, cor_chao, cor_borda, cor_detalhe, semente):
    """Chão: uma faixa, uma linha mais clara em cima e pontinhos sorteados."""
    desenho = ImageDraw.Draw(imagem)
    desenho.rectangle([0, CHAO, LARGURA, ALTURA], fill=cor(cor_chao))
    desenho.rectangle([0, CHAO, LARGURA, CHAO], fill=cor(cor_borda))
    random.seed(semente)
    for _ in range(70):
        x = random.randint(0, LARGURA - 3)
        y = random.randint(CHAO + 2, ALTURA - 2)
        desenho.rectangle([x, y, x + 1, y], fill=cor(cor_detalhe))


def montanha(desenho, x_esquerda, x_pico, x_direita, y_pico, cor_montanha, cor_neve=None):
    """Um triângulo com a base no chão. Com cor_neve, o pico fica branco."""
    desenho.polygon([(x_esquerda, CHAO), (x_pico, y_pico), (x_direita, CHAO)], fill=cor(cor_montanha))
    if cor_neve is not None:
        altura = (CHAO - y_pico) // 4
        meia_largura = (x_direita - x_esquerda) // 9
        desenho.polygon(
            [(x_pico - meia_largura, y_pico + altura), (x_pico, y_pico), (x_pico + meia_largura, y_pico + altura)],
            fill=cor(cor_neve),
        )


def nuvem(desenho, x, y, cor_nuvem):
    """Uma nuvem pequena feita de 3 retângulos."""
    desenho.rectangle([x + 3, y, x + 12, y + 2], fill=cor(cor_nuvem))
    desenho.rectangle([x, y + 3, x + 18, y + 5], fill=cor(cor_nuvem))
    desenho.rectangle([x + 2, y + 6, x + 15, y + 6], fill=cor(cor_nuvem))


def palmeira(desenho, x, altura, cor_palmeira):
    """Silhueta de coqueiro: tronco e 5 folhas."""
    topo = CHAO - altura
    desenho.rectangle([x, topo, x + 1, CHAO], fill=cor(cor_palmeira))
    for dx, dy in [(-8, 2), (-5, -3), (0, -5), (6, -3), (9, 2)]:
        desenho.line([(x, topo), (x + dx, topo + dy)], fill=cor(cor_palmeira), width=2)
        desenho.line([(x + dx, topo + dy), (x + dx + (2 if dx > 0 else -2), topo + dy + 3)], fill=cor(cor_palmeira), width=1)


def salvar(imagem, nome):
    salvar_png(ampliar(imagem, ESCALA), caminho("fundos", nome + ".png"))


# ---------------------------------------------------------------------------
# Um fundo por destino
# ---------------------------------------------------------------------------

def atacama():
    """Deserto ao pôr do sol, com o vulcão Licancabur e dunas."""
    imagem = nova_imagem(LARGURA, ALTURA)
    pintar_ceu(imagem, ["#2E1A3A", "#5B2440", "#9A3B3B", "#D4683A", "#F2A65A"])
    pintar_estrelas(imagem, 40, ["#FFFFFF", "#FFE9A8"], 1, 40)
    desenho = ImageDraw.Draw(imagem)

    desenho.ellipse([150, 84, 186, 120], fill=cor("#FFD98A"))          # sol
    montanha(desenho, 20, 80, 150, 46, "#6B2B33", "#F4D9C0")           # vulcão
    montanha(desenho, 130, 200, 262, 66, "#7C3436")
    montanha(desenho, -30, 20, 90, 78, "#7C3436")
    # dunas: duas elipses achatadas, cortadas pelo chão
    desenho.ellipse([-40, 96, 120, 130], fill=cor("#B5562F"))
    desenho.ellipse([90, 92, 300, 136], fill=cor("#C4673A"))

    pintar_chao(imagem, "#D99A5B", "#F0C080", "#B5743A", 11)
    salvar(imagem, "atacama")


def mendoza():
    """Dia claro, Cordilheira dos Andes com neve e fileiras de videiras."""
    imagem = nova_imagem(LARGURA, ALTURA)
    pintar_ceu(imagem, ["#2F6FB5", "#4C8CCB", "#74ACDF", "#A6CCEC", "#D6E9F5"])
    desenho = ImageDraw.Draw(imagem)

    nuvem(desenho, 30, 14, "#FFFFFF")
    nuvem(desenho, 170, 26, "#FFFFFF")
    nuvem(desenho, 110, 8, "#EAF3FA")
    montanha(desenho, 60, 128, 200, 30, "#5B6F8F", "#FFFFFF")          # Aconcágua
    montanha(desenho, -20, 50, 120, 50, "#6E82A0", "#FFFFFF")
    montanha(desenho, 150, 215, 280, 46, "#6E82A0", "#FFFFFF")
    desenho.ellipse([-60, 88, 150, 140], fill=cor("#6A8F4A"))          # colinas
    desenho.ellipse([110, 90, 320, 140], fill=cor("#5C8243"))

    # videiras: estacas com folhas, repetidas a cada 12 pontos
    for x in range(4, LARGURA, 12):
        desenho.rectangle([x, 100, x, CHAO], fill=cor("#5C3A22"))
        desenho.rectangle([x - 3, 98, x + 3, 102], fill=cor("#2F6B34"))
        desenho.point((x - 1, 103), fill=cor("#7B3FA0"))
        desenho.point((x + 2, 101), fill=cor("#7B3FA0"))

    pintar_chao(imagem, "#8A5A3A", "#A9744C", "#6B4428", 22)
    salvar(imagem, "mendoza")


def espanha():
    """Fim de tarde na Mancha: sol grande, colinas e moinhos de vento."""
    imagem = nova_imagem(LARGURA, ALTURA)
    pintar_ceu(imagem, ["#7A1F1F", "#AA2E1E", "#D4582A", "#F08A32", "#F6C04A"])
    desenho = ImageDraw.Draw(imagem)

    desenho.ellipse([96, 40, 150, 94], fill=cor("#FFE08A"))            # sol
    desenho.ellipse([-50, 80, 140, 150], fill=cor("#8A3A1C"))          # colinas
    desenho.ellipse([100, 86, 320, 150], fill=cor("#7A3218"))

    # moinhos: corpo branco, telhado escuro e 4 pás em X
    for x, base in [(40, 88), (190, 92), (228, 96)]:
        desenho.polygon([(x - 5, base), (x + 5, base), (x + 4, base - 14), (x - 4, base - 14)], fill=cor("#F4E9D0"))
        desenho.polygon([(x - 5, base - 14), (x, base - 20), (x + 5, base - 14)], fill=cor("#4A2412"))
        desenho.rectangle([x - 1, base - 4, x + 1, base], fill=cor("#4A2412"))
        for dx, dy in [(-9, -9), (9, -9), (-9, 9), (9, 9)]:
            desenho.line([(x, base - 15), (x + dx, base - 15 + dy)], fill=cor("#3A1A0C"), width=1)

    pintar_chao(imagem, "#C98A3A", "#E9B45A", "#A46A24", 33)
    salvar(imagem, "espanha")


def portugal():
    """Lisboa: o rio Tejo, a ponte vermelha e casas de telhado laranja."""
    imagem = nova_imagem(LARGURA, ALTURA)
    pintar_ceu(imagem, ["#1F4F8F", "#3F7FC0", "#6FA8DC", "#A9CDEC", "#DCEBF6"])
    desenho = ImageDraw.Draw(imagem)

    nuvem(desenho, 200, 12, "#FFFFFF")
    nuvem(desenho, 60, 22, "#EAF3FA")
    desenho.rectangle([0, 84, LARGURA, CHAO], fill=cor("#1F6FB2"))     # rio
    for x in range(6, LARGURA, 22):
        desenho.rectangle([x, 90 + (x % 3) * 4, x + 7, 90 + (x % 3) * 4], fill=cor("#8CC4EE"))

    # ponte: tabuleiro, duas torres e os cabos em V
    vermelho = cor("#C1121F")
    desenho.rectangle([0, 74, LARGURA, 76], fill=vermelho)
    for x in [70, 180]:
        desenho.rectangle([x, 44, x + 3, 84], fill=vermelho)
        desenho.line([(x + 1, 46), (x - 52, 74)], fill=vermelho, width=1)
        desenho.line([(x + 1, 46), (x + 54, 74)], fill=vermelho, width=1)

    # casas: parede clara, telhado laranja e janelas azuis
    paredes = ["#F4E9D0", "#F6D98A", "#E8B8A0", "#FFFFFF", "#CFE3F2"]
    x = -4
    numero = 0
    while x < LARGURA:
        largura = 16 + (numero * 7) % 9
        altura = 12 + (numero * 5) % 10
        topo = CHAO - altura
        desenho.rectangle([x, topo, x + largura, CHAO], fill=cor(paredes[numero % len(paredes)]))
        desenho.polygon([(x - 1, topo), (x + largura // 2, topo - 6), (x + largura + 1, topo)], fill=cor("#D4582A"))
        for janela in range(x + 3, x + largura - 3, 6):
            desenho.rectangle([janela, topo + 4, janela + 2, topo + 7], fill=cor("#1F6FB2"))
        x = x + largura + 2
        numero = numero + 1

    pintar_chao(imagem, "#D9CDB0", "#F4E9D0", "#8D93A6", 44)
    salvar(imagem, "portugal")


def gibraltar():
    """O Rochedo de Gibraltar visto do mar."""
    imagem = nova_imagem(LARGURA, ALTURA)
    pintar_ceu(imagem, ["#2B3A5C", "#44608A", "#6F92B5", "#A6C0D6", "#DCE6EC"])
    desenho = ImageDraw.Draw(imagem)

    nuvem(desenho, 20, 18, "#FFFFFF")
    nuvem(desenho, 196, 10, "#EEF3F7")
    desenho.rectangle([0, 90, LARGURA, CHAO], fill=cor("#2F6F9A"))     # mar
    for x in range(0, LARGURA, 18):
        desenho.rectangle([x + (x % 5), 96 + (x % 4) * 3, x + (x % 5) + 6, 96 + (x % 4) * 3], fill=cor("#8CC4EE"))

    # o Rochedo: um lado quase reto e o outro em rampa
    desenho.polygon([(60, 92), (96, 34), (112, 26), (128, 30), (150, 44), (200, 80), (214, 92)], fill=cor("#8D97A3"))
    desenho.polygon([(96, 34), (112, 26), (120, 60), (100, 92), (60, 92)], fill=cor("#B8C1CB"))  # face clara
    desenho.polygon([(120, 80), (200, 80), (214, 92), (100, 92)], fill=cor("#5E8253"))            # mato na base
    for x in range(110, 205, 9):
        desenho.rectangle([x, 86, x + 3, 89], fill=cor("#F4E9D0"))     # casinhas

    pintar_chao(imagem, "#8D939E", "#B8BDC7", "#6A707C", 55)
    salvar(imagem, "gibraltar")


def mocambique():
    """Praia no Oceano Índico ao entardecer, com um barco à vela e coqueiros."""
    imagem = nova_imagem(LARGURA, ALTURA)
    pintar_ceu(imagem, ["#0E4D64", "#1A8A8A", "#5CC4AE", "#F6D36A", "#F79A4A"])
    desenho = ImageDraw.Draw(imagem)

    desenho.ellipse([40, 62, 76, 98], fill=cor("#FFF0B0"))             # sol
    desenho.rectangle([0, 84, LARGURA, CHAO], fill=cor("#1CA7A0"))     # mar
    desenho.rectangle([0, 84, LARGURA, 86], fill=cor("#0E7C86"))
    for x in range(0, LARGURA, 16):
        desenho.rectangle([x + (x % 7), 92 + (x % 3) * 5, x + (x % 7) + 8, 92 + (x % 3) * 5], fill=cor("#D8F6EE"))

    # dhow: o barco de vela triangular da costa de Moçambique
    desenho.polygon([(150, 84), (178, 84), (174, 89), (154, 89)], fill=cor("#3A2418"))
    desenho.polygon([(163, 60), (163, 82), (180, 82)], fill=cor("#FBF7F0"))
    desenho.rectangle([162, 58, 162, 84], fill=cor("#3A2418"))

    for x, altura in [(14, 38), (28, 30), (222, 42), (240, 32)]:
        palmeira(desenho, x, altura, "#0B3B3C")

    pintar_chao(imagem, "#F1DBA0", "#FFF3CF", "#D2B36C", 66)
    salvar(imagem, "mocambique")


def orlando():
    """Noite de parque: castelo, roda-gigante e fogos de artifício."""
    imagem = nova_imagem(LARGURA, ALTURA)
    pintar_ceu(imagem, ["#070B24", "#0D1640", "#13245E", "#1B3A7E", "#2A5AA0"])
    pintar_estrelas(imagem, 70, ["#FFFFFF", "#BFD9FF", "#FFE9A8"], 7, 70)
    desenho = ImageDraw.Draw(imagem)

    # fogos: pontos em círculo ao redor de um centro
    for cx, cy, raio, cor_fogo in [(48, 30, 12, "#FF7AB6"), (200, 24, 14, "#FFD23F"), (128, 16, 9, "#6FE3FF")]:
        for dx, dy in [(1, 0), (0.7, 0.7), (0, 1), (-0.7, 0.7), (-1, 0), (-0.7, -0.7), (0, -1), (0.7, -0.7)]:
            for distancia in [raio * 0.45, raio * 0.75, raio]:
                x = round(cx + dx * distancia)
                y = round(cy + dy * distancia)
                desenho.point((x, y), fill=cor(cor_fogo))
        desenho.point((cx, cy), fill=cor("#FFFFFF"))

    # roda-gigante
    silhueta = cor("#060A1E")
    desenho.ellipse([186, 58, 232, 104], outline=silhueta, width=2)
    for dx, dy in [(23, 0), (16, 16), (0, 23), (-16, 16)]:
        desenho.line([(209 - dx, 81 - dy), (209 + dx, 81 + dy)], fill=silhueta, width=1)
    desenho.polygon([(209, 81), (198, CHAO), (220, CHAO)], fill=silhueta)
    for dx, dy in [(23, 0), (16, 16), (0, 23), (-16, 16), (-23, 0), (-16, -16), (0, -23), (16, -16)]:
        desenho.rectangle([209 + dx - 1, 81 + dy - 1, 209 + dx + 1, 81 + dy + 1], fill=cor("#FFD23F"))

    # castelo: 5 torres com telhado em ponta e janelas acesas
    for x, largura, altura in [(86, 8, 34), (98, 10, 50), (112, 12, 40), (128, 10, 56), (142, 8, 36)]:
        topo = CHAO - altura
        desenho.rectangle([x, topo, x + largura, CHAO], fill=silhueta)
        desenho.polygon([(x - 1, topo), (x + largura // 2, topo - 10), (x + largura + 1, topo)], fill=cor("#101A4A"))
        desenho.rectangle([x + largura // 2 - 1, topo + 6, x + largura // 2, topo + 9], fill=cor("#FFD23F"))
    desenho.rectangle([80, 92, 156, CHAO], fill=silhueta)
    desenho.rectangle([114, 98, 122, CHAO], fill=cor("#FFD23F"))        # portão aceso

    pintar_chao(imagem, "#1C2238", "#3A4468", "#2A3250", 77)
    for x in range(6, LARGURA, 24):
        desenho.rectangle([x, 114, x + 9, 114], fill=cor("#FFD23F"))    # faixa da rua
    salvar(imagem, "orlando")


if __name__ == "__main__":
    atacama()
    mendoza()
    espanha()
    portugal()
    gibraltar()
    mocambique()
    orlando()

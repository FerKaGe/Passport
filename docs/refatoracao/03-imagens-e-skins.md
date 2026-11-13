# 03 — Imagens novas, elementos tematizados e skins

Terceira etapa da organização do Passport. A primeira foi o diagnóstico ([01-diagnostico.md](./01-diagnostico.md)) e a segunda, a refatoração do jogo ([02-refatoracao.md](./02-refatoracao.md)).

## Como ler este documento

- Cada palavra técnica é explicada na primeira vez em que aparece e está no [Glossário](#glossário), no fim.
- Os trechos de código são reais. Em cima de cada um vai o caminho do arquivo e a linha, assim: `public/js/skins.js:59`.
- No fim há uma lista de [perguntas que a banca pode fazer](#perguntas-que-a-banca-pode-fazer), com respostas curtas.

---

## 1. Resumo

O que foi feito, em três commits:

| Parte | Commit | O que mudou |
|---|---|---|
| A | `5f59989` | Todas as imagens do jogo foram trocadas. São 52 arquivos, gerados por scripts Python (16 arquivos em `ferramentas/sprites/`: 13 geram imagens, 2 são de apoio e 1 roda todos). As imagens do JumpGoat foram apagadas. |
| B | `df1bb8a` | Botões e placar viraram objetos de viagem: passaporte, avião, cartão de embarque, página de passaporte, carimbo, etiqueta de bagagem, placa de aeroporto. |
| C | `6827dd2` | 8 skins (uma padrão e uma por destino), trocadas pela barra lateral e lembradas pelo navegador. |

O jogo foi testado inteiro, com a arte nova, passando pelas 7 fases. Os resultados estão na [seção 9](#9-o-que-foi-testado).

**O que ficou para você fazer ou decidir:**

- Jogar com as mãos. Os testes foram feitos por um robô (um script que aperta as teclas); ele confirma que dá para passar, não que está gostoso de jogar.
- Olhar o corgi e os obstáculos e dizer se algum precisa de retoque. Como são scripts, mudar um desenho é editar letras num arquivo e rodar de novo.
- As páginas públicas (Home, Login e Cadastro) **não mudam com a skin**. Elas ainda têm o visual da web-data-viz e serão refeitas na etapa da Home.
- O desbloqueio das skins e o salvamento no banco estão só planejados ([seção 8](#8-plano-desbloqueio-por-carimbo-e-salvamento-no-banco)).

---

## 2. Decisões que tomei no caminho

O pedido desta etapa e as decisões anteriores não batiam em alguns pontos. Segue o que escolhi e por quê. Se alguma estiver errada, é só avisar.

| # | Ponto | O que fiz | Por quê |
|---|---|---|---|
| 1 | O pedido fala em "uma viajante"; a decisão D6 do diagnóstico diz "corgi bípede" | O protagonista é o **corgi bípede, vestido de viajante** | Segui a D6, que você confirmou duas vezes. Usei as cores do corgi de `features/game/` e a roupa da protagonista de lá (colete azul-marinho, botões dourados e o azul da capa, que virou cachecol). |
| 2 | O pedido manda as imagens para `public/jogo/img/`; a D1 dizia `public/assets/jogo/` | Imagens em **`public/jogo/img/`** | Segui o pedido mais novo. A pasta antiga foi apagada. |
| 3 | "Mesmo tamanho dos originais" | Personagem, obstáculos e fundos têm o mesmo tamanho. **A moldura mudou**: de 1918×987 para 1200×759 px | A moldura antiga era esticada de um jeito diferente na largura e na altura, e os pontos do desenho ficavam tortos. A nova é desenhada no tamanho exato em que aparece. No CSS mudaram 3 números, em 1 px cada. |
| 4 | "2 a 3 obstáculos por destino" | **2 por destino**, 14 no total | Preferi 14 bem acabados a 21 corridos. Acrescentar um é escrever um desenho e uma linha no `fases.js`. |
| 5 | Ideia do leque para a Espanha | Troquei por um **touro** | Desenhei o leque duas vezes e ele parecia um sorvete. O touro se reconhece de primeira. |
| 6 | Ideias para Gibraltar (só o macaco) | Acrescentei a **cabine telefônica vermelha** | Precisava de um segundo obstáculo, e a cabine é a cara de Gibraltar. |
| 7 | "Quadros da história" (eram 6, e a página não usava) | **7 cartões-postais**, um por destino, que agora aparecem na tela de início | Um por fase conta a viagem inteira. |
| 8 | Fontes das skins | Baixei 8 fontes de pixel com licença livre (OFL) para `public/assets/fontes/` | Cada skin precisa de uma fonte, e o site não pode depender de internet. A licença de cada uma está na mesma pasta. |
| 9 | Pillow não estava instalado | Criei um ambiente Python em `ferramentas/.venv/` (fora do Git) e instalei o Pillow lá | O Pillow é usado só para gerar as imagens. O site continua sem nenhuma biblioteca nova. |

---

## 3. O que encontrei nos assets originais

Antes de desenhar, abri cada imagem do JumpGoat com um script e medi. **Ponto** é como vou chamar cada quadradinho da pixel art: o desenho é feito numa grade pequena e depois ampliado.

| Asset do JumpGoat | Tamanho | Quadros | Tamanho do ponto | Grade do desenho | Cores |
|---|---|---|---|---|---|
| `luna_correndo.gif` | 252×294 px | 6, de 90 ms | 6 px | 42×49 pontos | 18 |
| `lunaGameOver.gif` | 252×294 px | 32, de 70 ms | 6 px | 42×49 pontos | 18 |
| `latinha.gif` | 120×180 px | 6, de 220 ou 440 ms | 6 px | 20×30 pontos | 16 |
| `ceu_sem_nuvens_grande.png` | 1536×720 px | 1 | 6 px | 256×120 pontos | 7 |
| `moldura_fliperama_animada_tela_transparente.gif` | 1918×987 px | 8, de 180 ms | 3 px | cerca de 639×329 pontos | 41 |
| `xlurp-previa-jogo.png` | 1120×708 px | 1 | não é pixel art de grade | — | 1032 |
| `xlurp-quadro-1.png` a `-6.png` | 1120×748 px | 1 cada | não é pixel art de grade | — | mais de 12 mil |
| `gymfabs_logo_header@4x.png` | 676×172 px | 1 | não é pixel art de grade | — | 618 |

O que isso me ensinou sobre o estilo:

- **Contorno escuro**, quase preto, com 1 ponto de espessura em volta de tudo.
- **Poucas cores**: cada coisa tem uma cor base, uma mais clara (luz) e uma mais escura (sombra), sem degradê.
- **A Luna tem a cabeça grande** (metade da altura) e o corpo pequeno. O corgi segue essa estrutura.
- **A latinha quase não se mexe**: os olhos olham para um lado e para o outro, piscam, e o corpo "respira" 1 ponto para baixo.
- **O céu é feito de faixas**, e entre uma faixa e outra há uma tira em xadrez que mistura as duas cores.

Como descobri o tamanho do ponto: percorri linhas e colunas da imagem medindo o comprimento de cada sequência de pixels da mesma cor. Na Luna, todas as sequências têm 6, 12, 18, 24... pixels, sempre múltiplos de 6. Então o ponto tem 6 px.

---

## 4. Como um script de sprite funciona

**Sprite** é o nome que os jogos dão a uma imagem de personagem ou objeto.

### 4.1 A ideia

1. O desenho é escrito como **texto**: cada letra é um ponto.
2. Uma **paleta** diz que cor cada letra tem.
3. O script pinta uma imagem pequena, ponto por ponto.
4. No fim a imagem é **ampliada** 6 vezes sem suavizar: cada ponto vira um quadrado de 6×6 px.
5. Para animar, o script faz vários desenhos quase iguais (os **quadros**) e grava todos num GIF.

Os scripts usam a biblioteca **Pillow** (no código ela se chama `PIL`), que sabe criar, pintar e gravar imagens.

### 4.2 Os três arquivos envolvidos

Vou explicar o script do Atacama inteiro. Ele usa dois arquivos de apoio:

| Arquivo | Para que serve |
|---|---|
| `ferramentas/sprites/obstaculos_atacama.py` | Os **desenhos** do cacto e da pedra vulcânica. É o script que você roda. |
| `ferramentas/sprites/obstaculo_base.py` | O que é igual para todos os obstáculos: a paleta, os olhos e a função que monta os 6 quadros. |
| `ferramentas/sprites/pixel.py` | Funções que todos os scripts usam: pintar um desenho, fazer o contorno, ampliar, gravar. |

### 4.3 `obstaculos_atacama.py`, linha a linha

**Linhas 1 a 6: o comentário de abertura.** Em Python, um texto entre três aspas no começo do arquivo é a descrição do arquivo. Diz o que ele gera e como rodar.

**Linha 8: a importação.**

```python
# ferramentas/sprites/obstaculos_atacama.py:8
from obstaculo_base import gerar_todos
```

`from ... import ...` traz uma função que está em outro arquivo. É o mesmo papel do `<script src="...">` no HTML: usar aqui um código escrito em outro lugar. A função `gerar_todos` está em `obstaculo_base.py`.

**Linhas 10 a 39: o desenho do cacto.**

```python
# ferramentas/sprites/obstaculos_atacama.py:10-18 (começo)
CACTO = [
    "......PP......",
    ".....PYYP.....",
    "....GVGGGg....",
    "....GVGGGg....",
    "....GVGGGg....",
    "....GVGGGg.GVg",
    "....GVGGGg.GVg",
    "GVg.GVGGGg.GVg",
```

`CACTO` é uma **lista** (o vetor do Python) de textos. Cada texto é uma linha do desenho, de cima para baixo. Cada letra é um ponto:

- `.` é transparente: não pinta nada.
- `G` é verde, `V` é verde claro, `g` é verde escuro.
- `P` é rosa e `Y` é amarelo: a flor no topo do cacto.
- `K` é o contorno escuro: aqui desenha as sobrancelhas e a boca.

Repare na ordem `GVGGGg` do tronco: um ponto verde, um **verde claro** (a luz bate na esquerda), três verdes e um **verde escuro** (a sombra fica na direita). É assim que a pixel art dá volume com três cores.

O desenho tem 14 letras de largura e 28 linhas de altura. Todas as linhas precisam ter o mesmo número de letras; se eu errar, o script avisa (função `conferir`, em `obstaculo_base.py:124`).

**Coordenadas.** A posição de um ponto é dada por dois números, `(x, y)`:

- `x` é a coluna, contando da esquerda, **começando em 0**;
- `y` é a linha, contando de cima, **começando em 0**.

Então `(0, 0)` é o canto de cima, à esquerda, e `y` cresce para **baixo** (o contrário do gráfico da aula de matemática). O ponto `(4, 17)` é a 5ª letra da 18ª linha.

**Linhas 41 a 56: o desenho da pedra vulcânica.** Mesma ideia. `D` e `d` são os tons da pedra, `C` é o brilho cinza, `O` e `Y` são as rachaduras de lava.

**Linhas 58 a 61: a lista de obstáculos.**

```python
# ferramentas/sprites/obstaculos_atacama.py:58-61
OBSTACULOS = [
    {"nome": "cacto", "mapa": CACTO, "olhos": [(4, 17), (8, 17)], "palpebra": "G", "linha": 22},
    {"nome": "pedra-vulcanica", "mapa": PEDRA_VULCANICA, "olhos": [(3, 6), (8, 6)], "palpebra": "D", "linha": 8},
]
```

É uma lista de **dicionários**. O dicionário do Python é o objeto do JavaScript: pares de nome e valor entre chaves. Esta lista é a mesma ideia do vetor `fases` do jogo. Cada obstáculo tem:

| Campo | Exemplo | O que é |
|---|---|---|
| `nome` | `"cacto"` | Nome do arquivo: vira `cacto.gif`. |
| `mapa` | `CACTO` | O desenho. |
| `olhos` | `[(4, 17), (8, 17)]` | A coordenada de cada olho. O cacto tem um olho começando na coluna 4 e outro na coluna 8, os dois na linha 17. |
| `palpebra` | `"G"` | A letra da cor que cobre o olho quando ele pisca. No cacto é o verde. |
| `linha` | `22` | Qual linha do desenho some no quadro "achatado" (explicado abaixo). |

Os olhos não estão no desenho. Eles são colados depois, porque mudam de um quadro para o outro.

**Linhas 63 e 64: o que roda.**

```python
# ferramentas/sprites/obstaculos_atacama.py:63-64
if __name__ == "__main__":
    gerar_todos(OBSTACULOS)
```

Esse `if` quer dizer "só faça isto se este arquivo foi o que eu mandei rodar". Ele existe porque outro script, o `gerar_tudo.py`, importa este arquivo só para pegar a lista `OBSTACULOS`, e nessa hora não queremos gerar nada duas vezes.

### 4.4 Como os 6 quadros são montados

A função que faz o trabalho é a `gerar_obstaculo`. Antes dela, três listas dizem o que acontece em cada um dos 6 quadros:

```python
# ferramentas/sprites/obstaculo_base.py:17-26
ESCALA = 6

# Quanto tempo cada um dos 6 quadros fica na tela (igual à latinha)
DURACOES = [220, 440, 440, 220, 220, 220]

# O que os olhos fazem em cada quadro
OLHAR = ["esquerda", "direita", "esquerda", "direita", "fechado", "esquerda"]

# Em quais quadros o obstáculo fica achatado
ACHATADO = [False, True, False, True, True, False]
```

A posição de cada valor na lista é o número do quadro. No quadro 4, por exemplo: dura 220 ms, os olhos estão fechados e o obstáculo está achatado.

```python
# ferramentas/sprites/obstaculo_base.py:95-121
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
```

Passo a passo:

1. **Tamanho da imagem.** `len(mapa[0])` é quantas letras a primeira linha tem (a largura) e `len(mapa)` é quantas linhas existem (a altura). Soma 2 em cada porque o contorno vai ocupar 1 ponto de cada lado. O cacto tem 14×28 letras, então a imagem tem 16×30 pontos.
2. **`for numero in range(6)`** repete o bloco 6 vezes, com `numero` valendo 0, 1, 2, 3, 4 e 5. É o `for (var i = 0; i < 6; i++)` do JavaScript.
3. **`nova_imagem`** cria uma imagem vazia, toda transparente.
4. **Achatar.** Nos quadros 1, 3 e 4, o desenho usado é uma cópia com uma linha a menos no meio e uma linha vazia no topo. O obstáculo fica 1 ponto mais baixo, mas o pé não sai do chão. É a "respiração" da latinha.
5. **`desenhar_mapa(quadro, desenho, PALETA, 1, 1)`** pinta o desenho começando no ponto `(1, 1)`, e não no `(0, 0)`, para sobrar a borda de 1 ponto onde o contorno vai entrar.
6. **Olhos.** Para cada coordenada de olho, escolhe o desenhinho de 2×2 pontos daquele quadro (olhando para a esquerda, para a direita ou fechado) e pinta por cima. O `1 + x` é pelo mesmo motivo do item 5.
7. **`contornar`** desenha o contorno escuro em volta de tudo.
8. **`ampliar(quadro, ESCALA)`** multiplica o tamanho por 6. O quadro pronto entra na lista `quadros`.
9. Depois do laço, **`salvar_gif`** grava os 6 quadros num arquivo só, com a duração de cada um.

Conta do tamanho final do cacto: 16×30 pontos × 6 = **96×180 px**. É o que o script mostra no terminal quando roda.

### 4.5 As funções do `pixel.py`

**Pintar um desenho** é um laço dentro de outro: para cada linha, para cada letra.

```python
# ferramentas/sprites/pixel.py:72-80
    for y in range(len(mapa)):
        linha = mapa[y]
        for x in range(len(linha)):
            letra = linha[x]
            if letra == "." or letra == " ":
                continue
            dentro = 0 <= x0 + x < imagem.width and 0 <= y0 + y < imagem.height
            if dentro:
                imagem.putpixel((x0 + x, y0 + y), cor(paleta[letra]))
```

- `continue` pula para a próxima letra (o ponto `.` não pinta nada).
- `paleta[letra]` procura a letra no dicionário e devolve a cor, por exemplo `"#3E8E4A"`.
- `putpixel` pinta **um** ponto na posição `(x0 + x, y0 + y)`.

**A paleta** é um dicionário de letra para cor:

```python
# ferramentas/sprites/obstaculo_base.py:28-35 (começo)
PALETA = {
    "K": "#1E0C14",  # contorno e traços do rosto
    "N": "#1A1420",  # preto
    "W": "#FFFFFF",  # branco
    "w": "#D8D8E4",  # branco na sombra
    "G": "#3E8E4A",  # verde
    "g": "#286834",  # verde escuro
    "V": "#76C46A",  # verde claro
```

A regra que segui: letra **maiúscula** é a cor base e a **minúscula** é a mesma cor na sombra. Trocar a cor de todos os cactos é mudar uma linha aqui.

**O contorno** é feito pelo código, não por mim:

```python
# ferramentas/sprites/pixel.py:92-101
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
```

Para cada ponto **transparente**, olha os 4 vizinhos (esquerda, direita, cima, baixo). Se algum vizinho está pintado, o ponto fica na beira do desenho e vira contorno. O `[3]` pega o quarto número da cor, a opacidade: 0 é transparente.

**Ampliar** é uma linha:

```python
# ferramentas/sprites/pixel.py:105-107
def ampliar(imagem, escala):
    """Aumenta a imagem "escala" vezes. NEAREST = sem suavizar: cada ponto vira um quadrado."""
    return imagem.resize((imagem.width * escala, imagem.height * escala), Image.NEAREST)
```

`NEAREST` quer dizer **vizinho mais próximo**. Quando uma imagem cresce, o programa precisa inventar os pixels novos. O jeito comum mistura as cores vizinhas, e a imagem fica borrada. O vizinho mais próximo só **copia** a cor do ponto mais perto: cada ponto vira um quadrado de cor única, com a borda seca. É isso que faz a pixel art parecer pixel art.

**Gravar o GIF** (`salvar_gif`, em `pixel.py:182`):

- O GIF não guarda a cor de cada pixel. Ele guarda uma **tabela de cores** (no máximo 256) e, para cada pixel, o número da cor na tabela. Por isso imagens de poucas cores ficam tão leves.
- `duration` é o tempo de cada quadro, em milissegundos.
- `loop=0` repete para sempre.
- `transparency=0` diz que a cor número 0 da tabela é a transparente.
- `disposal=2` apaga o quadro anterior antes de desenhar o próximo. Sem isso, nas partes transparentes, os quadros se acumulariam um por cima do outro.

### 4.6 Os outros scripts, em uma frase cada

- **`viajante.py`**: o corgi é montado em **partes** (cabeça, tronco, pernas, braço, cachecol). Cada quadro da corrida junta as mesmas partes em posições diferentes; nos quadros 1 e 4 o corpo desce 1 ponto. Na segunda metade do passo as pernas trocam de cor (a da frente vira a de trás). No GIF de tonto, 3 estrelas giram em volta da cabeça: a posição de cada uma sai do cosseno e do seno de um ângulo que cresce a cada quadro.
- **`fundos.py`**: aqui o desenho não é letra por letra. É feito com **formas** em coordenadas: retângulos, triângulos e círculos. As estrelas são sorteadas, mas com `random.seed(...)`, que faz o sorteio dar sempre o mesmo resultado.
- **`moldura.py`**: desenha o gabinete com retângulos e deixa transparente o retângulo da tela. Entre os 8 quadros mudam as luzes, o texto que pisca, o passaporte na fenda e a posição do avião.
- **`carimbos.py`**: uma forma (círculo, retângulo ou hexágono) com duas bordas, um desenho no meio e a sigla, tudo numa cor só, como tinta.
- **`interface.py`**: logo, favicon, os dois passaportes do botão, o avião, o globo e os ícones da barra lateral.
- **`inicio.py`**: não desenha nada novo. **Monta cenas** com as imagens que os outros scripts já geraram (fundo + corgi + obstáculo + carimbo).
- **`gerar_tudo.py`**: roda todos, na ordem certa.

### 4.7 Como gerar as imagens de novo

Só é preciso se você mudar algum desenho. Uma vez:

```bash
python3 -m venv ferramentas/.venv
ferramentas/.venv/bin/pip install -r ferramentas/sprites/requirements.txt
```

Depois, sempre que mudar um desenho:

```bash
ferramentas/.venv/bin/python ferramentas/sprites/obstaculos_atacama.py   # só os do Atacama
ferramentas/.venv/bin/python ferramentas/sprites/gerar_tudo.py           # tudo
```

Conferi que rodar o `gerar_tudo.py` de novo gera arquivos **idênticos** aos que estão no Git (nenhuma diferença no `git status`).

---

## 5. Tabela de todas as imagens geradas

Todas ficam em `public/jogo/img/`. São 52 arquivos e **452 KB no total**. Só os 5 assets do jogo antigo somavam cerca de 530 KB, e os 6 quadrinhos, mais 1,2 MB.

### 5.1 Personagem

| Arquivo | Tamanho | Quadros | Script | Onde é usada | Substituiu |
|---|---|---|---|---|---|
| `personagem/correndo.gif` | 252×294 | 6 de 90 ms | `viajante.py` | `jogo.html:54`; `jogo.js` (`IMAGEM_CORRENDO`) | `luna_correndo.gif` |
| `personagem/pulando.gif` | 252×294 | 2 de 120 ms | `viajante.py` | `jogo.js:226`, durante o pulo | Novo. A Luna não tinha desenho de pulo. |
| `personagem/tonto.gif` | 252×294 | 32 de 70 ms | `viajante.py` | `jogo.js`, no game over | `lunaGameOver.gif` |

### 5.2 Obstáculos

Todos têm 6 quadros (220 ou 440 ms), ponto de 6 px, e substituem a `latinha.gif`. Na tela aparecem com 3/4 do tamanho do arquivo, a mesma proporção da latinha. São usados pelo vetor `fases`, em `public/js/fases.js:44-57`.

| Arquivo | Tamanho do arquivo | Na tela | Script | Fase |
|---|---|---|---|---|
| `obstaculos/cacto.gif` | 96×180 | 72×135 | `obstaculos_atacama.py` | Atacama |
| `obstaculos/pedra-vulcanica.gif` | 120×96 | 90×72 | `obstaculos_atacama.py` | Atacama |
| `obstaculos/barril.gif` | 120×132 | 90×99 | `obstaculos_mendoza.py` | Mendoza |
| `obstaculos/uvas.gif` | 108×156 | 81×117 | `obstaculos_mendoza.py` | Mendoza |
| `obstaculos/touro.gif` | 120×120 | 90×90 | `obstaculos_espanha.py` | Espanha |
| `obstaculos/oliveira.gif` | 120×168 | 90×126 | `obstaculos_espanha.py` | Espanha |
| `obstaculos/azulejo.gif` | 108×108 | 81×81 | `obstaculos_portugal.py` | Portugal |
| `obstaculos/sardinha.gif` | 84×168 | 63×126 | `obstaculos_portugal.py` | Portugal |
| `obstaculos/macaco.gif` | 108×156 | 81×117 | `obstaculos_gibraltar.py` | Gibraltar |
| `obstaculos/cabine.gif` | 84×180 | 63×135 | `obstaculos_gibraltar.py` | Gibraltar |
| `obstaculos/coqueiro.gif` | 120×180 | 90×135 | `obstaculos_mocambique.py` | Moçambique |
| `obstaculos/caranguejo.gif` | 120×84 | 90×63 | `obstaculos_mocambique.py` | Moçambique |
| `obstaculos/jacare.gif` | 120×96 | 90×72 | `obstaculos_orlando.py` | Orlando |
| `obstaculos/cone.gif` | 96×132 | 72×99 | `obstaculos_orlando.py` | Orlando |

Diferença para a latinha: ela ocupava sempre 120×180. Aqui cada obstáculo tem o tamanho do próprio desenho, e nenhum passa de 120×180. Assim a caixa de colisão é a imagem inteira, e há obstáculos baixos e altos.

### 5.3 Fundos

Todos têm 1536×720 px, 1 quadro, ponto de 6 px, e substituem o `ceu_sem_nuvens_grande.png`. Script: `fundos.py`. Usados pelo campo `fundo` do vetor `fases`.

| Arquivo | O que mostra |
|---|---|
| `fundos/atacama.png` | Pôr do sol no deserto, o vulcão Licancabur e dunas |
| `fundos/mendoza.png` | Cordilheira dos Andes com neve e fileiras de videiras |
| `fundos/espanha.png` | Sol grande, colinas e moinhos de vento da Mancha |
| `fundos/portugal.png` | O rio Tejo, a ponte vermelha de Lisboa e casas de telhado laranja |
| `fundos/gibraltar.png` | O Rochedo visto do mar |
| `fundos/mocambique.png` | Praia do Índico ao entardecer, um barco à vela e coqueiros |
| `fundos/orlando.png` | Noite de parque: castelo, roda-gigante e fogos |

### 5.4 Moldura, carimbos e tela de início

| Arquivo | Tamanho | Quadros | Script | Onde é usada | Substituiu |
|---|---|---|---|---|---|
| `moldura/moldura.gif` | 1200×759 | 8 de 180 ms | `moldura.py` | `css/jogo.css:64` | `moldura_fliperama_animada_tela_transparente.gif` |
| `carimbos/<destino>.png` (7) | 160×160 | 1 | `carimbos.py` | Campo `carimbo` das fases: página do passaporte, checkpoint e roteiro | Novo |
| `inicio/previa.png` | 1120×708 | 1 | `inicio.py` | `jogo/inicio.html` | `xlurp-previa-jogo.png` |
| `inicio/cartao-<destino>.png` (7) | 1120×748 | 1 | `inicio.py` | Campo `cartao` das fases: tela de início | `xlurp-quadro-1.png` a `-6.png` |

### 5.5 Interface

Script de todas: `interface.py`.

| Arquivo | Tamanho | Onde é usada | Substituiu |
|---|---|---|---|
| `interface/logo.png` | 676×172 | `jogo/inicio.html:34` | `gymfabs_logo_header@4x.png` |
| `interface/favicon.png` | 32×32 | Ícone da aba em todas as páginas; marca da barra lateral | `favicon-32.png` do GymFabs e `favicon2.ico` do AquaTech |
| `interface/passaporte-fechado.png` | 80×80 | `css/tema.css:61`, botão de jogar | Novo |
| `interface/passaporte-aberto.png` | 80×80 | `css/tema.css:66`, botão com mouse em cima ou em foco | Novo |
| `interface/aviao.png` | 80×68 | `css/tema.css:72`, botão de recomeçar | Novo |
| `interface/aviao-tinta.png` | 32×32 | `jogo/jogo.html:74`, progresso no cartão de embarque | Novo |
| `interface/globo.png` | 48×48 | `js/skins.js`, botões do seletor de skins | Novo |
| `interface/icone-globo.png`, `icone-mala.png`, `icone-aviao.png`, `icone-passaporte.png`, `icone-portao.png` | 32×32 | `js/sidebar.js:21-26` e botão Sair | Os emojis da barra lateral |

### 5.6 A prova de que nada aponta para as imagens antigas

Rodei esta busca em `public/`, `src/`, `app.js` e `ferramentas/sprites/`:

```bash
grep -rniE "luna|latinha|ceu_sem_nuvens|moldura_fliperama|moldura-fliperama|gymfabs|xlurp|previa-jogo|assets/jogo|lata\.gif|cacto\.png|favicon2" \
  public src app.js ferramentas/sprites --include=*.html --include=*.css --include=*.js --include=*.py
```

O que ela encontra são só:

- **comentários** nos scripts que dizem o que cada imagem substituiu (por exemplo `viajante.py:5`, "substitui luna_correndo.gif");
- a classe CSS `previa-jogo`, que é um nome de classe, não um arquivo;
- a palavra "coluna" em `sidebar.css`, que contém "luna".

Nenhuma linha carrega um arquivo antigo. Conferi também o contrário: toda imagem citada no HTML, no CSS e no JS existe, e toda imagem gerada é usada por alguém.

**Apagadas:** a pasta `public/assets/jogo/` inteira (13 arquivos, entre eles os GIFs da Luna, a lata, o cacto antigo, os 7 céus recoloridos, a moldura e a prévia) e o `public/assets/icon/favicon2.ico`. Com o servidor ligado, os dois endereços antigos respondem 404.

**Ficaram, por enquanto:** `circle-loading.gif`, `bg-jelly-fish-para-home.png` e os três ícones `_color.png`. Eles vieram do AquaTech (não do GymFabs) e ainda são usados pela Home, pelo Login e pelo Cadastro. Saem quando essas páginas forem refeitas.

---

## 6. Elementos tematizados

### 6.1 A tabela

| Elemento | Onde | Objeto escolhido | Por quê |
|---|---|---|---|
| Botão de jogar | Tela de início e tabuleiro | **Passaporte** que abre | É o objeto que dá nome ao site. Abrir o passaporte é o primeiro gesto de uma viagem. |
| Botão de recomeçar | Tabuleiro, no game over | **Avião** que decola ("NOVO VOO") | Perder é perder o voo; tentar de novo é pegar outro. Combina com o aviso "VOO CANCELADO!". |
| Placar | Tabuleiro | **Cartão de embarque** | Um cartão de embarque já tem os campos de que o placar precisa: destino, um número e o trecho. |
| Progresso da fase | Canhoto do cartão | **Avião** andando numa rota pontilhada | Mostra quanto falta sem o jogador ter que ler "3/5". |
| Carimbos ganhos | Tabuleiro | **Página de passaporte** com 7 espaços | É como um passaporte de verdade mostra por onde você passou. Os espaços vazios mostram o que falta. |
| Checkpoint | Tabuleiro, ao passar de fase | **Carimbo** do destino batendo na tela | É a recompensa da fase, e é a mesma imagem que depois fica na página do passaporte. |
| Seletor de skins | Barra lateral | **Globos**, um por destino | Escolher uma skin é escolher um lugar do mundo. |
| Itens do menu | Barra lateral | **Globo** (Dashboard), **mala** (Calculadora), **avião** (Jogo), **passaporte** (Sobre mim), **portão** (Sair) | Dashboard é a visão geral do mundo; a calculadora é fazer a mala e as contas; "sobre mim" é o documento de identidade; sair é o portão de desembarque. |
| Selo em cima do título | Tela de início | **Etiqueta de bagagem** | Identifica "de quem é" a tela, como a etiqueta identifica a mala. |
| Link de voltar | Página do jogo | **Placa de aeroporto** | É a sinalização que diz para onde ir. |
| Aviso de game over e de fim | Tabuleiro | **Painel de voos** (faixa escura com letras claras) | Onde se lê "voo cancelado" num aeroporto. |
| Lista de destinos | Tela de início | **Roteiro** com o carimbo de cada lugar | Antecipa o que o jogador vai ganhar. |
| Os 6 quadrinhos | Tela de início | **Cartões-postais** | Contam a viagem, um destino por cartão. |

### 6.2 Como o botão-objeto é feito

Os estilos comuns estão em `public/css/tema.css`. O botão continua sendo um `<button>`:

```html
<!-- public/jogo/jogo.html:95-98 -->
<button id="btn_embarcar" class="botao-tema botao-passaporte" onclick="iniciarJogo()">
    <span class="botao-icone" aria-hidden="true"></span>
    <span id="span_botao">EMBARCAR</span>
</button>
```

- A classe `botao-tema` dá a aparência (borda grossa, sombra em bloco, fonte).
- A classe `botao-passaporte` ou `botao-aviao` escolhe o desenho.
- O desenho é o **fundo** do primeiro `<span>`. O `aria-hidden="true"` avisa aos leitores de tela que aquele `<span>` é só enfeite.
- O texto fica no segundo `<span>`. É ele que o leitor de tela lê.

O passaporte abre trocando a imagem de fundo:

```css
/* public/css/tema.css:61-69 */
.botao-passaporte .botao-icone {
  background-image: url(../jogo/img/interface/passaporte-fechado.png);
}

/* ...que abre com o mouse em cima ou com o foco do teclado. */
.botao-passaporte:hover .botao-icone,
.botao-passaporte:focus .botao-icone {
  background-image: url(../jogo/img/interface/passaporte-aberto.png);
}
```

`:hover` vale enquanto o mouse está em cima. `:focus` vale enquanto o elemento está selecionado pelo teclado (tecla Tab). Escrevendo os dois, quem usa mouse e quem usa teclado veem a mesma coisa.

O avião decola com `transform`, que move e gira um elemento sem mexer no resto da página:

```css
/* public/css/tema.css:77-80 */
.botao-aviao:hover .botao-icone,
.botao-aviao:focus .botao-icone {
  transform: translate(8px, -6px) rotate(-12deg);
}
```

No jogo, quem troca o passaporte pelo avião é uma função pequena:

```js
// public/js/jogo.js:358-362
function mostrarBotao(texto, tipo) {
    span_botao.innerHTML = texto;
    btn_embarcar.className = "botao-tema " + tipo;
    btn_embarcar.style.display = "flex";
}
```

Ela é chamada com `mostrarBotao("NOVO VOO", "botao-aviao")` no game over e com `mostrarBotao("VIAJAR DE NOVO", "botao-passaporte")` no fim do jogo.

### 6.3 O cartão de embarque e o avião do progresso

O avião anda porque o JavaScript muda o `left` dele, em porcentagem:

```js
// public/js/jogo.js:449-450
var porcentagem = obstaculosPulados / fase.meta * 100;
img_aviaozinho.style.left = porcentagem + "%";
```

Com 3 obstáculos pulados de 5, a conta dá 60, e o avião fica a 60% da linha. No CSS, `transition: left 0.3s` (`css/jogo.css:231`) faz ele deslizar até o lugar novo em vez de pular.

### 6.4 A página do passaporte

```js
// public/js/jogo.js:456-462
for (var i = 0; i < fases.length; i++) {
    if (i < carimbos.length) {
        html += `<img class="selo carimbado" src="${fases[i].carimbo}" alt="Carimbo: ${fases[i].pais}" title="${fases[i].pais}" />`;
    } else {
        html += `<span class="selo" title="${fases[i].pais}: falta carimbar"></span>`;
    }
}
```

O laço passa pelas 7 fases. Se a fase já foi vencida (`i < carimbos.length`), escreve a imagem do carimbo dela; senão, escreve um espaço vazio, que o CSS desenha como um quadrado tracejado.

### 6.5 Acessibilidade: o que foi mantido

| Cuidado | Como |
|---|---|
| Botões de verdade | Os botões de jogar, de recomeçar e de skin são `<button>`. O navegador já sabe que `<button>` recebe foco com Tab e é acionado com Enter ou Espaço. |
| Texto ou rótulo | Os botões do jogo têm texto escrito. Os globos, que não têm texto, têm `aria-label="Skin Atacama"`. |
| Foco visível | `.botao-tema:focus` tem contorno claro de 4 px (`tema.css:50`); os globos têm contorno de 3 px (`sidebar.css:265`). |
| Hover | Todo botão muda com o mouse em cima: sombra maior, passaporte aberto, avião decolando, globo maior. |
| Imagens de enfeite | Têm `alt=""`, para o leitor de tela pular. As que informam têm texto: `alt="Carimbo: Chile"`. |
| Qual skin está escolhida | O botão da skin atual tem `aria-pressed="true"`. |
| Contraste | Medido para cada skin ([seção 7.1](#71-a-tabela)). |

Um detalhe do teclado no jogo: quem começa a partida com Enter estava com o foco no botão, e o botão some. Por isso o `iniciarJogo()` chama `btn_embarcar.blur()` (`jogo.js:140`), que solta o foco. Assim a tecla Espaço serve só para pular.

---

## 7. Skins

### 7.1 A tabela

**Contraste** é a diferença de claridade entre duas cores, medida de 1:1 (iguais) a 21:1 (preto no branco). A recomendação para texto comum é no mínimo **4,5:1**. Calculei os valores com a fórmula padrão (a das diretrizes de acessibilidade WCAG).

| Skin | Fundo (`cor_fundo`) | Botão (`cor_botao`) | Fonte (`fonte`) | Texto sobre o fundo | Texto do botão sobre o botão | Parágrafo sobre o fundo | Liberada por |
|---|---|---|---|---|---|---|---|
| Passaporte (padrão) | `#0B132B` azul-marinho | `#E0B04A` dourado | VT323 | 16,7:1 | 9,2:1 | 10,4:1 | Sempre liberada |
| Atacama | `#2B1A12` terra escura | `#E76F51` terracota | Jersey 20 | 15,2:1 | 5,4:1 | 9,4:1 | Carimbo 1 (Chile) |
| Mendoza | `#2A0C1B` vinho | `#74ACDF` celeste | Jersey 15 | 16,4:1 | 7,5:1 | 10,1:1 | Carimbo 2 (Argentina) |
| Espanha | `#2A0A0A` vermelho escuro | `#F1BF00` amarelo | Silkscreen | 16,7:1 | 10,6:1 | 10,3:1 | Carimbo 3 (Espanha) |
| Portugal | `#0A1F3D` azul | `#6FB1E8` azul-claro | Jersey 10 | 15,0:1 | 7,2:1 | 9,3:1 | Carimbo 4 (Portugal) |
| Gibraltar | `#1C1F26` cinza do Rochedo | `#F25C5C` vermelho | Handjet | 15,0:1 | 5,1:1 | 9,3:1 | Carimbo 5 (Gibraltar) |
| Moçambique | `#06282B` mar à noite | `#1CC5B7` turquesa | Pixelify Sans | 14,2:1 | 7,2:1 | 8,8:1 | Carimbo 6 (Moçambique) |
| Orlando | `#120B3A` noite | `#FF7AB6` rosa | Jersey 25 | 16,8:1 | 7,7:1 | 10,4:1 | Carimbo 7 (Estados Unidos) |

Notas:

- O **texto** é `#F8F4E8` (creme) e o **parágrafo** é `#C9C2B0`, iguais em todas as skins.
- O **texto do botão** é a própria cor de fundo da skin. Por isso o contraste "texto do botão sobre o botão" é igual ao do "botão sobre o fundo", que é a cor usada nos títulos em destaque.
- O menor valor de todos é **4,7:1**: a legenda (`#9AA0B4`) sobre o cartão da skin Moçambique. Passa do mínimo.
- A coluna "Liberada por" é o plano. **Hoje todas estão liberadas**, como você pediu.
- Mudei 3 cores em relação ao diagnóstico (seção 5.4 de lá). Os botões de Mendoza, Portugal e Gibraltar eram escuros com texto branco, e como cor de **título** sobre o fundo escuro não chegavam a 4,5:1. Troquei por tons claros do mesmo lugar: o celeste da bandeira argentina, o azul-claro do azulejo e um vermelho mais vivo.
- As fontes dos títulos e do jogo continuam sendo a Press Start 2P em todas as skins. A fonte da skin muda os textos corridos: parágrafos, menu, dicas.

Por que cada fonte: VT323 lembra a linha de letras de máquina no rodapé de um passaporte; Jersey 20 e 25 são pesadas (pedra do deserto, letreiro de parque); Jersey 15 é a intermediária; Silkscreen é toda em maiúsculas, como cartaz; Jersey 10 é fina, como o traço do azulejo; Handjet é estreita, como placa de estrada; Pixelify Sans é arredondada.

### 7.2 Os prints

Estão em [`docs/refatoracao/prints/`](./prints/). Para comparar de uma vez:

- [`comparacao-inicio.png`](./prints/comparacao-inicio.png): a tela de início nas 8 skins.
- [`comparacao-jogo.png`](./prints/comparacao-jogo.png): o jogo nas 8 skins (cada uma na fase do seu destino).
- [`comparacao-dashboard.png`](./prints/comparacao-dashboard.png): a Dashboard nas 8 skins. Calculadora e Sobre mim usam o mesmo estilo.

Na mesma pasta estão os 24 prints separados (`inicio-atacama.png`, `jogo-espanha.png`, `dashboard-orlando.png`...), o seletor aberto ([`seletor-aberto.png`](./prints/seletor-aberto.png)) e a tela de fim de jogo ([`fim-de-jogo.png`](./prints/fim-de-jogo.png)).

O gabinete do fliperama é uma imagem, então ele é azul-marinho e dourado em todas as skins. O que muda em volta dele é o fundo da página, a placa, a dica, a barra lateral e os botões.

### 7.3 O que é uma variável CSS

**Variável CSS** (o nome oficial é *custom property*) é um nome que guarda um valor dentro do CSS. Declara-se com dois traços na frente e usa-se com `var(...)`:

```css
/* declarar */
:root {
  --cor-fundo: #0B132B;
}

/* usar */
body {
  background-color: var(--cor-fundo);
}
```

A vantagem é a mesma de uma variável no JavaScript: o valor fica escrito num lugar só. Se 40 regras usam `var(--cor-fundo)`, mudar a variável muda as 40.

### 7.4 Como a skin troca a aparência

São três peças.

**Peça 1: nenhum arquivo de estilo escreve cor direto.** Todos usam as variáveis. Exemplo da Dashboard:

```css
/* public/css/dashboards.css:5-12 */
body {
  margin: 0;
  min-height: 100vh;
  font-family: var(--fonte-texto);
  font-size: var(--tamanho-texto);
  background-color: var(--cor-fundo);
  color: var(--cor-texto-suave);
}
```

**Peça 2: `skins.css` define as variáveis uma vez para cada skin.** Primeiro os valores da skin padrão, em `:root` (que é a tag `<html>`):

```css
/* public/css/skins.css:78-87 */
:root {
  /* os três campos da skin */
  --cor-fundo: #0B132B;            /* azul-marinho da capa do passaporte */
  --cor-destaque: #E0B04A;         /* dourado da capa: botões e destaques */
  --fonte-texto: "VT323", monospace;

  /* apoio */
  --cor-superficie: #14213D;       /* cartões e painéis */
  --cor-borda: #2B3A5C;            /* contornos discretos */
  --tamanho-texto: 20px;           /* cada fonte "parece" de um tamanho; isto compensa */
```

Depois, um bloco por destino, que dá **outros valores para os mesmos nomes**:

```css
/* public/css/skins.css:104-111 */
[data-skin="atacama"] {
  --cor-fundo: #2B1A12;
  --cor-destaque: #E76F51;
  --fonte-texto: "Jersey 20", sans-serif;
  --cor-superficie: #3D261A;
  --cor-borda: #5C3A28;
  --tamanho-texto: 20px;
}
```

`[data-skin="atacama"]` é um **seletor de atributo**: vale para o elemento que tem o atributo `data-skin` com o valor `atacama`. Atributos que começam com `data-` são livres: o HTML deixa a gente criar os nossos para guardar informação.

**Peça 3: o JavaScript coloca o atributo na tag `<html>`.**

```js
// public/js/skins.js:59-61
function aplicarSkin(id) {
    document.documentElement.setAttribute("data-skin", id);
}
```

`document.documentElement` é a tag `<html>`. Depois desta linha, a página fica `<html data-skin="atacama">`, o bloco `[data-skin="atacama"]` passa a valer, as variáveis ganham os valores do Atacama e **toda regra que usa `var(...)` muda sozinha**. O JavaScript não toca em nenhuma cor.

Por que na tag `<html>`: as variáveis CSS são **herdadas**. O que vale para um elemento vale para tudo que está dentro dele, e tudo está dentro do `<html>`.

Por que `skins.css` é o primeiro CSS de cada página: os outros arquivos usam as variáveis dele. A ordem está no `<head>`:

```html
<!-- public/jogo/jogo.html:16-20 -->
<!-- skins.css vem primeiro: os outros estilos usam as variáveis dele -->
<link rel="stylesheet" href="../css/skins.css" />
<link rel="stylesheet" href="../css/jogo.css" />
<link rel="stylesheet" href="../css/tema.css" />
<link rel="stylesheet" href="../css/sidebar.css" />
```

### 7.5 Os três campos do banco e as variáveis de apoio

O seu modelo de dados tem três campos por skin: `cor_fundo`, `cor_botao` e `fonte`. Eles são as variáveis `--cor-fundo`, `--cor-destaque` e `--fonte-texto`.

Só três não bastam para uma página ficar boa: um cartão precisa de um tom um pouco mais claro que o fundo, e cada fonte precisa de um tamanho para "parecer" igual às outras. Por isso cada skin tem mais três variáveis **de apoio** (`--cor-superficie`, `--cor-borda` e `--tamanho-texto`), que só existem no CSS. O texto do botão não precisa de variável própria: é a cor de fundo da skin (`--cor-destaque-texto: var(--cor-fundo)`, em `skins.css:90`).

### 7.6 O vetor de skins

```js
// public/js/skins.js:25-34
var skins = [
    { id: "padrao",     nome: "Passaporte", idDestino: 0, corFundo: "#0B132B", corBotao: "#E0B04A", fonte: "VT323" },
    { id: "atacama",    nome: "Atacama",    idDestino: 1, corFundo: "#2B1A12", corBotao: "#E76F51", fonte: "Jersey 20" },
    { id: "mendoza",    nome: "Mendoza",    idDestino: 2, corFundo: "#2A0C1B", corBotao: "#74ACDF", fonte: "Jersey 15" },
    { id: "espanha",    nome: "Espanha",    idDestino: 3, corFundo: "#2A0A0A", corBotao: "#F1BF00", fonte: "Silkscreen" },
    { id: "portugal",   nome: "Portugal",   idDestino: 4, corFundo: "#0A1F3D", corBotao: "#6FB1E8", fonte: "Jersey 10" },
    { id: "gibraltar",  nome: "Gibraltar",  idDestino: 5, corFundo: "#1C1F26", corBotao: "#F25C5C", fonte: "Handjet" },
    { id: "mocambique", nome: "Moçambique", idDestino: 6, corFundo: "#06282B", corBotao: "#1CC5B7", fonte: "Pixelify Sans" },
    { id: "orlando",    nome: "Orlando",    idDestino: 7, corFundo: "#120B3A", corBotao: "#FF7AB6", fonte: "Jersey 25" }
];
```

- `id` é o valor que vai no `data-skin`.
- `idDestino` é o mesmo número do `idDestino` do vetor `fases`: é a ligação entre a skin e o carimbo que vai liberá-la. O 0 quer dizer "sempre liberada".
- `corFundo`, `corBotao` e `fonte` são os três campos do banco.

**Um ponto fraco que você precisa conhecer:** as cores estão escritas em dois lugares, no `skins.css` e neste vetor. O CSS é o que pinta a página; o vetor pinta o "mar" dos globos do seletor e é o formato em que os dados vão chegar do banco. Se você mudar uma cor num lugar, precisa mudar no outro. Um dos testes que rodei compara os dois para as 8 skins, e eles batem. Quando as skins vierem do banco, o vetor deixa de ser escrito à mão.

### 7.7 Lembrar a escolha: `localStorage`

**`localStorage`** é uma gavetinha do navegador onde o site guarda textos. Diferente do `sessionStorage`, que o login usa e que some ao fechar a aba, o `localStorage` **continua lá** depois de fechar o navegador.

```js
// public/js/skins.js:64-76
function trocarSkin(id) {
    var skin = buscarSkin(id);

    aplicarSkin(skin.id);
    localStorage.setItem(CHAVE_DA_SKIN, skin.id);

    // Põe o foco no globo da skin escolhida. ...
    document.getElementById("btn_skin_" + skin.id).focus();

    marcarSkinAtual();
}
```

Ao clicar num globo: aplica a skin, guarda o `id` no `localStorage` com o nome `PASSPORT_SKIN` e atualiza as marcações do seletor.

Na hora de ler, o valor guardado passa por uma conferência:

```js
// public/js/skins.js:38-54
function buscarSkin(id) {
    for (var i = 0; i < skins.length; i++) {
        if (skins[i].id == id) {
            return skins[i];
        }
    }

    return skins[0];
}

function lerSkinSalva() {
    var idSalvo = localStorage.getItem(CHAVE_DA_SKIN);

    return buscarSkin(idSalvo).id;
}
```

`buscarSkin` percorre o vetor procurando o `id`. Se não achar, devolve `skins[0]`, a padrão. Isso cobre três casos de uma vez: nada foi guardado ainda, o valor foi estragado, ou uma skin deixou de existir.

A última linha do arquivo fica **fora de qualquer função**:

```js
// public/js/skins.js:152
aplicarSkin(lerSkinSalva());
```

Código fora de função roda assim que o navegador lê o arquivo. Como o `<script>` está no `<head>`, isso acontece antes de a página aparecer, e ela já abre com a skin certa, sem "piscar" na padrão.

### 7.8 O seletor na barra lateral

O `sidebar.js` só deixa o espaço e chama quem preenche:

```js
// public/js/sidebar.js:74 e 86
<div id="div_seletor_skins" class="glass-sidebar__skins"></div>
...
montarSeletorDeSkins();
```

Por isso `skins.js` precisa ser carregado **antes** de `sidebar.js` em cada página.

O `montarSeletorDeSkins()` (`skins.js:81`) escreve, com um `for` sobre o vetor, um botão por skin:

```js
// public/js/skins.js:97-108
for (var i = 0; i < skins.length; i++) {
    var skin = skins[i];

    html += `
        <button type="button" id="btn_skin_${skin.id}" class="skins__botao"
            style="background-color: ${skin.corBotao}"
            aria-label="Skin ${skin.nome}" title="${skin.nome}"
            onclick="trocarSkin('${skin.id}')">
            <img src="../jogo/img/interface/globo.png" alt="" />
        </button>
    `;
}
```

**Uma imagem só serve para os 8 globos.** O `globo.png` tem os continentes e o contorno, e o "mar" é transparente. A cor do mar é o `background-color` do botão, que vem do vetor.

A marcação da skin atual é feita por outra função, que **não reescreve** os botões:

```js
// public/js/skins.js:134-146
for (var i = 0; i < skins.length; i++) {
    var botao = document.getElementById("btn_skin_" + skins[i].id);

    if (skins[i].id == atual.id) {
        botao.setAttribute("aria-pressed", "true");
    } else {
        botao.setAttribute("aria-pressed", "false");
    }
}

// "Voltar para a padrão" só faz sentido quando a skin atual não é a padrão.
// hidden = true esconde o elemento, como display: none.
btn_skin_voltar.hidden = (atual.id == skins[0].id);
```

Por que não reescrever: na primeira versão eu reescrevia o seletor inteiro a cada troca. O teste de teclado mostrou o problema: o botão que estava com o foco era apagado, o foco se perdia e a barra fechava. Mudando só os atributos, o botão continua o mesmo e o foco fica nele.

**Voltar para a padrão** tem dois caminhos: o primeiro globo (dourado) é a skin Passaporte, e o botão "Voltar para a padrão" aparece sempre que a skin atual é outra.

Com a barra fechada aparece só o globo da skin atual. A lista de globos aparece quando a barra abre, com o mouse ou com o Tab (`sidebar.css:247-250`).

---

## 8. Plano: desbloqueio por carimbo e salvamento no banco

Nada desta seção está implementado. É o desenho de como fazer, usando o modelo de dados do seu README.

### 8.1 Tabelas

Acrescentar ao `src/database/script-tabelas.sql`:

```sql
CREATE TABLE destino (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pais VARCHAR(45),
    -- (os outros campos do README: cidades, datas, moeda...)
    cor_fundo CHAR(7),      -- ex.: '#2B1A12'
    cor_botao CHAR(7),      -- ex.: '#E76F51'
    fonte VARCHAR(45)       -- ex.: 'Jersey 20'
);

CREATE TABLE carimbo (
    fk_usuario INT,
    fk_destino INT,
    data_conquista DATETIME DEFAULT CURRENT_TIMESTAMP,
    pontuacao INT,
    PRIMARY KEY (fk_usuario, fk_destino),
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id),
    FOREIGN KEY (fk_destino) REFERENCES destino(id)
);

ALTER TABLE usuario ADD COLUMN fk_skin INT;
ALTER TABLE usuario ADD FOREIGN KEY (fk_skin) REFERENCES destino(id);
```

- A skin de um destino **é** o próprio destino: por isso `usuario.fk_skin` aponta para `destino`. `fk_skin` vazio (`NULL`) quer dizer skin padrão.
- A chave primária de `carimbo` é **composta** (usuário + destino): o banco não deixa o mesmo usuário ter dois carimbos do mesmo lugar.
- Os 7 `INSERT` de `destino` usam os valores do vetor `skins`, com os `id` de 1 a 7 na mesma ordem do `idDestino`.

### 8.2 Rotas da API

Todas no padrão da web-data-viz: rota → controller → model.

| Rota | O que faz | SQL principal |
|---|---|---|
| `GET /destinos/skins` | Devolve as skins (id, país, cores e fonte). Substitui o vetor escrito à mão. | `SELECT id, pais, cor_fundo, cor_botao, fonte FROM destino;` |
| `GET /carimbos/:idUsuario` | Devolve os carimbos que o usuário já tem. | `SELECT fk_destino, pontuacao FROM carimbo WHERE fk_usuario = ...;` |
| `POST /carimbos/registrar` | Grava um carimbo. Corpo: `idUsuario`, `idDestino`, `pontuacao`. | `INSERT INTO carimbo (fk_usuario, fk_destino, pontuacao) VALUES (...);` |
| `PUT /usuarios/skin/:idUsuario` | Grava a skin escolhida. Corpo: `idDestino` (ou vazio para a padrão). | `UPDATE usuario SET fk_skin = ... WHERE id = ...;` |
| `POST /usuarios/autenticar` (já existe) | Passa a devolver também o `fk_skin`. | Acrescentar `fk_skin` ao `SELECT` do login. |

Dois cuidados no controller:

- **Carimbo repetido.** Se o jogador vencer de novo uma fase que já tem, o `INSERT` falha por causa da chave primária. O model pode usar `INSERT ... ON DUPLICATE KEY UPDATE pontuacao = GREATEST(pontuacao, ...)`, que guarda a maior pontuação.
- **Não confiar no navegador.** Antes do `UPDATE` da skin, o controller confere com um `SELECT` se aquele usuário tem o carimbo daquele destino. Senão, qualquer um liberaria uma skin chamando a rota na mão.

### 8.3 Em que momento cada coisa acontece

| Momento | O que o front-end faz | Onde no código de hoje |
|---|---|---|
| **Login** | Guarda o `fk_skin` que veio da API e já aplica a skin. Assim a escolha acompanha o usuário em qualquer computador. | `login.html`, junto de onde guarda `ID_USUARIO` no `sessionStorage` |
| **Abrir uma página logada** | Busca os carimbos do usuário (`GET /carimbos/:idUsuario`) e monta o seletor: skin com carimbo fica liberada, sem carimbo fica bloqueada. | `montarSeletorDeSkins()`, em `skins.js:81` |
| **Abrir o jogo** | Com os mesmos carimbos, a página do passaporte já começa com os carimbos de partidas anteriores. | `prepararJogo()`, em `jogo.js` |
| **Ganhar um carimbo** (checkpoint) | Chama `POST /carimbos/registrar` com o `idDestino` da fase e as milhas. Mostra "SKIN LIBERADA!" junto do carimbo. | `darCarimbo()`, em `jogo.js:389`. O `fases[indiceFase].idDestino` já existe para isso. |
| **Trocar de skin** | Além do `localStorage`, chama `PUT /usuarios/skin/:idUsuario`. | `trocarSkin()`, em `skins.js:64` |

### 8.4 A regra do desbloqueio

> A skin de `idDestino` igual a N está liberada se existe um carimbo do usuário para o destino N. A skin de `idDestino` 0 (padrão) está sempre liberada.

No código é um laço dentro do laço do seletor: para cada skin, procurar o `idDestino` dela no vetor de carimbos que veio da API.

Skin bloqueada: o globo fica cinza, com um cadeado, e o botão ganha o atributo `disabled`, que impede o clique e o Enter. O rótulo muda para "Skin Atacama: bloqueada. Ganhe o carimbo do Chile no jogo".

O `localStorage` continua existindo, como **cópia local**: é ele que deixa a página abrir já com a skin certa, sem esperar a resposta do banco.

---

## 9. O que foi testado

### 9.1 Como testei

Nesta máquina não há navegador no Linux; usei o Chrome do Windows em modo "sem janela", comandado por scripts. O banco de dados foi trocado por um banco falso em memória (o MySQL de verdade fica na sua VM). Para o jogo, um **robô** lê a posição do obstáculo e aperta Espaço na hora certa, em tempo real. Os arquivos de teste ficaram fora do repositório.

### 9.2 O jogo, com a arte nova

| # | Teste | Resultado |
|---|---|---|
| 1 | Robô joga do Atacama até Orlando | Completou as 7 fases: 44 obstáculos, 73 segundos, 6094 milhas, 7 carimbos, "PASSAPORTE COMPLETO!" e botão "VIAJAR DE NOVO". |
| 2 | Fundo e velocidade de cada fase | Os 7 fundos certos e os tempos 1800, 1650, 1500, 1400, 1300, 1200 e 1100 ms. |
| 3 | Os 14 obstáculos aparecem | Sim, os 14 foram sorteados durante a partida. |
| 4 | Cada obstáculo dá para pular? | Testei um por um, na velocidade da fase dele, apertando com 60, 120, 180... 420 ms de antecedência. Todos passam de 120 a 300 ms; a maioria até 360 ms. Ou seja, a janela para apertar tem pelo menos 180 ms. |
| 5 | Carimbo no checkpoint | Em cada uma das 6 passagens de fase apareceu a imagem do carimbo certo e o texto "CARIMBADO! <PAÍS>". |
| 6 | Página do passaporte | 7 carimbos no fim; 0 depois de "VIAJAR DE NOVO". |
| 7 | Não pular | Game over, "VOO CANCELADO!", botão "NOVO VOO", corgi tonto, obstáculo parado. |
| 8 | Desenho do pulo | No chão `correndo.gif`, no ar `pulando.gif`, de volta ao chão `correndo.gif`. |
| 9 | Outras teclas não pulam; seta para cima e clique pulam | Certo: altura 0 com A e Tab; 200 px com seta e com clique. |
| 10 | Segurar Espaço | Um pulo só. |
| 11 | Bater na descida | Congela onde bateu (7 px, e continua 7 px um segundo depois). |
| 12 | Recomeçar várias vezes | 98 a 100 milhas por segundo, sempre. |
| 13 | Perder na fase 3 | Recomeça em "ESPANHA 0/6", com 2 carimbos e as milhas do checkpoint. |
| 14 | Trocar de aba | Pausa; 0 milhas ganhas enquanto escondido; volta a jogar. |
| 15 | Medidas | Corgi com 150×175 px e tabuleiro com 960×480 px, em (120, 96): as mesmas da etapa anterior, fora o 1 px da moldura. |
| 16 | Imagens quebradas e erros de script | Nenhuma imagem quebrada, nenhum erro, nenhuma mensagem no console. |
| 17 | Os 8 quadros da moldura | Cada quadro lido do GIF é idêntico ao que o script desenhou. |

### 9.3 Elementos e skins

| # | Teste | Resultado |
|---|---|---|
| 18 | O botão do jogo é um `<button>` com texto | Sim: `BUTTON`, texto "EMBARCAR". |
| 19 | Foco visível no botão | Contorno sólido de 4 px. |
| 20 | Clicar em cada um dos 8 globos | `data-skin` certo, valor guardado no `localStorage`, cor do fundo da página e do botão do jogo iguais às da skin. |
| 21 | CSS e vetor batem | Para as 8 skins, `--cor-fundo`, `--cor-destaque` e `--fonte-texto` são iguais a `corFundo`, `corBotao` e `fonte`. |
| 22 | As 8 fontes carregam | Sim, todas. |
| 23 | Só um globo marcado por vez | Sempre 1 com `aria-pressed="true"`. |
| 24 | Teclado | Com o foco na barra, ela abre (240 px); ao trocar de skin, o foco fica no globo e a barra continua aberta. |
| 25 | "Voltar para a padrão" | Escondido na skin padrão; visível nas outras; ao acionar, volta para a padrão e o foco vai para o globo dourado. |
| 26 | A skin vale em todas as páginas logadas | Escolhi Moçambique: Dashboard, Calculadora, Sobre mim, início do jogo e jogo abriram com ela. |
| 27 | Valor estragado no `localStorage` | Cai na padrão. |
| 28 | Nada guardado | Padrão. |
| 29 | Jogar com outra skin | O jogo começa normalmente com a skin Espanha. |
| 30 | `npm start` de verdade | As 8 páginas, os CSS, os JS, as imagens novas e as fontes respondem 200; os endereços das imagens antigas respondem 404. |

### 9.4 O que não foi testado

- **Jogar com as mãos.** O robô prova que dá para passar; não diz se a dificuldade está boa para uma pessoa.
- **Enter e Espaço de verdade no botão.** Testei o foco e o clique. O acionamento pelo teclado é do próprio `<button>`, mas não foi apertado por uma pessoa.
- **Leitor de tela.** Os atributos estão lá (`aria-label`, `aria-pressed`, `alt`); não ouvi como um leitor fala.
- **Outros navegadores e celular.** Só Chrome, em tela de computador. O jogo tem tamanho fixo (decisão D8).
- **Banco de dados de verdade.** Esta etapa não mexeu no banco, mas o login continua sem ter sido testado contra o MySQL da VM.
- **Aparência das fontes em outro computador.** Elas estão dentro do projeto, então devem ficar iguais; não conferi em outra máquina.

---

## 10. Como testar sozinho

1. `npm start` e abra `http://localhost:3333`.
2. Faça login. Você cai na Dashboard.
3. Passe o mouse na barra lateral. Ela abre. Os ícones são globo, mala, avião, passaporte e portão.
4. Embaixo, em "Skin: Passaporte", clique no globo laranja (Atacama). A página inteira muda de cor e de fonte.
5. Clique em **Calculadora** e em **Sobre mim**. A skin continua.
6. Aperte **F5**. A skin continua. Feche o navegador, abra de novo, faça login: continua.
7. Clique em "Voltar para a padrão". Volta o azul com dourado, e o botão some.
8. Sem o mouse: aperte **Tab** até a barra abrir, siga até os globos, aperte **Enter** num deles. A skin muda e o contorno continua no globo.
9. Clique em **Jogo**. Confira o logo, a etiqueta de bagagem, a prévia, os carimbos do roteiro e os 7 cartões-postais.
10. Passe o mouse no botão EMBARCAR: o passaporte abre. Chegue nele com o Tab: abre também, e aparece o contorno.
11. Clique em EMBARCAR. No jogo, clique em EMBARCAR de novo.
12. Pule com Espaço. Confira: o corgi encolhe as pernas no ar; o avião do cartão de embarque anda a cada obstáculo.
13. Passe a primeira fase. O carimbo "ATA" bate na tela e aparece no primeiro espaço da página do passaporte.
14. Deixe bater. Aparecem "VOO CANCELADO!", o corgi tonto com estrelas e o botão com o avião. Passe o mouse: o avião decola.
15. Troque de skin com o jogo aberto. O gabinete continua igual; a placa, a dica e o fundo mudam.
16. Para ver o `data-skin`: aperte **F12**, aba **Elements**, e olhe a primeira linha, `<html lang="pt-BR" data-skin="...">`. Troque de skin e veja o valor mudar.
17. Para ver o `localStorage`: **F12**, aba **Application**, **Local Storage**, `http://localhost:3333`. A chave é `PASSPORT_SKIN`.
18. Para ver uma variável funcionando: **F12**, aba **Elements**, clique em `<html>`, e na lista de estilos mude o valor de `--cor-destaque`. Todos os botões mudam ao mesmo tempo.

---

## 11. O que mudou em relação ao documento 02

| No 02 | Agora |
|---|---|
| Imagens em `public/assets/jogo/` | Em `public/jogo/img/` |
| Moldura esticada para 1199×758, tabuleiro em `top: 97px` | Moldura de 1200×759 no tamanho real, tabuleiro em `top: 96px` |
| Obstáculos: `obstaculoCacto` e `obstaculoLata` | 14 obstáculos, 2 por fase (`fases.js:44-57`) |
| Fases sem `carimbo` e `cartao` | Cada fase tem a imagem do carimbo e do cartão-postal |
| Carimbos como quadradinhos amarelos | Imagem do carimbo de cada destino |
| Botão com `btn_embarcar.innerHTML = "NOVO VOO"` | `mostrarBotao("NOVO VOO", "botao-aviao")` |
| Cores em `:root` de cada CSS | Todas em `css/skins.css` |
| Espaço reservado "Skins: em breve" na barra | Seletor funcionando |
| Fonte Barlow, do Google Fonts, na Dashboard | Fonte da skin, guardada no projeto |

A mecânica do jogo (pulo, colisão, laço, checkpoints, pausa) não mudou. A explicação dela continua valendo no [02](./02-refatoracao.md).

---

## Glossário

| Termo | O que é |
|---|---|
| **`alt`** | Texto de uma imagem para quem não a vê. `alt=""` diz que a imagem é só enfeite. |
| **`aria-label`** | Rótulo de um elemento para leitores de tela, usado quando não há texto visível. |
| **`aria-pressed`** | Diz se um botão de ligar/desligar está "apertado". Usado para marcar a skin escolhida. |
| **Atributo `data-`** | Atributo que a gente inventa no HTML para guardar uma informação. Ex.: `data-skin="atacama"`. |
| **`background-clip`** | Diz até onde o fundo de um elemento é pintado. Com `content-box`, o fundo não entra na área do `padding`. |
| **`box-shadow`** | Sombra de um elemento. Com desfoque 0, vira um bloco deslocado, como na pixel art. |
| **Contraste** | Diferença de claridade entre duas cores, de 1:1 a 21:1. Texto comum pede 4,5:1 ou mais. |
| **Coordenada** | Posição de um ponto: `(x, y)`. `x` é a coluna, `y` é a linha, e os dois começam em 0. O `y` cresce para baixo. |
| **Dicionário (Python)** | Pares de nome e valor entre chaves. É o objeto do JavaScript. |
| **`disposal`** | No GIF, o que fazer com um quadro antes de mostrar o próximo. 2 apaga; 1 deixa. |
| **Dithering** | Misturar duas cores em xadrez para parecer uma terceira. Usado entre as faixas do céu. |
| **`document.documentElement`** | A tag `<html>` da página, vista pelo JavaScript. |
| **Escala** | Quantas vezes o desenho é ampliado. Com escala 6, cada ponto vira um quadrado de 6×6 px. |
| **`:focus`** | Vale enquanto um elemento está selecionado pelo teclado ou por um clique. |
| **`:focus-visible`** | Como o `:focus`, mas só quando o navegador entende que o foco veio do teclado. |
| **`:focus-within`** | Vale para um elemento quando algo **dentro** dele está em foco. É o que abre a barra com o Tab. |
| **`@font-face`** | Regra do CSS que ensina ao navegador onde está o arquivo de uma fonte. |
| **GIF** | Formato de imagem que guarda vários quadros e até 256 cores. |
| **Herança (CSS)** | Um valor definido num elemento vale também para os que estão dentro dele. As variáveis CSS são herdadas. |
| **`hidden`** | Atributo que esconde um elemento. |
| **`:hover`** | Vale enquanto o mouse está em cima do elemento. |
| **`image-rendering: pixelated`** | Manda o navegador não suavizar uma imagem redimensionada. É o vizinho mais próximo, só que no CSS. |
| **`import` (Python)** | Traz para um arquivo o código de outro. |
| **Lista (Python)** | O vetor do Python: valores em ordem, entre colchetes. |
| **`localStorage`** | Lugar do navegador onde o site guarda textos que continuam lá depois de fechar a aba. |
| **OFL** | SIL Open Font License: licença que deixa usar e distribuir a fonte, desde que a licença vá junto. |
| **Paleta** | A lista curta de cores de um desenho. Nos scripts, um dicionário de letra para cor. |
| **Pillow (PIL)** | Biblioteca do Python para criar e gravar imagens. |
| **Pixel art** | Desenho feito ponto por ponto, numa grade pequena, e mostrado ampliado. |
| **Ponto** | Como chamo neste documento cada quadradinho do desenho, antes de ampliar. |
| **Pseudo-elemento `::before`** | Um elemento que só existe no CSS, criado dentro de outro. Faz o furo da etiqueta. |
| **Quadro** | Cada uma das imagens de uma animação. |
| **`random.seed`** | Fixa o ponto de partida do sorteio: o resultado sai sempre igual. |
| **`:root`** | No CSS, a tag `<html>`. É onde as variáveis de todo o site são declaradas. |
| **Seletor de atributo** | Seletor CSS entre colchetes: `[data-skin="atacama"]` vale para quem tem esse atributo com esse valor. |
| **Skin** | Conjunto de cores e fonte que muda a aparência do site sem mudar o conteúdo. |
| **Sprite** | Imagem de um personagem ou objeto de jogo. |
| **Tabela de cores** | No GIF e no PNG de paleta, a lista das cores usadas. Cada pixel guarda só o número da cor. |
| **`transform`** | Move, gira ou muda o tamanho de um elemento sem mexer no resto da página. |
| **`transition`** | Faz uma mudança de valor no CSS acontecer aos poucos, em vez de pular. |
| **Variável CSS** | Um nome que guarda um valor no CSS: declara com `--nome: valor` e usa com `var(--nome)`. |
| **Vizinho mais próximo (NEAREST)** | Jeito de ampliar que copia a cor do ponto mais perto, sem misturar. Mantém as bordas secas. |

---

## Perguntas que a banca pode fazer

**1. Você desenhou essas imagens?**
Elas são geradas por scripts Python que estão no repositório, em `ferramentas/sprites/`. Cada desenho é um texto em que cada letra é um ponto, e uma paleta diz a cor de cada letra. Usei IA para escrever os scripts, e isso está declarado no README e no diário de prompts. Sei explicar como eles funcionam e sei mudar um desenho.

**2. O que é pixel art e por que ampliar com "vizinho mais próximo"?**
É um desenho feito numa grade pequena, ponto por ponto. Ao ampliar, o vizinho mais próximo copia a cor do ponto sem misturar com os vizinhos, então cada ponto vira um quadrado de borda seca. O jeito comum de ampliar deixaria tudo borrado.

**3. Por que as imagens são tão leves?**
Porque têm poucas cores. GIF e PNG de paleta guardam uma tabela de cores e, para cada pixel, só o número da cor. As 52 imagens somam 452 KB.

**4. Como o GIF anima?**
O arquivo guarda vários quadros e o tempo de cada um. O script desenha os quadros um a um, mudando só o que se mexe (olhos, pernas, luzes), e grava todos juntos com `loop=0`, que repete para sempre.

**5. O que é `image-rendering: pixelated`?**
É uma propriedade do CSS que manda o navegador não suavizar a imagem quando ela é mostrada num tamanho diferente do arquivo. Sem ela, o corgi apareceria borrado, porque o arquivo tem 252 px e na tela ele tem 150 px.

**6. O que é uma variável CSS?**
Um nome que guarda um valor: declaro `--cor-fundo: #0B132B` e uso `var(--cor-fundo)`. Mudando a variável, tudo que a usa muda junto.

**7. Como a skin muda o site inteiro?**
Nenhum CSS escreve cor direto; todos usam variáveis. O `skins.css` tem um bloco de valores para cada skin, com o seletor `[data-skin="..."]`. O JavaScript só coloca o atributo `data-skin` na tag `<html>`. Como as variáveis são herdadas, a página toda muda.

**8. Por que na tag `<html>` e não no `<body>`?**
Funcionaria no `<body>` também. Usei o `<html>` porque ele já existe quando o script do `<head>` roda (o `<body>` ainda não), e assim a skin é aplicada antes de a página aparecer.

**9. Qual a diferença entre `localStorage` e `sessionStorage`?**
Os dois guardam textos no navegador. O `sessionStorage` some quando a aba fecha: uso para o login. O `localStorage` fica: uso para lembrar a skin.

**10. E se alguém mexer no valor guardado no `localStorage`?**
O `buscarSkin` procura o valor no vetor de skins. Se não achar, devolve a padrão. Testei com um valor inventado.

**11. Onde aparecem vetor, laço, função e condicional nesta etapa?**
Vetor de objetos: `skins` e `fases`. Laço: o `for` que escreve os globos e o que escreve os carimbos. Função: `buscarSkin`, `aplicarSkin`, `trocarSkin`, `mostrarBotao`. Condicional: `if (skins[i].id == id)` e o `if` que decide entre carimbo e espaço vazio.

**12. As cores das skins estão em dois lugares. Isso não é ruim?**
É um ponto fraco, e eu sei dele. O CSS pinta a página e o vetor pinta os globos do seletor. Um teste confere que os dois batem. Quando as skins vierem do banco, pela rota `GET /destinos/skins`, o vetor deixa de ser escrito à mão.

**13. Como as skins vão ser liberadas?**
Cada skin tem o `idDestino` de um destino. Quando o jogador ganha o carimbo de uma fase, o jogo vai gravar na tabela `carimbo`. Ao montar o seletor, a página busca os carimbos do usuário e libera só as skins correspondentes. A padrão é sempre liberada.

**14. Quais tabelas e rotas isso pede?**
Tabelas `destino` (com `cor_fundo`, `cor_botao` e `fonte`) e `carimbo` (usuário, destino, data e pontuação), mais o campo `fk_skin` em `usuario`. Rotas: listar skins, listar carimbos do usuário, registrar carimbo e salvar a skin escolhida.

**15. Por que a chave primária de `carimbo` é composta?**
Para o banco não aceitar dois carimbos do mesmo destino para o mesmo usuário.

**16. Como você garantiu que dá para ler os textos?**
Calculei o contraste de cada combinação com a fórmula das diretrizes de acessibilidade. O mínimo recomendado é 4,5:1; o menor valor que tenho é 4,7:1.

**17. O que você fez pela acessibilidade?**
Os botões são `<button>`, então funcionam com Tab, Enter e Espaço. Todos têm texto ou `aria-label`. O foco tem contorno visível. O que acontece com o mouse em cima acontece também com o foco. Imagens de enfeite têm `alt=""`.

**18. Por que o botão é um `<button>` e não uma `<div>` com imagem?**
Porque o `<button>` já vem com o comportamento certo: recebe foco, responde ao teclado e é anunciado como botão pelos leitores de tela. Numa `<div>` eu teria que programar tudo isso.

**19. Como o passaporte "abre"?**
São duas imagens. O CSS mostra a fechada e troca pela aberta em `:hover` e `:focus`. Não tem JavaScript nisso.

**20. Como o avião do placar anda?**
O JavaScript calcula `obstaculosPulados / meta * 100` e põe o resultado no `left` do avião, em porcentagem. O `transition` do CSS faz ele deslizar.

**21. Por que o corgi tem o mesmo tamanho da cabra do JumpGoat?**
Para a colisão não mudar. O jogo mede a caixa da imagem; mantendo 252×294 px no arquivo e 150 px na tela, as contas da etapa anterior continuam valendo.

**22. Por que os obstáculos têm tamanhos diferentes?**
Para variar o pulo: há obstáculos baixos e largos (caranguejo, jacaré) e altos e estreitos (cabine, sardinha). Cada um tem `largura`, `altura` e `folga` no `fases.js`, e a colisão lê esses números.

**23. O site usa Python?**
Não. O Python só gera as imagens, uma vez, no meu computador. O site é HTML, CSS e JavaScript com a API em Node.js, como a web-data-viz.

**24. De onde vieram as fontes? Pode usar?**
São fontes com a licença OFL, que permite usar e distribuir desde que a licença acompanhe. Os arquivos e a licença de cada uma estão em `public/assets/fontes/`. Por estarem no projeto, o site não depende de internet para ter a aparência certa.

**25. O que veio dos seus colegas nesta parte?**
A mecânica do jogo veio do JumpGoat, do Fabricio Lima, e o corgi segue a estrutura de corpo da cabra Luna. A barra lateral veio do Igor Fuchs Pereira. As imagens, os elementos tematizados e as skins são desta etapa.

---

## Próxima etapa

- Tabelas `destino` e `carimbo`, rotas de carimbo e de skin, e o desbloqueio ([seção 8](#8-plano-desbloqueio-por-carimbo-e-salvamento-no-banco)).
- Home, Login e Cadastro com as variáveis da skin e sem as imagens do AquaTech.
- Dashboard, Calculadora e Sobre mim.

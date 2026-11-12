# 02 — Refatoração: o que foi feito e como funciona

Data: 12/11/2026. Ramo do Git: `organizar-repositorio`. Este documento conta a execução do plano do [01-diagnostico.md](01-diagnostico.md).

## Como ler este documento

- **Seção 1**: resumo e o que ficou de fora.
- **Seção 2**: escolhas que fiz durante a execução e que você precisa conhecer (e pode mudar).
- **Seção 3**: os 8 passos, um por commit, com o que mudou, por quê, arquivos e um trecho antes/depois.
- **Seção 4**: o jogo explicado, do clique em EMBARCAR ao game over, função por função.
- **Seção 5**: como a sidebar entra em cada tela.
- **Seção 6**: o que eu testei e o resultado. **Seção 7**: como você testa sozinho.
- No fim: glossário dos conceitos novos e perguntas da banca.

Termos já explicados no glossário do documento 01 (rota, controller, model, `offsetLeft`, `getComputedStyle`, animação CSS, variável CSS...) não são repetidos aqui. O glossário deste documento traz só o que é novo.

---

## 1. Resumo

O que está pronto:

- O repositório saiu de 149 para 58 arquivos versionados. Não existe mais nada do AquaTech nem do GymFabs no código.
- Cadastro e login funcionam só com a tabela `usuario` (nome, e-mail e senha).
- O jogo está em `public/jogo/`, com HTML, CSS e JS separados, 7 fases num vetor de objetos, carimbo entre as fases e recomeço na fase em que o jogador perdeu.
- A sidebar aparece nas 5 telas logadas, montada por uma função a partir de um vetor, com o espaço do seletor de skins marcado.
- A pasta `features/` foi apagada.

O que **não** está pronto, de propósito (fica para as próximas etapas):

| Pendência | Situação hoje |
|---|---|
| Arte nova (corgi bípede, obstáculos, fundos, moldura, paleta) | O jogo usa as imagens antigas. Os fundos são o céu antigo recolorido por destino. A moldura ainda diz "JUMP GOAT". |
| Salvar carimbo no banco e liberar skins | O carimbo existe só durante a partida. Não há rota `/carimbos` nem seletor de skins. |
| Home, Dashboard, Calculadora e Sobre mim | A Home ainda tem o texto e a foto de água-viva do AquaTech. As outras três são páginas com o aviso "em construção". |
| Tabelas `destino`, `custo`, `tipo_viagem` e `carimbo` | O script SQL só cria `usuario`. |
| Diário de prompts | `docs/diario-de-prompts.md` continua vazio, e o README diz que ele existe. |

O que **não pude testar**: o banco de verdade. Detalhes na seção 6.

---

## 2. Escolhas feitas durante a execução

O plano não cobria tudo. Onde precisei decidir, escolhi o caminho mais simples e anotei aqui. Nenhuma destas escolhas é difícil de desfazer.

| # | Escolha | Por quê | Como desfazer |
|---|---|---|---|
| E1 | Os tempos de travessia ficaram **1,8 s → 1,1 s**, e não 2,0 s → 1,2 s como no plano. | Com a colisão honesta (retângulo contra retângulo), obstáculo **lento** fica mais tempo embaixo do viajante e exige pulo **mais** preciso. Medi: na fase mais lenta sobram cerca de 200 ms de folga para apertar a tecla; na mais rápida, 300 ms. Com 2,0 s a primeira fase ficava a mais apertada de todas. | Trocar `tempoTravessia` em `public/js/fases.js`. |
| E2 | A moldura antiga é **esticada** 23% na vertical. | O buraco dela tem proporção diferente do tabuleiro de 960×480 que você aprovou. Esticando, o buraco fica com exatamente 960×480 e o tabuleiro encaixa. O desenho fica um pouco deformado até a moldura nova chegar. | Some sozinho quando a moldura nova (1200×720 com buraco de 960×480) entrar. |
| E3 | Criei `calculadora.html` e `sobre.html` como páginas "em construção". | A sidebar precisa de links que abram alguma coisa. Sem as páginas, dois itens do menu dariam erro 404. | Substituir o conteúdo quando as telas forem feitas. |
| E4 | O e-mail virou `UNIQUE` no script do banco. | Um teste mostrou a brecha: cadastrar duas vezes o mesmo e-mail e senha criava dois usuários, e o login passava a recusar os dois ("Mais de um usuário com o mesmo login e senha"). | Tirar a palavra `UNIQUE` de `src/database/script-tabelas.sql`. |
| E5 | O cadastro confere se a senha é igual à confirmação. | O campo "Confirmação da Senha" existia, mas o código só conferia se ele não estava vazio. | Apagar o `if` em `public/cadastro.html:115`. |
| E6 | O nome "AquaTech" virou "Passport" nas três páginas públicas. | Só o nome, no título da aba e no cabeçalho. O conteúdo da Home não foi tocado. | — |
| E7 | O carimbo é desenhado com CSS (borda dupla e texto), sem imagem. | Ainda não existe a arte dos carimbos. | Trocar por imagem quando a arte chegar. |
| E8 | O jogo pausa quando você troca de aba do navegador. | Sem isso, o obstáculo continuaria andando sem ninguém conferir a colisão, e o jogador ganharia obstáculos "de graça". | Apagar `aoTrocarDeAba` e `pausarJogo` em `public/js/jogo.js`. |
| E9 | O README ganhou a seção "Créditos" e os arquivos vindos do JumpGoat e da sidebar têm o aviso de copyright no topo. | Pedido do seu prompt de execução (item 4). O slide de agradecimentos continua sendo o crédito principal. | — |

Duas respostas suas que entraram no plano antes da execução (estão no documento 01): o mural de avisos foi apagado (D3) e, de `DOCUMENTOS_DE_APOIO/`, ficaram só o tutorial de criar rota e o exemplo de gráfico (D4).

---

## 3. Passo a passo

Cada passo é um commit. Para ver exatamente o que mudou em um deles: `git show <código>`.

### Passo 1 — Limpeza do que ninguém usava (`bab76f7`)

**O que mudou.** Saíram 77 arquivos que nenhuma página, CSS ou rota citava: 23 imagens de `public/assets/`, `docs/documents.txt`, os exemplos de quiz e de upload, o site GymFabs (Index, Pagina Login, CalculadoraIMC, README) e os 6 quadrinhos. As duas licenças MIT foram para `docs/licencas/`.

**Por quê.** Eram arquivos mortos. Tirar primeiro o que não tem risco deixa os passos seguintes mais fáceis de conferir.

**Como conferi.** Depois de apagar, busquei o nome de cada arquivo removido em `public/`, `src/`, `app.js` e `README.md`. Resultado: nenhuma referência.

**Antes e depois** (pasta `public/assets/`):

```
ANTES: 29 imagens                    DEPOIS: 6 imagens
aguarde-orange.gif                   circle-loading.gif
aguarde-pink.gif ... (4 gifs)        icon/favicon2.ico
circle-loading.gif                   imgs/bg-jelly-fish-para-home.png
icon/favicon2.ico, favicon2.png      imgs/growth_color.png
imgs/ (22 imagens)                   imgs/lightbulb_color.png
                                     imgs/planet-earth_color.png
```

As 6 que ficaram ainda são usadas pela Home, pelo login e pelo cadastro. Saem quando essas telas forem refeitas.

### Passo 2 — Cadastro e login só com usuário (`07fe85d`)

**O que mudou.** O cadastro não pede mais código de ativação de empresa. O login responde direto, sem buscar aquários. O script do banco cria o banco `passport` com a tabela `usuario`. Nasceu o `.env.example`.

**Por quê.** O Passport não tem empresa nem aquário. E o login antigo tinha um defeito: usuário sem aquário ficava preso no "carregando" para sempre (risco R3 do documento 01).

**Arquivos.** `public/cadastro.html`, `public/login.html`, `public/dashboard/dashboard.html`, `src/controllers/usuarioController.js`, `src/models/usuarioModel.js`, `src/database/script-tabelas.sql`, `.env.example`.

**Antes e depois** — o controller do login:

```js
// ANTES: src/controllers/usuarioController.js (o login dependia do model de aquário)
if (resultadoAutenticar.length == 1) {
    aquarioModel.buscarAquariosPorEmpresa(resultadoAutenticar[0].empresaId)
        .then((resultadoAquarios) => {
            if (resultadoAquarios.length > 0) {
                res.json({ id: ..., email: ..., nome: ..., senha: ..., aquarios: resultadoAquarios });
            } else {
                res.status(204).json({ aquarios: [] });   // sem aquário: resposta vazia, tela travada
            }
        })
}
```

```js
// DEPOIS: src/controllers/usuarioController.js:19-26
if (resultadoAutenticar.length == 1) {
    // Achou exatamente um usuário: devolve os dados que o
    // login.html guarda na sessão (a senha não volta).
    res.json({
        id: resultadoAutenticar[0].id,
        email: resultadoAutenticar[0].email,
        nome: resultadoAutenticar[0].nome
    });
}
```

**Antes e depois** — o SQL do cadastro:

```js
// ANTES: src/models/usuarioModel.js
INSERT INTO usuario (nome, email, senha, fk_empresa) VALUES ('${nome}', '${email}', '${senha}', '${fkEmpresa}');
// DEPOIS: src/models/usuarioModel.js:19
INSERT INTO usuario (nome, email, senha) VALUES ('${nome}', '${email}', '${senha}');
```

**Antes e depois** — o aviso na tela do cadastro:

```js
// ANTES: public/cadastro.html (a cada clique nascia um temporizador que nunca parava)
setInterval(sumirMensagem, 5000);
```

```js
// DEPOIS: public/cadastro.html:158-163
function mostrarMensagem(texto) {
  cardErro.style.display = "block";
  mensagem_erro.innerHTML = texto;
  finalizarAguardar();
  setTimeout(sumirMensagem, 5000);   // roda uma vez só
}
```

A diferença entre os dois: `setInterval` repete para sempre; `setTimeout` roda uma vez. Para "esconder o aviso daqui a 5 segundos", o certo é `setTimeout`.

Também saiu a chamada a `limparFormulario()`, uma função que não existia nessa página.

### Passo 3 — Remoção do AquaTech (`0d1c957`)

**O que mudou.** Saíram as rotas, controllers e models de aviso, medida, aquário e empresa (12 arquivos), as telas `cards.html`, `mural.html`, `edicao-aviso.html`, o `alerta.js` e o `simulador.html`. O `app.js` ficou só com as rotas que existem.

**Por quê.** Só agora dava para apagar: o passo 2 tirou as duas dependências (cadastro → empresa, login → aquário). Se a ordem fosse a contrária, o `require` de um arquivo apagado derrubaria o servidor inteiro.

**Arquivos.** `app.js`, 12 arquivos em `src/`, 5 em `public/`, `public/css/estilo.css`, `public/css/dashboards.css`, `public/index.html`, `public/login.html`, `public/cadastro.html`.

**Antes e depois** — o `app.js`:

```js
// ANTES
var indexRouter = require("./src/routes/index");
var usuarioRouter = require("./src/routes/usuarios");
var avisosRouter = require("./src/routes/avisos");
var medidasRouter = require("./src/routes/medidas");
var aquariosRouter = require("./src/routes/aquarios");
var empresasRouter = require("./src/routes/empresas");
```

```js
// DEPOIS: app.js:18-19
var indexRouter = require("./src/routes/index");
var usuarioRouter = require("./src/routes/usuarios");
```

**Como conferi.** `npm start` subiu sem erro. A busca por `aquario|empresa|medida|aviso|simulador|aquatech` em `public`, `src` e `app.js` não devolveu nada. `/simulador.html` e `/avisos/listar` passaram a responder 404, como esperado.

### Passo 4 — Sidebar (`d8637a7`)

**O que mudou.** A glass sidebar virou um componente: `public/css/sidebar.css` (aparência) e `public/js/sidebar.js` (conteúdo). As três páginas de `public/dashboard/` passaram a usá-la.

**Por quê.** A barra é igual em todas as telas logadas. Escrever o mesmo HTML em 5 páginas obrigaria a mudar 5 arquivos a cada item novo do menu.

**Arquivos.** `public/css/sidebar.css` (veio de `features/glass-sidebar/`), `public/js/sidebar.js` (novo), `public/css/dashboards.css`, `public/dashboard/dashboard.html`, `calculadora.html`, `sobre.html`.

A explicação completa está na seção 5.

**Antes e depois** — o menu no HTML da página:

```html
<!-- ANTES: o menu inteiro escrito à mão em cada página (public/dashboard/dashboard.html) -->
<div class="header-left">
    <h1>AquaTech</h1>
    <div class="hello"><h3>Olá, <span id="b_usuario">usuário</span>!</h3></div>
    <div class="btn-nav-white"><a href="./cards.html"><h3>Aquários e Terrários</h3></a></div>
    <div class="btn-nav"><h3>Gráficos</h3></div>
    <div class="btn-nav-white"><a href="./mural.html"><h3>Mural de Avisos</h3></a></div>
    <div class="btn-logout" onclick="limparSessao()"><h3>Sair</h3></div>
</div>
```

```html
<!-- DEPOIS: public/dashboard/dashboard.html:24-27 -->
<body class="glass-sidebar-page" onload="montarSidebar('dashboard'), validarSessao()">

    <!-- A barra lateral é escrita aqui dentro pelo montarSidebar() -->
    <aside id="barra_lateral" class="glass-sidebar"></aside>
```

### Passo 5 — Mover o jogo sem mudar a lógica (`ecd06b4`)

**O que mudou.** Os arquivos do JumpGoat foram para `public/` com nomes novos. No código, só os caminhos mudaram.

**Por quê.** É o princípio "mover primeiro, mudar depois". Se o jogo quebrasse aqui, a causa só poderia ser um caminho errado, e não a lógica.

**De onde para onde:**

| Antes (em `features/Projeto-individual---GymFabs/`) | Depois (em `public/`) |
|---|---|
| `JumpGoat/JumpGoat.html` | `jogo/jogo.html` |
| `JumpGoat/style.css` | `css/jogo.css` |
| `Jump-goat-home/JumpGoat-home.html` | `jogo/inicio.html` |
| `Jump-goat-home/style.css` | `css/jogo-inicio.css` |
| `JumpGoat/img/luna_correndo.gif` | `assets/jogo/personagem/correndo.gif` |
| `JumpGoat/img/lunaGameOver.gif` | `assets/jogo/personagem/tonto.gif` |
| `JumpGoat/img/latinha.gif` | `assets/jogo/obstaculos/lata.gif` |
| `JumpGoat/img/moldura_fliperama_animada_tela_transparente.gif` | `assets/jogo/moldura/moldura-fliperama.gif` |

**Antes e depois** — os três tipos de caminho (risco R6 do documento 01):

```html
<!-- ANTES: no HTML, a partir da pasta da página -->
<img src="img/luna_correndo.gif" class="luna" />
<!-- DEPOIS -->
<img src="../assets/jogo/personagem/correndo.gif" class="luna" />
```

```css
/* ANTES: no CSS, a partir da pasta do arquivo CSS */
background-image: url(img/ceu_sem_nuvens_grande.png);
/* DEPOIS (o CSS está em public/css/, então ../ sobe para public/) */
background-image: url(../assets/jogo/fundos/ceu-noturno.png);
```

**Como conferi.** Pedi ao servidor cada caminho citado nas duas telas e nos dois CSS: todos responderam 200. Rodei o jogo sem pular: game over, botão RESTART e GIF da cabra tonta, igual ao original.

### Passo 6 — Refatoração do jogo (`1f0d59f`)

**O que mudou.** O JavaScript saiu do HTML e foi dividido em `fases.js` (os dados) e `jogo.js` (a lógica). Entraram as 7 fases, os checkpoints, o recomeço, os textos de viagem e a correção dos defeitos apontados no documento 01.

**Por quê.** É o centro do plano. A explicação completa está na seção 4.

**Arquivos.** `public/js/fases.js` e `public/js/jogo.js` (novos), `public/jogo/jogo.html`, `public/jogo/inicio.html`, `public/css/jogo.css`, `public/css/jogo-inicio.css`, a fonte em `public/assets/fontes/`, 7 fundos em `public/assets/jogo/fundos/`, `public/assets/jogo/obstaculos/cacto.png` e `public/assets/jogo/inicio/previa-jogo.png`.

**Antes e depois** — a colisão:

```js
// ANTES: três números fixos, que só serviam para a cabra e a lata
if (
  latinhaPosicao <= 120 &&
  latinhaPosicao > 0 &&
  lunaPosicao < 120
) {
```

```js
// DEPOIS: public/js/jogo.js:314-319 (as medidas vêm dos elementos e do objeto do obstáculo)
var cruzouNaHorizontal = obstaculoEsquerda < viajanteDireita && obstaculoDireita > viajanteEsquerda;
var estaBaixo = alturaDoPulo < alturaDoObstaculo;
return cruzouNaHorizontal && estaBaixo;
```

**Antes e depois** — o teclado:

```js
// ANTES: registrado dentro de iniciar(), a cada partida; qualquer tecla pulava
document.addEventListener("keydown", pulo);
```

```js
// DEPOIS: public/js/jogo.js:61, dentro de prepararJogo(), que roda uma vez ao abrir a página
document.addEventListener("keydown", aoApertarTecla);
```

**Antes e depois** — os textos:

| Antes | Depois |
|---|---|
| `SCORE:0` | `MILHAS 0` |
| `START` / `RESTART` | `EMBARCAR` / `NOVO VOO` / `VIAJAR DE NOVO` |
| "Em Xlurpônia as máquinas fazem tudo... Luna, a cabra mais forte da galáxia." | "Corra do deserto do Atacama até Orlando, pulando os obstáculos de cada destino..." |
| `MINIGAME GYMFABS` | `JOGO DO PASSAPORTE` |
| variáveis `luna`, `latinha`, `score` | `img_viajante`, `img_obstaculo`, `milhas` |
| classes `.luna`, `.latinha`, `.gameBoard` | `.viajante`, `.obstaculo`, `.tabuleiro` |
| variáveis CSS `--roxo`, `--roxo-claro` | `--cor-destaque`, `--cor-destaque-claro` |

### Passo 7 — Apagar `features/` e créditos (`3195126`)

**O que mudou.** A pasta `features/` saiu inteira. O README ganhou a seção "Créditos", o link do diário de prompts foi corrigido, entrou o passo do `.env.example` e saiu a palavra "Canvas" da tabela de tecnologias.

**Por quê.** Tudo que servia já estava em `public/` ou em `docs/licencas/`. O jogo não usa a tecnologia Canvas (ele usa imagens e CSS), então o README afirmava algo que a banca poderia cobrar.

**O que foi guardado de `features/`:** o cacto (`obstaculo-chile-cacto@2x.png` → `public/assets/jogo/obstaculos/cacto.png`), as imagens antigas do jogo e as duas licenças. O corgi de quatro patas e a protagonista foram apagados, como você autorizou. Continuam recuperáveis pelo Git: `git show ecd06b4:features/game/IMGS/corgi-correndo.webp > corgi.webp`.

### Passo 8 — E-mail único (`641bdcf`)

**O que mudou.** Uma palavra em `src/database/script-tabelas.sql:14`:

```sql
-- ANTES
email VARCHAR(50),
-- DEPOIS
email VARCHAR(50) UNIQUE, -- UNIQUE: o banco recusa dois cadastros com o mesmo e-mail
```

**Por quê.** Escolha E4 da seção 2.

---

## 4. O jogo refatorado

### 4.1 Os arquivos e o papel de cada um

| Arquivo | Papel |
|---|---|
| `public/jogo/inicio.html` | Tela de início: apresenta o jogo e lista o roteiro. |
| `public/jogo/jogo.html` | O "esqueleto" da partida: tabuleiro, viajante, obstáculo, painel, carimbo, aviso e botão. Não tem lógica. |
| `public/css/jogo.css` | Aparência e **movimento**: as animações do pulo e do obstáculo estão aqui. |
| `public/js/fases.js` | Os **dados**: o vetor `fases`. |
| `public/js/jogo.js` | A **lógica**: liga e desliga animações, confere colisão, conta milhas, troca de fase. |

A ordem dos `<script>` em `jogo.html:20-23` importa:

```html
<script src="../js/sessao.js"></script>
<script src="../js/sidebar.js"></script>
<script src="../js/fases.js"></script>
<script src="../js/jogo.js"></script>
```

O navegador executa de cima para baixo. O `jogo.js` usa o vetor `fases` logo na linha 46, então o `fases.js` precisa vir antes.

### 4.2 O vetor `fases`

```js
// public/js/fases.js:37-48 (resumido)
var obstaculoCacto = { nome: "cacto", imagem: PASTA_OBSTACULOS + "cacto.png", largura: 60, altura: 92, folga: 8 };
var obstaculoLata = { nome: "lata", imagem: PASTA_OBSTACULOS + "lata.gif", largura: 90, altura: 135, folga: 20 };

var fases = [
    {
        idDestino: 1,
        nome: "Atacama",
        pais: "Chile",
        fundo: PASTA_FUNDOS + "atacama.png",
        tempoTravessia: 1800,
        meta: 5,
        obstaculos: [obstaculoCacto, obstaculoLata]
    },
    // ... mais 6 fases
];
```

- `fases` é um **vetor** (os colchetes `[ ]`) de **objetos** (as chaves `{ }`). `fases[0]` é o Atacama; `fases[0].meta` é `5`; `fases.length` é `7`.
- Dentro de cada fase há outro vetor, `obstaculos`. `fases[0].obstaculos[1].altura` é `135`.
- Os objetos `obstaculoCacto` e `obstaculoLata` são criados uma vez e reaproveitados nas fases, para não repetir as medidas 7 vezes.

Os valores de hoje:

| # | Destino | Travessia | Velocidade | Meta | Obstáculos |
|---|---|---|---|---|---|
| 1 | Atacama | 1800 ms | 600 px/s | 5 | cacto, lata |
| 2 | Mendoza | 1650 ms | 655 px/s | 5 | lata |
| 3 | Espanha | 1500 ms | 720 px/s | 6 | lata |
| 4 | Portugal | 1400 ms | 771 px/s | 6 | lata |
| 5 | Gibraltar | 1300 ms | 831 px/s | 7 | lata |
| 6 | Moçambique | 1200 ms | 900 px/s | 7 | lata |
| 7 | Orlando | 1100 ms | 982 px/s | 8 | lata |

A velocidade é uma conta: o obstáculo percorre 1080 px (960 do tabuleiro mais os 120 px que ele começa para fora) dividido pelo tempo de travessia.

### 4.3 O fluxo de uma partida

```
A página abre
   └─ prepararJogo()            registra os ouvintes (uma vez) e mostra a fase 1
        │
Clique em EMBARCAR
   └─ iniciarJogo()             zera a fase, esconde o botão
        ├─ carregarFase()       fundo, velocidade e painel
        ├─ soltarObstaculo()    sorteia o obstáculo e liga a animação dele
        └─ ligarLaco()          começa o laço            estado = "jogando"
        │
A cada quadro (60 vezes por segundo)
   └─ lacoDoJogo()              soma milhas, chama houveColisao()
        │
Tecla Espaço, Seta para cima ou clique
   └─ aoApertarTecla() → pular()        liga a animação do pulo
        └─ (o pulo acaba) aoTerminarPulo()
        │
O obstáculo sai pela esquerda e recomeça
   └─ aoObstaculoDarVolta()     obstaculosPulados + 1
        ├─ ainda não bateu a meta → sortearObstaculo()
        └─ bateu a meta → darCarimbo()                   estado = "carimbo"
                             └─ (2 segundos) proximaFase()   estado = "jogando"
        │
houveColisao() devolve true
   └─ gameOver()                congela tudo, mostra NOVO VOO   estado = "gameover"
        │
Clique em NOVO VOO
   └─ iniciarJogo()             recomeça NA MESMA FASE, com os carimbos e as milhas do último carimbo
```

Depois do 7º carimbo, `darCarimbo()` põe o estado em `"fim"` e mostra "PASSAPORTE COMPLETO!". Clicar em VIAJAR DE NOVO recomeça do Atacama, sem carimbos.

### 4.4 A variável `estado`

```js
// public/js/jogo.js:42
var estado = "inicio";
```

É um texto que diz em que momento o jogo está. Quase toda função começa perguntando por ele. Isso substitui o truque do original, em que a única proteção contra "começar duas partidas" era o botão estar escondido.

| Estado | Quando | O que vale |
|---|---|---|
| `"inicio"` | Página aberta, antes do primeiro clique | Só o botão EMBARCAR |
| `"jogando"` | Obstáculo andando | Pulo, colisão, milhas |
| `"carimbo"` | Carimbo na tela, entre duas fases | Nada (2 segundos de descanso) |
| `"pausado"` | O jogador trocou de aba | Nada, até voltar |
| `"gameover"` | Bateu | Só o botão NOVO VOO |
| `"fim"` | 7 carimbos | Só o botão VIAJAR DE NOVO |

### 4.5 Função por função

Todas estão em `public/js/jogo.js`. O número é a linha onde a função começa.

**`prepararJogo()` — linha 58.** Chamada pelo `onload` do `<body>`, uma vez. Registra os cinco ouvintes e carrega a fase 1.

```js
// public/js/jogo.js:61-70 (sem os comentários)
document.addEventListener("keydown", aoApertarTecla);
div_tabuleiro.addEventListener("mousedown", pular);
img_viajante.addEventListener("animationend", aoTerminarPulo);
img_obstaculo.addEventListener("animationiteration", aoObstaculoDarVolta);
document.addEventListener("visibilitychange", aoTrocarDeAba);
```

Por que `mousedown` e não `click` no tabuleiro: o botão EMBARCAR fica dentro do tabuleiro. Com `click`, o mesmo clique que começa o jogo também faria o viajante pular. O `mousedown` acontece antes do `click`, quando o jogo ainda não começou, e é ignorado.

**`preCarregarImagens()` — linha 79.** Dois laços `for`, um dentro do outro: para cada fase, para cada obstáculo dela, cria uma imagem na memória. Isso faz o navegador baixar os arquivos antes de precisar deles.

**`iniciarJogo()` — linha 100.** Chamada pelo botão. Em ordem:
1. Se já há partida (`"jogando"`, `"carimbo"` ou `"pausado"`), sai sem fazer nada.
2. Se o estado é `"fim"`, zera fase, carimbos e milhas guardadas.
3. `milhas = milhasNoCheckpoint`: volta para a pontuação do último carimbo.
4. Desfaz o game over: GIF de corrida, tira as classes `pulando` e `pausado`.
5. Esconde aviso, carimbo e botão.
6. `carregarFase`, `soltarObstaculo`, `estado = "jogando"`, `ligarLaco`.

**`carregarFase(indice)` — linha 136.** Recebe a posição da fase no vetor e coloca na tela o que é dela.

```js
// public/js/jogo.js:137-146 (sem os comentários)
var fase = fases[indice];
div_tabuleiro.style.backgroundImage = `url(${fase.fundo})`;
div_tabuleiro.style.setProperty("--tempo-travessia", fase.tempoTravessia + "ms");
atualizarPainel();
```

A terceira linha é a que muda a dificuldade. `--tempo-travessia` é uma variável CSS, e a animação do obstáculo usa esse valor como duração:

```css
/* public/css/jogo.css:153-155 */
.obstaculo.andando {
  animation: atravessar var(--tempo-travessia) infinite linear;
}
```

O JavaScript nunca escreve a velocidade "na mão": ele muda a variável, e o CSS faz o resto.

**`soltarObstaculo()` — linha 150.** Chama `sortearObstaculo()` e depois `reiniciarAnimacao(img_obstaculo, "andando")`.

**`sortearObstaculo()` — linha 156.** Escolhe um obstáculo do vetor da fase.

```js
// public/js/jogo.js:157-168 (sem os comentários)
var lista = fases[indiceFase].obstaculos;
var posicao = Math.floor(Math.random() * lista.length);
obstaculoAtual = lista[posicao];
img_obstaculo.src = obstaculoAtual.imagem;
img_obstaculo.style.width = obstaculoAtual.largura + "px";
img_obstaculo.style.height = obstaculoAtual.altura + "px";
```

`Math.random()` devolve um número entre 0 e 1. Com 2 obstáculos na lista: vezes 2 dá algo entre 0 e 1,99; `Math.floor` arredonda para baixo e sobra 0 ou 1, que são as duas posições do vetor.

**`reiniciarAnimacao(elemento, classe)` — linha 172.** Tira a classe, lê `offsetWidth`, coloca a classe de novo. A leitura no meio parece inútil, mas é necessária: sem ela o navegador junta as duas mudanças, conclui que nada mudou e a animação continua de onde estava. Ler uma medida obriga o navegador a aplicar a remoção naquele instante.

**`aoApertarTecla(evento)` — linha 187.** O navegador entrega um objeto `evento` com os dados da tecla.

```js
// public/js/jogo.js:188-202 (sem os comentários)
if (estado != "jogando") {
    return;
}
if (evento.code == "Space" || evento.code == "ArrowUp") {
    evento.preventDefault();
    if (!evento.repeat) {
        pular();
    }
}
```

- `evento.code` diz qual tecla foi. Só Espaço e Seta para cima passam.
- `evento.preventDefault()` cancela o que o navegador faria com a tecla (rolar a página).
- `evento.repeat` é `true` quando a tecla está sendo **segurada** e o navegador repete o evento sozinho. Essas repetições são ignoradas.

**`pular()` — linha 205.** Se o jogo está valendo e não há pulo em andamento, marca `pulando = true` e coloca a classe `pulando`, que liga a animação do CSS.

**`aoTerminarPulo()` — linha 218.** Chamada pelo navegador quando a animação do pulo acaba. Tira a classe e libera o próximo pulo. No original isso era um `setTimeout` de 700 ms, e o número precisava ser igual ao do CSS. Agora a duração existe só no CSS (`--tempo-pulo`, em `jogo.css`).

**`ligarLaco()` — linha 229.** Liga o laço com `requestAnimationFrame`, mas só se ele ainda não estiver ligado (variável `lacoLigado`). Sem esse cuidado poderiam existir dois laços ao mesmo tempo, e as milhas subiriam em dobro. É dentro desta função que está o comentário comparando com o `setInterval`, como você pediu.

**`lacoDoJogo(horario)` — linha 263.** Roda uma vez por quadro.

```js
// public/js/jogo.js:265-285 (sem os comentários)
if (estado != "jogando") {
    lacoLigado = false;
    return;
}
if (horarioAnterior != 0) {
    var segundos = (horario - horarioAnterior) / 1000;
    milhas += segundos * MILHAS_POR_SEGUNDO;
}
horarioAnterior = horario;
span_milhas.innerHTML = Math.floor(milhas);
if (houveColisao()) {
    gameOver();
    lacoLigado = false;
    return;
}
requestAnimationFrame(lacoDoJogo);
```

- `horario` é o momento do quadro, em milissegundos, informado pelo navegador.
- As milhas sobem pelo **tempo que passou** entre dois quadros. Se o computador engasgar e pular quadros, a pontuação continua certa.
- A última linha pede o próximo quadro. É assim que o laço continua: cada volta agenda a seguinte. Quando a função dá `return` antes dessa linha, o laço para.

**`houveColisao()` — linha 295.** Devolve `true` ou `false`.

```
          viajanteEsquerda      viajanteDireita
                 │◄──── caixa ────►│
        ┌────────┼─────────────────┼────────┐
        │ folga  │    viajante     │ folga  │   imagem de 150 px
        └────────┴─────────────────┴────────┘
                             ┌──┬───────┬──┐
                             │  │ caixa │  │    obstáculo
                             └──┴───────┴──┘
                    obstaculoEsquerda   obstaculoDireita
```

- Cada "caixa" é a imagem menos a folga dos dois lados. A folga existe porque o desenho não ocupa a imagem toda (a cabra visível tem 114 px dentro de uma imagem de 150 px) e para dar tolerância.
- **Cruzou na horizontal** quando a caixa do obstáculo começa antes do fim da caixa do viajante **e** termina depois do começo dela.
- **Está baixo** quando a altura do pulo é menor que a altura do obstáculo menos a folga.
- Só é colisão se as duas coisas forem verdade ao mesmo tempo.

**`gameOver()` — linha 322.** Põe o estado em `"gameover"`, coloca a classe `pausado` no obstáculo e no viajante, troca o GIF e mostra o aviso e o botão.

```css
/* public/css/jogo.css:169-172 */
.viajante.pausado,
.obstaculo.pausado {
  animation-play-state: paused;
}
```

`animation-play-state: paused` congela a animação onde ela está. O original copiava a posição para o estilo do elemento, e por isso a cabra voltava a subir sozinha (defeito 3 do documento 01).

**`aoObstaculoDarVolta()` — linha 346.** Chamada pelo navegador cada vez que a animação do obstáculo termina uma volta. Se o estado ainda é `"jogando"`, o viajante passou: soma 1. Depois decide com um `if`: bateu a meta → `darCarimbo()`; não bateu → `sortearObstaculo()`.

**`darCarimbo()` — linha 364.**
1. `carimbos.push(fase.pais)`: acrescenta o país no fim do vetor de carimbos.
2. `milhasNoCheckpoint = milhas`: guarda a pontuação.
3. Tira a classe `andando` (o obstáculo some).
4. Mostra o carimbo na tela.
5. `if (indiceFase == fases.length - 1)`: era a última fase? Se sim, estado `"fim"`. Se não, estado `"carimbo"` e `setTimeout(proximaFase, 2000)`.

`fases.length - 1` é a posição da última fase: o vetor tem 7 itens, e as posições vão de 0 a 6.

**`proximaFase()` — linha 392.** Soma 1 em `indiceFase`, zera `obstaculosPulados`, esconde o carimbo, carrega a fase nova, solta o obstáculo e liga o laço.

**`atualizarPainel()` — linha 412.** Escreve o destino e o progresso (`3/5`) e desenha os 7 quadradinhos do passaporte com um `for`:

```js
// public/js/jogo.js:422-428
for (var i = 0; i < fases.length; i++) {
    if (i < carimbos.length) {
        html += `<span class="selo carimbado" title="${fases[i].pais}"></span>`;
    } else {
        html += `<span class="selo" title="${fases[i].pais}"></span>`;
    }
}
```

Com 2 carimbos, as posições 0 e 1 ganham a classe `carimbado` (quadradinho cheio) e as outras 5 ficam vazias.

**`aoTrocarDeAba()` e `pausarJogo()` — linhas 440 e 452.** `document.hidden` é `true` quando a aba está escondida. Saiu da aba jogando → pausa. Voltou → continua.

### 4.6 O que mudou em relação ao JumpGoat

A coluna "Defeito" usa a numeração da seção 2.7 do documento 01.

| Defeito | No JumpGoat | No Jogo do Passaporte | Onde |
|---|---|---|---|
| 1. Velocidade dependia da janela | Tabuleiro com `width: 80%` | Tabuleiro fixo de 960×480 | `jogo.css:91-99` |
| 2. Segurar a tecla travava o pulo | `setTimeout` a cada repetição | Ignora `evento.repeat`; fim do pulo por `animationend` | `jogo.js:199`, `:218` |
| 3. Cabra flutuava no game over | Posição copiada para o estilo inline | Animações pausadas | `jogo.js:327-328` |
| 4. Moldura desalinhada | Moldura no fundo do `<body>` | Moldura é uma `<div>` e o tabuleiro fica no buraco dela | `jogo.css:78-99` |
| 5. Números fixos na colisão | `120` e `120` | Medidas lidas dos elementos e do objeto | `jogo.js:295-320` |
| 6. Colisão desligava cedo atrás | `latinhaPosicao > 0` | Compara os dois retângulos inteiros | `jogo.js:314` |
| 7. Laço mais rápido que a tela | `setInterval` de 10 ms | `requestAnimationFrame` | `jogo.js:240` |
| 8. Pontos por voltas do laço | `score += 10` | Milhas pelo tempo real | `jogo.js:271-274` |
| 9. Qualquer tecla; só teclado | Sem conferir a tecla | Espaço, Seta para cima ou clique | `jogo.js:194`, `:62` |
| 10. Duração do pulo em dois lugares | `700ms` no CSS e `700` no JS | Só no CSS (`--tempo-pulo`) | `jogo.css:38` |
| 11. Botão fora do centro, lata aparecendo | `left: 42%`; `right: -80px` | `left: 50%` com `translate(-50%)`; `right: -120px` | `jogo.css:243-256`, `:144-149` |
| 12. Fonte dependia de internet | `@import` do Google Fonts | Arquivo em `assets/fontes/` | `jogo.css:10-13` |
| 13. Tudo num arquivo só | HTML e JS juntos | `jogo.html`, `jogo.css`, `fases.js`, `jogo.js` | — |
| Ouvinte criado a cada partida | Dentro de `iniciar()` | Uma vez, em `prepararJogo()` | `jogo.js:61` |

O que **não** mudou: o CSS continua movendo o obstáculo e fazendo o pulo; o pulo dura os mesmos 700 ms e sobe os mesmos 200 px; a leitura de posição usa os mesmos `offsetLeft` e `getComputedStyle`.

---

## 5. Como a sidebar entra em cada tela

### 5.1 A ideia

A página tem só uma tag vazia. Uma função escreve o menu dentro dela.

```html
<!-- em toda página logada, por exemplo public/dashboard/sobre.html:24-27 -->
<body class="glass-sidebar-page" onload="montarSidebar('sobre'), validarSessao()">
    <aside id="barra_lateral" class="glass-sidebar"></aside>
```

### 5.2 Os quatro pedaços que cada página precisa

| # | O quê | Para quê |
|---|---|---|
| 1 | `<link rel="stylesheet" href="../css/sidebar.css">` | A aparência da barra. |
| 2 | `<script src="../js/sessao.js">` e `<script src="../js/sidebar.js">` | As funções `validarSessao`, `limparSessao` e `montarSidebar`. |
| 3 | `class="glass-sidebar-page"` no `<body>` | Reserva 100 px à esquerda, para o conteúdo não ficar embaixo da barra fechada. |
| 4 | `<aside id="barra_lateral" class="glass-sidebar"></aside>` e `montarSidebar('nome')` no `onload` | O lugar da barra e a ordem para escrevê-la. |

### 5.3 O vetor de itens e o laço

```js
// public/js/sidebar.js:17-22
var itensDaSidebar = [
    { id: "dashboard",   nome: "Dashboard",   icone: "📊", link: "../dashboard/dashboard.html" },
    { id: "calculadora", nome: "Calculadora", icone: "🧮", link: "../dashboard/calculadora.html" },
    { id: "jogo",        nome: "Jogo",        icone: "🏃", link: "../jogo/inicio.html" },
    { id: "sobre",       nome: "Sobre mim",   icone: "🙋", link: "../dashboard/sobre.html" }
];
```

```js
// public/js/sidebar.js:45-60 (sem os comentários)
for (var i = 0; i < itensDaSidebar.length; i++) {
    var item = itensDaSidebar[i];
    var classes = "glass-sidebar__item";
    if (item.id == paginaAtual) {
        classes += " is-active";
    }
    html += `
        <a href="${item.link}" class="${classes}" title="${item.nome}">
            <span class="glass-sidebar__icon" aria-hidden="true">${item.icone}</span>
            <span class="glass-sidebar__label">${item.nome}</span>
        </a>
    `;
}
```

- O `for` passa pelos 4 objetos e monta um link para cada um.
- O `if` compara o `id` do item com o texto que a página passou (`'sobre'`). O item igual ganha a classe `is-active` e aparece destacado.
- No fim, `barra_lateral.innerHTML = html` coloca tudo dentro do `<aside>` (linha 83).

Para criar uma página nova no menu: uma linha no vetor. Nenhuma página existente precisa mudar.

### 5.4 Por que a ordem do `onload` importa

```html
onload="montarSidebar('jogo'), validarSessao(), prepararJogo()"
```

O `validarSessao()` (em `public/js/sessao.js`) escreve o nome do usuário no elemento `b_usuario`. Esse elemento está **dentro** da barra, e a barra só existe depois de `montarSidebar()`. Se a ordem fosse invertida, `validarSessao()` procuraria um elemento que ainda não existe e daria erro.

### 5.5 Por que os links começam com `../`

Toda página logada está uma pasta abaixo de `public/` (em `public/dashboard/` ou em `public/jogo/`). `../` sobe para `public/`, e dali o caminho desce para a pasta certa. Por isso o mesmo vetor serve para as duas pastas. É a mesma razão do `../login.html` do `sessao.js`.

### 5.6 O espaço do seletor de skins

```js
// public/js/sidebar.js:68-74
<!-- ESPAÇO DO SELETOR DE SKINS (ainda não implementado).
     Na próxima etapa, os botões das skins liberadas pelos carimbos
     do jogo vão ser escritos dentro desta div. -->
<div id="div_seletor_skins" class="glass-sidebar__skins" title="Skins (em breve)">
    <span class="glass-sidebar__icon" aria-hidden="true">🎨</span>
    <span class="glass-sidebar__label">Skins: em breve</span>
</div>
```

Hoje aparece uma caixa tracejada com "Skins: em breve". Quando o seletor existir, uma função vai escrever os botões dentro de `div_seletor_skins`, do mesmo jeito que `montarSidebar` escreve o menu.

### 5.7 O que mudou no CSS da barra

| Mudança em `public/css/sidebar.css` | Por quê |
|---|---|
| `box-sizing: border-box` na barra (linha 52) | A demonstração original tinha essa regra em outro arquivo (`demo.css`). Sem ela a barra fechada ficava com 90 px em vez de 68 px. Vi isso na primeira captura de tela. |
| `:focus-within` junto do `:hover` (linhas 91 e 102) | A barra abre também pela tecla Tab. |
| `overflow: hidden` (linha 85) | O texto invisível da barra fechada "vazava" para fora, e a barra abria com o mouse ainda longe dela. |
| Um tema só, o escuro | O original trocava entre claro e escuro. No Passport quem vai trocar as cores é a skin. |
| `.glass-sidebar__usuario` e `.glass-sidebar__skins` | A saudação e o espaço das skins. |

---

## 6. O que testei e o resultado

### 6.1 Como testei

- Subi o site com `npm start` e pedi cada página e cada arquivo ao servidor.
- Abri as telas no Chrome e tirei capturas em 1366×768.
- Para o jogo e para o cadastro e login, usei roteiros automáticos: um pequeno programa que roda dentro da página no Chrome, aperta as teclas, clica nos botões e anota o que aconteceu. Os roteiros do jogo rodaram em tempo real.
- Os arquivos de teste ficaram fora do repositório.

### 6.2 O que NÃO pôde ser testado

**O banco de verdade.** Nesta máquina existe um MySQL rodando, mas o `.env.dev` ainda tem `'SEUSDADOSAQUI'` no usuário e no nome do banco, e eu não tenho acesso à VM. Com o `npm start` normal, o cadastro pela API responde:

```
"Access denied for user 'SEUSDADOSAQUI'@'localhost' (using password: YES)" [500]
```

Isso mostra que a API chega até o MySQL e que falta só a configuração.

Para testar o caminho navegador → rota → controller → model sem o banco, usei um **banco falso em memória**: um programa de teste que recebe o mesmo texto SQL que o model monta e guarda os usuários numa lista. Ele prova que as telas, as rotas e o controller conversam direito e que o SQL sai com o formato esperado. Ele **não** prova que o MySQL aceita o `script-tabelas.sql` nem os comandos. Isso só o teste da seção 7 (passos 1 a 4) confirma.

### 6.3 Resultados

**Servidor e arquivos** (com `npm start` normal)

| Teste | Resultado |
|---|---|
| `npm start` sobe e mostra a mensagem do servidor | ✅ |
| Home, login, cadastro, as 3 páginas de `dashboard/` e as 2 de `jogo/` respondem | ✅ todas 200 |
| JS, CSS, fonte, prévia, cacto e fundos respondem | ✅ todos 200 |
| `/simulador.html`, `/dashboard/mural.html` e `/avisos/listar` | ✅ 404, como esperado |

**Cadastro, login e sidebar** (no Chrome, com o banco falso)

| Teste | Resultado |
|---|---|
| Cadastro com campos vazios | ✅ "Preencha todos os campos para se cadastrar." |
| Senha diferente da confirmação | ✅ "A senha e a confirmação da senha estão diferentes." |
| Cadastro certo | ✅ mensagem de sucesso e ida para `login.html` |
| Login com senha errada | ✅ "Email e/ou senha inválido(s)", continua no login |
| Login com campos vazios | ✅ "Preencha o e-mail e a senha para entrar." |
| Login certo | ✅ vai para `dashboard/dashboard.html`; a sessão guarda nome, e-mail e id; não guarda mais `AQUARIOS` |
| Nome do usuário na barra | ✅ "Bia Teste" |
| Cada link da barra abre a página e marca o item certo | ✅ Dashboard, Calculadora, Jogo e Sobre mim |
| O espaço das skins existe em todas | ✅ |
| Barra abre com o foco do teclado | ✅ (captura de tela) |
| Botão Sair | ✅ volta para o login e esvazia a sessão |
| Abrir `jogo/jogo.html` sem login | ✅ manda para `login.html` |
| Dois cadastros com o mesmo e-mail e senha | ⚠️ sem o `UNIQUE`, o login recusava os dois. Corrigido no passo 8. O `UNIQUE` em si só vale no MySQL de verdade. |

**Jogo** (no Chrome, em tempo real)

| # | Teste | Resultado |
|---|---|---|
| 1 | Não apertar nada | ✅ game over no primeiro obstáculo; aviso "VOO CANCELADO!"; botão "NOVO VOO"; GIF tonto; o obstáculo fica parado e as milhas param |
| 2 | Segurar Espaço | ✅ um pulo só (sobe a 200 px e volta ao chão); nenhuma tremida depois |
| 3 | Bater durante a descida do pulo | ✅ parou a 7 px do chão e continuava a 7 px depois de 1,2 s |
| 4 | Teclas A, F5 e Tab | ✅ não pulam. Seta para cima pula |
| 5 | Clique no tabuleiro | ✅ pula |
| 6 | Recomeçar 4 vezes seguidas | ✅ 98, 98, 98 e 100 milhas no primeiro segundo de cada uma |
| 8 e 10 | Um robô joga as 7 fases | ✅ 44 obstáculos, 7 carimbos, "PASSAPORTE COMPLETO!", 73 segundos, 6094 milhas. A cada fase mudaram o fundo, o tempo de travessia e o painel |
| — | Clicar em VIAJAR DE NOVO depois do fim | ✅ volta ao Atacama, 0 carimbos, milhas zeradas |
| 9 | Perder na fase 3 | ✅ recomeça em "ESPANHA 0/6", com 2 carimbos e as milhas do último carimbo |
| 13 | Trocar de aba | ✅ estado `pausado`, 0 milhas ganhas em 1,5 s; ao voltar, continua sem salto na pontuação |
| 12 | Mensagens de erro no console | ✅ nenhuma |
| 7 | Moldura encaixada em 1366 px | ✅ (captura de tela) |
| 11 | Fonte sem internet | ✅ o arquivo da fonte é servido pelo próprio site. Não desliguei a internet para conferir a aparência. |

**Folga de tempo do pulo.** Fiz o robô apertar a tecla cada vez mais cedo, até bater:

| Fase | Passa quando a tecla é apertada entre... | Folga |
|---|---|---|
| Atacama (a mais lenta) | 100 e 300 ms antes de o obstáculo encostar | cerca de 200 ms |
| Orlando (a mais rápida) | 100 e 400 ms antes | cerca de 300 ms |

A fase rápida perdoa mais o erro de tempo; o que a deixa difícil é ter menos tempo para reagir (o obstáculo leva 0,9 s para chegar, contra 1,4 s na primeira).

**Não testei:** celular e tela de toque; outros navegadores além do Chrome; o jogo jogado por uma pessoa (só pelo robô).

---

## 7. Como testar sozinho

### Parte A — Banco (é a parte que eu não consegui fazer)

1. Na VM, abra o MySQL e execute o arquivo `src/database/script-tabelas.sql` inteiro.
2. Confira: `USE passport;` e depois `DESCRIBE usuario;`. Devem aparecer `id`, `nome`, `email` e `senha`.
3. Na pasta do projeto, copie o `.env.example` com o nome `.env.dev` e preencha `DB_HOST` (o IP da VM), `DB_USER` e `DB_PASSWORD`.
4. Rode `npm install` (só na primeira vez) e `npm start`. Deve aparecer "Servidor do seu site já está rodando!".

### Parte B — Cadastro e login

5. Abra `http://localhost:3333`. Clique em Cadastro.
6. Clique em Cadastrar sem preencher nada. Deve aparecer o aviso de campos vazios.
7. Preencha com senhas diferentes. Deve aparecer o aviso de senha diferente.
8. Preencha certo. Deve aparecer "Cadastro realizado com sucesso!" e a tela muda para o login.
9. Na VM: `SELECT * FROM usuario;`. A linha nova tem que estar lá.
10. Tente cadastrar de novo o mesmo e-mail. Deve aparecer "Não foi possível fazer o cadastro".
11. No login, erre a senha. Deve aparecer "Email e/ou senha inválido(s)".
12. Entre com a senha certa. Deve abrir a Dashboard, com a barra lateral.

### Parte C — Sidebar

13. Passe o mouse na barra: ela abre e mostra "Olá, seu nome!".
14. Clique em Calculadora, Jogo e Sobre mim. Em cada tela, o item correspondente fica destacado.
15. Aperte Tab algumas vezes: a barra abre sozinha.
16. Clique em Sair. Volta para o login.
17. Sem fazer login, digite `http://localhost:3333/jogo/jogo.html`. Deve voltar para o login.

### Parte D — Jogo

18. Faça login, clique em Jogo e depois em EMBARCAR (duas vezes: uma na tela de início, outra no jogo).
19. Não aperte nada. Game over no primeiro obstáculo.
20. Clique em NOVO VOO e pule com Espaço. Depois com a seta para cima. Depois clicando no tabuleiro.
21. Aperte a letra A: não pula.
22. Segure o Espaço: um pulo só.
23. Pule 5 obstáculos. Aparece o carimbo "CHILE", o fundo muda, o painel mostra "MENDOZA 0/5" e o primeiro quadradinho do passaporte fica cheio.
24. Perca de propósito em Mendoza. Clique em NOVO VOO: continua em Mendoza, com 1 carimbo.
25. Aperte F12, abra a aba Console e jogue. Não pode aparecer linha vermelha.
26. Na aba Rede (Network) do F12, recarregue a página. Nenhuma linha pode estar em vermelho (404).

Para chegar rápido à última fase num teste: abra o Console (F12) e digite `indiceFase = 6` **antes** de clicar em EMBARCAR.

---

## Glossário dos conceitos novos

| Termo | O que é |
|---|---|
| `animation-play-state: paused` | Propriedade CSS que congela uma animação no ponto em que ela está. Tirando o `paused`, ela continua dali. |
| Banco falso (em memória) | Um programa de teste que finge ser o banco: recebe o SQL e guarda os dados numa lista, que some quando o programa fecha. Serve para testar o resto do sistema sem o MySQL. |
| Commit | Uma "foto" do projeto no Git, com uma mensagem dizendo o que mudou. Dá para voltar a qualquer uma. |
| Componente | Um pedaço de tela feito uma vez e usado em várias páginas. Aqui, a sidebar. |
| `document.hidden` | Vale `true` quando a aba do navegador está escondida. |
| `evento.code` | O nome da tecla que disparou o evento: `"Space"`, `"ArrowUp"`, `"KeyA"`. |
| `evento.preventDefault()` | Cancela o que o navegador faria por conta própria com aquele evento (por exemplo, rolar a página com o Espaço). |
| `evento.repeat` | Vale `true` nos eventos que o navegador repete sozinho enquanto a tecla fica segurada. |
| `@font-face` | Regra CSS que ensina ao navegador uma fonte a partir de um arquivo do próprio site. |
| `:focus-within` | Vale para um elemento quando algo **dentro** dele está com o foco do teclado. |
| Laço dentro de laço | Um `for` dentro de outro. Para cada volta do de fora, o de dentro dá todas as suas voltas. |
| `Math.floor` | Arredonda um número para baixo: `Math.floor(2.9)` é `2`. |
| `Math.random` | Devolve um número aleatório entre 0 e 1 (nunca chega em 1). |
| `mousedown` | O evento de "botão do mouse apertado". Acontece antes do `click`, que só vem quando o botão é solto. |
| `new Image()` | Cria uma imagem só na memória, sem colocar na página. Dar um `src` a ela faz o navegador baixar o arquivo. |
| Ouvinte | A função registrada com `addEventListener` para ser chamada quando um evento acontece. |
| `pointer-events: none` | Faz o clique "atravessar" o elemento, como se ele não estivesse ali. |
| `.push()` | Acrescenta um item no fim de um vetor: `carimbos.push("Chile")`. |
| Ramo (branch) | Uma linha de trabalho separada no Git. As mudanças ficam nela até serem juntadas à principal. |
| `return` | Termina a função naquele ponto. Pode devolver um valor (`return true`) ou nada. |
| `setProperty` | Muda uma variável CSS pelo JavaScript: `elemento.style.setProperty("--nome", valor)`. |
| `transform: translate(-50%, -50%)` | Desloca o elemento metade da própria largura e altura. Junto com `left: 50%` e `top: 50%`, centraliza. |
| `UNIQUE` | Regra do banco: dois registros não podem ter o mesmo valor naquela coluna. |
| `visibilitychange` | Evento disparado quando a aba do navegador é escondida ou volta a aparecer. |
| `.env.example` | Um modelo do arquivo de configuração, sem dados secretos, que pode ir para o GitHub. Cada pessoa copia e preenche o seu. |

---

## Perguntas que a banca pode fazer

**1. Por que você separou `fases.js` de `jogo.js`?**
Um guarda os dados e o outro a lógica. Para mudar a dificuldade, um fundo ou um obstáculo, eu mexo só no vetor `fases`, sem tocar nas funções do jogo.

**2. Como o jogo passa de uma fase para a outra?**
Cada vez que o obstáculo termina uma volta, o navegador dispara o evento `animationiteration`. A função `aoObstaculoDarVolta` soma 1 em `obstaculosPulados`. Quando o total chega na `meta` da fase, `darCarimbo` guarda o país no vetor `carimbos` e, depois de 2 segundos, `proximaFase` soma 1 no índice e carrega a fase seguinte.

**3. Como a velocidade muda de fase para fase?**
Cada fase tem um `tempoTravessia`. A função `carregarFase` escreve esse valor na variável CSS `--tempo-travessia`, e a animação do obstáculo usa essa variável como duração. Tempo menor, obstáculo mais rápido.

**4. O que é a variável `estado`?**
É um texto que diz em que momento o jogo está: `"inicio"`, `"jogando"`, `"carimbo"`, `"pausado"`, `"gameover"` ou `"fim"`. As funções consultam esse texto antes de agir. Por exemplo, `pular` só funciona em `"jogando"`.

**5. Por que `requestAnimationFrame` e não `setInterval`?**
O `setInterval` de 10 ms rodava umas 100 vezes por segundo, mas a tela só muda 60 vezes: 41% das leituras vinham repetidas. O `requestAnimationFrame` roda uma vez por quadro e informa o horário, o que me deixa contar as milhas pelo tempo real. A comparação está comentada dentro de `ligarLaco`.

**6. Por que a função `lacoDoJogo` chama `requestAnimationFrame` de novo no fim?**
Porque `requestAnimationFrame` chama a função uma vez só. Para o laço continuar, cada volta pede a próxima. Quando o jogo para, a função dá `return` antes desse pedido e o laço termina.

**7. Como você evita dois laços ao mesmo tempo?**
Com a variável `lacoLigado`. `ligarLaco` só pede o primeiro quadro se ela estiver `false`. Dois laços contariam as milhas em dobro.

**8. O que é a "folga" de cada obstáculo?**
São os pixels de cada lado que não contam na colisão. O desenho não ocupa a imagem inteira e eu quis dar uma tolerância ao jogador. A caixa de colisão é a imagem menos a folga.

**9. Por que segurar a tecla não faz pular sem parar?**
O navegador repete o evento `keydown` enquanto a tecla fica segurada, mas marca essas repetições com `repeat = true`. Eu ignoro as repetições. E um pulo novo só começa quando o anterior terminou, pela variável `pulando`.

**10. Como o jogo sabe que o pulo acabou?**
Pelo evento `animationend`, que o navegador dispara quando a animação CSS termina. Antes era um `setTimeout` de 700 ms, e o número precisava ser igual ao do CSS.

**11. Por que a fase mais lenta não é a mais fácil de acertar o tempo?**
Porque o obstáculo lento fica mais tempo embaixo do viajante. O pulo dura sempre o mesmo, então sobra menos folga: cerca de 200 ms na primeira fase contra 300 ms na última. O que deixa a última difícil é o tempo de reação: o obstáculo chega em 0,9 segundo.

**12. Como a sidebar aparece em todas as telas sem repetir o HTML?**
Cada página tem um `<aside>` vazio e chama `montarSidebar`. A função percorre o vetor `itensDaSidebar` com um `for`, monta um link para cada objeto e escreve tudo no `<aside>` com `innerHTML`.

**13. Como a sidebar sabe qual item destacar?**
Cada página passa o seu nome para a função: `montarSidebar('jogo')`. Dentro do laço, um `if` compara esse nome com o `id` de cada item e coloca a classe `is-active` no que for igual.

**14. Por que `montarSidebar()` vem antes de `validarSessao()`?**
Porque `validarSessao` escreve o nome do usuário num elemento que fica dentro da barra. Se a barra ainda não existisse, daria erro.

**15. O que você tirou da web-data-viz e em que ordem?**
Primeiro refatorei o cadastro e o login para não dependerem de empresa e aquário. Só depois tirei as linhas do `app.js` e apaguei os arquivos. Na ordem contrária, o `require` de um arquivo apagado derrubaria o servidor.

**16. Por que existe um `.env.example`?**
O `.env.dev` tem a senha do banco e não vai para o GitHub. O `.env.example` é o modelo sem senha: quem baixa o projeto copia, preenche e roda.

**17. O que o `UNIQUE` no e-mail resolve?**
Sem ele, dois cadastros com o mesmo e-mail e senha criavam dois usuários iguais, e o login recusava os dois. Com `UNIQUE`, o banco recusa o segundo cadastro.

**18. O carimbo fica salvo quando eu fecho o navegador?**
Ainda não. Hoje o vetor `carimbos` existe só durante a partida. Salvar no banco pela rota `/carimbos` é a próxima etapa.

**19. De quem é a arte do jogo?**
A arte que aparece hoje ainda é a do JumpGoat, do Fabricio Lima. Os fundos são o céu dele recolorido. A arte do Passport, com o corgi bípede, entra na próxima etapa.

**20. Como você testou sem o banco?**
Com um banco falso em memória, que recebe o mesmo SQL que o model monta. Isso testa as telas, as rotas e o controller. O teste com o MySQL de verdade está descrito no passo a passo "Como testar sozinho".

---

## Próxima etapa (para registro)

1. **Arte.** Corgi bípede (mesma estrutura da cabra; cores de corgi, orelhas grandes, tronco comprido e patas curtas), com a mesma qualidade do sprite atual; GIF de game over com menos quadros; obstáculos e fundos de cada destino; moldura do Passport; paleta nova. Os GIFs serão feitos por mim (Claude).
2. **Carimbos no banco.** Tabelas `destino` e `carimbo`, rota `/carimbos` e o `fetch` em `darCarimbo`.
3. **Skins.** Cores na tabela `destino` (decisão D10) e o seletor no espaço já marcado da sidebar.
4. **Telas.** Home, Dashboard, Calculadora e Sobre mim.

# 01 — Diagnóstico do repositório Passport

Data: 11/11/2026. Nesta etapa eu só li e planejei. O único arquivo criado é este. Nada foi alterado, movido ou apagado.

## Como ler este documento

- **Decisões** vem logo abaixo: são as escolhas que mudam o resto do plano, já com as suas respostas de 11/11/2026.
- As seções 1 a 6 respondem aos seis pedidos, na mesma ordem.
- No fim há o **glossário**, as **perguntas que a banca pode fazer** e um anexo explicando **como eu medi** cada número.
- Quando um termo técnico aparece pela primeira vez, ele está em **negrito** e explicado ali mesmo; depois ele volta no glossário.
- Trechos de código têm sempre o caminho e a linha, assim: `public/login.html:132`.

O que eu consegui conferir e o que não consegui:

| Conferido de verdade | Só lido no código (não executado) |
|---|---|
| Todos os arquivos foram lidos e cada nome foi buscado no repositório inteiro. | A API (cadastro, login, rotas). Não há `node_modules` instalado e o `.env.dev` ainda tem `'SEUSDADOSAQUI'` no lugar dos dados do banco, então o servidor não sobe. |
| Tamanho e número de quadros de todas as imagens (lidos direto dos bytes dos arquivos). | O banco na VM (não tenho acesso a ela). |
| O JumpGoat original no Chrome: capturas de tela em 1920 e 1366 px de largura, e um roteiro de teclas automático em 1920 px, rodado numa **cópia fora do repositório**. | |

---

## Resumo em 10 linhas

1. O repositório tem 149 arquivos versionados; cerca de 100 deles não servem ao Passport (AquaTech, site GymFabs, materiais de apoio, imagens soltas).
2. Hoje o site que roda em `public/` ainda é o **AquaTech** da web-data-viz, do título ao banco.
3. Não dá para simplesmente apagar `empresa` e `aquario`: o **cadastro** depende de empresa e o **login** depende de aquário. Primeiro refatora, depois apaga.
4. O JumpGoat funciona com três peças: animação CSS move a lata e o pulo, um `setInterval` de 10 ms lê as posições, e três números fixos decidem a colisão.
5. Achei e confirmei no navegador três defeitos: segurar a tecla trava o pulo, a cabra fica flutuando depois do game over e a moldura não encaixa no tabuleiro.
6. A velocidade da lata depende da largura da janela: em Full HD ela anda 800 px/s, em 1366 px anda 578 px/s (o jogo fica 38% mais rápido na tela grande).
7. A refatoração proposta mantém a mecânica e troca os números fixos por um **vetor de objetos** `fases`, com 7 destinos, velocidade crescente e checkpoint por obstáculos pulados.
8. As páginas que exigem login ficam em `public/dashboard/` e `public/jogo/`, as duas um nível abaixo de `public/`, com a glass sidebar e o seletor de skins.
9. Todos os assets do jogo foram medidos e têm um substituto de viagem proposto, com tamanho em pixels e paleta nova com contraste calculado.
10. Das 10 decisões, 6 já foram respondidas por você (tabela abaixo); a seção 6 traz a ordem segura de execução, com teste em cada passo.

---

## Decisões

Atualizado em 11/11/2026 com a sua resposta:

- **Alteradas por você:** D1, D3, D4, D5 e D6.
- **Aprovadas:** D2, D7 (com um pedido a mais), D8, D9 e D10.
- Todas as 10 estão respondidas.

| # | Decisão | O que vale | Por quê |
|---|---|---|---|
| D1 | Onde ficam as páginas que exigem login | As duas telas do jogo em `public/jogo/` (`inicio.html` e `jogo.html`); Dashboard, Calculadora e Sobre mim em `public/dashboard/` | As duas pastas ficam um nível abaixo de `public/`, então o `../login.html` do `sessao.js` funciona nas duas. O CSS, o JS e as imagens do jogo continuam em `public/css/`, `public/js/` e `public/assets/jogo/`. |
| D2 | Cadastro sem código de ativação de empresa | Tirar empresa do cadastro, do model e do banco | O Passport não tem empresa. O README já desenha `usuario` sem `fk_empresa`. |
| D3 | Rotas de `aviso` (mural) | **Apagar agora**, com o resto do AquaTech | Você pediu para avaliar se o mural serviria para um indicador de "melhor destino para viajar agora" ou um alerta de menor preço. Não serve: o mural guarda textos que o usuário digita (título e descrição). Esses dois indicadores são **consultas** nas tabelas `destino` e `custo`, feitas na etapa da Dashboard. O alerta de menor preço em 6 meses precisa de uma tabela nova com o histórico de preços, que ainda não existe no modelo do README. |
| D4 | `DOCUMENTOS_DE_APOIO/` | **Manter só dois**: o tutorial de criar rota e o exemplo de gráfico. Apagar o quiz e o upload | Você pediu para avaliar se o upload serviria para subir as fotos das viagens. Não precisa: as fotos são suas e fixas, então basta colocá-las em `public/assets/imgs/` e apontar no HTML. Upload só faria sentido se os **visitantes** enviassem fotos. Além disso, o exemplo usa a biblioteca `multer`, que não está no seu `package.json`. |
| D5 | `quebra-cabeca-drag.html` | **Manter**, na raiz, sem mexer | É a sua contribuição para os colegas: o Fabricio e o Igor usam esse arrastar e soltar nos projetos deles. Se eles apontam para o arquivo no seu GitHub, mudar de pasta quebraria o link deles. |
| D6 | Quem é o personagem do jogo | Um **corgi bípede**: o mesmo formato da cabra Luna, com as cores de corgi e orelhas compridas no lugar dos chifres | Como o tamanho do desenho não muda (252×294 px), as medidas da colisão continuam valendo. Além das cores e das orelhas grandes, ele tem tronco comprido e patas curtas, para ser reconhecido como corgi. O corgi de quatro patas e a protagonista de `features/game/` não entram no jogo e podem ser apagados. **Todos os GIFs novos serão feitos na próxima etapa**, com a mesma qualidade da cabra atual; o de game over pode ter menos quadros. |
| D7 | Laço do jogo | Usar `requestAnimationFrame`, deixando no código um comentário com a versão em `setInterval` e a diferença entre as duas | Medi: 41% das leituras a cada 10 ms devolvem valor repetido. Explicação na seção 2.6. |
| D8 | Tamanho do tabuleiro | Fixo em 960 × 480 px, dentro de uma moldura própria | Com largura em `80%` a dificuldade muda de tela para tela e a moldura desalinha. |
| D9 | Depois do game over | Recomeçar na fase em que perdeu, mantendo os carimbos | Fica mais fácil mostrar as 7 fases para a banca. Alternativa: voltar sempre ao Atacama. |
| D10 | Onde moram as cores da skin | No banco, na tabela `destino` (como está no seu README); o vetor `fases` guarda só o que é do jogo | Evita ter a mesma cor escrita em dois lugares. |

Duas observações sobre o contexto que você me passou:

- Você escreveu que Cadastro e Login exigem login. Entendi que só a Home tem **conteúdo** público, mas Cadastro e Login abrem sem login (senão ninguém entra). Se não for isso, me avise.
- A pasta da sidebar veio como `<PASTA DA SIDEBAR>` no pedido. Ela está em `features/glass-sidebar/` e é de **Igor Fuchs Pereira** (licença MIT, 2026), não do Fabricio. Entra no slide de agradecimentos junto com ele.

Sobre os créditos (sua resposta): você, o Fabricio e o Igor fazem projetos individuais e a colaboração entre vocês é cobrada. Cada um fez algo que os outros usam, e os créditos vão num slide de agradecimentos, que é requisito do projeto. O plano segue isso. Mantive só um cuidado barato: guardar as duas licenças MIT em `docs/licencas/`, porque o texto da licença pede que ela acompanhe o código copiado.

---

## 1. Inventário

### 1.1 Como a web-data-viz funciona (para entender as decisões)

O site tem duas metades:

- **Front-end**: os arquivos em `public/` (HTML, CSS, JS, imagens). O navegador baixa e executa.
- **Back-end (API)**: os arquivos em `src/` e o `app.js`. Rodam no Node.js e conversam com o MySQL.

O `app.js` liga as duas:

```js
// app.js:27
app.use(express.static(path.join(__dirname, "public")));
// app.js:32
app.use("/usuarios", usuarioRouter);
```

- `express.static` significa: "todo arquivo dentro de `public/` pode ser pedido pelo navegador". Por isso `http://localhost:3333/login.html` abre `public/login.html`. **Só o que está em `public/` é servido.** A pasta `features/` não aparece no site.
- Uma **rota Express** é um endereço que a API sabe responder. `app.use("/usuarios", usuarioRouter)` diz: "todo endereço que começa com `/usuarios` é resolvido pelo arquivo de rotas de usuário".

Cada pedido passa por três arquivos, sempre na mesma ordem:

```js
// src/routes/usuarios.js:11-13  → a ROTA recebe o pedido e chama o controller
router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});
```

```
navegador ──fetch──> rota (routes) ──> controller (confere os dados) ──> model (monta o SQL) ──> MySQL
```

- **Controller**: confere se os dados chegaram e decide a resposta (200, 400, 403...).
- **Model**: monta o texto do comando SQL e manda para o banco.

Guarde esta corrente. Quando eu digo "apagar a rota de aquário quebra o login", é porque um elo dessa corrente (o controller de usuário) chama o model de aquário.

### 1.2 Como confirmei quem usa cada arquivo

Para cada arquivo, busquei o **nome dele** dentro de todos os outros arquivos de texto do repositório (fora `.git`), com `grep -rIlF "<nome>" .`. Depois abri cada resultado para separar referência de verdade de coincidência de nome (por exemplo, existem 8 arquivos chamados `style.css`).

Um cuidado: no Node, `require("./src/routes/avisos")` não escreve o `.js`, então a busca pelo nome com extensão não acha. As ligações entre `app.js`, rotas, controllers e models eu conferi lendo cada `require`.

Na coluna "Quem usa", **"ninguém"** quer dizer: a busca devolveu zero resultados reais.

### 1.3 Raiz do repositório

| Caminho | Para que serve hoje | Quem usa ou referencia | Decisão |
|---|---|---|---|
| `app.js` | Liga o servidor, serve `public/` e registra as 6 rotas. | `package.json:7-8` (`npm start`). | **Refatorar**: tirar as 4 rotas do AquaTech (linhas 20-23 e 33-36) e registrar as novas. Só depois de ajustar cadastro e login. |
| `package.json` | Lista as bibliotecas (express, mysql2, dotenv, cors, nodemon). | `npm install`, `npm start`. | **Manter.** Não precisa de biblioteca nova. |
| `.gitignore` | Diz ao Git o que não versionar (`node_modules/`, `.env`...). | Git. | **Manter.** |
| `.env`, `.env.dev` | Dados de conexão do banco e a porta (3333). Não são versionados. | `app.js:4-8`, `src/database/config.js:5-9`. | **Manter e preencher**: `DB_DATABASE` ainda está `'SEUSDADOSAQUI'`. Os dois arquivos ficaram no histórico do Git (commit `3fd6b85`), mas só com esses textos de exemplo e `localhost`, então nenhuma senha vazou. |
| `LICENSE` | Licença MIT da web-data-viz (BandTec/SPTech, 2022). | Obrigatória para usar a web-data-viz. | **Manter.** |
| `README.md` | Apresentação do Passport. | GitHub. | **Refatorar** (pequeno): o link do diário aponta para `./diario-de-prompts.md` (linha 213), mas o arquivo está em `docs/`; a tabela de tecnologias cita "Canvas" (linha 106), que o jogo não usa. Opcional: uma linha citando a colaboração com o Fabricio e o Igor. |
| `quebra-cabeca-drag.html` | Quebra-cabeça 3×3 de arrastar e soltar (exercício seu, commit "Feature: Drag & Drop"). | Nenhum arquivo deste repositório (está fora de `public/`, então o site não o serve). O Fabricio e o Igor usam nos projetos deles. | **Manter** onde está (D5). É a sua parte na colaboração entre os três projetos. |

### 1.4 `docs/`

| Caminho | Para que serve hoje | Quem usa ou referencia | Decisão |
|---|---|---|---|
| `docs/diario-de-prompts.md` | Vazio (0 bytes). | `README.md:213` promete o "Diário de Prompts". | **Manter e preencher.** O README diz para a banca que todo uso de IA está registrado ali. Esta sessão deve ser a primeira anotação. |
| `docs/documents.txt` | Vazio (0 bytes). | Ninguém. | **Apagar.** Arquivo vazio sem referência. |
| `docs/refatoracao/01-diagnostico.md` | Este documento. | — | **Manter.** |

### 1.5 `src/` — a API

| Caminho | Para que serve hoje | Quem usa ou referencia | Decisão |
|---|---|---|---|
| `src/database/config.js` | Abre a conexão com o MySQL e executa o SQL. | Os 5 models. | **Manter** sem mudar. |
| `src/database/script-tabelas.sql` | Cria o banco `aquatech` com `empresa`, `usuario`, `aviso`, `aquario`, `medida`. | `README.md:187`. Você roda à mão na VM. | **Refatorar**: novo script com as tabelas do seu README (`usuario`, `tipo_viagem`, `destino`, `custo`, `carimbo`). |
| `src/routes/index.js` | Rota `/` que faz `res.render("index")`. | `app.js:18,31`. | **Manter** sem mudar. Ver risco R13: ela nunca chega a rodar. |
| `src/routes/usuarios.js` | Rotas `/usuarios/cadastrar` e `/usuarios/autenticar`. | `app.js:19,32`; `public/cadastro.html:147`; `public/login.html:108`. | **Manter.** |
| `src/controllers/usuarioController.js` | Confere os dados de cadastro e login. | `src/routes/usuarios.js:4`. | **Refatorar**: tirar o aquário do login (linhas 2 e 23-36) e a empresa do cadastro (linhas 59 e 68-69). |
| `src/models/usuarioModel.js` | SQL de cadastro e login. | `usuarioController.js:1`. | **Refatorar**: tirar `fk_empresa` das linhas 6 e 19. |
| `src/routes/empresas.js` | Rotas `/empresas/...`. | `app.js:23,36`; `public/cadastro.html:190` chama `/empresas/listar`. | **Apagar depois** de refatorar o cadastro (D2). |
| `src/controllers/empresaController.js` | Cadastra e busca empresas. | `src/routes/empresas.js:4`. | **Apagar depois**, junto com a rota. |
| `src/models/empresaModel.js` | SQL de empresa. | `empresaController.js:1`. | **Apagar depois**, junto com a rota. |
| `src/routes/aquarios.js` | Rotas `/aquarios/...`. | `app.js:22,35`. Nenhuma página chama essas rotas. | **Apagar depois** de refatorar o login. |
| `src/controllers/aquarioController.js` | Lista e cadastra aquários. | `src/routes/aquarios.js:4`. | **Apagar depois.** |
| `src/models/aquarioModel.js` | SQL de aquário. | `aquarioController.js:1` **e** `usuarioController.js:2` (o login). | **Apagar depois** de tirar a linha 2 do `usuarioController.js`. É o arquivo mais perigoso de apagar cedo. |
| `src/routes/medidas.js` | Rotas `/medidas/ultimas` e `/medidas/tempo-real`. | `app.js:21,34`; `public/dashboard/dashboard.html:175,260`; `public/js/alerta.js:4`. | **Apagar depois** de refatorar a dashboard. |
| `src/controllers/medidaController.js` | Busca temperaturas. | `src/routes/medidas.js:4`. | **Apagar depois.** |
| `src/models/medidaModel.js` | SQL de medidas. | `medidaController.js:1`. | **Apagar depois.** |
| `src/routes/avisos.js` | Rotas do mural (listar, publicar, editar, deletar). | `app.js:20,33`; `public/dashboard/mural.html:117,156,177`; `edicao-aviso.html:107`. | **Apagar depois** de tirar o mural (D3). |
| `src/controllers/avisoController.js` | Regras do mural. | `src/routes/avisos.js:4`. | **Apagar depois**, junto com a rota. |
| `src/models/avisoModel.js` | SQL do mural. | `avisoController.js:1`. | **Apagar depois**, junto com a rota. |

Por que aquário, medida, empresa e aviso são inúteis para o Passport: são o assunto do projeto AquaTech (sensores de temperatura em aquários de empresas). O Passport não tem sensor, empresa nem mural. Há ainda dois sinais de que a parte de aquário nunca foi usada de verdade: a rota espera `/:empresaId` mas o controller lê `req.params.idUsuario` (`aquarioController.js:4`), e o SQL de cadastro está escrito na ordem errada (`aquarioModel.js:13`: `INSERT INTO (descricao, fk_empresa) aquario VALUES`).

A palavra "depois" em cada linha é o ponto principal. A ordem segura está na seção 6.3.

### 1.6 `public/` — páginas, CSS e JS

| Caminho | Para que serve hoje | Quem usa ou referencia | Decisão |
|---|---|---|---|
| `public/index.html` | Home do AquaTech (banner de água-viva, Missão/Visão/Valores em lorem ipsum). | `express.static` serve como página inicial; links em `login.html`, `cadastro.html`, `simulador.html`. | **Refatorar**: vira a Home pública do Passport (linha do tempo das viagens). |
| `public/login.html` | Login do AquaTech. Guarda `AQUARIOS` na sessão e vai para `dashboard/cards.html` (linhas 129 e 132). | Links nas outras páginas; `public/js/sessao.js:11,17`. | **Refatorar**: tirar `AQUARIOS`, mudar o destino depois do login, visual do Passport. |
| `public/cadastro.html` | Cadastro com código de ativação de empresa. | Links em `index.html` e `login.html`. | **Refatorar**: tirar o código de ativação e a função `listar()` (D2). |
| `public/simulador.html` | Página "Simulador" só com lorem ipsum. | Menu de `index.html:27`, `login.html:30`, `cadastro.html:28`. | **Apagar**, e tirar os 3 links do menu. Não tem conteúdo. A Calculadora de custo nasce nova dentro da área logada. |
| `public/dashboard/dashboard.html` | Gráficos de temperatura com Chart.js. | Menus de `cards.html`, `mural.html`, `edicao-aviso.html`. | **Refatorar**: vira a Dashboard de custos. Aproveita o padrão `obterDadosGrafico` → `plotarGrafico` (linhas 167 e 196). Tirar o kit FontAwesome (linha 26), que é de outra pessoa. |
| `public/dashboard/cards.html` | Cartões de temperatura por aquário. | `login.html:132` e os menus das outras 3 telas. | **Apagar depois** de mudar o destino do login. |
| `public/dashboard/mural.html` | Mural de avisos. | Menus das outras 3 telas. | **Apagar** junto com as rotas de aviso (D3). |
| `public/dashboard/edicao-aviso.html` | Editar um aviso. | `mural.html:150`. | **Apagar** junto com o mural. |
| `public/css/estilo.css` | Estilo das páginas públicas. | As 8 páginas HTML. | **Refatorar**: paleta e variáveis do Passport; tirar o fundo de água-viva (linhas 68 e 144) e o sino do flaticon (linha 351). |
| `public/css/dashboards.css` | Estilo da área logada (menu lateral fixo, cartões, mural). | As 4 páginas de `dashboard/`. | **Refatorar**: o menu `.header-left` sai, entra a glass sidebar. |
| `public/js/sessao.js` | `validarSessao()`, `limparSessao()`, `aguardar()`, `finalizarAguardar()`. | As 8 páginas HTML. | **Manter** e acrescentar a parte da skin escolhida. |
| `public/js/alerta.js` | Alertas de temperatura dos aquários. | `cards.html:16`, `dashboard.html:15`, `mural.html:14`. | **Apagar depois** de refatorar a dashboard. |

### 1.7 `public/assets/` — imagens

| Caminho | Para que serve hoje | Quem usa ou referencia | Decisão |
|---|---|---|---|
| `assets/icon/favicon2.ico` | Ícone da aba (16, 32 e 48 px), escrito "AQUA TECH". | As 8 páginas HTML. | **Substituir** pelo ícone do Passport. Só apagar quando as 8 páginas apontarem para o novo. |
| `assets/icon/favicon2.png` | O mesmo ícone em PNG 200×200. | Ninguém. | **Apagar.** |
| `assets/circle-loading.gif` | Círculo rosa de "carregando", 256×256, 30 quadros. | `login.html:66`, `cadastro.html:79`. | **Substituir** por um "carregando" de viagem (avião dando a volta). Só apagar depois da troca. |
| `assets/aguarde-pink.gif` | Cópia idêntica do `circle-loading.gif` (mesmos bytes). | Ninguém. | **Apagar.** |
| `assets/aguarde-orange.gif` | "Aguarde" laranja, 200×200, 30 quadros. | Ninguém. | **Apagar.** |
| `assets/aguarde-pink2.gif` | "Aguarde" rosa, 300×300, 34 quadros. | Ninguém. | **Apagar.** |
| `assets/aguarde-pink3.gif` | "Aguarde" salmão, 256×256, 28 quadros. | Ninguém. | **Apagar.** |
| `assets/imgs/bg-jelly-fish-para-home.png` | Foto de águas-vivas, 1365×500. Fundo do banner e do login. | `public/css/estilo.css:68` e `:144`. | **Apagar depois** de trocar o fundo no CSS. Se apagar antes, as páginas ficam sem fundo. |
| `assets/imgs/bg-jelly-fish-para_outras_pags.png` | Foto de águas-vivas, 1365×830. | Ninguém. | **Apagar.** |
| `assets/imgs/planet-earth_color.png` | Ícone de planeta com folhas, 512×512. | `public/index.html:50`. | **Apagar depois** de refazer a Home. Não é pixel art e não sei a licença do ícone. |
| `assets/imgs/lightbulb_color.png` | Ícone de lâmpada, 512×512. | `public/index.html:57`. | **Apagar depois** de refazer a Home. |
| `assets/imgs/growth_color.png` | Ícone de crescimento, 512×512. | `public/index.html:64`. | **Apagar depois** de refazer a Home. |
| `assets/imgs/planet-earth.png`, `lightbulb.png`, `growth.png` | Versões sem cor dos três ícones acima. | Ninguém. | **Apagar.** |
| `assets/imgs/missao.png`, `visao.png`, `valores.png` | Ícones de Missão, Visão e Valores, 512×512. | Ninguém. | **Apagar.** |
| `assets/imgs/av1.png`, `av2.png`, `av3.png`, `av4.png`, `av5.png` | Avatares de exemplo, 512×512. | Ninguém. | **Apagar.** |
| `assets/imgs/pessoa1.png`, `pessoa2.png`, `pessoa3.png` | Fotos de exemplo, 218×218. | Ninguém. | **Apagar.** |
| `assets/imgs/banner-fundo.jpeg` | Banner de exemplo, 3352×1040. | Ninguém. | **Apagar.** |
| `assets/imgs/imagem-apoio.png` | Imagem de exemplo, 2360×1392. | Ninguém. | **Apagar.** |
| `assets/imgs/side-img-contato.png` | Imagem lateral de contato, 560×650. | Ninguém. | **Apagar.** |

Resumo: das 29 imagens de `public/assets/`, **23 não são usadas por nenhuma página** (1,16 MB) e podem sair já. As outras 6 saem conforme cada tela for refeita.

### 1.8 `DOCUMENTOS_DE_APOIO/`

Materiais de estudo que vêm junto com a web-data-viz. Nenhuma página nem a API usa qualquer arquivo daqui (os únicos resultados da busca eram coincidências de nome, como `style.css` e `app.js`).

| Caminho | Para que serve hoje | Quem usa | Decisão |
|---|---|---|---|
| `PASSO_A_PASSO_CRIAR_ROTA_NA_API.md` | Tutorial: como criar uma rota nova (exemplo de carros). | Ninguém. | **Manter** (D4): é o passo a passo que você vai seguir para criar `/carimbos`. |
| `PASSO_A_PASSO_ADICIONAR_UPLOAD_DE_IMAGENS_AO_PROJETO.md` | Tutorial de upload de imagem. | Ninguém. | **Apagar.** O Passport não tem upload. |
| `exemplo_criacao_grafico_estatico/EXEMPLO-GRAFICO-ESTATICO.html` | Exemplo de gráfico de linha e de barra com Chart.js. | Ninguém. | **Manter** (D4): consulta para a Dashboard. |
| `exemplo_de_quiz/EXEMPLO_QUIZZ.html`, `exemplo_de_quiz/style.css` | Exemplo de quiz. | Um usa o outro; mais ninguém. | **Apagar.** O Passport não tem quiz. |
| `exemplo_de_upload_de_arquivo/` (13 arquivos: `.gitignore`, `LICENSE`, `README.md`, `app.js`, `package.json`, `public/index.html`, `public/perfil.html`, `src/config/configUpload.js`, `src/controllers/usuarioController.js`, `src/database/config.js`, `src/database/script-exemplo-criacao.sql`, `src/models/usuarioModel.js`, `src/routes/usuarioRouter.js`) | Um mini-projeto separado de upload, que usa a biblioteca `multer`. | Só os arquivos da própria pasta. | **Apagar** (D4). As fotos do site são fixas e não precisam de upload; e o exemplo usa uma biblioteca que não está no seu `package.json`. |

### 1.9 `features/` — nada aqui é servido pelo site

`features/` está fora de `public/`. É material de origem: ou vira arquivo dentro de `public/`, ou sai.

**`features/Projeto-individual---GymFabs/`** (do Fabricio Lima, MIT, cerca de 12 MB)

| Caminho | Para que serve hoje | Quem usa ou referencia | Decisão |
|---|---|---|---|
| `LICENSE` | Licença MIT do Fabricio (2026). | A licença exige que o aviso acompanhe qualquer cópia. | **Mover** para `docs/licencas/JumpGoat-LICENSE.txt`. Não apagar. |
| `JumpGoat/JumpGoat.html` | O jogo: HTML e cerca de 60 linhas de JS. | `Jump-goat-home/JumpGoat-home.html:29`. | **Refatorar** para `public/jogo/jogo.html` + `public/js/jogo.js` + `public/js/fases.js`. |
| `JumpGoat/style.css` | Estilo e animações do jogo. | `JumpGoat.html:7`. | **Refatorar** para `public/css/jogo.css`. |
| `JumpGoat/img/luna_correndo.gif`, `lunaGameOver.gif`, `latinha.gif`, `ceu_sem_nuvens_grande.png`, `moldura_fliperama_animada_tela_transparente.gif` | Os 5 assets do jogo. | `JumpGoat.html:11,12,29,68`; `style.css:11,22`. | **Substituir** (seção 5). Ficam como estão até o jogo novo rodar; depois saem. |
| `Jump-goat-home/JumpGoat-home.html` | Tela de início do jogo. | `Index/index.html:40`. | **Refatorar** para `public/jogo/inicio.html`. |
| `Jump-goat-home/style.css` | Estilo da tela de início, com a paleta roxa. | `JumpGoat-home.html:8`. | **Refatorar** para `public/css/jogo-inicio.css`. |
| `Jump-goat-home/img/gymfabs_logo_header@4x.png` | Logo GymFabs. Cópia idêntica do que está em `Index/img/`. | `JumpGoat-home.html:12`. | **Substituir** pelo logo do Passport. |
| `Jump-goat-home/img/xlurp-previa-jogo.png` | Imagem de prévia. Mostra **outro** jogo (Xlurp Attack, de naves). | `JumpGoat-home.html:18`. | **Substituir** por uma captura do jogo do Passport. |
| `Jump-goat-home/img/xlurp-quadro-1.png` até `xlurp-quadro-6.png` | 6 quadrinhos da história dos Xlurps (1,26 MB). | Ninguém: nem o HTML nem o CSS da tela de início usam. | **Apagar.** |
| `Index/index.html`, `Index/style.css` | Página inicial do site de musculação. | `JumpGoat-home.html:13`, `Pagina Login/login.html`. | **Apagar.** É o site dele, não o seu. |
| `Index/img/` (16 imagens: `IronMan.png`, `alimentacao-panqueca.png`, `alimentacao-venom.png`, `alimentacao-whey.png`, `antes.jpeg`, `atual.jpeg`, `destaque-ganley.png`, `favicon-32.png`, `fundo_inicio_1440x666.png`, `gymfabs_logo_header@4x.png`, `icone_calculadora_circulo@8x.png`, `musica-lista.png`, `musica-player.png`, `parceiro-ellen.png`, `parceiro-gabriel.png`, `parceiro-marcos.png`) | Fotos e imagens do site de musculação (6,4 MB), inclusive fotos pessoais dele e de colegas. | Só `Index/index.html`, `Index/style.css` e o favicon em `JumpGoat-home.html:7`. | **Apagar.** Além de inúteis, são fotos de outras pessoas. |
| `Pagina Login/cadastro.html`, `login.html`, `style.css` | Cadastro e login do GymFabs, com medidor de força de senha. | `Index/index.html:22-23`, `JumpGoat-home.html:32`. | **Apagar.** Seu cadastro e login são os da web-data-viz. |
| `Pagina Login/img/` (4 imagens: `Fundo do cadastro — 1920×1080 (Full HD)@2x.png`, `check-caixa.png`, `gymfabs_logo_simbolo_roxo.png`, `mascote_cadastro_olhando@4x.png`) | Imagens do login do GymFabs (3,7 MB). | Só as duas páginas da pasta. | **Apagar.** |
| `CalculadoraIMC/calculadoraIMC.html`, `style.css`, `img/fundo-calculadora-1920x1080.png` | Calculadora de IMC. | `Index/index.html:41`. | **Apagar.** Sua calculadora é de custo de viagem e usa o banco. |
| `README.md`, `assets/readme/banner.svg`, `assets/readme/paleta.svg` | Apresentação do GymFabs no GitHub. | `banner.svg` é usado pelo README dele; `paleta.svg` por ninguém. | **Apagar**, depois de copiar a licença. |

**`features/game/`** (seu começo de jogo)

| Caminho | Para que serve hoje | Quem usa ou referencia | Decisão |
|---|---|---|---|
| `index.html`, `CSS/style.css`, `Js/script.js` | Protótipo: corgi parado, cacto passando, pulo com qualquer tecla. Sem colisão. | Entre si. | **Apagar depois** que o jogo novo rodar. O `script.js:12` lê `cacto.offsetLeft`, mas não existe nada com `id="cacto"` (a imagem só tem `class`), então dá erro a cada 10 ms. |
| `IMGS/protagonista-correndo.webp` | Protagonista correndo, 120×144, 4 quadros de 110 ms. | Ninguém (o HTML usa o corgi como personagem). | **Apagar** junto com `features/game/` (D6): não entra no jogo. Se quiser usar em outra tela, como "Sobre mim", me avise antes. |
| `IMGS/corgi-correndo.webp` | Corgi correndo, 165×120, 4 quadros de 100 ms. | `index.html:16`. | **Apagar** junto com `features/game/` (D6): o personagem passa a ser o corgi bípede. Serve de referência de cores para o desenho novo. |
| `IMGS/obstaculo-chile-cacto.png`, `@2x.png`, `@4x.png` | Cacto em 30×46, 60×92 e 120×184. | Só a versão 1x é usada (`index.html:15`). | **Mover** a `@2x` para `public/assets/jogo/obstaculos/`; apagar as outras duas. |

**`features/glass-sidebar/`** (de Igor Fuchs Pereira, MIT)

| Caminho | Para que serve hoje | Quem usa ou referencia | Decisão |
|---|---|---|---|
| `sidebar.css` | A barra lateral de vidro. | `index.html:8` da própria pasta. | **Mover** para `public/css/sidebar.css` e trocar as cores por variáveis da skin. |
| `index.html` | Página de demonstração; contém o `<aside>` modelo. | `README.md` da pasta. | **Apagar depois** de levar o `<aside>` para as páginas logadas. |
| `demo/demo.css`, `demo/demo.js` | Só da demonstração. O `demo.js` troca o tema claro/escuro. | `index.html:9,51`. | **Apagar depois.** A lógica do `demo.js` (mudar um atributo no `<html>`) é a base do seletor de skins. |
| `logo.svg` | Logo da demonstração. | `index.html:7,14`. | **Apagar depois**; entra o logo do Passport. |
| `README.md` | Explica como usar a barra. | Ninguém. | **Apagar depois** de integrar. |
| `LICENSE` | Licença MIT do Igor. | A licença exige manter o aviso. | **Mover** para `docs/licencas/glass-sidebar-LICENSE.txt`. |

---

## 2. Como o JumpGoat funciona, linha a linha

### 2.1 A ideia em uma frase

O JavaScript **não move nada**. Quem move a lata e faz a cabra pular é o CSS. O JavaScript só **liga e desliga** essas animações e, 100 vezes por segundo, **pergunta onde cada coisa está** para decidir se bateu.

### 2.2 O palco: HTML e posicionamento

```html
<!-- features/Projeto-individual---GymFabs/JumpGoat/JumpGoat.html:10-17 -->
<div class="gameBoard">
  <img src="img/luna_correndo.gif" class="luna" />
  <img src="img/latinha.gif" class="latinha" />
  <div id="div_score" class="score">SCORE:0</div>
  <button id="btn_start" class="start" onclick="iniciar()">START</button>
</div>
```

São 4 elementos dentro de uma caixa: a cabra (Luna), a lata, o placar e o botão.

```css
/* JumpGoat/style.css:15-23 */
.gameBoard {
  width: 80%;
  height: 500px;
  border: solid 1px purple;
  margin: 100px auto;
  position: relative;
  overflow: hidden;
  background-image: url(img/ceu_sem_nuvens_grande.png);
}
```

- `position: relative` — transforma a caixa na **referência** dos filhos. Tudo que estiver dentro com `position: absolute` passa a medir distância a partir das bordas dela, e não da página.
- `overflow: hidden` — o que sair da caixa não aparece. É assim que a lata "entra" pela direita e "some" pela esquerda.
- `width: 80%` — a largura é 80% da janela. Guarde isso: é a origem de duas limitações.

```css
/* JumpGoat/style.css:36-41 e 47-51 */
.latinha { position: absolute; bottom: 0; width: 90px; right: -80px; }
.luna    { position: absolute; bottom: 0px; width: 150px; }
```

- `bottom: 0` cola as duas no chão da caixa.
- A Luna não tem `left`, então fica onde o navegador a colocaria normalmente: no canto esquerdo.
- A lata tem `right: -80px`, ou seja, começa 80 px **para fora** da borda direita. Como ela tem 90 px de largura, sobram 10 px aparecendo. Na captura de tela dá para ver essa lasquinha vermelha antes de o jogo começar. No seu `features/game` isso não acontece porque o cacto tem 80 px.

### 2.3 O movimento: animações CSS

Uma **animação CSS** tem duas partes: o `@keyframes` (a lista de "em tal momento, tal valor") e a propriedade `animation` (que liga essa lista a um elemento e diz quanto tempo dura).

**A lata andando:**

```css
/* JumpGoat/style.css:43-45 e 65-73 */
.latinha.andando { animation: latinhaAnimacao 2s infinite linear; }

@keyframes latinhaAnimacao {
  from { right: -80px; }
  to   { right: 100%; }
}
```

- `right` vai de `-80px` (fora, à direita) até `100%` (a borda direita da lata encosta na borda **esquerda** da caixa, ou seja, saiu toda).
- `2s` é o tempo de uma travessia. `infinite` repete para sempre. `linear` mantém velocidade constante.
- A regra vale só para `.latinha.andando`, isto é, quando a imagem tem **as duas classes**. Colocar ou tirar a classe `andando` é o interruptor da lata.

**O pulo:**

```css
/* JumpGoat/style.css:53-55 e 75-99 (resumido) */
.pulo { animation: pulo 700ms; }

@keyframes pulo {
  0%   { bottom: 0px; }
  40%  { bottom: 200px; }
  50%, 60%, 70% { bottom: 200px; }   /* no arquivo são três blocos separados */
  100% { bottom: 0px; }
}
```

O pulo dura 700 ms e é dividido assim:

```
tempo:   0 ms ─────── 280 ms ─────────────── 490 ms ─────── 700 ms
altura:  0 px  sobe   200 px   fica parada   200 px  desce    0 px
```

- Os blocos de 50% e 60% são desnecessários: entre 40% e 70% o valor já é o mesmo. Podem sair sem mudar nada.
- A subida e a descida não são retas: o padrão do CSS é a curva `ease` (começa devagar, acelera, freia).
- Medi no Chrome: a Luna fica **acima de 120 px** de mais ou menos 120 ms até 570 ms depois da tecla. São cerca de **450 ms de "janela segura"**. Esse número volta na seção 3.

### 2.4 O JavaScript, bloco a bloco

**Linhas 20-22: variáveis globais**

```js
// JumpGoat.html:20-22
let luna = document.querySelector(".luna");
let latinha = document.querySelector(".latinha");
let score = 0;
```

- `document.querySelector(".luna")` devolve o primeiro elemento da página com a classe `luna`. Guardar numa variável evita procurar de novo a cada uso.
- `div_score` e `btn_start` são usados mais abaixo **sem** `querySelector`. Funciona porque o navegador cria sozinho uma variável global para cada elemento que tem `id`. É o mesmo jeito da web-data-viz (`nome_input.value`). O risco: se um dia você criar uma variável com o mesmo nome do `id`, ela "esconde" o elemento.
- O `<script>` está no fim do `<body>` de propósito: quando ele roda, as imagens e o botão já existem.

**Linhas 24-38: começar (ou recomeçar)**

```js
// JumpGoat.html:27-38
score = 0;
div_score.innerHTML = "SCORE:0";
luna.src = "img/luna_correndo.gif";
luna.style.bottom = "";
latinha.style.left = "";
latinha.style.animation = "";

btn_start.style.display = "none";

latinha.classList.add("andando");
```

- As seis primeiras linhas **desfazem** o que o game over fez. `elemento.style.algo = ""` apaga o estilo que o JavaScript tinha escrito direto no elemento (o **estilo inline**), e o elemento volta a obedecer ao arquivo CSS.
- `display = "none"` esconde o botão. O comentário da linha 34 diz "tirar o foco dele", mas nenhuma linha faz isso.
- `classList.add("andando")` liga a animação da lata. Como o game over tinha tirado essa classe, colocar de novo faz a animação **recomeçar do início**.

**Linhas 40-48: o pulo**

```js
// JumpGoat.html:40-48
document.addEventListener("keydown", pulo);

function pulo() {
  luna.classList.add("pulo");

  setTimeout(function remover() {
    luna.classList.remove("pulo");
  }, 700);
}
```

- `addEventListener("keydown", pulo)` — "sempre que **qualquer** tecla for pressionada, chame `pulo`". Não confere qual tecla é: F5, Tab e Ctrl também fazem pular.
- `classList.add("pulo")` liga a animação de 700 ms.
- `setTimeout(..., 700)` — "daqui a 700 ms, execute isto uma vez". Aqui ele tira a classe, para que o próximo `add` consiga disparar a animação de novo. Se a classe ficasse lá, adicionar de novo não faria nada.
- O `700` do JavaScript precisa ser igual ao `700ms` do CSS (`style.css:54`). São dois lugares para manter iguais à mão.

**Linhas 50-57: o laço e a pontuação**

```js
// JumpGoat.html:50-57
const loop = setInterval(function () {
  const latinhaPosicao = latinha.offsetLeft;
  const lunaPosicao = Number(
    window.getComputedStyle(luna).bottom.replace("px", ""),
  );

  score += 10;
  div_score.innerHTML = `SCORE:${score}`;
```

- `setInterval(função, 10)` — "execute esta função a cada 10 milissegundos, para sempre". Ele devolve um número de identificação, guardado em `loop`, que serve para parar depois com `clearInterval(loop)`. Isso é o **laço do jogo**.
- `latinha.offsetLeft` — a distância, em pixels inteiros, entre a borda esquerda da lata e a borda esquerda do "pai de referência" (a `.gameBoard`, por causa do `position: relative`). No início vale quase a largura da caixa; vai diminuindo; chega a `-90` quando a lata sai.
- `window.getComputedStyle(luna).bottom` — o valor de `bottom` que o navegador está usando **neste instante**, já contando a animação. Vem como texto, por exemplo `"137.5px"`.
  - Por que não `luna.style.bottom`? Porque `style` só enxerga o que foi escrito direto no elemento. O valor que muda durante a animação vem do CSS, e só `getComputedStyle` vê.
  - `.replace("px", "")` tira o "px" e `Number(...)` transforma o texto em número, para poder comparar com `<`.
- `score += 10` a cada volta: são cerca de 1000 pontos por segundo. **A pontuação é um cronômetro**: mede quanto tempo você sobreviveu, não quantas latas pulou. Quem não aperta nada faz 1740 pontos em Full HD.
- `` `SCORE:${score}` `` é uma **template string**: texto entre crases onde `${...}` é trocado pelo valor da variável.

**Linhas 59-63: a colisão**

```js
// JumpGoat.html:59-63
if (
  latinhaPosicao <= 120 &&
  latinhaPosicao > 0 &&
  lunaPosicao < 120
) {
```

São três perguntas, e as três precisam ser verdadeiras (`&&` quer dizer "e"):

```
        0                 120                         largura da caixa
        │◄── zona de perigo ──►│
        ┌───────────────────┐
        │  Luna (150 px)    │        ◄──── lata vindo (90 px)
        └───────────────────┘
```

| Condição | Em português | De onde vem o número |
|---|---|---|
| `latinhaPosicao <= 120` | A borda esquerda da lata já chegou na Luna. | A Luna é desenhada com 150 px de largura, mas a parte visível vai só até 128 px (o resto é transparente). 120 é um "quase encostou". |
| `latinhaPosicao > 0` | A lata ainda não passou. | Quando a borda esquerda da lata chega em 0, o jogo considera que ela já foi embora. |
| `lunaPosicao < 120` | A Luna não está alta o bastante. | A lata tem 135 px de altura na tela. Exigir 120 dá 15 px de tolerância. |

Os dois `120` são coincidência: um mede distância horizontal, o outro mede altura.

**Linhas 64-80: game over**

```js
// JumpGoat.html:64-80 (sem os comentários)
latinha.style.animation = "none";
latinha.style.left = `${latinhaPosicao}px`;
latinha.style.animation = "none";
luna.style.bottom = `${lunaPosicao}px`;
luna.src = "img/lunaGameOver.gif";

clearInterval(loop);
document.removeEventListener("keydown", pulo);
latinha.classList.remove("andando");

btn_start.innerHTML = "RESTART";
btn_start.style.display = "block";
```

- `animation = "none"` para a lata (a linha 66 repete a 64 sem necessidade). Mas, parada a animação, `right` voltaria para `-80px` e a lata pularia para a direita. Por isso a linha 65 **prende** a lata onde ela estava, escrevendo `left`.
- `luna.style.bottom` tenta prender a Luna na altura da batida. Isso tem um defeito (2.7, item 3).
- Trocar o `src` troca o GIF pelo da cabra tonta.
- `clearInterval(loop)` desliga o laço: o placar para de subir.
- `removeEventListener` desliga o pulo.
- O mesmo botão volta, agora escrito "RESTART". Clicar chama `iniciar()` de novo.

### 2.5 Sobre o `addEventListener` criado a cada partida

A função `pulo` está escrita **dentro** de `iniciar()`. Então, a cada partida, o navegador cria uma função `pulo` nova e registra um ouvinte novo.

Isso **não acumula** neste código, e vale entender o motivo: o `removeEventListener` da linha 73 está dentro da mesma chamada de `iniciar()`, então ele enxerga exatamente a mesma `pulo` que foi registrada e consegue removê-la. Uma função que continua enxergando as variáveis do lugar onde foi criada se chama **closure**.

O perigo é que isso só funciona enquanto existir **um único caminho** para o fim da partida. Se `iniciar()` rodar duas vezes sem game over no meio, ficam dois laços e dois ouvintes, e o placar sobe em dobro. Hoje só o botão escondido impede isso. Quando o jogo ganhar checkpoints e troca de fase, esse arranjo fica frágil.

A própria web-data-viz tem o problema de verdade: `public/cadastro.html:130` e `public/login.html:102` criam um `setInterval` novo a cada clique e nunca param nenhum.

### 2.6 Sobre o laço de 10 ms

A tela do computador redesenha 60 vezes por segundo, ou seja, um **quadro** a cada 16,7 ms. A animação CSS só anda de quadro em quadro. Perguntar a posição a cada 10 ms é perguntar mais rápido do que a resposta muda.

Medi isso num Chrome de verdade, durante 1 segundo:

| O que medi | Resultado |
|---|---|
| Voltas do `setInterval` de 10 ms | 99 |
| Quadros desenhados | 59 |
| Leituras de `offsetLeft` com valor **diferente** da anterior | 58 |

Das 99 leituras, 41 devolveram o mesmo número da leitura anterior. E cada leitura de `offsetLeft` ou `getComputedStyle` obriga o navegador a recalcular a posição dos elementos na hora (isso se chama **reflow**).

A alternativa é o `requestAnimationFrame`: uma função do próprio navegador (não é biblioteca) que diz "chame minha função logo antes de desenhar o próximo quadro". O laço roda exatamente uma vez por quadro, e a função ainda recebe o horário exato, o que permite contar pontos por **tempo real** em vez de contar voltas.

### 2.7 Limitações deste jeito de fazer

Marquei com ✅ o que confirmei rodando o jogo e com 📖 o que concluí lendo o código.

| # | Limitação | Onde | O que acontece |
|---|---|---|---|
| 1 | ✅ A velocidade depende da largura da janela | `style.css:16` + `:44` | A lata sempre atravessa em 2 s. Caixa mais larga = mais pixels no mesmo tempo. Em Full HD: 800 px/s. Em 1366 px: 578 px/s. O jogo é 38% mais rápido na tela grande. |
| 2 | ✅ Segurar a tecla trava o pulo | `JumpGoat.html:42-48` | Cada repetição da tecla agenda um `setTimeout` novo, mesmo sem iniciar pulo. Esses temporizadores "velhos" disparam depois e cortam pulos seguintes. No teste, o segundo pulo foi cortado no ar e, daí em diante, a Luna não passou de 8 px de altura. |
| 3 | ✅ A Luna fica flutuando depois do game over | `JumpGoat.html:67` | Se a batida acontece durante o pulo, a animação continua (uma animação CSS tem prioridade sobre o estilo inline). Quando ela acaba, vale o `bottom` gravado na hora da batida. No teste a Luna bateu a 103 px, desceu até o chão e voltou para 103 px, onde ficou parada no ar. |
| 4 | ✅ A moldura não encaixa no tabuleiro | `style.css:11-12` e `:15-19` | O buraco transparente da moldura mede 1536×625 px e começa em y=126. O tabuleiro tem 500 px de altura e começa em y=100. Em Full HD sobra uma faixa branca de 150 px embaixo. Em 1366 px o tabuleiro passa por cima dos textos "VAI!" e "INSERT COIN". E a moldura se repete no fim da página. |
| 5 | ✅ Números fixos na colisão | `JumpGoat.html:60-62` | Os `120` só valem para esta cabra e esta lata. Trocou o tamanho de uma imagem, tem que recalcular à mão. Com 7 destinos e obstáculos de tamanhos diferentes, não dá. |
| 6 | 📖 A colisão é generosa demais atrás | `JumpGoat.html:61` | Entre `0` e `-76` a lata ainda está desenhada em cima da Luna, mas o `> 0` já desligou a colisão. Dá para pousar "dentro" da lata sem perder. |
| 7 | ✅ Laço mais rápido que a tela | `JumpGoat.html:50,82` | 41% das leituras são repetidas (2.6). |
| 8 | ✅ Pontuação por voltas do laço | `JumpGoat.html:56` | Fez 990 pontos em 1 segundo, não 1000. Em aba em segundo plano o navegador desacelera os temporizadores e o placar quase para. Não mede obstáculos pulados, então não serve para checkpoint. |
| 9 | 📖 Qualquer tecla pula; só teclado | `JumpGoat.html:40` | Não confere `event.code`. Não tem clique nem toque, então não joga no celular. Espaço e setas também rolam a página. |
| 10 | 📖 Duração do pulo escrita duas vezes | `style.css:54` e `JumpGoat.html:47` | `700ms` no CSS e `700` no JS. Mudou um, tem que lembrar do outro. |
| 11 | ✅ Detalhes visuais | `style.css:28-29`, `:40`, `:22` | O botão START não fica no centro (está 47 px à esquerda em Full HD). Aparecem 10 px da lata antes de começar. O céu é cortado e, em janela mais larga que 1920 px, se repete. |
| 12 | 📖 Precisa de internet | `style.css:1` | A fonte Press Start 2P vem do Google Fonts. Sem internet na sala da banca, o texto cai para a fonte padrão do sistema. |
| 13 | 📖 Tudo no mesmo arquivo | `JumpGoat.html:19-84` | HTML e JS juntos, e caminhos de imagem escritos dentro do JS (linhas 29 e 68). Ao mover de pasta, esses caminhos quebram sem aviso. |

### 2.8 A tela de início (`Jump-goat-home`)

É uma página estática: não tem JavaScript nenhum.

```html
<!-- Jump-goat-home/JumpGoat-home.html:11-14 -->
<header>
  <img src="img/gymfabs_logo_header@4x.png" alt="" />
  <a href="../Index/index.html" class="link_voltar">Voltar ao início</a>
</header>
```

```html
<!-- Jump-goat-home/JumpGoat-home.html:16-37 (resumido) -->
<section class="hero">
  <div class="img-jogo"><img src="img/xlurp-previa-jogo.png" alt="" /></div>
  <div class="titulo-jogo">
    <span class="selo">MINIGAME GYMFABS</span>
    <h1>Jump <span>Goat</span></h1>
    <p>Em Xlurpônia as máquinas fazem tudo...</p>
    <a href="../JumpGoat/JumpGoat.html" class="play">🎮 Jogar Agora</a>
    <p class="conta"><a href="../Pagina Login/cadastro.html">Crie sua conta</a> para jogar...</p>
  </div>
</section>
```

Linha a linha:

- **Linha 6**: o título da aba é "Attack Xlurp", e a imagem da linha 18 mostra um jogo de naves. Mas o `<h1>` diz "Jump Goat" e o botão abre o JumpGoat. A página mistura dois jogos do Fabricio.
- **Linha 7**: o favicon vem de `../Index/img/`, uma pasta vizinha. Se a pasta `Index` sumir, o ícone some.
- **Linhas 13, 29 e 32**: três links com `../`, que sobem uma pasta. Todos apontam para dentro do GymFabs e **todos quebram** quando a página for para `public/`.
- **Linha 32**: o caminho tem espaço (`Pagina Login`). Funciona, mas é fonte de erro.

O CSS:

```css
/* Jump-goat-home/style.css:9-22 */
:root {
  --roxo: #7b2cbf;        /* botões e destaques */
  --roxo-claro: #c77dff;  /* links e textos em destaque */
  --fundo: #08070a;       /* fundo da página */
  --texto: #f4f0fa;       /* títulos e texto principal */
  /* ... mais 6 ... */
}
```

Isto é uma **variável CSS**. Você dá um nome a um valor (`--roxo`) dentro de `:root` (que significa "a página inteira") e usa com `var(--roxo)`:

```css
/* Jump-goat-home/style.css:24-28 */
body {
  font-family: "Space Grotesk", sans-serif;
  background-color: var(--fundo);
}
```

A vantagem: para mudar a cor do site inteiro, muda-se uma linha só. **É exatamente esse mecanismo que vai fazer as skins**: cada skin redefine as mesmas variáveis com outros valores.

```css
/* Jump-goat-home/style.css:50-57 */
.hero {
  display: flex;
  flex-direction: row;
  gap: 100px;
  padding: 80px 90px;
  align-items: center;
}
```

- `display: flex` coloca os filhos lado a lado (imagem à esquerda, textos à direita). `gap` é o espaço entre eles. `align-items: center` alinha os dois pelo meio na vertical.

```css
/* Jump-goat-home/style.css:59-64 */
.hero img {
  display: block;
  width: 720px;
  box-shadow: 0 0 80px rgba(123, 44, 191, 0.35);
  border-radius: 30px;
}
```

- `box-shadow` com 80 px de espalhamento cria o brilho roxo em volta da imagem. A cor está escrita em números (`123, 44, 191` é o mesmo `--roxo`) em vez de usar a variável.
- `width: 720px` é fixo: em tela pequena a imagem não diminui.

Limitações da tela de início:

| # | Limitação | Onde |
|---|---|---|
| 1 | Três variáveis declaradas e nunca usadas neste arquivo: `--roxo-escuro`, `--fundo-secao`, `--fundo-card`. | `style.css:12,15,16` |
| 2 | Três classes do HTML sem nenhuma regra no CSS: `.img-jogo`, `.conta`, `.link_voltar`. | `JumpGoat-home.html:13,17,31` |
| 3 | `.titulo-jogo span` pinta de roxo **todo** `<span>` dali, inclusive o selo. Funciona por acaso. | `style.css:79-81` |
| 4 | Fontes New Rocker e Space Grotesk vêm do Google Fonts: precisa de internet. E não é a Press Start 2P do jogo. | `style.css:1` |
| 5 | Os 6 quadrinhos `xlurp-quadro-*.png` estão na pasta mas a página não usa. | `Jump-goat-home/img/` |
| 6 | O link "Crie sua conta" perde o sentido: no Passport só chega nesta tela quem já está logado. | `JumpGoat-home.html:31-33` |

---

## 3. Proposta de refatoração do JumpGoat

Sem código nesta etapa: só a descrição. A regra é **mesma mecânica, outros números**. Continua sendo: um obstáculo atravessa por animação CSS, o pulo é uma animação CSS, e um laço lê as posições para decidir a colisão.

### 3.1 Onde cada parte vai morar

| Hoje | Vira | Motivo |
|---|---|---|
| `JumpGoat/JumpGoat.html` (HTML) | `public/jogo/jogo.html` | Página logada, na pasta do jogo (D1). |
| `JumpGoat/JumpGoat.html` (JS, linhas 19-84) | `public/js/jogo.js` | A web-data-viz guarda JS compartilhado em `public/js/` (`sessao.js`, `alerta.js`). |
| (não existe) | `public/js/fases.js` | O vetor de objetos com os 7 destinos. Separado para você mexer em dificuldade sem tocar na lógica. |
| `JumpGoat/style.css` | `public/css/jogo.css` | CSS fica em `public/css/`. |
| `Jump-goat-home/JumpGoat-home.html` | `public/jogo/inicio.html` | Página logada, na pasta do jogo (D1). |
| `Jump-goat-home/style.css` | `public/css/jogo-inicio.css` | Idem. |
| `JumpGoat/img/*` | `public/assets/jogo/...` | Imagens ficam em `public/assets/`. |
| (não existe) | `src/routes/carimbos.js`, `src/controllers/carimboController.js`, `src/models/carimboModel.js` | Salvar e listar carimbos, no mesmo padrão rota → controller → model. |

Os arquivos JS entram com `<script src="...">` simples, na ordem `sessao.js`, `fases.js`, `jogo.js`. Sem `import`/`export`: é o jeito que a web-data-viz já usa.

### 3.2 O vetor `fases`

Um **vetor de objetos** é uma lista em que cada item é uma "ficha" com vários campos. `fases` tem 7 fichas, na ordem do jogo. Cada ficha teria:

| Campo | Tipo | O que guarda | Exemplo (fase 1) |
|---|---|---|---|
| `idDestino` | número | O `id` do destino no banco. Liga a fase ao carimbo e à skin. | `1` |
| `nome` | texto | Nome que aparece na tela. | `"Atacama"` |
| `pais` | texto | País, para o carimbo. | `"Chile"` |
| `fundo` | texto | Caminho da imagem de fundo. | `"../assets/jogo/fundos/atacama.png"` |
| `obstaculos` | **vetor de objetos** | Os obstáculos que podem aparecer nesta fase. | 3 fichas |
| `tempoTravessia` | número (ms) | Quanto o obstáculo leva para cruzar a tela. Menor = mais difícil. | `2000` |
| `meta` | número | Quantos obstáculos pular para ganhar o carimbo. | `5` |
| `carimbo` | texto | Caminho da imagem do carimbo. | `"../assets/jogo/carimbos/chile.png"` |

Cada ficha de `obstaculos` teria:

| Campo | O que guarda | Exemplo |
|---|---|---|
| `imagem` | Caminho do arquivo. | `"../assets/jogo/obstaculos/cacto.png"` |
| `largura`, `altura` | Tamanho na tela, em px. | `60`, `92` |
| `folga` | Quantos px de cada lado **não contam** na colisão (a borda transparente do desenho). | `8` |

Com isso, os `120` fixos desaparecem: a colisão passa a usar a largura, a altura e a folga do obstáculo que está na tela.

### 3.3 As 7 fases

Os tempos e metas são **valores de partida**. Vão ser ajustados jogando.

| # | Destino | Fundo | Obstáculos (vetor) | Travessia | Meta |
|---|---|---|---|---|---|
| 1 | Atacama (Chile) | Deserto à noite, céu cheio de estrelas, dunas | cacto (já existe), pedra, gêiser | 2,0 s | 5 |
| 2 | Mendoza (Argentina) | Cordilheira dos Andes e vinhedos | barril de vinho, caixa de uvas, garrafa | 1,8 s | 5 |
| 3 | Espanha | Ponte de Ronda ou a Giralda de Sevilha | laranjeira em vaso, violão, paellera | 1,6 s | 6 |
| 4 | Portugal | Ladeira de Lisboa com azulejos | bonde amarelo, galo de Barcelos, pastel de nata | 1,5 s | 6 |
| 5 | Gibraltar | O Rochedo | macaco de Gibraltar, cabine telefônica vermelha, placa de fronteira | 1,4 s | 7 |
| 6 | Moçambique | Praia de Ponta do Ouro, coqueiros | coco, caranguejo, cesto de capulana | 1,3 s | 7 |
| 7 | Orlando (EUA) | Parque à noite com montanha-russa e fogos | carrinho de pipoca, jacaré, mala esquecida | 1,2 s | 8 |

Total: 44 obstáculos, cerca de 66 segundos de jogo sem errar. Cabe numa demonstração para a banca.

Para Orlando, sugiro um parque genérico. Castelo e personagens de parques reais são marcas registradas.

### 3.4 Como a dificuldade aumenta

Três alavancas, todas lidas do vetor:

1. **Velocidade**: `tempoTravessia` diminui de 2,0 s para 1,2 s. O JavaScript escreve esse valor numa variável CSS (por exemplo `--tempo-travessia`) e a regra `animation` da lata usa `var(--tempo-travessia)`. Com tabuleiro de 960 px (D8), isso dá de 525 px/s na fase 1 a 875 px/s na fase 7. Para comparar: o original em Full HD anda a 800 px/s.
2. **Variedade**: a cada volta, sorteia-se um obstáculo do vetor da fase. Obstáculos mais largos ou mais altos pedem pulo mais preciso.
3. **Meta**: mais obstáculos para ganhar o carimbo nas fases finais.

**Uma conta de segurança que vale explicar para a banca.** O pulo mantém a personagem acima do obstáculo por cerca de 450 ms (seção 2.3). O obstáculo fica "embaixo" dela durante `(largura da caixa da personagem + largura da caixa do obstáculo) ÷ velocidade`. Esse tempo tem que ser **bem menor** que 450 ms, senão a fase é impossível. Com caixas somando 130 px: fase 1 dá 250 ms, fase 7 dá 150 ms. As duas cabem. Se algum obstáculo for muito largo numa fase lenta, a conta estoura: por isso a `folga` e a largura ficam no vetor, onde dá para conferir.

### 3.5 Checkpoints

- **Como contar obstáculo pulado**: a animação CSS avisa cada vez que termina uma volta, por um evento chamado `animationiteration`. Se o jogo ainda está valendo quando esse evento chega, o obstáculo passou: soma 1 em `obstaculosPulados`.
- **Quando dar o carimbo**: quando `obstaculosPulados` chega na `meta` da fase atual. Esse é o melhor momento, porque o obstáculo acabou de sair da tela.
- **O que acontece no checkpoint**, em ordem:
  1. Pausa o obstáculo.
  2. Mostra o carimbo batendo na tela ("CHILE ✓").
  3. Guarda o destino no vetor `carimbos` e envia para a API (`POST /carimbos/registrar`, com o id do usuário que está em `sessionStorage.ID_USUARIO`).
  4. Soma 1 no índice da fase e carrega a próxima ficha: troca fundo, obstáculos e velocidade.
  5. Zera `obstaculosPulados` e continua.
- **Depois da fase 7**: tela de "Passaporte completo".
- **Game over**: recomeça na fase atual, com os carimbos já ganhos (D9).
- **Skins**: ao abrir qualquer página logada, o site pede os carimbos do usuário (`GET /carimbos/:idUsuario`). Um laço percorre os 7 destinos e, para cada um, monta o botão da skin liberado ou com cadeado.

### 3.6 O que muda por dentro (e qual limitação cada mudança resolve)

| Mudança | Resolve (seção 2.7) |
|---|---|
| Tabuleiro de tamanho fixo dentro de uma moldura que é um elemento próprio, e não o fundo do `<body>`. | 1, 4, 11 |
| Um único ouvinte de teclado, registrado uma vez ao abrir a página. Uma variável `estado` (`"inicio"`, `"jogando"`, `"checkpoint"`, `"gameover"`) decide se a tecla vale. | Fragilidade da 2.5 |
| Só Espaço e Seta para cima pulam; ignora a repetição de tecla segurada; clique ou toque no tabuleiro também pula. | 2, 9 |
| O fim do pulo é avisado pelo evento `animationend`, sem `setTimeout`. | 2, 10 |
| No game over, as animações são **pausadas** (`animation-play-state: paused`) em vez de copiar posições para o estilo inline. | 3 |
| Colisão compara os dois retângulos usando `offsetLeft`, `offsetWidth`, a altura e a `folga` de cada obstáculo. | 5, 6 |
| Laço com `requestAnimationFrame` (D7). | 7 |
| Pontos calculados pelo tempo real decorrido. Checkpoint por obstáculos pulados. | 8 |
| Fonte Press Start 2P baixada para `public/assets/fontes/` e carregada com `@font-face`. | 12 |
| Caminhos das imagens só dentro de `fases.js`. | 13 |
| `image-rendering: pixelated` nas imagens do jogo, para a pixel art não ficar borrada ao ampliar. | — |

### 3.7 Onde aparecem os cinco conceitos que a faculdade pede

| Conceito | Onde vai aparecer no jogo |
|---|---|
| Variáveis | `faseAtual`, `obstaculosPulados`, `pontos`, `estado`. |
| Funções | `iniciarJogo`, `carregarFase`, `pular`, `verificarColisao`, `darCarimbo`, `gameOver`, `salvarCarimbo`. |
| Condicionais | A colisão; "chegou na meta?"; "era a última fase?"; "a tecla é Espaço?". |
| Laços | O laço do jogo; o `for` que monta os 7 carimbos e os botões de skin; o `for` que pré-carrega as imagens da fase. |
| Vetores | `fases` (vetor de objetos), `obstaculos` dentro de cada fase, `carimbos` do jogador. |

---

## 4. Estrutura final de pastas proposta

```
Passport/
├── app.js
├── package.json
├── .gitignore
├── LICENSE
├── README.md
├── quebra-cabeca-drag.html
├── DOCUMENTOS_DE_APOIO/
├── docs/
│   ├── diario-de-prompts.md
│   ├── licencas/
│   └── refatoracao/
├── public/
│   ├── index.html
│   ├── login.html
│   ├── cadastro.html
│   ├── dashboard/
│   │   ├── dashboard.html
│   │   ├── calculadora.html
│   │   └── sobre.html
│   ├── jogo/
│   │   ├── inicio.html
│   │   └── jogo.html
│   ├── css/
│   │   ├── estilo.css
│   │   ├── skins.css
│   │   ├── sidebar.css
│   │   ├── dashboards.css
│   │   ├── jogo-inicio.css
│   │   └── jogo.css
│   ├── js/
│   │   ├── sessao.js
│   │   ├── skins.js
│   │   ├── sidebar.js
│   │   ├── fases.js
│   │   └── jogo.js
│   └── assets/
│       ├── icon/
│       ├── fontes/
│       ├── imgs/
│       └── jogo/
│           ├── personagem/
│           ├── obstaculos/
│           ├── fundos/
│           ├── carimbos/
│           └── moldura/
└── src/
    ├── database/
    │   ├── config.js
    │   └── script-tabelas.sql
    ├── routes/
    ├── controllers/
    └── models/
```

Uma frase por pasta:

| Pasta | Para que serve |
|---|---|
| `docs/` | Tudo que é para ler e não para rodar: o diário de prompts e os documentos da refatoração. |
| `docs/licencas/` | As licenças MIT do JumpGoat (Fabricio Lima) e da glass sidebar (Igor Fuchs Pereira), que precisam acompanhar o código reaproveitado. |
| `docs/refatoracao/` | Este diagnóstico e os próximos documentos numerados do plano. |
| `public/` | O site que o navegador recebe; na raiz ficam só as três páginas que abrem sem login. |
| `public/dashboard/` | As três páginas logadas do site (Dashboard, Calculadora e Sobre mim), com a sidebar. |
| `public/jogo/` | As duas telas do jogo (início e partida), também logadas e com a sidebar. |
| `public/css/` | Um arquivo de estilo por assunto: base do site, skins, sidebar, área logada e as duas telas do jogo. |
| `public/js/` | O JavaScript compartilhado entre páginas: sessão, skins, sidebar, dados das fases e a lógica do jogo. |
| `public/assets/icon/` | O ícone da aba do navegador. |
| `public/assets/fontes/` | A fonte Press Start 2P guardada no projeto, para funcionar sem internet. |
| `public/assets/imgs/` | As imagens do site fora do jogo (fotos dos destinos, logo, ilustrações). |
| `public/assets/jogo/` | Tudo que o jogo desenha, separado por tipo. |
| `public/assets/jogo/personagem/` | O corgi bípede correndo e tonto. |
| `public/assets/jogo/obstaculos/` | Os obstáculos dos 7 destinos. |
| `public/assets/jogo/fundos/` | Um cenário por destino. |
| `public/assets/jogo/carimbos/` | Um carimbo por país. |
| `public/assets/jogo/moldura/` | A moldura de fliperama do Passport. |
| `src/database/` | A conexão com o MySQL e o script que cria as tabelas do Passport. |
| `src/routes/` | Os endereços da API: `index`, `usuarios`, `destinos`, `custos`, `carimbos`. |
| `src/controllers/` | A conferência dos dados de cada rota, um arquivo por assunto. |
| `src/models/` | Os comandos SQL de cada assunto. |

Pasta que deixa de existir: `features/`. De `DOCUMENTOS_DE_APOIO/` ficam só o tutorial de criar rota e o exemplo de gráfico (D4). A arquitetura da web-data-viz (`app.js`, `public/`, `src/routes`, `src/controllers`, `src/models`, `src/database`) fica igual: só entram arquivos novos nas mesmas pastas.

As rotas de `destinos` e `custos` (Calculadora e Dashboard) aparecem na árvore só para ela ficar completa. O desenho delas não faz parte deste diagnóstico.

---

## 5. Assets do JumpGoat e do Jump-goat-home

Como li os números: tamanho e quadros vêm dos bytes de cada arquivo. "Na tela" é o tamanho depois que o CSS redimensiona.

### 5.1 Assets do JumpGoat

| Arquivo | Tamanho do arquivo | Quadros | Na tela | O que mostra | Substituto proposto |
|---|---|---|---|---|---|
| `luna_correndo.gif` (27 KB) | 252×294 px, fundo transparente, 16 cores | 6 quadros de 90 ms (ciclo de 0,54 s) | 150×175 px. Parte visível: 114×168 px | Cabra roxa de faixa na cabeça, correndo | **Corgi bípede correndo** (D6). É a própria Luna redesenhada: mesmo arquivo de 252×294 px e 6 quadros, cores de corgi (laranja, creme e contorno marrom) e orelhas compridas no lugar dos chifres. Como o tamanho não muda, continua em 150×175 px na tela e a caixa de colisão é a mesma. **Precisa ser redesenhado**: a troca de cor dá para fazer por script, trocando cada tom de roxo nas tabelas de cores do GIF (são cerca de 14 tons, e quase todo quadro tem a sua tabela); as orelhas são desenho quadro a quadro. |
| `lunaGameOver.gif` (131 KB) | 252×294 px, transparente | 32 quadros de 70 ms (2,24 s), repete para sempre | 150×175 px | A mesma cabra, tonta, com estrelas | **Corgi bípede tonto**, com as estrelinhas (D6). Mesmo tamanho do sprite de corrida (252×294 px), para não "pular" na troca. O original tem 32 quadros; redesenhar as orelhas em todos dá trabalho, e 8 a 12 quadros bastam. **Precisa ser redesenhado.** |
| `latinha.gif` (17 KB) | 120×180 px, transparente | 6 quadros de 220 ou 440 ms (1,76 s) | 90×135 px, sem borda transparente | Lata vermelha de refrigerante com cara brava | **Obstáculos por destino** (3 por fase, 21 no total; ver 3.3). Na tela: largura de 60 a 100 px, altura de 80 a 135 px. Já existe o cacto: usar `obstaculo-chile-cacto@2x.png` (60×92). Podem ser PNG parados; animação é opcional. |
| `ceu_sem_nuvens_grande.png` (12 KB) | 1536×720 px, sem transparência | 1 | Só os 500 px de cima aparecem | Céu roxo em faixas, com estrelas | **7 fundos, um por destino** (3.3), do tamanho exato do tabuleiro: 960×480 px. |
| `moldura_fliperama_animada_tela_transparente.gif` (330 KB) | 1918×987 px, 64 cores. Buraco transparente de 1536×625 px, começando em x=192, y=126 | 8 quadros de 180 ms (1,44 s) | Cobre a página inteira | Gabinete de fliperama roxo. Tem desenhado dentro da imagem: "JUMP GOAT", "VAI!", "INSERT COIN", "PULAR", "BUU", a cabra e a lata | **Moldura do Passport.** Como os textos e mascotes estão dentro do GIF, não dá para editar: precisa de uma nova. Proposta: 1200×720 px com buraco de 960×480 px. Título "PASSPORT"; no lugar de "INSERT COIN", "INSIRA O PASSAPORTE"; o botão "PULAR" vira um carimbo; o joystick vira manche de avião; o corgi e um avião no lugar da cabra e da lata. |
| Fonte Press Start 2P | — | — | Placar e botão | Fonte de fliperama, carregada do Google Fonts (`style.css:1`) | **Manter**, mas com o arquivo dentro do projeto. |
| Cor `purple` | — | — | Borda de 1 px do tabuleiro (`style.css:18`) | — | `var(--cor-borda)` |
| Cor `aliceblue` | — | — | Texto do placar (`style.css:60`) | — | `var(--cor-texto)` |

### 5.2 Assets do Jump-goat-home

| Arquivo | Tamanho do arquivo | Quadros | Na tela | O que mostra | Substituto proposto |
|---|---|---|---|---|---|
| `gymfabs_logo_header@4x.png` (28 KB) | 676×172 px, transparente (parte visível 653×141) | 1 | 170 px de largura | Caveira de cabra com halteres e "GymFabs" | **Logo do Passport**: um passaporte em pixel art com um avião, e o nome. Mesmo formato: cerca de 680×170 px. |
| `xlurp-previa-jogo.png` (54 KB) | 1120×708 px | 1 | 720 px de largura, com brilho roxo em volta | Tela do "Xlurp Attack" (outro jogo, de naves) | **Captura do jogo do Passport** na fase do Atacama, tirada quando ele estiver pronto. 1120×708 px. |
| `xlurp-quadro-1.png` a `-6.png` (150 a 242 KB cada) | 1120×748 px | 1 cada | Não aparecem (a página não usa) | História em quadrinhos dos Xlurps | **Não substituir.** Se sobrar tempo: 7 cartões-postais, um por destino, contando a viagem. |
| `../Index/img/favicon-32.png` | 32×32 px | 1 | Ícone da aba | Símbolo GymFabs | **Favicon do Passport** (o mesmo do site todo). |
| Fonte New Rocker | — | — | Título "Jump Goat", 80 px | Fonte gótica | **Press Start 2P**, em tamanho menor (ela é larga: 40 a 48 px). |
| Fonte Space Grotesk | — | — | Textos | Fonte sem serifa | Uma fonte de texto legível que venha da skin. Press Start 2P cansa em parágrafos. |

### 5.3 A paleta roxa (o que sai)

Definida em `Jump-goat-home/style.css:9-22`.

| Variável | Cor | Para que serve | Usada neste arquivo? |
|---|---|---|---|
| `--roxo` | `#7b2cbf` | Botões e destaques | Sim (borda do botão Jogar) |
| `--roxo-claro` | `#c77dff` | Links e textos em destaque | Sim |
| `--roxo-escuro` | `#3c096c` | Sombras e gradientes | Não |
| `--fundo` | `#08070a` | Fundo da página | Sim |
| `--fundo-secao` | `#120a1c` | Seções alternadas | Não |
| `--fundo-card` | `#1a1224` | Cards | Não |
| `--borda` | `#2e2240` | Bordas | Sim |
| `--texto` | `#f4f0fa` | Títulos | Sim |
| `--texto-secundario` | `#c9beda` | Parágrafos | Sim |
| `--texto-apagado` | `#a99bbf` | Legendas e links | Sim |

Fora das variáveis: o brilho `rgba(123, 44, 191, 0.35)` (linha 62) e, no jogo, `purple` e `aliceblue`.

### 5.4 Paleta nova do Passport

A ideia: **capa de passaporte** (azul-marinho com dourado), **página de passaporte** (papel creme) e **tinta de carimbo**. Os nomes das variáveis dizem a função, não a cor, porque cada skin vai trocar os valores.

**Skin padrão ("Passaporte"), antes de qualquer carimbo:**

| Variável | Cor | Para que serve | Contraste |
|---|---|---|---|
| `--cor-fundo` | `#0B132B` | Fundo da página (noite) | — |
| `--cor-superficie` | `#14213D` | Cartões e painéis (capa do passaporte) | — |
| `--cor-borda` | `#2B3A5C` | Contornos | — |
| `--cor-destaque` | `#E0B04A` | Botões e títulos (dourado da capa) | 9,2:1 sobre o fundo |
| `--cor-destaque-texto` | `#0B132B` | Texto em cima do botão | 9,2:1 sobre o dourado |
| `--cor-texto` | `#F8F4E8` | Texto principal | 16,7:1 sobre o fundo |
| `--cor-texto-suave` | `#C9C2B0` | Parágrafos | 10,4:1 |
| `--cor-texto-apagado` | `#8D93A6` | Legendas | 6,0:1 |
| `--cor-papel` | `#F4E9D0` | Página do passaporte (onde ficam os carimbos) | — |
| `--cor-tinta` | `#14213D` | Texto sobre o papel | 13,2:1 sobre o papel |
| `--cor-carimbo` | `#C1121F` | Tinta vermelha de carimbo. **Só sobre o papel.** | 5,2:1 sobre o papel; apenas 3,0:1 sobre o fundo escuro |
| `--cor-carimbo-ok` | `#1F7A6E` | Tinta verde ("aprovado"). Só em desenho ou texto grande. | 4,3:1 sobre o papel |
| `--cor-erro` | `#FF6B6B` | Mensagens de erro sobre o fundo escuro | 6,6:1 |

**Contraste** é a diferença de claridade entre o texto e o fundo. A recomendação para texto comum é no mínimo 4,5:1. Calculei cada par.

**Skins por destino** (cada uma redefine as mesmas variáveis):

| Destino | `--cor-fundo` | `--cor-destaque` (botão) | Texto do botão | Cor de apoio | Ideia | Contraste do botão |
|---|---|---|---|---|---|---|
| Atacama | `#2B1A12` terra escura | `#E76F51` terracota | `#2B1A12` | `#F4A261` areia | Deserto ao pôr do sol | 5,4:1 |
| Mendoza | `#1F0A14` vinho escuro | `#9B2242` malbec | `#FFFFFF` | `#74ACDF` celeste | Vinho e céu argentino | 7,8:1 |
| Espanha | `#2A0A0A` | `#F1BF00` amarelo | `#2A0A0A` | `#AA151B` vermelho | Cores da bandeira | 10,6:1 |
| Portugal | `#0A1F3D` azul azulejo | `#1F6FB2` | `#FFFFFF` | `#6FB1E8` azul claro | Azulejos de Lisboa | 5,3:1 |
| Gibraltar | `#1C1F26` rocha | `#C8102E` vermelho | `#FFFFFF` | `#B8BDC7` calcário | O Rochedo e a cabine vermelha | 5,9:1 |
| Moçambique | `#06282B` mar à noite | `#1CC5B7` turquesa | `#06282B` | `#FCE100` amarelo | Oceano Índico e capulana | 7,2:1 |
| Orlando | `#120B3A` noite | `#FF7AB6` rosa neon | `#120B3A` | `#FFD23F` dourado | Fogos de artifício no parque | 7,7:1 |

O texto principal de cada skin é quase branco e passa de 14:1 sobre o fundo em todas. As cores são propostas: mude à vontade, só refaça a conta de contraste do botão.

Sobre a fonte da skin: sugiro manter Press Start 2P nos títulos de todas as skins (é a identidade de fliperama) e variar só a fonte dos textos. Qualquer fonte escolhida precisa estar em `public/assets/fontes/`, com a licença conferida na hora de baixar.

### 5.5 Botões e elementos que podem virar objetos do tema

| Elemento hoje | Onde | Objeto proposto | Como fazer só com HTML e CSS |
|---|---|---|---|
| Botão START / RESTART | `JumpGoat.html:16` | **Cartão de embarque**: "EMBARCAR" e, no game over, "NOVO VOO" | Botão com imagem de fundo em pixel art, ou borda tracejada e um "picote" feito com pseudo-elemento. |
| Placar `SCORE:0` | `JumpGoat.html:14` | **Painel de aeroporto**: "MILHAS 0000" | Fundo preto, letras amarelas, Press Start 2P. |
| (novo) Progresso da fase | — | **Avião** andando numa linha pontilhada até o próximo país | Uma `<div>` com o avião e `left` em porcentagem, calculada com `obstaculosPulados ÷ meta`. |
| (novo) Aviso de checkpoint | — | **Carimbo** batendo na tela | Imagem do carimbo com animação CSS de escala e rotação. |
| (novo) Carimbos ganhos | — | **Página de passaporte** com 7 espaços | Fundo `--cor-papel`; um `for` desenha os 7, cheios ou vazios. |
| Selo "MINIGAME GYMFABS" | `JumpGoat-home.html:22` | **Etiqueta de bagagem**: "JOGO DO PASSAPORTE" | `border-radius` e um furinho com pseudo-elemento. |
| Botão "🎮 Jogar Agora" | `JumpGoat-home.html:29` | **Passaporte** fechado que abre ao passar o mouse | Imagem de fundo e `transform` no `:hover`. |
| Link "Voltar ao início" | `JumpGoat-home.html:13` | **Placa de aeroporto** com seta | Texto com seta, cores de sinalização. |
| Link "Crie sua conta" | `JumpGoat-home.html:31-33` | Some. No lugar: "Seus carimbos: 3 de 7" | Texto montado com os dados da API. |
| Seletor de skins | Sidebar (botão "Alternar tema" em `glass-sidebar/index.html:36`) | **Planetas**: uma bolinha por destino, com as cores da skin; as bloqueadas ficam cinza com cadeado | `border-radius: 50%` e um gradiente; um `for` cria os 7. |
| Item "Sair" da sidebar | `glass-sidebar/index.html:39` | **Portão de desembarque** | Ícone novo. |
| Item da Calculadora | Sidebar | **Mala** | Ícone novo. |
| Item da Dashboard | Sidebar | **Globo** ou mapa | Ícone novo. |
| Item do Jogo | Sidebar | **Avião** | Ícone novo. |
| Item "Sobre mim" | Sidebar | **Passaporte** | Ícone novo. |
| `circle-loading.gif` | `login.html:66`, `cadastro.html:79` | **Avião dando a volta no globo** | GIF pequeno (64×64 px) ou animação CSS de rotação. |
| Cartão de login e cadastro | `login.html:51`, `cadastro.html:49` | **Passaporte aberto**: formulário na página da direita | Duas colunas com `display: flex` e fundo `--cor-papel`. |
| Mensagem de erro e de sucesso | `cardErro` em `login.html:46` | **Carimbo** "NEGADO" (vermelho) e "APROVADO" (verde) | Borda dupla, texto girado com `transform: rotate`. |

---

## 6. Riscos e como vamos testar

### 6.1 O que pode quebrar

| # | Risco | Por que acontece | Como evitar |
|---|---|---|---|
| R1 | **O servidor inteiro não sobe.** | `app.js:20-23` faz `require` das rotas. Se um arquivo de rota, controller ou model for apagado e o `require` ficar, o Node para com "Cannot find module" antes de abrir a porta. Nenhuma página carrega. | Tirar primeiro a linha de `require` e a de `app.use`; só depois apagar o arquivo. |
| R2 | **O login para de funcionar.** | `usuarioController.js:2` faz `require` do model de aquário, e a linha 23 só responde ao login depois de buscar aquários. | Refatorar `autenticar` para responder direto; só então apagar aquário. |
| R3 | **O login já tem um defeito hoje.** | Se o usuário não tem aquário, a API responde com status 204 (`usuarioController.js:34`), que por definição não tem corpo. O `login.html:120` vê "ok" e tenta ler um JSON que não existe (linha 123). A tela fica no "carregando" para sempre. | A mesma refatoração do R2 resolve. |
| R4 | **O cadastro para de funcionar.** | `cadastro.html:18` chama `listar()` ao abrir, que busca `/empresas/listar` (linha 190). O controller exige `idEmpresaVincularServer` (`usuarioController.js:68`). O SQL grava `fk_empresa` (`usuarioModel.js:19`). | Mudar os três lugares e o banco **juntos**, testar, e só então apagar empresa. |
| R5 | O cadastro tem defeitos menores hoje. | `cadastro.html:174` chama `limparFormulario()`, que não existe nessa página. A linha 130 cria um `setInterval` novo a cada clique. O laço das linhas 134-144 mostra erro para cada empresa que não bate, antes de achar a certa. | Corrigir ao refatorar. |
| R6 | **Caminhos relativos quebram ao mover o jogo.** | Há três tipos de caminho e cada um parte de um lugar diferente. `url(...)` dentro do CSS parte da pasta **do arquivo CSS**. `src` e `href` no HTML partem da pasta **da página**. Texto de caminho dentro do JS (`JumpGoat.html:29,68`) também parte da **página**, não do arquivo JS. | Mover primeiro, sem mudar mais nada, e abrir a aba Rede do navegador procurando erro 404. |
| R7 | O jogo deixa de abrir com dois cliques. | Depois de ir para `public/`, ele usa `fetch` e depende do servidor. | Abrir sempre por `http://localhost:3333`. |
| R8 | Nomes de pasta com maiúscula, espaço e acento. | `features/game/CSS`, `IMGS`, `Js`; `Pagina Login`; `Fundo do cadastro — 1920×1080 (Full HD)@2x.png`. O Windows não diferencia maiúscula de minúscula; o Linux (a VM) diferencia. Um caminho que funciona num pode falhar no outro. | Tudo novo em minúsculas, sem espaço e sem acento. |
| R9 | `sessao.js` manda para a página errada. | `public/js/sessao.js:11,17` usa `../login.html`: só funciona para páginas exatamente um nível abaixo de `public/`. | Manter toda página logada exatamente um nível abaixo de `public/`: em `public/dashboard/` ou em `public/jogo/` (D1). |
| R10 | "Exigir login" hoje é só no navegador. | `validarSessao()` olha o `sessionStorage` e redireciona. O servidor entrega a página para qualquer um, e as rotas da API não conferem nada. A `dashboard.html` nem chama `validarSessao` (o `onload` da linha 29 está comentado). | Chamar `validarSessao()` em todas as páginas logadas e explicar esse limite para a banca. Segurança no servidor mudaria a arquitetura. |
| R11 | Sem internet, partes do site somem. | Google Fonts (`estilo.css:1`, `dashboards.css:3`, os dois CSS do jogo), Chart.js (`dashboard.html:23`), FontAwesome (`dashboard.html:26`), o sino do flaticon (`estilo.css:351`). | Fontes dentro do projeto. Chart.js vem de fora na própria web-data-viz: testar a Dashboard com e sem internet antes da banca. |
| R12 | Imagem quebrada ao apagar asset ainda em uso. | `bg-jelly-fish-para-home.png`, `circle-loading.gif`, `favicon2.ico` e os três ícones `_color` ainda são usados (seção 1.7). | Só apagar depois da troca. |
| R13 | A rota `/` daria erro 500. | `src/routes/index.js:5` chama `res.render("index")`, mas o projeto não tem motor de páginas configurado. Não aparece porque `express.static` (`app.js:27`) responde antes com `public/index.html`. | Não apagar `public/index.html` em nenhum momento. |
| R14 | O banco não acompanha o código. | O script cria o banco `aquatech`. O `.env.dev` ainda tem `'SEUSDADOSAQUI'`. Na VM: o IP pode mudar, o usuário do MySQL precisa aceitar conexão de fora e a porta 3306 precisa estar liberada. | Passo 0 da ordem segura: fazer o AquaTech original rodar antes de mudar qualquer coisa. |
| R15 | Senha e SQL. | A senha é gravada como texto puro. O SQL é montado colando o texto digitado (`usuarioModel.js:6`), o que permite **SQL injection**. | É como a web-data-viz ensina. Saber explicar (ver perguntas da banca). |
| R16 | Qualquer um pode se dar um carimbo. | Quem avisa a API é o navegador do jogador. | Limite aceitável para o projeto; saber explicar. |
| R17 | A sidebar e a moldura brigam por espaço. | A sidebar reserva 100 px à esquerda (`sidebar.css:57-59`) e fica por cima de tudo (`z-index: 50`). | O tabuleiro fixo de 960 px cabe em 1366 − 100 px. Testar nessa largura. |
| R18 | A sidebar só abre com o mouse. | `sidebar.css:94` usa só `:hover`. A demonstração diz que abre com Tab, mas não há regra para isso. Em tela de toque ela não abre. | Acrescentar `:focus-within` junto do `:hover`. |
| R19 | Crédito do trabalho dos colegas. | O jogo vem do Fabricio e a sidebar do Igor. A colaboração entre os três projetos é cobrada pela faculdade, e a banca precisa enxergar o que é seu e o que é adaptado. Os dois repositórios têm licença MIT, que pede que o aviso de copyright acompanhe a cópia. | Slide de agradecimentos na apresentação (requisito do projeto), as duas licenças guardadas em `docs/licencas/` e o diário de prompts preenchido. |
| R20 | Jogo impossível ou fácil demais. | Os tempos da seção 3.3 são estimativas. | Jogar cada fase várias vezes e ajustar no vetor; conferir a conta de segurança da 3.4. |

### 6.2 Princípios

1. **Um ramo separado** no Git (`refatoracao`), para a `main` continuar funcionando.
2. **Um passo, um teste, um commit.** Se quebrar, você sabe em qual passo foi e volta só ele.
3. **Mover primeiro, mudar depois.** O jogo vai para `public/` com as imagens antigas e o código antigo. Só quando rodar no lugar novo é que a lógica muda.
4. **Refatorar antes de apagar.** Nada que ainda é usado sai.

### 6.3 Ordem segura, com o teste de cada passo

| Passo | O que fazer | Como testar |
|---|---|---|
| 0 | Criar o ramo. `npm install`. Preencher `.env.dev`. Rodar o script SQL original na VM. | `npm start` mostra a mensagem do servidor. Cadastrar com o código `ED145B` e fazer login: tem que chegar nos cartões de aquário. **Se isto não funcionar, o problema é de ambiente, e é melhor descobrir agora.** |
| 1 | Copiar as duas licenças para `docs/licencas/`. Apagar o que ninguém usa: 23 imagens de `public/assets/`, o quiz e o upload de `DOCUMENTOS_DE_APOIO/`, `docs/documents.txt`, os 6 quadrinhos e as pastas `Index`, `Pagina Login`, `CalculadoraIMC`, `assets` e o `README.md` do GymFabs. | Repetir o teste do passo 0: nada pode ter mudado. Aba Rede sem nenhum 404. |
| 2 | Novo `script-tabelas.sql` com as tabelas do Passport. Rodar na VM. | No MySQL: `SHOW TABLES;` e um `SELECT` em `destino` com os 7 destinos. |
| 3 | Cadastro e login sem empresa e sem aquário (`cadastro.html`, `login.html`, `usuarioController.js`, `usuarioModel.js`). | Cadastrar um usuário novo; conferir a linha no banco; login com senha certa (entra) e errada (mensagem). |
| 4 | Tirar empresa, aquário, medida e aviso (D3): primeiro as linhas do `app.js`, depois os 12 arquivos, `cards.html`, `mural.html`, `edicao-aviso.html` e `alerta.js`. | `npm start` sobe sem erro. A busca `grep -rniE "aquario|empresa|medida|aviso" public src app.js` não devolve nada. Repetir o teste do passo 3. |
| 5 | Sidebar e skins nas páginas logadas. | Em cada página: a barra aparece, abre, o link ativo está marcado, "Sair" volta ao login. Sem login, a página manda para o login. Testar em 1366×768. |
| 6 | Mover o JumpGoat para `public/` **sem mudar a lógica**, só os caminhos. | Abrir `http://localhost:3333/jogo/jogo.html`: joga igual ao original. Aba Rede sem 404. |
| 7 | Refatorar o jogo: `fases.js`, colisão, laço, checkpoints, ainda com as imagens antigas. | A lista de testes do jogo (6.4). |
| 8 | Trocar imagens, moldura, paleta e textos. | A lista de testes de novo, nas 7 fases. Nenhuma imagem do GymFabs na tela. |
| 9 | Rota de carimbos e ligação com as skins. | Ganhar um carimbo e conferir a linha na tabela `carimbo`. Sair, entrar de novo: a skin continua liberada. Repetir o mesmo checkpoint: não duplica. |
| 10 | Home, Sobre mim, Calculadora e Dashboard. | `npm start` sobe; cada tela abre e mostra os dados do banco. |
| 11 | Limpeza final: apagar `features/`, arrumar o README, preencher o diário. | Clonar o repositório numa pasta nova, `npm install`, `npm start`, percorrer o site inteiro. |

### 6.4 Lista de testes do jogo

Cada linha é um teste de 30 segundos, para repetir a cada mudança. As primeiras são justamente os defeitos confirmados no original.

| # | Teste | Resultado esperado |
|---|---|---|
| 1 | Não apertar nada. | Game over no primeiro obstáculo. |
| 2 | **Segurar** a tecla Espaço. | Um pulo só; ao soltar e apertar de novo, pula normalmente. |
| 3 | Bater no obstáculo **durante a descida** do pulo. | A personagem para onde bateu e não volta a subir sozinha. |
| 4 | Apertar F5, Tab, uma letra. | Não pula. |
| 5 | Clicar no tabuleiro. | Pula. |
| 6 | Game over e recomeçar 5 vezes seguidas. | O placar sobe na mesma velocidade da primeira vez. |
| 7 | Jogar em janela de 1366 px e em tela cheia Full HD. | Mesmo tamanho de tabuleiro, mesma velocidade, moldura encaixada. |
| 8 | Pular exatamente a meta da fase 1. | Carimbo do Chile, fundo e obstáculos de Mendoza, obstáculo mais rápido. |
| 9 | Perder na fase 3. | Recomeça na fase 3, com 2 carimbos. |
| 10 | Completar a fase 7. | Tela de passaporte completo; 7 skins liberadas. |
| 11 | Desligar a internet e recarregar. | A fonte de fliperama continua. |
| 12 | Abrir o Console (F12) durante uma partida inteira. | Nenhuma linha vermelha. |
| 13 | Trocar de aba por 10 segundos e voltar. | O jogo não dá pontos "de graça" nem trava. |

---

## Glossário

| Termo | O que é |
|---|---|
| `addEventListener` | Pede ao navegador: "quando tal coisa acontecer, chame esta função". `removeEventListener` desfaz o pedido, e precisa receber a mesma função. |
| Animação CSS | Mudança automática de uma propriedade ao longo do tempo, feita pelo navegador. Tem duas partes: `@keyframes` (os valores em cada momento) e `animation` (liga ao elemento e define a duração). |
| `animationend` / `animationiteration` | Eventos que o navegador dispara quando uma animação CSS termina, ou quando completa uma volta e recomeça. |
| API | A parte do sistema que roda no servidor e responde a pedidos com dados. Aqui: `app.js` e `src/`. |
| Asset | Qualquer arquivo que não é código: imagem, GIF, fonte, ícone. |
| `background-size: cover` | Aumenta ou diminui a imagem de fundo até cobrir toda a área, cortando o que sobrar. |
| Caixa de colisão | O retângulo invisível usado para decidir se dois desenhos se tocaram. Costuma ser menor que a imagem, para descontar a borda transparente. |
| Caminho relativo | Endereço de arquivo que parte de onde você está (`img/x.png`, `../css/y.css`). `../` sobe uma pasta. O caminho absoluto começa com `/` e parte da raiz do site. |
| Cascata e prioridade | A regra que decide qual estilo vale quando dois disputam a mesma propriedade. Estilo inline ganha de classe; **animação CSS ganha de estilo inline**. |
| CDN | Um servidor na internet de onde a página baixa um arquivo pronto (fonte, biblioteca). Sem internet, não chega. |
| `classList` | A lista de classes de um elemento. `.add("x")` coloca, `.remove("x")` tira. |
| `clearInterval` | Para um `setInterval`. Recebe o número que o `setInterval` devolveu. |
| Closure | Uma função que continua enxergando as variáveis do lugar onde foi criada. |
| Contraste | Diferença de claridade entre texto e fundo, escrita como `4,5:1`. Quanto maior, mais fácil de ler. |
| Controller | O arquivo que recebe os dados do pedido, confere e decide a resposta. Fica em `src/controllers/`. |
| Estado | Uma variável que diz em que momento o programa está (`"jogando"`, `"gameover"`...). |
| Estilo inline | Estilo escrito direto no elemento (`elemento.style.left = "10px"`), em vez de no arquivo CSS. |
| Evento | Algo que acontece na página e que o JavaScript pode ouvir: tecla, clique, fim de animação. |
| `express.static` | A linha do Express que deixa o navegador pedir os arquivos de uma pasta. Aqui, `public/`. |
| `fetch` | A função do navegador que faz um pedido à API sem recarregar a página. |
| `getComputedStyle` | Devolve o valor que o navegador está usando **agora** para uma propriedade CSS, contando classes e animações. Vem como texto (`"120px"`). |
| GIF animado | Imagem com vários quadros que o navegador troca sozinho. O número de quadros e o tempo de cada um ficam gravados no arquivo. |
| `id` global | O navegador cria uma variável com o nome de cada `id` da página. Por isso `btn_start.style` funciona sem `getElementById`. |
| `image-rendering: pixelated` | Faz o navegador ampliar a imagem sem suavizar, mantendo os quadradinhos da pixel art nítidos. |
| `keydown` | O evento de "tecla pressionada". Repete sozinho enquanto a tecla fica segurada. |
| Laço do jogo | O trecho que se repete muitas vezes por segundo para conferir o que está acontecendo. |
| Licença MIT | Permite usar, copiar e modificar o código, inclusive em outro projeto, desde que o aviso de copyright e a licença acompanhem a cópia. |
| Model | O arquivo que monta o comando SQL e fala com o banco. Fica em `src/models/`. |
| `offsetLeft` | Distância em pixels, sem casas decimais, da borda esquerda do elemento até a borda esquerda do pai de referência. `offsetWidth` é a largura. |
| `overflow: hidden` | Esconde tudo que passar para fora da caixa. |
| Pai de referência | O elemento a partir do qual `offsetLeft` e `position: absolute` medem. É o ancestral mais próximo que tem `position` diferente do padrão. |
| `position: relative` / `absolute` | `absolute` tira o elemento do fluxo e deixa posicionar com `top`, `bottom`, `left`, `right`. `relative` no pai transforma esse pai na referência. |
| Quadro | Cada "foto" que a tela mostra. Uma tela comum mostra 60 por segundo, um a cada 16,7 ms. |
| `querySelector` | Devolve o primeiro elemento da página que combina com um seletor CSS (`".luna"`). |
| Reflow | O recálculo de posição e tamanho dos elementos. Ler `offsetLeft` obriga o navegador a fazer isso na hora. |
| `requestAnimationFrame` | Função do navegador: "chame minha função logo antes de desenhar o próximo quadro". Roda uma vez por quadro. |
| Rota Express | Um endereço que a API sabe responder (`POST /usuarios/autenticar`). Definida em `src/routes/` e registrada no `app.js`. |
| `sessionStorage` | Um espaço do navegador para guardar textos enquanto a aba estiver aberta. O site guarda ali o nome e o id de quem fez login. |
| `setInterval` | "Execute esta função a cada N milissegundos, para sempre." Devolve um número para poder parar depois. |
| `setTimeout` | "Execute esta função uma vez, daqui a N milissegundos." |
| Skin | Um conjunto de cores, fonte e formato de botão que troca a aparência do site sem trocar o conteúdo. |
| SQL injection | Ataque em que a pessoa digita um pedaço de SQL num campo, e o sistema executa porque colou o texto direto no comando. |
| Status HTTP | O número que a API devolve dizendo como foi: 200 deu certo, 204 deu certo e não há conteúdo, 400 pedido errado, 403 proibido, 404 não existe, 500 erro no servidor. |
| Template string | Texto entre crases em que `${variavel}` é trocado pelo valor: `` `SCORE:${score}` ``. |
| Variável CSS | Um nome dado a um valor no CSS (`--cor-fundo: #0B132B`), usado com `var(--cor-fundo)`. Mudou a variável, muda em todo lugar que a usa. |
| Vetor de objetos | Uma lista (`[ ]`) em que cada item é um conjunto de campos com nome (`{ }`). |

---

## Perguntas que a banca pode fazer

**1. Esse jogo é seu?**
A mecânica vem do JumpGoat, do meu colega Fabricio Lima, e a barra lateral é do Igor Fuchs Pereira. A colaboração entre os projetos faz parte da proposta: eles usam o meu quebra-cabeça de arrastar e soltar. Os créditos estão no slide de agradecimentos. Eu refatorei o código para dentro da web-data-viz, criei as 7 fases em vetor, os checkpoints, a ligação com o banco e as skins, e troquei todas as imagens, cores e textos.

**2. Quem faz o obstáculo andar, o JavaScript ou o CSS?**
O CSS. Uma animação com `@keyframes` muda a posição do obstáculo de um lado ao outro. O JavaScript só coloca e tira a classe que liga a animação, e lê a posição para ver se bateu.

**3. Como o jogo sabe que houve colisão?**
A cada quadro eu leio onde o obstáculo está com `offsetLeft` e a altura da personagem com `getComputedStyle`. Se os dois retângulos se sobrepõem na horizontal e a personagem não está acima da altura do obstáculo, é colisão.

**4. Por que `getComputedStyle` e não `elemento.style.bottom`?**
Porque `style` só mostra o que foi escrito direto no elemento. Durante o pulo, a altura vem da animação CSS, e só `getComputedStyle` devolve o valor daquele instante.

**5. O que é `offsetLeft`?**
É a distância em pixels da borda esquerda do elemento até a borda esquerda do pai de referência, que aqui é o tabuleiro, porque ele tem `position: relative`.

**6. Por que você trocou o `setInterval` de 10 ms?**
A tela desenha a cada 16,7 ms e a animação só anda de quadro em quadro. Medi: de 99 leituras em um segundo, 41 vinham repetidas. O `requestAnimationFrame` roda uma vez por quadro e ainda informa o horário, o que deixa a pontuação por tempo real.

**7. O que eram os números 120 do código original?**
Dois limites escritos à mão: a distância em que a lata "encosta" na cabra e a altura mínima do pulo para passar por cima. Só serviam para aquelas duas imagens. Agora largura, altura e folga vêm do objeto de cada obstáculo.

**8. Como a dificuldade aumenta?**
Cada fase tem um `tempoTravessia` menor no vetor `fases`, de 2,0 s até 1,2 s. O JavaScript passa esse valor para uma variável CSS que a animação usa. A meta de obstáculos por fase também cresce.

**9. Onde estão vetores e laços no projeto?**
`fases` é um vetor de 7 objetos, e cada fase tem dentro um vetor de obstáculos. Uso `for` para montar os 7 carimbos e os botões de skin, e o laço do jogo repete a verificação de colisão a cada quadro.

**10. O que é uma variável CSS e por que você usou?**
É um nome para um valor, como `--cor-fundo`. Todo o site usa `var(--cor-fundo)`. Cada skin só redefine essas variáveis, e a aparência inteira muda sem eu tocar no resto do CSS.

**11. Como o carimbo chega no banco?**
Quando a fase termina, o jogo faz um `fetch` com `POST` para a rota `/carimbos/registrar`. A rota chama o controller, que confere os dados; o controller chama o model, que monta o `INSERT`; e o `config.js` executa no MySQL da VM.

**12. O que são rota, controller e model?**
A rota é o endereço e para qual função ele vai. O controller confere os dados que chegaram e decide a resposta. O model monta o SQL e fala com o banco. É a divisão da web-data-viz, que eu mantive.

**13. O que você apagou da web-data-viz e por quê?**
As partes de empresa, aquário, medida e aviso, porque eram do projeto AquaTech. Antes de apagar, refatorei o cadastro (que dependia de empresa) e o login (que dependia de aquário), porque apagar direto derrubaria o servidor.

**14. Como você garante que só quem fez login vê as páginas?**
Cada página logada chama `validarSessao()`, que confere o `sessionStorage` e manda para o login se estiver vazio. É uma proteção no navegador. Uma proteção no servidor exigiria mudar a arquitetura da web-data-viz, o que a regra do projeto não permite.

**15. Seu sistema é seguro contra SQL injection?**
Não totalmente. Os models montam o SQL colando o texto que o usuário digitou, como a web-data-viz ensina. O correto seria usar parâmetros no lugar dos valores. É uma limitação conhecida, que eu mantive para não mudar a arquitetura.

**16. Por que as páginas logadas ficam em `public/dashboard/` e `public/jogo/`?**
Porque o `sessao.js` volta para o login com `../login.html`, que só funciona um nível abaixo de `public/`. A `dashboard/` já era a área logada da web-data-viz; a `jogo/` segue o mesmo padrão e separa as duas telas do jogo.

**17. O que acontece se a sala não tiver internet?**
O jogo e as skins funcionam, porque a fonte está dentro do projeto. O gráfico da Dashboard usa o Chart.js vindo de um CDN, como na web-data-viz original, então essa tela precisa de internet.

**18. Por que o jogo anda igual em qualquer tela?**
No original o tabuleiro tinha 80% da largura da janela e o obstáculo sempre cruzava em 2 segundos, então tela maior significava obstáculo mais rápido (800 contra 578 pixels por segundo). Fixei o tabuleiro em 960 pixels.

**19. O que é `position: relative` no tabuleiro?**
Ele transforma o tabuleiro na referência dos elementos de dentro. A personagem e o obstáculo têm `position: absolute`, então `bottom: 0` significa "no chão do tabuleiro", e não "no fim da página".

**20. Você usou IA?**
Sim, para diagnosticar o repositório, planejar a refatoração e tirar dúvidas. Está registrado no diário de prompts, em `docs/diario-de-prompts.md`. Eu sei explicar cada trecho do código.

---

## Anexo — Como medi

| O que | Como |
|---|---|
| Tamanho, quadros, tempo por quadro e transparência das imagens | Um script em Python sem bibliotecas, que lê os cabeçalhos de PNG, GIF, JPEG, WebP e ICO. |
| Parte visível da cabra e da lata; posição do buraco da moldura | Decodifiquei os pixels dos GIFs e medi onde começa e onde termina a área transparente. |
| Arquivos idênticos | Comparação por `md5sum`: `aguarde-pink.gif` = `circle-loading.gif`; os dois `gymfabs_logo_header@4x.png` são iguais. |
| Quem referencia cada arquivo | `grep -rIlF` do nome de cada arquivo no repositório, mais leitura dos `require`. |
| Desalinhamento da moldura; lasca da lata; botão fora do centro | Capturas de tela do `JumpGoat.html` original no Chrome, em 1920×1080 e 1366×768. |
| Velocidade da lata, janela segura do pulo, pontos por segundo, leituras repetidas | Uma **cópia** do jogo fora do repositório, com um roteiro de teste acrescentado só na cópia, rodando em tempo real no Chrome em 1920×1080. |
| Defeito de segurar a tecla; cabra flutuando | O mesmo roteiro, simulando as teclas e anotando a altura da cabra a cada 50 ms. |
| Contraste das cores | Fórmula de contraste da recomendação de acessibilidade para a web (WCAG), calculada para cada par. |
| Velocidade em 1366 px | Conta a partir da largura do tabuleiro (não rodei o roteiro nessa largura). |

O que **não** foi testado: a API e o banco (ver a tabela no início). Os riscos R2 a R5 vêm da leitura do código e precisam ser confirmados no passo 0 da ordem segura.

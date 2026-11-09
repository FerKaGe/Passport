<div align="center">

<img src="assets/readme/banner.svg" alt="GymFabs — Projeto Individual SPTech" width="100%">

<br>

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-7B2CBF?style=for-the-badge&labelColor=120E18)
![SPTech](https://img.shields.io/badge/SPTech-projeto%20individual-C77DFF?style=for-the-badge&labelColor=120E18)


![HTML5](https://img.shields.io/badge/HTML5-08070A?style=for-the-badge&logo=html5&logoColor=C77DFF)
![CSS3](https://img.shields.io/badge/CSS3-08070A?style=for-the-badge&logo=css&logoColor=C77DFF)
![JavaScript](https://img.shields.io/badge/JavaScript-08070A?style=for-the-badge&logo=javascript&logoColor=C77DFF)
![Node.js](https://img.shields.io/badge/Node.js-08070A?style=for-the-badge&logo=nodedotjs&logoColor=C77DFF)
![MySQL](https://img.shields.io/badge/MySQL-08070A?style=for-the-badge&logo=mysql&logoColor=C77DFF)

**[Sobre](#-sobre)** · **[Funcionalidades](#-funcionalidades)** · **[Tecnologias](#-tecnologias)** · **[Como rodar](#-como-rodar)** · **[Autor](#-autor)**

</div>

---

## ◆ Sobre

A **GymFabs** é um site sobre o meu hobby favorito, a **musculação**, desenvolvido como **Projeto Individual** na **SPTech — São Paulo Tech School**.

Nele eu conto como a musculação entrou na minha vida, o que ela me ensinou e quem me inspira. O site também tem um **quiz** para testar o que você sabe de treino, uma página com os meus **favoritos** (músicas, alimentação e ficha de treino) e uma **calculadora de IMC**. Quem quiser pode criar uma conta e entrar com **cadastro e login**.

> [!NOTE]
> O projeto está em desenvolvimento ativo. As telas são feitas do zero com HTML, CSS e JavaScript puros, e o cadastro e o login vão usar a API **web-data-viz** (Node.js) com banco **MySQL**.

---

## ◆ Funcionalidades

| | Tela | O que tem | Status |
|:-:|---|---|:-:|
| 🏋️ | **Meu hobby** | Minha história na musculação: como tudo começou, a primeira academia, os valores que levo além do treino, as dificuldades que superei e as minhas inspirações | ⚪ Planejado |
| 🎮 | **Quiz GymFabs** | Mini game com visual arcade: tela inicial, perguntas de múltipla escolha sobre treino e tela de resultado com acertos x erros e desempenho por tema | ⚪ Planejado |
| ⭐ | **Meus favoritos** | Músicas para treinar, o que eu como antes e depois do treino e a minha ficha de treino favorita | ⚪ Planejado |
| ⚖️ | **Calculadora de IMC** | Recebe peso (kg) e altura (cm), calcula o IMC e mostra a faixa de classificação | 🟣 Em andamento |
| 📝 | **Cadastro** | Nome, e-mail e senha, com validação de e-mail e medidor de força de senha em tempo real | 🟣 Em andamento |
| 🔐 | **Login** | Acesso com o e-mail e a senha cadastrados | ⚪ Iniciado |

<details>
<summary><b>📝 Cadastro: medidor de força de senha</b></summary>

<br>

A senha ganha 1 ponto para cada critério atendido:

- contém **número**
- tem **8 caracteres ou mais**
- mistura letras **maiúsculas e minúsculas**
- contém **caractere especial** (`! @ # $ % & *`)

| Pontos | Força | Pode cadastrar? |
|:-:|---|:-:|
| 1 | **FRACA** | ❌ |
| 2 | **MÉDIA** | ❌ |
| 3 | **FORTE** | ✅ |
| 4 | **MONSTRA** | ✅ |

O e-mail é considerado válido quando contém `@` e `.`.

</details>

---

## ◆ Tecnologias

| Camada | Tecnologia | Uso | Status |
|---|---|---|:-:|
| Estrutura | ![HTML5](https://img.shields.io/badge/HTML5-120E18?style=flat-square&logo=html5&logoColor=C77DFF) | Todas as telas | ✅ Em uso |
| Estilo | ![CSS3](https://img.shields.io/badge/CSS3-120E18?style=flat-square&logo=css&logoColor=C77DFF) | Visual das telas | ✅ Em uso |
| Lógica | ![JavaScript](https://img.shields.io/badge/JavaScript-120E18?style=flat-square&logo=javascript&logoColor=C77DFF) | Validações, IMC e quiz | ✅ Em uso |
| API | ![Node.js](https://img.shields.io/badge/Node.js-120E18?style=flat-square&logo=nodedotjs&logoColor=C77DFF) **web-data-viz** | Cadastro e login | 🔜 Planejado |
| Banco de dados | ![MySQL](https://img.shields.io/badge/MySQL-120E18?style=flat-square&logo=mysql&logoColor=C77DFF) | Guardar os usuários cadastrados | 🔜 Planejado |

---

## ◆ Como rodar

Por enquanto as telas são só HTML, CSS e JavaScript, então não precisa instalar nada.

```bash
# 1. Clone o repositório
git clone https://github.com/oFabs-dev/Projeto-individual---GymFabs.git

# 2. Entre na pasta
cd Projeto-individual---GymFabs
```

**3.** Abra o arquivo da tela que quiser no navegador:

- `CalculadoraIMC/calculadoraIMC.html`
- `Pagina Login/cadastro.html`
- `Pagina Login/login.html`





## ◆ Autor

<div align="center">

<a href="https://github.com/oFabs-dev">
  <img src="https://github.com/oFabs-dev.png" width="110" alt="Foto de perfil de Fabricio Lima" style="border-radius: 50%;">
</a>

### Fabricio Lima

Estudante da **SPTech — São Paulo Tech School**

[![GitHub](https://img.shields.io/badge/@oFabs--dev-08070A?style=for-the-badge&logo=github&logoColor=C77DFF)](https://github.com/oFabs-dev)

</div>

---

<div align="center">

Distribuído sob a licença **MIT**. Veja [`LICENSE`](LICENSE) para mais detalhes.

<sub>Feito com 💜 e muita série pesada.</sub>

</div>

<!-- Cabeçalho animado -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,12,20&height=220&section=header&text=Meu%20Passaporte&fontSize=56&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Os%20pa%C3%ADses%20que%20j%C3%A1%20conheci%20%E2%9C%88%EF%B8%8F&descAlignY=58&descSize=20" width="100%" alt="Meu Passaporte"/>
</p>

<p align="center">
  <a href="#">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&pause=1000&color=1E88E5&center=true&vCenter=true&width=650&lines=7+pa%C3%ADses%2C+3+continentes%2C+muitas+hist%C3%B3rias+%F0%9F%8C%8D;Quanto+custaria+a+sua+pr%C3%B3xima+viagem%3F+%F0%9F%92%B8;Monte+o+quebra-cabe%C3%A7a+e+ganhe+carimbos+%F0%9F%A7%A9;Projeto+Individual+%E2%80%A2+SPTech+2026.2" alt="Typing SVG" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-em%20desenvolvimento-F7A81B?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/banca-30%2F11%20a%2004%2F12-1E88E5?style=for-the-badge" alt="Banca"/>
  <img src="https://img.shields.io/badge/IA-Di%C3%A1rio%20de%20Prompts-8E24AA?style=for-the-badge" alt="Diário de Prompts"/>
</p>

<p align="center">
  <a href="#-sobre">Sobre</a> •
  <a href="#-destinos">Destinos</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-o-jogo-do-passaporte">Jogo</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-arquitetura">Arquitetura</a> •
  <a href="#-como-executar">Como executar</a> •
  <a href="#-cronograma">Cronograma</a>
</p>

---

## 📖 Sobre

**Meu Passaporte** é um site pessoal onde compartilho os países que já conheci. Além de contar cada viagem, o site ajuda quem visita a descobrir **quanto custaria fazer a mesma viagem saindo de São Paulo**, de acordo com o seu estilo: **aventura**, **low cost** ou **exclusiva**.

Para deixar tudo mais divertido, cada país vira uma fase de um jogo: monte o quebra-cabeça de uma foto da viagem, finque a bandeira certa e ganhe um carimbo no seu passaporte! 🛂

> Projeto Individual do 1º semestre (2026.2) da SPTech, integrando as disciplinas de Pesquisa e Inovação, Banco de Dados, Algoritmos, Arquitetura de Computadores, Sistemas Operacionais, TI e Socioemocional.

---

## 🌍 Destinos

| | País | Cidades | Quando |
|:-:|---|---|---|
| 🇨🇱 | **Chile** | Deserto do Atacama | 11/2016 a 02/2017 |
| 🇦🇷 | **Argentina** | Mendoza | 12/2023 a 01/2024 |
| 🇪🇸 | **Espanha** | Madrid, Sevilha, Utrera, Cádiz, Ronda | 06/2024 a 07/2024 |
| 🇵🇹 | **Portugal** | Lisboa, Algarve, Portimão | 07/2024 |
| 🇬🇮 | **Gibraltar** | Gibraltar (território britânico) | 07/2024 a 08/2024 |
| 🇲🇿 | **Moçambique** | Maputo, Ponta do Ouro | 08/2024 a 10/2024 |
| 🇺🇸 | **Estados Unidos** | Orlando | 09/2026 |

---

## ✨ Funcionalidades

- [ ] 🏠 **Home pública** com a linha do tempo das viagens
- [ ] 📝 **Cadastro e login** com validações em JavaScript
- [ ] 🙋 **Sobre mim**, contando como a paixão por viajar começou
- [ ] 🎒 **Escolha do tipo de viagem**: aventura, low cost ou exclusiva
- [ ] 📊 **Dashboard** com o custo total da viagem para cada destino (7, 15 ou 30 dias)
- [ ] ✈️ **Indicadores**: estimativa de voo, melhor época do ano e destino mais barato
- [ ] 💱 **Conversão de moeda** local para real
- [ ] 🧩 **Jogo do Passaporte** com carimbos salvos no banco

> Dashboard, Sobre mim e Jogo só aparecem para quem está logado.

### 🧮 Como o custo é calculado

```
custo total = valor do voo (SP → destino) + valor da diária × número de dias
```

---

## 🧩 O jogo do Passaporte

```mermaid
flowchart LR
    A[🖼️ Foto da viagem<br/>embaralhada em 9 peças] --> B[🧩 Usuário monta<br/>o quebra-cabeça]
    B --> C{📍 Finca a bandeira<br/>do país certo?}
    C -- Sim --> D[🛂 Carimbo no passaporte<br/>+ curiosidade da viagem]
    C -- Não --> E[🔁 Tenta de novo]
    E --> C
    D --> F[(💾 Carimbo salvo<br/>no MySQL)]
```

Cada um dos 7 países é uma fase. Ao completar todas, o passaporte fica cheio! 🏆

---

## 🛠️ Tecnologias

<p align="center">
  <img src="https://skillicons.dev/icons?i=html,css,js,nodejs,express,mysql,ubuntu,git,github,vscode&theme=dark" alt="Tecnologias"/>
</p>

| Camada | Tecnologia |
|---|---|
| Front-end | HTML, CSS, JavaScript, Chart.js |
| Back-end | Node.js + Express (API [web-data-viz](https://github.com/BandTec/web-data-viz)) |
| Banco de dados | MySQL em uma VM Lubuntu (VirtualBox) |
| Organização | Git, GitHub e Trello |

---

## 🏗️ Arquitetura

```mermaid
flowchart LR
    U[👤 Navegador<br/>HTML • CSS • JS] -- fetch --> R[🛣️ Routes]
    subgraph API Node.js - web-data-viz
        R --> C[🎮 Controllers] --> M[📦 Models]
    end
    M -- SQL --> DB[(🐬 MySQL<br/>VM Lubuntu)]
```

### 🗄️ Modelo de dados

```mermaid
erDiagram
    TIPO_VIAGEM ||--o{ USUARIO : prefere
    TIPO_VIAGEM ||--o{ CUSTO : define
    DESTINO ||--o{ CUSTO : tem
    USUARIO ||--o{ CARIMBO : conquista
    DESTINO ||--o{ CARIMBO : gera

    USUARIO {
        int id PK
        varchar nome
        varchar email
        varchar senha
        int fk_tipo_viagem FK
    }
    TIPO_VIAGEM {
        int id PK
        varchar nome
    }
    DESTINO {
        int id PK
        varchar pais
        varchar cidades
        date inicio_viagem
        date fim_viagem
        varchar melhor_epoca
        varchar moeda
        decimal cotacao_real
    }
    CUSTO {
        int id PK
        int fk_destino FK
        int fk_tipo_viagem FK
        decimal valor_voo
        decimal valor_diaria
    }
    CARIMBO {
        int fk_usuario FK
        int fk_destino FK
        datetime data_conquista
    }
```

---

## 🚀 Como executar

```bash
# 1. Clone o repositório
git clone https://github.com/FerKaGe/Passport.git
cd Passport

# 2. Instale as dependências
npm install

# 3. Crie o banco na VM executando o script SQL
#    src/database/script-tabelas.sql

# 4. Configure o acesso ao banco no arquivo .env.dev
#    (host da VM, usuário, senha e nome do banco)

# 5. Inicie a aplicação
npm start
```

Depois é só acessar `http://localhost:3333` no navegador. 🌐

---

## 📅 Cronograma

| Semana | Período | Entrega | Status |
|:-:|---|---|:-:|
| 2 | 25/10 a 31/10 | Documentação, Git, Trello e banco de dados | ⏳ |
| 3 | 01/11 a 07/11 | Home e Sobre mim | ⏳ |
| 4 | 08/11 a 14/11 | Cadastro, login e quebra-cabeça | ⏳ |
| 5 | 15/11 a 21/11 | Dashboard e carimbos do passaporte | ⏳ |
| 6 | 22/11 a 28/11 | Testes, apresentação e ensaio | ⏳ |
| 🎤 | 30/11 a 04/12 | Apresentação para a banca | ⏳ |

---

## 🤖 Uso de IA

Este projeto usa IA como apoio para tirar dúvidas, revisar código e planejar. Tudo o que foi pedido, usado e alterado está registrado no [**Diário de Prompts**](./diario-de-prompts.md).

---

## 👤 Autor

<p align="center">
  Feito com ❤️ e muitas milhas por <a href="https://github.com/FerKaGe"><b>FerKaGe</b></a>
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,12,20&height=120&section=footer" width="100%" alt="Rodapé"/>
</p>

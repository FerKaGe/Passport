# Glass Sidebar

Barra lateral flutuante com efeito de vidro, em HTML e CSS puro. Fechada, mostra só os ícones; ao passar o mouse, abre por cima da página e mostra os nomes.

## Como usar

1. Copie o `sidebar.css` e ligue na página:

   ```html
   <link rel="stylesheet" href="sidebar.css">
   ```

2. Coloque `glass-sidebar-page` no `<body>`, para o conteúdo não ficar por baixo da barra fechada:

   ```html
   <body class="glass-sidebar-page">
   ```

3. Copie o `<aside class="glass-sidebar">` do `index.html`.

A pasta `demo/` é só da página de demonstração.

## Classes

| Classe | Uso |
| --- | --- |
| `glass-sidebar__brand` | Logo e nome |
| `glass-sidebar__nav` | Links principais |
| `glass-sidebar__bottom` | Grupo de baixo (tema, sair) |
| `glass-sidebar__item` | Cada link ou botão |
| `glass-sidebar__icon` | Ícone, sempre visível |
| `glass-sidebar__label` | Texto, visível só com a barra aberta |
| `is-active` | Página atual |
| `is-danger` | Vermelho ao passar o mouse |

Cores e medidas são variáveis `--glass-sidebar-*` no topo do `sidebar.css`. O tema escuro segue o sistema ou `data-theme="dark"` / `"light"` no `<html>`.

## Como funciona

- **Fechada:** a barra tem `68px` de largura e os textos ficam com `opacity: 0`.
- **`:hover`:** com o mouse em cima, a largura vai para `240px` e os textos para `opacity: 1`, animados por `transition`.
- **`position: fixed`:** a barra não ocupa espaço no layout. O `glass-sidebar-page` reserva só a largura fechada, então ela abre por cima do conteúdo sem empurrá-lo.
- **`:focus-visible`:** quem navega pelo teclado vê um contorno no item focado; ao clicar com o mouse, o contorno não aparece.

## O efeito de vidro

O vidro é a soma de duas propriedades na `.glass-sidebar`:

```css
background: rgba(255, 250, 241, 0.55);
backdrop-filter: blur(16px) saturate(160%);
```

- **`backdrop-filter`** aplica filtros no que está **atrás** do elemento, e não no elemento em si. `blur(16px)` desfoca a página por trás da barra, como um vidro fosco, e `saturate(160%)` deixa as cores de trás mais vivas, compensando o tom claro que o fundo adiciona.
- **`background`** precisa ser semitransparente. O último número do `rgba()` é a opacidade: `0.55` deixa passar a página desfocada e ainda dá um tom à barra, o que mantém o texto legível. Com `1` (opaco), o fundo cobriria tudo e o desfoque não apareceria; com `0`, sobraria só um borrão sem cor.

O efeito aparece mais quando há cores ou imagens atrás da barra. Por isso a demonstração usa um fundo com duas cores e um corte seco no meio da tela, que fica desfocado através do vidro. Sobre um fundo liso, a barra fica só translúcida.

## Licença

[MIT](LICENSE)

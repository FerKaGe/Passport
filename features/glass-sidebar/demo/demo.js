// Só da página de demonstração: alterna entre os temas claro e escuro.
const DARK_THEME = "dark";
const LIGHT_THEME = "light";

function toggleTheme() {
  // Sem data-theme no <html>, a página está seguindo o tema do sistema.
  const isDarkNow = document.documentElement.dataset.theme
    ? document.documentElement.dataset.theme === DARK_THEME
    : window.matchMedia("(prefers-color-scheme: dark)").matches;

  document.documentElement.dataset.theme = isDarkNow ? LIGHT_THEME : DARK_THEME;
}

document.getElementById("theme-button").addEventListener("click", toggleTheme);

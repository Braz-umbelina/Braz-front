const CHAVE = "braz:tema";

export type Tema = "claro" | "escuro";

/* Tailwind switches on a class in <html>, so the theme is applied here and read back
from the same place: no context, no provider, one line in each component that needs it. */
export const lerTema = (): Tema =>
  localStorage.getItem(CHAVE) === "claro" ? "claro" : "escuro";

/* A barra de status do celular usa esta cor, então ela troca junto com o tema.
Os mesmos dois valores estão no script do index.html, que roda antes disto. */
const CORES: Record<Tema, string> = { claro: "#EEF2F6", escuro: "#0A0F1C" };

export const aplicarTema = (tema: Tema) => {
  document.documentElement.classList.toggle("dark", tema === "escuro");
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", CORES[tema]);
  localStorage.setItem(CHAVE, tema);
};

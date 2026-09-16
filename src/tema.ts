const CHAVE = "braz:tema";

export type Tema = "claro" | "escuro";

export const lerTema = (): Tema =>
  localStorage.getItem(CHAVE) === "claro" ? "claro" : "escuro";

const CORES: Record<Tema, string> = { claro: "#EEF2F6", escuro: "#0A0F1C" };

export const aplicarTema = (tema: Tema) => {
  document.documentElement.classList.toggle("dark", tema === "escuro");
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", CORES[tema]);
  localStorage.setItem(CHAVE, tema);
};

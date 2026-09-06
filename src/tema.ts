const CHAVE = "braz:tema";

export type Tema = "claro" | "escuro";

/* Tailwind switches on a class in <html>, so the theme is applied here and read back
from the same place: no context, no provider, one line in each component that needs it. */
export const lerTema = (): Tema =>
  localStorage.getItem(CHAVE) === "claro" ? "claro" : "escuro";

export const aplicarTema = (tema: Tema) => {
  document.documentElement.classList.toggle("dark", tema === "escuro");
  localStorage.setItem(CHAVE, tema);
};

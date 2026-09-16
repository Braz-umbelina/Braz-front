import { useEffect } from "react";

export const useAlturaVisual = () => {
  useEffect(() => {
    const viewport = window.visualViewport;

    const atualizar = () => {
      const altura = viewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty(
        "--altura-visual",
        `${Math.round(altura)}px`,
      );
    };

    atualizar();
    viewport?.addEventListener("resize", atualizar);
    viewport?.addEventListener("scroll", atualizar);
    window.addEventListener("resize", atualizar);
    window.addEventListener("orientationchange", atualizar);

    return () => {
      viewport?.removeEventListener("resize", atualizar);
      viewport?.removeEventListener("scroll", atualizar);
      window.removeEventListener("resize", atualizar);
      window.removeEventListener("orientationchange", atualizar);
      document.documentElement.style.removeProperty("--altura-visual");
    };
  }, []);
};

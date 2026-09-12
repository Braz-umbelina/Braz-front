import type { Tema } from "../tema";

type Props = {
  tema: Tema;
  aoTrocarTema: () => void;
  aoSair: () => void;
  className?: string;
};

const CLASSE_ICONE =
  "flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:text-brand-tinta hover:bg-gray-100 dark:text-gray-400 dark:hover:text-brand-acao dark:hover:bg-white/[0.04] transition-colors";

/* The same bar for the student and for the teacher. On a phone both areas lose their
side bar, and giving each one its own top bar would make the two look like different
apps. The breakpoint comes from outside because they hide the side bar at different
widths. */
function BarraTopoMobile({ tema, aoTrocarTema, aoSair, className = "" }: Props) {
  return (
    <header
      className={`shrink-0 flex items-center justify-between border-b border-gray-200 px-4 py-1 dark:border-white/5 ${className}`}
    >
      <img
        src="/images/logo-braz.webp"
        alt="Braz"
        className="h-12 w-auto object-contain dark:hidden"
      />
      <img
        src="/images/logo-escuro-braz.webp"
        alt="Braz"
        className="hidden h-12 w-auto object-contain dark:block"
      />

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={aoTrocarTema}
          className={CLASSE_ICONE}
          aria-label={tema === "escuro" ? "Usar tema claro" : "Usar tema escuro"}
        >
          <i className={tema === "escuro" ? "fa-solid fa-sun" : "fa-solid fa-moon"} />
        </button>

        <button
          type="button"
          onClick={aoSair}
          className={CLASSE_ICONE}
          aria-label="Sair"
        >
          <i className="fa-solid fa-arrow-right-from-bracket" />
        </button>
      </div>
    </header>
  );
}

export default BarraTopoMobile;

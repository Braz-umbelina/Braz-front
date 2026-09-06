import { useState } from "react";
import { aplicarTema, lerTema } from "../../tema";

type Props = {
  aoSair: () => void;
};

/* Fixed at this width: the bar carries only the mark, the theme and the exit, and
nothing in it is worth the space an open panel would take from the conversation. */
function BarraLateral({ aoSair }: Props) {
  const [tema, setTema] = useState(lerTema);

  const trocarTema = () => {
    const novo = tema === "escuro" ? "claro" : "escuro";
    aplicarTema(novo);
    setTema(novo);
  };

  return (
    <aside className="relative z-20 shrink-0 h-full w-16 flex flex-col border-r border-gray-200 bg-white dark:border-white/5 dark:bg-white/[0.02]">
      <div className="flex items-center justify-center p-4">
        <img
          src="/images/icone-escuro-braz.webp"
          alt="Braz"
          className="h-8 w-8 object-contain dark:hidden"
        />
        <img
          src="/images/icone-braz.webp"
          alt="Braz"
          className="h-8 w-8 object-contain hidden dark:block"
        />
      </div>

      <div className="mt-auto p-4 space-y-1">
        <button
          onClick={trocarTema}
          className="w-full flex items-center justify-center rounded-xl px-3 py-2.5 text-gray-500 hover:text-brand-tinta hover:bg-gray-100 dark:text-gray-400 dark:hover:text-brand-acao dark:hover:bg-white/[0.04] transition-colors"
          aria-label={tema === "escuro" ? "Usar tema claro" : "Usar tema escuro"}
        >
          <i className={tema === "escuro" ? "fa-solid fa-sun" : "fa-solid fa-moon"} />
        </button>

        <button
          onClick={aoSair}
          className="w-full flex items-center justify-center rounded-xl px-3 py-2.5 text-gray-500 hover:text-brand-tinta hover:bg-gray-100 dark:text-gray-400 dark:hover:text-brand-acao dark:hover:bg-white/[0.04] transition-colors"
          aria-label="Sair"
        >
          <i className="fa-solid fa-arrow-right-from-bracket" />
        </button>
      </div>
    </aside>
  );
}

export default BarraLateral;

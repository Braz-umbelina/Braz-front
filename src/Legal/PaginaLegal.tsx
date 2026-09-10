import { Link } from "react-router-dom";

type Props = {
  titulo: string;
  atualizadoEm: string;
  children: React.ReactNode;
};

/* Both legal pages share this shell. They are read outside the login card, so they
get the page background and a plain column instead of the two column fold. */
function PaginaLegal({ titulo, atualizadoEm, children }: Props) {
  return (
    <div className="bg-brand-claro text-brand-tinta dark:bg-brand-fundo dark:text-brand-light font-sans min-h-screen px-5 py-10 sm:px-8 sm:py-14 selection:bg-brand-acao selection:text-black">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-brand-tinta dark:text-brand-light/50 dark:hover:text-white"
        >
          <i className="fa-solid fa-arrow-left text-xs" aria-hidden="true" />
          Voltar
        </Link>

        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {titulo}
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-brand-light/50">
          Atualizada em {atualizadoEm}.
        </p>

        <div className="mt-10 space-y-8 text-[0.95rem] leading-relaxed">
          {children}
        </div>

        <p className="mt-14 border-t border-gray-200 pt-6 text-xs leading-relaxed text-gray-500 dark:border-white/10 dark:text-brand-light/40">
          Braz, projeto de extensão de Geovani Eterno Rodrigues, Centro
          Universitário Internacional UNINTER, realizado no Colégio Estadual
          Umbelina Braz Gomides. Não tem vínculo com o governo do estado de
          Goiás nem com qualquer empresa.
        </p>
      </div>
    </div>
  );
}

export function Secao({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-lg font-semibold text-brand-tinta dark:text-white">
        {titulo}
      </h2>
      <div className="mt-2 space-y-3 text-gray-700 dark:text-brand-light/70">
        {children}
      </div>
    </section>
  );
}

export default PaginaLegal;

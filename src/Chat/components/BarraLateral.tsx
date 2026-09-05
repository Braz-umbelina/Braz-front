import type { Aula } from "../services/aulaService";

type Props = {
  aula: Aula | null;
  aberta: boolean;
  aoAlternar: () => void;
  aoSair: () => void;
};

function BarraLateral({ aula, aberta, aoAlternar, aoSair }: Props) {
  return (
    <aside
      className={`relative z-20 shrink-0 h-full flex flex-col border-r border-white/5 bg-white/[0.02] transition-[width] duration-300 ${
        aberta ? "w-64" : "w-16"
      }`}
    >
      <div className="flex items-center gap-3 p-4">
        <img
          src="/images/icone-escuro-braz.webp"
          alt="Braz"
          className="h-8 w-8 object-contain shrink-0"
        />
        {aberta && (
          <span className="font-display font-bold text-lg text-white">
            Braz
          </span>
        )}
      </div>

      {/* The class only exists while the teacher keeps it open, so this block is the
      student's way of telling whether the Braz will answer at all. */}
      {aberta && (
        <div className="px-4 mt-4">
          <p className="text-[0.6rem] uppercase tracking-widest text-gray-500 mb-2">
            Aula de agora
          </p>
          {aula ? (
            <div className="rounded-xl bg-brand-painel px-3 py-2.5">
              <p className="text-sm font-semibold text-white leading-snug">
                {aula.disciplina}
              </p>
              {aula.professor && (
                <p className="text-xs text-gray-400 mt-0.5">
                  Professora {aula.professor}
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-500 leading-relaxed">
              Nenhuma aula aberta no momento.
            </p>
          )}
        </div>
      )}

      <div className="mt-auto p-4 space-y-3">
        {aberta && (
          <p className="text-[0.65rem] text-gray-600 leading-relaxed">
            O Braz pode cometer erros. Confirme com a professora o que for
            importante.
          </p>
        )}

        <button
          onClick={aoSair}
          className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-gray-400 hover:text-brand-acao hover:bg-white/[0.04] transition-colors ${
            aberta ? "" : "justify-center"
          }`}
        >
          <i className="fa-solid fa-arrow-right-from-bracket" />
          {aberta && <span className="text-sm">Sair</span>}
        </button>
      </div>

      <button
        onClick={aoAlternar}
        aria-label={aberta ? "Recolher menu" : "Expandir menu"}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-brand-painel border border-white/10 text-gray-400 hover:text-brand-acao flex items-center justify-center text-[0.6rem] transition-colors"
      >
        <i className={aberta ? "fa-solid fa-chevron-left" : "fa-solid fa-chevron-right"} />
      </button>
    </aside>
  );
}

export default BarraLateral;

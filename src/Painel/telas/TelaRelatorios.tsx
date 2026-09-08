import type { Relatorio, ResumoAula } from "../services/aulaService";

type Props = {
  aulas: ResumoAula[];
  carregandoAulas: boolean;
  selecionada: string | null;
  relatorios: Relatorio[];
  carregandoRelatorios: boolean;
  aoSelecionar: (aulaId: string) => void;
};

const data = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });

const ROTULO_ESCLARECIDA = {
  SIM: "Esclarecida",
  PARCIAL: "Parcial",
  NAO: "Não esclarecida",
};

function TelaRelatorios({
  aulas,
  carregandoAulas,
  selecionada,
  relatorios,
  carregandoRelatorios,
  aoSelecionar,
}: Props) {
  return (
    <div className="animate-fade-in flex gap-8 h-full min-h-0">
      <div className="w-52 shrink-0 overflow-y-auto">
        <p className="text-[0.65rem] uppercase tracking-widest text-gray-500 dark:text-brand-light/40 mb-3">
          Aulas
        </p>

        {carregandoAulas && (
          <div className="animate-pulse space-y-4" aria-label="Carregando aulas">
            {["w-32", "w-40", "w-28", "w-36"].map((largura, indice) => (
              <div key={indice} className="space-y-2">
                <div className={`h-4 ${largura} rounded bg-gray-300 dark:bg-white/10`} />
                <div className="h-3 w-14 rounded bg-gray-200 dark:bg-white/[0.06]" />
              </div>
            ))}
          </div>
        )}

        {!carregandoAulas && aulas.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-brand-light/30">
            Nenhuma aula ainda.
          </p>
        )}

        <div className={`flex flex-col items-start gap-2 ${carregandoAulas ? "hidden" : ""}`}>
          {aulas.map((aula, indice) => (
            <button
              key={aula.id}
              type="button"
              onClick={() => aoSelecionar(aula.id)}
              style={{ animationDelay: `${(indice + 1) * 60}ms` }}
              className={`animate-cascata text-left transition-colors ${
                selecionada === aula.id
                  ? "text-brand-ocre dark:text-brand-amarelo"
                  : selecionada
                    ? "text-brand-tinta dark:text-white"
                    : "text-brand-tinta dark:text-white hover:text-brand-ocre dark:hover:text-brand-amarelo"
              }`}
            >
              <span className="block font-display font-semibold text-sm leading-snug">
                {aula.disciplina.nome}
              </span>
              <span className="block text-xs text-gray-500 dark:text-brand-light/40">
                {data(aula.abertaEm)}
                {aula.fechadaEm ? "" : " · aberta"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-w-0 overflow-y-auto">
        {carregandoRelatorios && (
          <div className="animate-pulse space-y-4" aria-label="Carregando relatórios">
            {[0, 1, 2].map((item) => (
              <div key={item} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 space-y-3">
                <div className="h-5 w-40 rounded bg-gray-300 dark:bg-white/10" />
                <div className="h-3 w-28 rounded bg-gray-200 dark:bg-white/[0.06]" />
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-white/[0.06]" />
              </div>
            ))}
          </div>
        )}

        {!carregandoAulas && !selecionada && (
          <p className="text-sm text-gray-400 dark:text-brand-light/30">
            Escolha uma aula para ver os relatórios.
          </p>
        )}

        {selecionada && !carregandoRelatorios && relatorios.length === 0 && (
          /* A class with no reports is a class where nobody asked anything, or one
          that is still open: the reports are only written when it is finished. */
          <p className="text-sm text-gray-400 dark:text-brand-light/30">
            Nenhum relatório nesta aula.
          </p>
        )}

        <div className={`flex flex-col gap-4 ${carregandoRelatorios ? "hidden" : ""}`}>
          {relatorios.map((relatorio, indice) => (
            <div
              key={relatorio.id}
              style={{ animationDelay: `${(indice + 1) * 70}ms` }}
              className="animate-cascata rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-5"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display font-semibold text-brand-tinta dark:text-white">
                  {relatorio.aluno.nome}
                </h3>
                <span className="shrink-0 text-xs text-gray-500 dark:text-brand-light/40">
                  {ROTULO_ESCLARECIDA[relatorio.esclarecida]}
                </span>
              </div>

              {relatorio.temas.length > 0 && (
                <p className="text-xs text-gray-500 dark:text-brand-light/50 mt-1">
                  {relatorio.temas.join(" · ")}
                </p>
              )}

              <p className="text-sm text-brand-tinta/80 dark:text-brand-light/70 mt-3 leading-relaxed">
                {relatorio.observacoes}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TelaRelatorios;

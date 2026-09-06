import type { AulaAberta, AulaAtual, Disciplina } from "../services/aulaService";

type Props = {
  disciplinas: Disciplina[];
  aulaAtual: AulaAtual | null;
  aulaAberta: AulaAberta | null;
  escolhida: string;
  agindo: boolean;
  confirmando: boolean;
  aoEscolher: (id: string) => void;
  aoIniciar: () => void;
  aoConfirmar: () => void;
  aoCancelar: () => void;
  aoAlternarPausa: () => void;
  aoFinalizar: () => void;
};

const horario = (iso: string) =>
  new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

function TelaAula({
  disciplinas,
  aulaAtual,
  aulaAberta,
  escolhida,
  agindo,
  confirmando,
  aoEscolher,
  aoIniciar,
  aoConfirmar,
  aoCancelar,
  aoAlternarPausa,
  aoFinalizar,
}: Props) {
  if (aulaAtual) {
    return (
      <div className="animate-fade-in">
        <p className="text-[0.65rem] uppercase tracking-widest text-gray-500 dark:text-brand-light/40 mb-2">
          {aulaAtual.pausada ? "Aula pausada" : "Aula em andamento"}
        </p>
        <h2 className="font-display font-bold text-3xl text-brand-tinta dark:text-white">
          {aulaAtual.disciplina}
        </h2>
        <p className="text-sm text-gray-500 dark:text-brand-light/50 mt-1">
          Aberta às {horario(aulaAtual.abertaEm)}
          {aulaAberta?.professor ? ` por ${aulaAberta.professor}` : ""}
        </p>

        {/* Pausing only stops the Braz from answering; the conversation stays in
        Redis and the reports are not written until the class is finished. */}
        <p className="text-sm text-gray-500 dark:text-brand-light/50 mt-6 max-w-md">
          {aulaAtual.pausada
            ? "O Braz não está respondendo os alunos. Retome quando quiser voltar."
            : "O Braz está respondendo os alunos desta turma."}
        </p>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            type="button"
            onClick={aoAlternarPausa}
            disabled={agindo}
            className="rounded-full border border-brand-tinta dark:border-white/20 px-6 py-2.5 font-display font-semibold text-sm text-brand-tinta dark:text-white hover:bg-brand-tinta hover:text-white dark:hover:bg-white/10 disabled:opacity-40 transition-colors"
          >
            {aulaAtual.pausada ? "Retomar aula" : "Pausar aula"}
          </button>

          <button
            type="button"
            onClick={aoFinalizar}
            disabled={agindo}
            className="rounded-full bg-brand-tinta dark:bg-brand-acao px-6 py-2.5 font-display font-semibold text-sm text-white dark:text-black hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            {agindo ? "Finalizando..." : "Finalizar e gerar relatórios"}
          </button>
        </div>

        <p className="text-xs text-gray-400 dark:text-brand-light/30 mt-4 max-w-md">
          Finalizar encerra a aula para todos e escreve os relatórios. Não tem
          volta.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="font-display font-bold text-3xl text-brand-tinta dark:text-white">
        Abrir uma aula
      </h2>
      <p className="text-sm text-gray-500 dark:text-brand-light/50 mt-1 mb-6">
        Escolha a disciplina desta aula.
      </p>

      <div className="flex flex-col items-start gap-1 min-h-[10rem]">
        {disciplinas.map((disciplina) => (
          <button
            key={disciplina.id}
            type="button"
            onClick={() => aoEscolher(disciplina.id)}
            className={`font-display font-bold text-2xl transition-all py-1.5 ${
              escolhida === disciplina.id
                ? "text-brand-ocre dark:text-brand-amarelo translate-x-2"
                : "text-brand-tinta dark:text-white hover:text-brand-ocre dark:hover:text-brand-amarelo hover:translate-x-2"
            }`}
          >
            {disciplina.nome}
          </button>
        ))}
      </div>

      {/* Opening a class closes whatever class is open, whoever opened it, and writes
      its reports. She has to see whose class that is before the click. */}
      {confirmando && aulaAberta && (
        <div className="mt-6 rounded-2xl border border-brand-ocre/40 dark:border-brand-amarelo/30 bg-brand-ocre/5 dark:bg-brand-amarelo/5 p-5 max-w-md">
          <p className="text-sm text-brand-tinta dark:text-brand-light">
            {aulaAberta.professor} está com uma aula de {aulaAberta.disciplina}{" "}
            aberta agora. Abrir a sua encerra aquela e gera os relatórios dela.
          </p>
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={aoCancelar}
              className="rounded-full border border-gray-300 dark:border-white/20 px-5 py-2 text-sm text-brand-tinta dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={aoConfirmar}
              disabled={agindo}
              className="rounded-full bg-brand-tinta dark:bg-brand-acao px-5 py-2 font-display font-semibold text-sm text-white dark:text-black hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              {agindo ? "Abrindo..." : "Encerrar aquela e abrir a minha"}
            </button>
          </div>
        </div>
      )}

      {!confirmando && (
        <button
          type="button"
          onClick={aoIniciar}
          disabled={!escolhida || agindo}
          className="mt-6 rounded-full bg-brand-tinta dark:bg-brand-acao px-6 py-2.5 font-display font-semibold text-sm text-white dark:text-black hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {agindo ? "Abrindo..." : "Iniciar aula"}
        </button>
      )}
    </div>
  );
}

export default TelaAula;

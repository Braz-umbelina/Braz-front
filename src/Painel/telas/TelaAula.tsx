import { useEffect, useState } from "react";
import OndaProfessora from "../../components/OndaProfessora";
import type { AulaAberta, AulaAtual, Disciplina } from "../services/aulaService";

type Props = {
  disciplinas: Disciplina[];
  carregando: boolean;
  aulaAtual: AulaAtual | null;
  aulaAberta: AulaAberta | null;
  escolhida: string;
  agindo: boolean;
  acao: string | null;
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

const duracao = (iso: string) => {
  const minutos = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutos < 1) return "agora há pouco";
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return resto === 0 ? `há ${horas}h` : `há ${horas}h${resto}`;
};

const CLASSE_BOTAO_PAINEL =
  "w-full rounded-full bg-brand-acao px-6 py-3 font-display font-semibold text-base text-black hover:bg-transparent hover:text-white border border-brand-acao disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-brand-acao disabled:hover:text-black transition-all";

const CLASSE_BOTAO_VAZADO =
  "w-full rounded-full border border-white/30 px-6 py-3 font-display font-semibold text-base text-white hover:bg-white/10 disabled:opacity-40 transition-colors";

function TelaAula({
  disciplinas,
  carregando,
  aulaAtual,
  aulaAberta,
  escolhida,
  agindo,
  acao,
  confirmando,
  aoEscolher,
  aoIniciar,
  aoConfirmar,
  aoCancelar,
  aoAlternarPausa,
  aoFinalizar,
}: Props) {
  const [, redesenhar] = useState(0);

  useEffect(() => {
    if (!aulaAtual) return;
    const id = setInterval(() => redesenhar((n) => n + 1), 60000);
    return () => clearInterval(id);
  }, [aulaAtual]);

  if (carregando) {
    return (
      <div className="relative flex-1 min-w-0 flex overflow-hidden">
        <OndaProfessora />
        <div
          className="hidden lg:block absolute inset-y-0 right-0 left-[47%] bg-brand-mata"
          style={{ clipPath: "url(#ondaProfessora)" }}
          aria-hidden="true"
        />
        <main className="relative z-10 w-full lg:w-[46%] pt-24 px-8 lg:px-12">
          <div className="animate-pulse space-y-4" aria-label="Carregando painel">
            <div className="h-9 w-48 rounded-lg bg-gray-300 dark:bg-white/10" />
            <div className="h-4 w-64 rounded bg-gray-200 dark:bg-white/[0.06]" />
            <div className="pt-4 space-y-3">
              <div className="h-7 w-40 rounded bg-gray-300 dark:bg-white/10" />
              <div className="h-7 w-56 rounded bg-gray-300 dark:bg-white/10" />
              <div className="h-7 w-44 rounded bg-gray-300 dark:bg-white/10" />
            </div>
          </div>
        </main>
        <div className="hidden lg:flex absolute inset-y-0 right-0 w-[36%] items-center px-8 xl:px-12">
          <div className="w-full animate-pulse space-y-4" aria-hidden="true">
            <div className="h-3 w-32 rounded bg-white/10" />
            <div className="h-10 w-56 rounded-lg bg-white/10" />
            <div className="h-4 w-full max-w-sm rounded bg-white/10" />
            <div className="h-12 w-full max-w-sm rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 min-w-0 flex overflow-hidden">
      <OndaProfessora />

      {/* Same fold as her login screen: the panel carries the state of the class and
      the buttons, and the left side is only the choice. */}
      <div
        className="hidden lg:block absolute inset-y-0 right-0 left-[47%] bg-brand-mata"
        style={{ clipPath: "url(#ondaProfessora)" }}
        aria-hidden="true"
      />

      <main
        key={aulaAtual ? "com-aula" : "sem-aula"}
        className="relative z-10 w-full lg:w-[46%] flex flex-col justify-start pt-24 px-8 lg:px-12 pb-8 animate-fade-in"
      >
        <h2 className="font-display font-bold text-3xl text-brand-tinta dark:text-white">
          {aulaAtual ? "Suas disciplinas" : "Abrir uma aula"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-brand-light/50 mt-1 mb-6">
          {aulaAtual
            ? "Encerre a aula atual para abrir outra."
            : "Escolha a disciplina desta aula."}
        </p>

        <div className="flex flex-col items-start gap-1 min-h-[10rem]">
          {disciplinas.map((disciplina) => (
            <button
              key={disciplina.id}
              type="button"
              onClick={() => aoEscolher(disciplina.id)}
              disabled={aulaAtual !== null}
              className={`font-display font-bold text-2xl text-left transition-all py-1.5 ${
                aulaAtual
                  ? aulaAtual.disciplina === disciplina.nome
                    ? "text-brand-ocre dark:text-brand-amarelo cursor-default"
                    : "text-brand-tinta/40 dark:text-white/30 cursor-default"
                  : escolhida === disciplina.id
                    ? "text-brand-ocre dark:text-brand-amarelo translate-x-2"
                    : escolhida
                      ? "text-brand-tinta dark:text-white"
                      : "text-brand-tinta dark:text-white hover:text-brand-ocre dark:hover:text-brand-amarelo hover:translate-x-2"
              }`}
            >
              {disciplina.nome}
            </button>
          ))}
        </div>
      </main>

      <div
        key={aulaAtual ? "aberta" : "livre"}
        className="hidden lg:flex absolute inset-y-0 right-0 w-[36%] flex-col justify-center px-8 xl:px-12 animate-fade-in"
      >
        {aulaAtual ? (
          <>
            <p className="text-[0.65rem] uppercase tracking-widest text-brand-light/40 mb-2">
              {aulaAtual.pausada ? "Aula pausada" : "Aula em andamento"}
            </p>
            <h3 className="font-display font-bold text-3xl xl:text-4xl leading-tight text-white">
              {aulaAtual.disciplina}
            </h3>
            <p className="text-base text-brand-light/50 mt-1">
              Aberta às {horario(aulaAtual.abertaEm)} &middot;{" "}
              {duracao(aulaAtual.abertaEm)}
            </p>

            <p className="text-base text-brand-light/60 mt-5 mb-6 min-h-[3.5rem]">
              {aulaAtual.pausada
                ? "O histórico da turma é preservado durante a pausa."
                : "A pausa suspende as respostas do Braz mas não encerra a aula."}
            </p>

            <div className="flex flex-col gap-3 max-w-sm">
              <button
                type="button"
                onClick={aoAlternarPausa}
                disabled={agindo}
                className={CLASSE_BOTAO_VAZADO}
              >
                {aulaAtual.pausada ? "Retomar aula" : "Pausar aula"}
              </button>

              <button
                type="button"
                onClick={aoFinalizar}
                disabled={agindo}
                className={CLASSE_BOTAO_PAINEL}
              >
                {acao === "finalizar" ? "Finalizando..." : "Finalizar aula"}
              </button>
            </div>

            <p className="text-xs text-brand-light/30 mt-4 max-w-sm text-center">
              O encerramento é definitivo e gera os relatórios da turma.
            </p>
          </>
        ) : (
          <>
            <p className="text-[0.65rem] uppercase tracking-widest text-brand-light/40 mb-2">
              Nenhuma aula aberta
            </p>
            <h3 className="font-display font-bold text-3xl xl:text-4xl leading-tight text-white min-h-[4rem]">
              Pronta para
              <br />
              começar.
            </h3>
            <p className="text-base text-brand-light/60 mt-4 mb-6 max-w-sm min-h-[3.5rem]">
              Os alunos acessam o Braz somente durante a aula. Ao encerrar, é
              gerado um relatório individual por aluno participante.
            </p>

            {/* Opening a class closes whatever class is open, whoever opened it, and
            writes its reports. She has to see whose class that is before the click. */}
            {confirmando && aulaAberta ? (
              <div className="max-w-sm">
                <p className="text-sm text-brand-amarelo">
                  Há uma aula de {aulaAberta.disciplina} em andamento, aberta
                  por {aulaAberta.professor}. Iniciar uma nova aula encerra a
                  atual e gera os relatórios dela.
                </p>
                <div className="flex flex-col gap-3 mt-4">
                  <button
                    type="button"
                    onClick={aoConfirmar}
                    disabled={agindo}
                    className={CLASSE_BOTAO_PAINEL}
                  >
                    {acao === "abrir"
                      ? "Abrindo..."
                      : "Encerrar a atual e iniciar"}
                  </button>
                  <button
                    type="button"
                    onClick={aoCancelar}
                    className={CLASSE_BOTAO_VAZADO}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-sm">
                <button
                  type="button"
                  onClick={aoIniciar}
                  disabled={!escolhida || agindo}
                  className={CLASSE_BOTAO_PAINEL}
                >
                  {acao === "abrir" || acao === "verificar"
                    ? "Abrindo..."
                    : "Iniciar aula"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TelaAula;

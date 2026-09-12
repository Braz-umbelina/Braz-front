import { useEffect, useState } from "react";
import Alerta from "../components/Alerta";
import BarraTopoMobile from "../components/BarraTopoMobile";
import { ErroDeApi } from "../api/client";
import { aplicarTema, lerTema } from "../tema";
import TelaAula from "./telas/TelaAula";
import TelaRelatorios from "./telas/TelaRelatorios";
import * as aulaService from "./services/aulaService";
import type {
  AulaAberta,
  AulaAtual,
  Disciplina,
  Relatorio,
  ResumoAula,
} from "./services/aulaService";

type Props = {
  token: string;
  aoSair: () => void;
};

type Aba = "aula" | "relatorios";

//-------------- component

function Painel({ token, aoSair }: Props) {
  const [aba, setAba] = useState<Aba>("aula");
  const [tema, setTema] = useState(lerTema);

  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [aulaAtual, setAulaAtual] = useState<AulaAtual | null>(null);
  const [aulaAberta, setAulaAberta] = useState<AulaAberta | null>(null);
  const [carregandoPainel, setCarregandoPainel] = useState(true);
  const [escolhida, setEscolhida] = useState("");
  const [confirmando, setConfirmando] = useState(false);

  const [aulas, setAulas] = useState<ResumoAula[]>([]);
  const [carregandoAulas, setCarregandoAulas] = useState(true);
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [carregandoRelatorios, setCarregandoRelatorios] = useState(false);

  const [gerandoAula, setGerandoAula] = useState<string | null>(null);
  /* Attempts live in memory on purpose: reloading gives her three fresh ones, and by
  then the spike that caused the failure has usually passed. */
  const [falhasPorAula, setFalhasPorAula] = useState<Record<string, number>>({});

  const [acao, setAcao] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  /* The notice clears itself: it reports something that already happened, so leaving
  it on screen only makes her wonder whether it is about the last click or this one. */
  useEffect(() => {
    if (!erro && !aviso) return;
    const id = setTimeout(
      () => {
        setErro(null);
        setAviso(null);
      },
      erro ? 8000 : 5000,
    );
    return () => clearTimeout(id);
  }, [erro, aviso]);

  const trocarTema = () => {
    const novo = tema === "escuro" ? "claro" : "escuro";
    aplicarTema(novo);
    setTema(novo);
  };

  /* Wraps every call so an expired token drops the session in one place instead of
  each button having to know what a 401 means. */
  const chamar = async (nome: string, executar: () => Promise<void>) => {
    setErro(null);
    setAviso(null);
    setAcao(nome);
    try {
      await executar();
    } catch (error) {
      if (error instanceof ErroDeApi && error.status === 401) {
        aoSair();
        return;
      }
      setErro(error instanceof Error ? error.message : "Erro inesperado");
    } finally {
      setAcao(null);
    }
  };

  /* /aula/atual answers null when the class open right now belongs to another
  teacher, so what comes back here is always hers. */
  const carregarEstado = async () => {
    setAulaAtual(await aulaService.buscarAulaAtual(token));
  };

  /* The effects do not go through chamar: it sets state before the first await, and
  that is a cascading render inside an effect. They carry their own try/catch. */
  useEffect(() => {
    const carregar = async () => {
      try {
        const [lista, atual, historico] = await Promise.all([
          aulaService.listarDisciplinas(token),
          aulaService.buscarAulaAtual(token),
          aulaService.listarAulas(token),
        ]);
        setDisciplinas(lista);
        setAulaAtual(atual);
        setAulas(historico);
      } catch (error) {
        if (error instanceof ErroDeApi && error.status === 401) {
          aoSair();
          return;
        }
        setErro(error instanceof Error ? error.message : "Erro inesperado");
      } finally {
        setCarregandoPainel(false);
        setCarregandoAulas(false);
      }
    };
    void carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /* The open class is read again on the click: the one loaded when the panel opened
  may be stale, and acting on it would close a colleague's class with no warning. */
  const iniciar = () =>
    void chamar("verificar", async () => {
      const aberta = await aulaService.buscarAulaAberta();
      setAulaAberta(aberta);
      if (aberta) {
        setConfirmando(true);
        return;
      }
      await aulaService.abrirAula(escolhida, token);
      await carregarEstado();
      setEscolhida("");
    });

  const confirmarInicio = () =>
    chamar("abrir", async () => {
      await aulaService.abrirAula(escolhida, token);
      await carregarEstado();
      setConfirmando(false);
      setEscolhida("");
    });

  const alternarPausa = () => {
    if (!aulaAtual) return;
    void chamar("pausa", async () => {
      if (aulaAtual.pausada) {
        await aulaService.despausarAula(aulaAtual.id, token);
      } else {
        await aulaService.pausarAula(aulaAtual.id, token);
      }
      await carregarEstado();
    });
  };

  const finalizar = () => {
    if (!aulaAtual) return;
    void chamar("finalizar", async () => {
      const dados = await aulaService.fecharAula(aulaAtual.id, token);
      const [, historico] = await Promise.all([
        carregarEstado(),
        aulaService.listarAulas(token),
      ]);
      setAulas(historico);
      setAviso(
        dados.falhas > 0
          ? `Aula encerrada. ${dados.gerados} de ${dados.gerados + dados.falhas} relatórios gerados. Os que faltam ficam disponíveis na aba Relatórios.`
          : `Aula encerrada. ${dados.gerados} relatório(s) gerado(s).`,
      );
    });
  };

  /* The conversation stays in Redis until its report is saved, so this only works on
  whoever is missing one and can be run again without duplicating anything. */
  const gerarRelatorios = (aulaId: string) => {
    setGerandoAula(aulaId);
    void chamar("gerar", async () => {
      const dados = await aulaService.gerarRelatorios(aulaId, token);
      const historico = await aulaService.listarAulas(token);
      setAulas(historico);
      if (selecionada === aulaId) {
        setRelatorios(await aulaService.buscarRelatorios(aulaId, token));
      }
      setFalhasPorAula((atual) => ({
        ...atual,
        [aulaId]: dados.falhas > 0 ? (atual[aulaId] ?? 0) + 1 : 0,
      }));
      setAviso(
        dados.falhas > 0
          ? `${dados.gerados} relatório(s) gerado(s). ${dados.falhas} ainda pendente(s).`
          : `${dados.gerados} relatório(s) gerado(s).`,
      );
    }).finally(() => setGerandoAula(null));
  };

  const voltarParaAulas = () => {
    setSelecionada(null);
    setRelatorios([]);
  };

  const selecionarAula = (aulaId: string) => {
    setSelecionada(aulaId);
    setRelatorios([]);
    setCarregandoRelatorios(true);
    void chamar("relatorios", async () => {
      setRelatorios(await aulaService.buscarRelatorios(aulaId, token));
    }).finally(() => setCarregandoRelatorios(false));
  };

  const classeAbaMobile = (alvo: Aba) =>
    `flex-1 flex flex-col items-center gap-1 py-2.5 text-xs transition-colors ${
      aba === alvo
        ? "text-brand-tinta dark:text-white font-semibold"
        : "text-gray-500 dark:text-brand-light/50"
    }`;

  const classeAba = (alvo: Aba) =>
    `w-full text-left rounded-xl px-3 py-2 text-sm transition-colors ${
      aba === alvo
        ? "bg-gray-100 dark:bg-white/[0.06] text-brand-tinta dark:text-white font-semibold"
        : "text-gray-500 dark:text-brand-light/50 hover:text-brand-tinta dark:hover:text-white"
    }`;

  return (
    <div className="bg-brand-claro text-brand-tinta dark:bg-brand-fundo dark:text-brand-light font-sans h-screen [height:100dvh] flex flex-col lg:flex-row overflow-hidden selection:bg-brand-acao selection:text-black">
      <BarraTopoMobile
        className="lg:hidden"
        tema={tema}
        aoTrocarTema={trocarTema}
        aoSair={aoSair}
      />

      <aside className="relative z-20 shrink-0 h-full w-52 hidden lg:flex flex-col border-r border-gray-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-4">
        <div className="mb-8">
          <img
            src="/images/logo-braz.webp"
            alt="Braz"
            className="h-20 w-auto object-contain object-left dark:hidden"
          />
          <img
            src="/images/logo-escuro-braz.webp"
            alt="Braz"
            className="h-20 w-auto object-contain object-left hidden dark:block"
          />
        </div>

        <nav className="flex flex-col gap-1">
          <button type="button" onClick={() => setAba("aula")} className={classeAba("aula")}>
            Aula
          </button>
          <button
            type="button"
            onClick={() => setAba("relatorios")}
            className={classeAba("relatorios")}
          >
            Relatórios
          </button>
        </nav>

        <div className="mt-auto flex flex-col gap-1">
          <button
            type="button"
            onClick={trocarTema}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-500 dark:text-brand-light/50 hover:text-brand-tinta dark:hover:text-white transition-colors"
          >
            <i className={tema === "escuro" ? "fa-solid fa-sun" : "fa-solid fa-moon"} />
            {tema === "escuro" ? "Tema claro" : "Tema escuro"}
          </button>

          <button
            type="button"
            onClick={aoSair}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-500 dark:text-brand-light/50 hover:text-brand-tinta dark:hover:text-white transition-colors"
          >
            <i className="fa-solid fa-arrow-right-from-bracket" />
            Sair
          </button>
        </div>
      </aside>

      <main className="relative flex-1 min-w-0 flex flex-col overflow-hidden">
        {aba === "aula" ? (
          <TelaAula
            disciplinas={disciplinas}
            carregando={carregandoPainel}
            aulaAtual={aulaAtual}
            aulaAberta={aulaAberta}
            escolhida={escolhida}
            agindo={acao !== null}
            acao={acao}
            confirmando={confirmando}
            aoEscolher={setEscolhida}
            aoIniciar={iniciar}
            aoConfirmar={() => void confirmarInicio()}
            aoCancelar={() => setConfirmando(false)}
            aoAlternarPausa={alternarPausa}
            aoFinalizar={finalizar}
          />
        ) : (
          <div className="flex-1 min-h-0 overflow-hidden p-4 sm:p-6 lg:p-12">
            <TelaRelatorios
              aulas={aulas}
              carregandoAulas={carregandoAulas}
              selecionada={selecionada}
              relatorios={relatorios}
              carregandoRelatorios={carregandoRelatorios}
              aoSelecionar={selecionarAula}
              aoVoltar={voltarParaAulas}
              gerandoAula={gerandoAula}
              falhasPorAula={falhasPorAula}
              aoGerar={gerarRelatorios}
            />
          </div>
        )}

        {(erro || aviso) && (
          <div className="absolute inset-x-0 bottom-0 z-20 px-4 sm:px-6 lg:px-12 pb-4 lg:pb-6">
            {erro && <Alerta texto={erro} tipo="erro" />}
            {aviso && !erro && <Alerta texto={aviso} tipo="aviso" />}
          </div>
        )}
      </main>

      <nav className="lg:hidden shrink-0 flex border-t border-gray-200 dark:border-white/5">
        <button type="button" onClick={() => setAba("aula")} className={classeAbaMobile("aula")}>
          <i className="fa-solid fa-chalkboard-user" aria-hidden="true" />
          Aula
        </button>
        <button
          type="button"
          onClick={() => setAba("relatorios")}
          className={classeAbaMobile("relatorios")}
        >
          <i className="fa-solid fa-file-lines" aria-hidden="true" />
          Relatórios
        </button>
      </nav>
    </div>
  );
}

export default Painel;

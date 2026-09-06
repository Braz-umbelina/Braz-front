import { useEffect, useState } from "react";
import Alerta from "../components/Alerta";
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
  const [escolhida, setEscolhida] = useState("");
  const [confirmando, setConfirmando] = useState(false);

  const [aulas, setAulas] = useState<ResumoAula[]>([]);
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [carregandoRelatorios, setCarregandoRelatorios] = useState(false);

  const [agindo, setAgindo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const trocarTema = () => {
    const novo = tema === "escuro" ? "claro" : "escuro";
    aplicarTema(novo);
    setTema(novo);
  };

  /* Wraps every call so an expired token drops the session in one place instead of
  each button having to know what a 401 means. */
  const chamar = async (acao: () => Promise<void>) => {
    setErro(null);
    setAviso(null);
    setAgindo(true);
    try {
      await acao();
    } catch (error) {
      if (error instanceof ErroDeApi && error.status === 401) {
        aoSair();
        return;
      }
      setErro(error instanceof Error ? error.message : "Erro inesperado");
    } finally {
      setAgindo(false);
    }
  };

  /* The open class is read from two routes: /aula/atual carries the id the buttons
  need, and /aula/aberta carries the teacher's name, which is what tells her whether
  the class open right now is hers. */
  const carregarEstado = async () => {
    const [atual, aberta] = await Promise.all([
      aulaService.buscarAulaAtual(token),
      aulaService.buscarAulaAberta(),
    ]);
    setAulaAtual(atual);
    setAulaAberta(aberta);
  };

  /* The effects do not go through chamar: it sets state before the first await, and
  that is a cascading render inside an effect. They carry their own try/catch. */
  useEffect(() => {
    const carregar = async () => {
      try {
        const [lista, atual, aberta] = await Promise.all([
          aulaService.listarDisciplinas(token),
          aulaService.buscarAulaAtual(token),
          aulaService.buscarAulaAberta(),
        ]);
        setDisciplinas(lista);
        setAulaAtual(atual);
        setAulaAberta(aberta);
      } catch (error) {
        if (error instanceof ErroDeApi && error.status === 401) {
          aoSair();
          return;
        }
        setErro(error instanceof Error ? error.message : "Erro inesperado");
      }
    };
    void carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (aba !== "relatorios") return;
    const carregar = async () => {
      try {
        setAulas(await aulaService.listarAulas(token));
      } catch (error) {
        if (error instanceof ErroDeApi && error.status === 401) {
          aoSair();
          return;
        }
        setErro(error instanceof Error ? error.message : "Erro inesperado");
      }
    };
    void carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aba, token]);

  const iniciar = () => {
    if (aulaAberta) {
      setConfirmando(true);
      return;
    }
    void confirmarInicio();
  };

  const confirmarInicio = () =>
    chamar(async () => {
      await aulaService.abrirAula(escolhida, token);
      await carregarEstado();
      setConfirmando(false);
      setEscolhida("");
    });

  const alternarPausa = () => {
    if (!aulaAtual) return;
    void chamar(async () => {
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
    void chamar(async () => {
      const dados = await aulaService.fecharAula(aulaAtual.id, token);
      await carregarEstado();
      setAviso(
        `Aula encerrada. ${dados.gerados} relatório(s) gerado(s)` +
          (dados.falhas > 0 ? `, ${dados.falhas} falha(s).` : "."),
      );
    });
  };

  const selecionarAula = (aulaId: string) => {
    setSelecionada(aulaId);
    setRelatorios([]);
    setCarregandoRelatorios(true);
    void chamar(async () => {
      setRelatorios(await aulaService.buscarRelatorios(aulaId, token));
    }).finally(() => setCarregandoRelatorios(false));
  };

  const classeAba = (alvo: Aba) =>
    `w-full text-left rounded-xl px-3 py-2 text-sm transition-colors ${
      aba === alvo
        ? "bg-gray-100 dark:bg-white/[0.06] text-brand-tinta dark:text-white font-semibold"
        : "text-gray-500 dark:text-brand-light/50 hover:text-brand-tinta dark:hover:text-white"
    }`;

  return (
    <div className="bg-brand-claro text-brand-tinta dark:bg-brand-preto dark:text-brand-light font-sans h-screen flex overflow-hidden selection:bg-brand-acao selection:text-black">
      <aside className="relative z-20 shrink-0 h-full w-52 flex flex-col border-r border-gray-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-4">
        <div className="flex items-center gap-3 mb-8">
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
          <span className="font-display font-bold text-lg text-brand-tinta dark:text-white">
            Braz
          </span>
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

      <main className="flex-1 min-w-0 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-3xl h-full flex flex-col">
          {aba === "aula" ? (
            <TelaAula
              disciplinas={disciplinas}
              aulaAtual={aulaAtual}
              aulaAberta={aulaAberta}
              escolhida={escolhida}
              agindo={agindo}
              confirmando={confirmando}
              aoEscolher={setEscolhida}
              aoIniciar={iniciar}
              aoConfirmar={() => void confirmarInicio()}
              aoCancelar={() => setConfirmando(false)}
              aoAlternarPausa={alternarPausa}
              aoFinalizar={finalizar}
            />
          ) : (
            <TelaRelatorios
              aulas={aulas}
              selecionada={selecionada}
              relatorios={relatorios}
              carregandoRelatorios={carregandoRelatorios}
              aoSelecionar={selecionarAula}
            />
          )}

          {erro && <Alerta texto={erro} tipo="erro" />}
          {aviso && !erro && <Alerta texto={aviso} tipo="aviso" />}
        </div>
      </main>
    </div>
  );
}

export default Painel;

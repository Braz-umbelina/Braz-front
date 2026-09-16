import { useEffect, useRef, useState } from "react";
import { ErroDeApi } from "../api/client";
import BarraTopoMobile from "../components/BarraTopoMobile";
import { aplicarTema, lerTema } from "../tema";
import BarraLateral from "./components/BarraLateral";
import CampoMensagem from "./components/CampoMensagem";
import Mensagem, { Digitando, type DadosMensagem } from "./components/Mensagem";
import { buscarAulaAberta, type Aula } from "./services/aulaService";
import { buscarHistorico, enviarMensagem } from "./services/chatService";

type Props = {
  token: string;
  aoSair: () => void;
};


function Chat({ token, aoSair }: Props) {
  const [mensagens, setMensagens] = useState<DadosMensagem[]>([]);
  const [tema, setTema] = useState(lerTema);
  const [aula, setAula] = useState<Aula | null>(null);
  const [sincronizado, setSincronizado] = useState(false);
  const [avisoConexao, setAvisoConexao] = useState<string | null>(null);
  const [aulaCarregada, setAulaCarregada] = useState(false);
  const geracaoConversa = useRef(0);
  const envioEmCurso = useRef(false);
  const podeEnviarRef = useRef(false);
  const [input, setInput] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const listaRef = useRef<HTMLElement>(null);

  const trocarTema = () => {
    const novo = tema === "escuro" ? "claro" : "escuro";
    aplicarTema(novo);
    setTema(novo);
  };

  useEffect(() => {
    const quadro = requestAnimationFrame(() => {
      const lista = listaRef.current;
      if (!lista) return;
      lista.scrollTo({ top: lista.scrollHeight, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(quadro);
  }, [mensagens, enviando]);

  useEffect(() => {
    const invalidarConversa = () => { geracaoConversa.current++; };
    let ativo = true;
    let conectado = true;
    let primeiroEvento = true;
    let versao = 0;
    let executando = false;
    let inicializado = false;
    let anterior: Aula | null = null;
    let repetir: ReturnType<typeof setTimeout> | undefined;
    let reconectar: ReturnType<typeof setTimeout> | undefined;
    let tentativas = 0;
    let eventos: EventSource | undefined;

    const sincronizar = async () => {
      if (executando || !ativo || !conectado) return;
      executando = true;
      const atual = versao;
      const primeiraCarga = !inicializado;
      const historicoAdiantado = primeiraCarga ? buscarHistorico(token) : null;
      historicoAdiantado?.catch(() => {});
      try {
        const dados = await buscarAulaAberta();
        if (!ativo || !conectado || atual !== versao) return;
        const mudouConversa = !inicializado ||
          Boolean(dados) !== Boolean(anterior) ||
          dados?.disciplina !== anterior?.disciplina ||
          dados?.professor !== anterior?.professor;
        setAula(dados);
        if (mudouConversa) {
          invalidarConversa();
          setMensagens([]);
          setErro(null);
          if (inicializado) setInput("");
          const historico = dados
            ? await (historicoAdiantado ?? buscarHistorico(token))
            : [];
          if (!ativo || !conectado || atual !== versao) return;
          setMensagens(historico.length ? historico.map((turno) => ({
            role: turno.role === "user" ? "aluno" : "braz",
            texto: turno.text,
          })) : [{
            role: "braz",
            texto: dados
              ? "Olá! Alguma dúvida sobre " + dados.disciplina + " hoje?"
              : "Olá! No momento não há nenhuma aula aberta.",
          }]);
        }
        anterior = dados;
        inicializado = true;
        podeEnviarRef.current = Boolean(dados && !dados.pausada);
        setSincronizado(true);
        setAvisoConexao(null);
        setAulaCarregada(true);
      } catch (error) {
        if (!ativo || atual !== versao) return;
        podeEnviarRef.current = false;
        setSincronizado(false);
        if (error instanceof ErroDeApi && error.status === 401) {
          aoSair();
          return;
        }
        setAvisoConexao("Não foi possível atualizar o chat. Tentando novamente...");
        let espera = 5000 + Math.random() * 2000;
        if (
          error instanceof ErroDeApi &&
          error.status === 429 &&
          error.aguardeSegundos
        ) {
          espera = error.aguardeSegundos * 1000 + Math.random() * 3000;
        }
        repetir = setTimeout(() => void sincronizar(), espera);
      } finally {
        executando = false;
        if (ativo && conectado && atual !== versao) void sincronizar();
      }
    };

    const atualizar = () => {
      conectado = true;
      if (primeiroEvento) {
        primeiroEvento = false;
        if (executando || inicializado) return;
      }
      versao++;
      clearTimeout(repetir);
      podeEnviarRef.current = false;
      setSincronizado(false);
      setAvisoConexao(null);
      void sincronizar();
    };
    const conectar = () => {
      eventos = new EventSource(
        import.meta.env.VITE_API_URL + "/aula/eventos",
      );
      eventos.addEventListener("aula-atualizada", atualizar);
      eventos.onopen = () => {
        tentativas = 0;
      };
      eventos.onerror = () => {
        conectado = false;
        versao++;
        clearTimeout(repetir);
        podeEnviarRef.current = false;
        setSincronizado(false);
        setAvisoConexao("Conexão interrompida. Reconectando ao chat...");
        if (!ativo || eventos?.readyState !== EventSource.CLOSED) return;
        const espera =
          Math.min(3000 * 2 ** tentativas, 30000) + Math.random() * 2000;
        tentativas++;
        clearTimeout(reconectar);
        reconectar = setTimeout(conectar, espera);
      };
    };

    conectar();
    void sincronizar();
    return () => {
      ativo = false;
      podeEnviarRef.current = false;
      invalidarConversa();
      clearTimeout(repetir);
      clearTimeout(reconectar);
      eventos?.close();
    };
  }, [token, aoSair]);

  const bloqueado = !sincronizado || !aula || aula.pausada;
  const aviso = !sincronizado && avisoConexao ? avisoConexao
    : !aula ? null
    : aula.pausada ? "Aula pausada pela professora."
    : null;

  const perguntar = async () => {
    const texto = input.trim();
    if (!texto || envioEmCurso.current || !podeEnviarRef.current) return;
    envioEmCurso.current = true;
    const geracao = geracaoConversa.current;

    setMensagens((atual) => [...atual, { role: "aluno", texto }]);
    setInput("");
    setErro(null);
    setEnviando(true);

    try {
      const resposta = await enviarMensagem(texto, token);
      if (geracao !== geracaoConversa.current) return;
      setMensagens((atual) => [...atual, { role: "braz", texto: resposta }]);
    } catch (error) {
      if (geracao !== geracaoConversa.current) return;
      if (error instanceof ErroDeApi && error.status === 401) {
        aoSair();
        return;
      }
      setErro(
        error instanceof Error ? error.message : "Erro ao falar com o Braz",
      );
    } finally {
      envioEmCurso.current = false;
      setEnviando(false);
    }
  };

  return (
    <div className="bg-brand-claro text-brand-tinta dark:bg-brand-fundo dark:text-brand-light font-sans h-full flex flex-col sm:flex-row relative overflow-hidden selection:bg-brand-acao selection:text-black">
      <div className="pointer-events-none absolute -top-[28rem] -left-[28rem] w-[70rem] h-[70rem] rounded-full bg-white dark:bg-white/[0.06] blur-[180px]" />

      <BarraTopoMobile
        className="sm:hidden relative z-20"
        tema={tema}
        aoTrocarTema={trocarTema}
        aoSair={aoSair}
      />
      <BarraLateral tema={tema} aoTrocarTema={trocarTema} aoSair={aoSair} />

      <div className="relative flex-1 flex flex-col min-w-0 lg:-ml-16">
        <div className="absolute top-4 right-6 z-10 text-right hidden sm:block pointer-events-none">
          {aula && (
            <>
              <p className="text-[0.65rem] text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                {aula.professor ? `Professora ${aula.professor}` : ""}
              </p>
              <p className="text-xs font-semibold text-brand-tinta dark:text-brand-light">
                {aula.disciplina}
              </p>
            </>
          )}
        </div>

        <main
          ref={listaRef}
          className={aula || !aulaCarregada
            ? "flex-1 min-h-0 overflow-y-auto p-4 md:p-8 flex flex-col gap-8 max-w-3xl mx-auto w-full"
            : "absolute inset-0 overflow-y-auto p-4 md:p-8 flex flex-col max-w-3xl mx-auto w-full"}
        >
          {!aulaCarregada ? (
            <div className="flex flex-col gap-8" aria-label="Carregando a conversa">
              <div className="animate-pulse space-y-2 max-w-md">
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-white/[0.06]" />
                <div className="h-4 w-4/5 rounded bg-gray-200 dark:bg-white/[0.06]" />
              </div>
              <div className="animate-pulse self-end h-11 w-40 rounded-2xl bg-gray-300 dark:bg-white/10" />
              <div className="animate-pulse space-y-2 max-w-sm">
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-white/[0.06]" />
                <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-white/[0.06]" />
              </div>
              <div className="animate-pulse self-end h-11 w-52 rounded-2xl bg-gray-300 dark:bg-white/10" />
              <div className="animate-pulse space-y-2 max-w-lg">
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-white/[0.06]" />
                <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-white/[0.06]" />
              </div>
              {avisoConexao && (
                <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                  {avisoConexao}
                </p>
              )}
            </div>
          ) : !aula ? (
            <section className="flex-1 flex flex-col items-center justify-center gap-5 sm:gap-7 py-10 px-2 text-center" aria-label="Espera pela aula">
              <img
                src="/images/logo-braz.webp"
                alt="Braz"
                className="h-16 sm:h-24 lg:h-32 object-contain -translate-x-[2.5%] dark:hidden"
              />
              <img
                src="/images/logo-escuro-braz.webp"
                alt="Braz"
                className="hidden h-16 sm:h-24 lg:h-32 object-contain -translate-x-[2.5%] dark:block"
              />
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight">
                Aguardando o início da aula.
              </h1>
              <p className="max-w-lg text-sm sm:text-base lg:text-lg text-gray-800 dark:text-gray-400 leading-relaxed">
                Nenhuma aula aberta no momento. Quando a professora iniciar, seu chat será liberado automaticamente.
              </p>
            </section>
          ) : (
            <>
              {mensagens.map((mensagem, indice) => (
                <Mensagem key={indice} mensagem={mensagem} />
              ))}
              {enviando && <Digitando />}
            </>
          )}
          {erro && (
            <div
              role="alert"
              className="max-w-3xl w-full animate-fade-in border-l-2 border-red-400 dark:border-red-800 pl-4"
            >
              <p className="text-red-700 dark:text-red-400 leading-relaxed">
                {erro}
              </p>
            </div>
          )}
        </main>

        {!aulaCarregada && (
          <div className="relative z-10 mt-auto shrink-0 w-full px-4 pt-6 pb-5">
            <div className="max-w-3xl mx-auto animate-pulse">
              <div className="h-12 rounded-2xl bg-gray-200 dark:bg-white/[0.06]" />
            </div>
          </div>
        )}

        {aulaCarregada && aula && (
          <div className="animate-cascata relative z-10 mt-auto shrink-0">
            <CampoMensagem
              valor={input}
              enviando={enviando}
              bloqueado={bloqueado}
              aviso={aviso}
              pausada={Boolean(aula.pausada) && !avisoConexao}
              placeholder={aula.pausada ? "Envio pausado pela professora"
                : "Pergunte ao Braz..."}
              aoMudar={setInput}
              aoEnviar={() => void perguntar()}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;

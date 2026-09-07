import { useEffect, useRef, useState } from "react";
import { ErroDeApi } from "../api/client";
import BarraLateral from "./components/BarraLateral";
import CampoMensagem from "./components/CampoMensagem";
import Mensagem, { Digitando, type DadosMensagem } from "./components/Mensagem";
import { buscarAulaAberta, type Aula } from "./services/aulaService";
import { buscarHistorico, enviarMensagem } from "./services/chatService";

type Props = {
  token: string;
  aoSair: () => void;
};

//-------------- component

function Chat({ token, aoSair }: Props) {
  const [mensagens, setMensagens] = useState<DadosMensagem[]>([]);
  const [aula, setAula] = useState<Aula | null>(null);
  const [sincronizado, setSincronizado] = useState(false);
  const [avisoConexao, setAvisoConexao] = useState("Verificando a aula...");
  const geracaoConversa = useRef(0);
  const envioEmCurso = useRef(false);
  const podeEnviarRef = useRef(false);
  const [input, setInput] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const listaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    //Wait for layout before scrolling to the last message
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
    let conectado = false;
    let versao = 0;
    let executando = false;
    let inicializado = false;
    let anterior: Aula | null = null;
    let repetir: ReturnType<typeof setTimeout> | undefined;
    const eventos = new EventSource(import.meta.env.VITE_API_URL + "/aula/eventos");

    const sincronizar = async () => {
      if (executando || !ativo || !conectado) return;
      executando = true;
      const atual = versao;
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
          const historico = dados ? await buscarHistorico(token) : [];
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
      } catch (error) {
        if (!ativo || atual !== versao) return;
        podeEnviarRef.current = false;
        setSincronizado(false);
        setAvisoConexao("Não foi possível atualizar o chat. Tentando novamente...");
        if (error instanceof ErroDeApi && error.status === 401) {
          setAvisoConexao("Sua sessão expirou. Saia e entre novamente.");
          return;
        }
        repetir = setTimeout(() => void sincronizar(), 5000);
      } finally {
        executando = false;
        //Fetch again if another event arrived during the request
        if (ativo && conectado && atual !== versao) void sincronizar();
      }
    };

    const atualizar = () => {
      conectado = true;
      versao++;
      clearTimeout(repetir);
      podeEnviarRef.current = false;
      setSincronizado(false);
      setAvisoConexao("Atualizando a aula...");
      void sincronizar();
    };
    eventos.addEventListener("aula-atualizada", atualizar);
    eventos.onerror = () => {
      conectado = false;
      versao++;
      clearTimeout(repetir);
      podeEnviarRef.current = false;
      setSincronizado(false);
      setAvisoConexao("Conexão interrompida. Reconectando ao chat...");
    };
    return () => {
      ativo = false;
      podeEnviarRef.current = false;
      invalidarConversa();
      clearTimeout(repetir);
      eventos.close();
    };
  }, [token]);

  const bloqueado = !sincronizado || !aula || aula.pausada;
  const aviso = !sincronizado ? avisoConexao
    : !aula ? "Nenhuma aula aberta. Aguarde a professora iniciar."
    : aula.pausada ? "Aula pausada. Aguarde a professora liberar o chat."
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
    <div className="bg-brand-claro text-brand-tinta dark:bg-black dark:text-brand-light font-sans h-screen flex relative overflow-hidden selection:bg-brand-acao selection:text-black">
      <div className="pointer-events-none absolute -top-[28rem] -left-[28rem] w-[70rem] h-[70rem] rounded-full bg-white dark:bg-white/[0.06] blur-[180px]" />

      <BarraLateral aoSair={aoSair} />

      <div className="relative flex-1 flex flex-col min-w-0">
        <div className="absolute top-4 right-6 z-10 text-right hidden sm:block pointer-events-none">
          {aula ? (
            <>
              <p className="text-[0.65rem] text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                {aula.professor ? `Professora ${aula.professor}` : ""}
              </p>
              <p className="text-xs font-semibold text-brand-tinta dark:text-brand-light">
                {aula.disciplina}
              </p>
            </>
          ) : (
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Nenhuma aula aberta no momento.
            </p>
          )}
        </div>

        <main
          ref={listaRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-8 max-w-3xl mx-auto w-full"
        >
          {mensagens.map((mensagem, indice) => (
            <Mensagem key={indice} mensagem={mensagem} />
          ))}

          {enviando && <Digitando />}

        {erro && (
          <div className="w-full flex justify-center animate-fade-in">
            <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/60 dark:border-red-800 dark:text-red-200 text-sm rounded-xl px-4 py-2 text-center">
              {erro}
            </div>
          </div>
        )}

          <div className="h-6 shrink-0" />
        </main>

        <CampoMensagem
          valor={input}
          enviando={enviando}
          bloqueado={bloqueado}
          aviso={aviso}
          aoMudar={setInput}
          aoEnviar={() => void perguntar()}
        />
      </div>
    </div>
  );
}

export default Chat;

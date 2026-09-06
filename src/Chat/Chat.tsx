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
  const [input, setInput] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const listaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    /* Waits one frame before scrolling: right after the state changes the browser has
    not laid the new text out yet, so scrollHeight would still be the old one and the
    last message would stay hidden behind the input bar. */
    const quadro = requestAnimationFrame(() => {
      const lista = listaRef.current;
      if (!lista) return;
      lista.scrollTo({ top: lista.scrollHeight, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(quadro);
  }, [mensagens, enviando]);

  useEffect(() => {
    const carregarAula = async () => {
      try {
        const dados = await buscarAulaAberta();
        setAula(dados);

        /* Anything the student already asked in this class comes back from Redis; the
        greeting only shows up when the conversation is still empty. */
        const historico = await buscarHistorico(token);
        if (historico.length > 0) {
          setMensagens(
            historico.map((turno) => ({
              role: turno.role === "user" ? "aluno" : "braz",
              texto: turno.text,
            })),
          );
          return;
        }

        setMensagens([
          {
            role: "braz",
            texto: dados
              ? `Olá! Alguma dúvida sobre ${dados.disciplina} hoje?`
              : "Olá! No momento não há nenhuma aula aberta.",
          },
        ]);
      } catch {
        setMensagens([
          {
            role: "braz",
            texto: "Olá! Estou aqui para ajudar você a aprender.",
          },
        ]);
      }
    };
    void carregarAula();
  }, [token]);

  const perguntar = async () => {
    const texto = input.trim();
    if (!texto || enviando) return;

    setMensagens((atual) => [...atual, { role: "aluno", texto }]);
    setInput("");
    setErro(null);
    setEnviando(true);

    try {
      const resposta = await enviarMensagem(texto, token);
      setMensagens((atual) => [...atual, { role: "braz", texto: resposta }]);
    } catch (error) {
      /* An expired or invalid token only shows up here, so this is where the session
      is dropped and the student goes back to the login screen. */
      if (error instanceof ErroDeApi && error.status === 401) {
        aoSair();
        return;
      }
      setErro(
        error instanceof Error ? error.message : "Erro ao falar com o Braz",
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-brand-claro text-brand-tinta dark:bg-brand-preto dark:text-brand-light font-sans h-screen flex relative overflow-hidden selection:bg-brand-acao selection:text-black">
      {/* Light coming from the top left corner: it breaks the flat background without
      competing with the conversation. */}
      <div className="pointer-events-none absolute -top-[28rem] -left-[28rem] w-[70rem] h-[70rem] rounded-full bg-white dark:bg-white/[0.06] blur-[180px]" />

      <BarraLateral aoSair={aoSair} />

      <div className="relative flex-1 flex flex-col min-w-0">
        {/* Loose in the corner instead of a header bar: nothing else sits up there,
        and the class is something the student checks, not something he acts on. */}
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
          aoMudar={setInput}
          aoEnviar={() => void perguntar()}
        />
      </div>
    </div>
  );
}

export default Chat;

import { useEffect, useRef, useState } from "react";
import { ErroDeApi } from "../../api/client";
import CampoMensagem from "../../Chat/components/CampoMensagem";
import Mensagem, {
  Digitando,
  type DadosMensagem,
} from "../../Chat/components/Mensagem";
import {
  buscarHistoricoProfessor,
  enviarMensagemProfessor,
} from "../services/chatProfessorService";

type Props = {
  token: string;
  aoSair: () => void;
};

function TelaChatProfessor({ token, aoSair }: Props) {
  const [mensagens, setMensagens] = useState<DadosMensagem[]>([]);
  const [input, setInput] = useState("");
  const [carregado, setCarregado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const listaRef = useRef<HTMLElement>(null);
  const envioEmCurso = useRef(false);

  useEffect(() => {
    let ativo = true;

    buscarHistoricoProfessor(token)
      .then((historico) => {
        if (!ativo) return;
        setMensagens(
          historico.length
            ? historico.map((turno) => ({
                role: turno.role === "user" ? "professora" : "braz",
                texto: turno.text,
              }))
            : [
                {
                  role: "braz",
                  texto: "Olá! Como posso ajudar?",
                },
              ],
        );
      })
      .catch((error) => {
        if (!ativo) return;
        if (error instanceof ErroDeApi && error.status === 401) {
          aoSair();
          return;
        }
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar a conversa",
        );
      })
      .finally(() => {
        if (ativo) setCarregado(true);
      });

    return () => {
      ativo = false;
    };
  }, [token, aoSair]);

  useEffect(() => {
    const quadro = requestAnimationFrame(() => {
      const lista = listaRef.current;
      if (!lista) return;
      lista.scrollTo({ top: lista.scrollHeight, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(quadro);
  }, [mensagens, enviando]);

  const perguntar = async () => {
    const texto = input.trim();
    if (!texto || envioEmCurso.current) return;
    envioEmCurso.current = true;

    setMensagens((atual) => [
      ...atual,
      { role: "professora", texto },
    ]);
    setInput("");
    setErro(null);
    setEnviando(true);

    try {
      const resposta = await enviarMensagemProfessor(texto, token);
      setMensagens((atual) => [
        ...atual,
        { role: "braz", texto: resposta },
      ]);
    } catch (error) {
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
    <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden bg-brand-claro dark:bg-brand-fundo animate-fade-in">
      <div className="pointer-events-none absolute -top-[28rem] -left-[28rem] w-[70rem] h-[70rem] rounded-full bg-white dark:bg-white/[0.04] blur-[180px]" />

      <main
        ref={listaRef}
        className="relative flex-1 min-h-0 overflow-y-auto p-4 md:p-8 flex flex-col gap-8 max-w-3xl mx-auto w-full"
      >
        {!carregado ? (
          <div
            className="flex flex-col gap-8"
            aria-label="Carregando a conversa"
          >
            <div className="animate-pulse space-y-2 max-w-md">
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-white/[0.06]" />
              <div className="h-4 w-4/5 rounded bg-gray-200 dark:bg-white/[0.06]" />
            </div>
            <div className="animate-pulse self-end h-11 w-40 rounded-2xl bg-gray-300 dark:bg-white/10" />
            <div className="animate-pulse space-y-2 max-w-sm">
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-white/[0.06]" />
              <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-white/[0.06]" />
            </div>
          </div>
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

      {carregado && (
        <div className="relative z-10 mt-auto shrink-0">
          <CampoMensagem
            valor={input}
            enviando={enviando}
            bloqueado={false}
            aviso={null}
            pausada={false}
            placeholder="Pergunte ao Braz..."
            rodape="O Braz pode cometer erros. Confira as informações importantes."
            aoMudar={setInput}
            aoEnviar={() => void perguntar()}
          />
        </div>
      )}
    </div>
  );
}

export default TelaChatProfessor;

import { useEffect, useState, type FormEvent } from "react";
import Alerta from "../components/Alerta";
import FundoOnda from "../components/FundoOnda";
import OndaProfessora from "../components/OndaProfessora";
import Rodape from "../components/Rodape";
import TelaChave from "./telas/TelaChave";
import TelaProfessoras from "./telas/TelaProfessoras";
import * as professorService from "./services/professorService";
import type { Professora } from "./services/professorService";

type Props = {
  aoAutenticar: (token: string) => void;
};

//-------------- component

function Professor({ aoAutenticar }: Props) {
  const [professoras, setProfessoras] = useState<Professora[]>([]);
  const [escolhida, setEscolhida] = useState<Professora | null>(null);
  const [chave, setChave] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const naChave = escolhida !== null;

  useEffect(() => {
    const carregarProfessoras = async () => {
      try {
        const lista = await professorService.listarProfessoras();
        setProfessoras(lista);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar a lista",
        );
      } finally {
        setCarregando(false);
      }
    };
    void carregarProfessoras();
  }, []);

  const escolher = (professora: Professora) => {
    setEscolhida(professora);
    setChave("");
    setErro(null);
  };

  const voltar = () => {
    setEscolhida(null);
    setChave("");
    setErro(null);
  };

  const entrar = (e: FormEvent) => {
    e.preventDefault();
    if (!escolhida) return;
    setErro(null);
    setEnviando(true);
    void (async () => {
      try {
        const dados = await professorService.login(escolhida.id, chave);
        aoAutenticar(dados.token);
      } catch (error) {
        setErro(error instanceof Error ? error.message : "Erro inesperado");
      } finally {
        setEnviando(false);
      }
    })();
  };

  return (
    <div className="bg-brand-claro text-brand-tinta dark:bg-brand-fundo dark:text-brand-light font-sans min-h-screen flex items-center justify-center p-4 pb-20 sm:p-8 sm:pb-20 lg:pb-8 selection:bg-brand-acao selection:text-black">
      <OndaProfessora />
      <FundoOnda cor="bg-brand-mata" variante="professora" />
      <Rodape />

      <div className="relative w-full max-w-5xl lg:h-[36rem] rounded-[2rem] bg-white dark:bg-brand-preto shadow-[0_30px_80px_-30px_rgba(15,35,60,0.35)] overflow-hidden flex">
        {/* The green walks to the other side when she reaches the key screen, so the
        step change is felt before the text is read. */}
        <div
          className={`hidden lg:block absolute inset-y-0 bg-brand-mata ${
            naChave ? "left-0 right-[52%]" : "right-0 left-[52%]"
          }`}
          style={{
            clipPath: "url(#ondaProfessora)",
            transform: naChave ? "scaleX(-1)" : undefined,
          }}
          aria-hidden="true"
        />

        <div
          className={`hidden lg:flex absolute inset-y-0 w-[44%] flex-col justify-center px-12 xl:px-16 ${
            naChave ? "left-0 items-start text-left" : "right-0 items-end text-right"
          }`}
        >
          <img
            src="/images/icone-braz.webp"
            alt="Braz"
            className={`w-12 h-12 object-contain absolute top-10 ${
              naChave ? "left-12 xl:left-16" : "right-12 xl:right-16"
            }`}
          />

          {naChave ? (
            <>
              <h2 className="font-display font-bold text-3xl xl:text-4xl leading-tight text-white">
                Olá,
                <br />
                {escolhida.nome}.
              </h2>
              <p className="text-sm text-brand-light/60 mt-4 max-w-xs">
                O Braz auxilia os alunos. Você acompanha o resultado.
              </p>
            </>
          ) : (
            <>
              <h2 className="font-display font-bold text-3xl xl:text-4xl leading-tight text-white">
                Bom te ver,
                <br />
                professora.
              </h2>
              <p className="text-sm text-brand-light/60 mt-4 max-w-xs">
                Escolha seu nome para acessar seu painel.
              </p>
            </>
          )}

          <a
            href="mailto:projetobraz.umbelina@gmail.com"
            className={`absolute bottom-10 text-xs text-brand-light/30 hover:text-brand-amarelo transition-colors ${
              naChave ? "left-12 xl:left-16" : "right-12 xl:right-16"
            }`}
          >
            projetobraz.umbelina@gmail.com
          </a>
        </div>

        <main
          className={`relative z-10 w-full lg:w-[50%] flex flex-col justify-center px-8 sm:px-10 lg:px-14 py-8 ${
            naChave ? "lg:ml-auto" : ""
          }`}
        >
          {escolhida ? (
            <TelaChave
              professora={escolhida.nome}
              chave={chave}
              enviando={enviando}
              aoMudarChave={setChave}
              aoEnviar={entrar}
              aoVoltar={voltar}
            />
          ) : (
            <TelaProfessoras
              professoras={professoras}
              carregando={carregando}
              aoEscolher={escolher}
            />
          )}

          {erro && <Alerta texto={erro} tipo="erro" />}
        </main>
      </div>
    </div>
  );
}

export default Professor;

import { useEffect, useState, type FormEvent } from "react";
import Alerta from "../components/Alerta";
import TelaChave from "./telas/TelaChave";
import TelaProfessoras from "./telas/TelaProfessoras";
import * as professorService from "./services/professorService";
import type { Professora } from "./services/professorService";
import { CLASSE_SUBTITULO, CLASSE_TITULO } from "../estilos";

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
    <div className="bg-brand-preto text-brand-light font-sans min-h-screen relative overflow-hidden selection:bg-brand-acao selection:text-black">
      <div className="pointer-events-none absolute -top-[28rem] -left-[28rem] w-[70rem] h-[70rem] rounded-full bg-white/[0.06] blur-[180px]" />

      <main className="relative px-6 py-10">
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-center mb-8">
            <img
              src="/images/logo-escuro-braz.webp"
              alt="Braz"
              className="h-11 w-auto object-contain"
            />
          </div>

          <div className="text-center mb-8">
            <h1 className={CLASSE_TITULO}>Bem-vinda!</h1>
            <p className={CLASSE_SUBTITULO}>
              {escolhida
                ? "Confirme a sua chave para entrar."
                : "Selecione o seu nome para continuar."}
            </p>
          </div>

          {escolhida ? (
            <TelaChave
              nome={escolhida.nome}
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
        </div>
      </main>
    </div>
  );
}

export default Professor;

import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ErroDeApi } from "../api/client";
import Alerta from "../components/Alerta";
import FundoOnda from "../components/FundoOnda";
import OndaBraz from "../components/OndaBraz";
import Rodape from "../components/Rodape";
import TelaEsqueci from "./telas/TelaEsqueci";
import TelaLogin from "./telas/TelaLogin";
import TelaRedefinir from "./telas/TelaRedefinir";
import TelaRegistro from "./telas/TelaRegistro";
import TelaVerificar from "./telas/TelaVerificar";
import * as alunoService from "./services/alunoService";

type Tela = "login" | "registro" | "verificar" | "esqueci" | "redefinir";

type Props = {
  aoAutenticar: (token: string) => void;
};

const DIGITOS_VAZIOS = Array<string>(6).fill("");


//-------------- component

function Login({ aoAutenticar }: Props) {
  const [tela, setTela] = useState<Tela>("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [codigoTurma, setCodigoTurma] = useState("");
  const [digitos, setDigitos] = useState(DIGITOS_VAZIOS);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [esperaReenvio, setEsperaReenvio] = useState(0);

  const codigo = digitos.join("");

  /* Counts down the seconds the backend asked us to wait, so the student sees the button
  come back to life instead of clicking it and getting the same error again. */
  useEffect(() => {
    if (esperaReenvio <= 0) return;
    const id = setTimeout(() => setEsperaReenvio((atual) => atual - 1), 1000);
    return () => clearTimeout(id);
  }, [esperaReenvio]);

  const trocarTela = (destino: Tela) => {
    setTela(destino);
    setErro(null);
    setAviso(null);
    setDigitos(DIGITOS_VAZIOS);
    /* The email carries over between screens because it is the same person typing, but
    the password never does: what was typed to sign in must not show up on sign up. */
    setSenha("");
  };

  /* Wraps every submit so the loading state and the error message are handled in one
  place, instead of repeating try/catch on each screen. */
  const enviar = async (acao: () => Promise<void>) => {
    setErro(null);
    setAviso(null);
    setEnviando(true);
    try {
      await acao();
    } catch (error) {
      if (error instanceof ErroDeApi && error.aguardeSegundos) {
        setEsperaReenvio(error.aguardeSegundos);
      }
      setErro(error instanceof Error ? error.message : "Erro inesperado");
    } finally {
      setEnviando(false);
    }
  };

  const entrar = (e: FormEvent) => {
    e.preventDefault();
    void enviar(async () => {
      const dados = await alunoService.login(email, senha);
      aoAutenticar(dados.token);
    });
  };

  const cadastrar = (e: FormEvent) => {
    e.preventDefault();
    void enviar(async () => {
      const dados = await alunoService.registro(
        nome,
        email,
        senha,
        codigoTurma,
      );
      trocarTela("verificar");
      setAviso(dados.message);
    });
  };

  const confirmarCodigo = (e: FormEvent) => {
    e.preventDefault();
    void enviar(async () => {
      const dados = await alunoService.verificarCodigo(email, codigo);
      aoAutenticar(dados.token);
    });
  };

  const reenviar = () => {
    void enviar(async () => {
      const dados = await alunoService.reenviarCodigo(email);
      setAviso(dados.message);
      setEsperaReenvio(60);
    });
  };

  const pedirCodigoDeSenha = (e: FormEvent) => {
    e.preventDefault();
    void enviar(async () => {
      const dados = await alunoService.pedirCodigoDeSenha(email);
      trocarTela("redefinir");
      setAviso(dados.message);
      setEsperaReenvio(60);
    });
  };

  const redefinirSenha = (e: FormEvent) => {
    e.preventDefault();
    void enviar(async () => {
      await alunoService.trocarSenha(email, codigo, senha);
      setSenha("");
      trocarTela("login");
      setAviso("Senha alterada. Entre com a nova senha.");
    });
  };

  return (
    <div className="bg-brand-claro dark:bg-brand-fundo text-brand-tinta dark:text-brand-light font-sans min-h-screen flex items-center justify-center p-4 pb-20 sm:p-8 sm:pb-20 lg:pb-8 selection:bg-brand-acao selection:text-black">
      <OndaBraz />
      <FundoOnda cor="bg-brand-painel" variante="aluno" />
      <Rodape />

      <div className="relative w-full max-w-5xl lg:h-[36rem] rounded-[2rem] bg-white dark:bg-brand-preto shadow-[0_30px_80px_-30px_rgba(15,35,60,0.35)] overflow-hidden flex">
        {/* The panel keeps this blue in both themes, the way the teacher side keeps its
        green: the light version of it washed out against the white card. */}
        <div
          className="hidden lg:block absolute inset-y-0 right-0 left-[56%] bg-brand-painel"
          style={{ clipPath: "url(#ondaBraz)" }}
          aria-hidden="true"
        />

        <div className="hidden lg:flex absolute inset-y-0 right-0 w-[46%] flex-col justify-center items-end text-right px-12 xl:px-16">
          <img
            src="/images/icone-braz.webp"
            alt="Braz"
            className="w-12 h-12 object-contain absolute top-10 right-12 xl:right-16"
          />
          <h2 className="font-display font-bold text-3xl xl:text-4xl leading-tight text-white">
            Pergunte.
            <br />O Braz{" "}
            <span className="text-brand-amarelo">ensina</span>.
          </h2>
          <p className="text-sm text-brand-light/60 mt-4 max-w-xs">
            Assistente educacional para alunos e professores.
          </p>
          <a
            href="mailto:projetobraz.umbelina@gmail.com"
            className="absolute bottom-10 right-12 xl:right-16 text-xs text-brand-light/30 hover:text-brand-acao transition-colors"
          >
            projetobraz.umbelina@gmail.com
          </a>
        </div>

        <main className="relative z-10 w-full lg:w-[52%] flex flex-col justify-center px-8 sm:px-10 lg:px-14 py-8">
          {tela === "login" && (
            <TelaLogin
              email={email}
              senha={senha}
              enviando={enviando}
              aoMudarEmail={setEmail}
              aoMudarSenha={setSenha}
              aoEnviar={entrar}
              aoEsquecerSenha={() => trocarTela("esqueci")}
              aoCriarConta={() => trocarTela("registro")}
            />
          )}

          {tela === "registro" && (
            <TelaRegistro
              nome={nome}
              email={email}
              senha={senha}
              codigoTurma={codigoTurma}
              enviando={enviando}
              aoMudarNome={setNome}
              aoMudarEmail={setEmail}
              aoMudarSenha={setSenha}
              aoMudarCodigoTurma={setCodigoTurma}
              aoEnviar={cadastrar}
              aoFazerLogin={() => trocarTela("login")}
            />
          )}
 
          {tela === "verificar" && (
            <TelaVerificar
              email={email}
              digitos={digitos}
              enviando={enviando}
              aoMudarDigitos={setDigitos}
              aoEnviar={confirmarCodigo}
              aoReenviar={reenviar}
              esperaReenvio={esperaReenvio}
              aoVoltar={() => trocarTela("login")}
            />
          )}

          {tela === "esqueci" && (
            <TelaEsqueci
              email={email}
              enviando={enviando}
              aoMudarEmail={setEmail}
              aoEnviar={pedirCodigoDeSenha}
              esperaReenvio={esperaReenvio}
              aoVoltar={() => trocarTela("login")}
            />
          )}

          {tela === "redefinir" && (
            <TelaRedefinir
              digitos={digitos}
              senha={senha}
              enviando={enviando}
              aoMudarDigitos={setDigitos}
              aoMudarSenha={setSenha}
              aoEnviar={redefinirSenha}
              aoVoltar={() => trocarTela("esqueci")}
            />
          )}

          {erro && <Alerta texto={erro} tipo="erro" />}
          {aviso && !erro && <Alerta texto={aviso} tipo="aviso" />}

          {tela === "registro" && (
          <p className="text-[11px] text-gray-500 dark:text-brand-cinza mt-6 text-center sm:whitespace-nowrap">
            Ao criar sua conta, você concorda com os{" "}
            <Link
              to="/termos"
              className="text-brand-elo dark:text-brand-eloClaro font-semibold hover:opacity-80 transition-opacity"
            >
              Termos de Uso
            </Link>{" "}
            e a{" "}
            <Link
              to="/privacidade"
              className="text-brand-elo dark:text-brand-eloClaro font-semibold hover:opacity-80 transition-opacity whitespace-nowrap"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        )}
        </main>
      </div>
    </div>
  );
}

export default Login;

import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ErroDeApi } from "../api/client";
import Alerta from "../components/Alerta";
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
    <div className="bg-brand-claro dark:bg-brand-preto text-brand-tinta dark:text-brand-light font-sans min-h-screen flex items-center justify-center p-4 sm:p-8 selection:bg-brand-acao selection:text-black">
      {/* The wave came out of Haikei as a 600x900 path and was normalised here, so the
      clip follows the card whatever its size instead of being tied to those pixels. */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="ondaBraz" clipPathUnits="objectBoundingBox">
            <path d="M0.3100 0.0000L1.0000 0.0000L1.0000 1.0000L0.3300 1.0000C0.3200 0.9950,0.2867 0.9850,0.2700 0.9700C0.2533 0.9550,0.2400 0.9350,0.2300 0.9100C0.2200 0.8850,0.2150 0.8517,0.2100 0.8200C0.2050 0.7883,0.2083 0.7483,0.2000 0.7200C0.1917 0.6917,0.1783 0.6700,0.1600 0.6500C0.1417 0.6300,0.1117 0.6183,0.0900 0.6000C0.0683 0.5817,0.0450 0.5617,0.0300 0.5400C0.0150 0.5183,0.0033 0.4967,0.0000 0.4700C0.0000 0.4433,0.0000 0.4083,0.0100 0.3800C0.0200 0.3517,0.0383 0.3250,0.0600 0.3000C0.0817 0.2750,0.1150 0.2533,0.1400 0.2300C0.1650 0.2067,0.1917 0.1850,0.2100 0.1600C0.2283 0.1350,0.2333 0.1067,0.2500 0.0800C0.2667 0.0533,0.3000 0.0133,0.3100 0.0000Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="relative w-full max-w-5xl h-[36rem] rounded-[2rem] bg-white dark:bg-brand-preto shadow-[0_30px_80px_-30px_rgba(15,35,60,0.35)] overflow-hidden flex">
        {/* The panel is one shade away from the card: the wave has to be read as a fold
        in the same surface, not as a second box glued to the first. */}
        <div
          className="hidden lg:block absolute inset-y-0 right-0 left-[56%] bg-gray-50 dark:bg-brand-painel"
          style={{ clipPath: "url(#ondaBraz)" }}
          aria-hidden="true"
        />

        <div className="hidden lg:flex absolute inset-y-0 right-0 w-[46%] flex-col justify-center items-end text-right px-12 xl:px-16">
          <img
            src="/images/icone-escuro-braz.webp"
            alt="Braz"
            className="w-12 h-12 object-contain absolute top-10 right-12 xl:right-16"
          />
          <h2 className="font-display font-bold text-3xl xl:text-4xl leading-tight text-brand-tinta dark:text-white">
            Pergunte.
            <br />O Braz ensina.
          </h2>
          <p className="text-sm text-gray-500 dark:text-brand-light/60 mt-4 max-w-xs">
            Assistente educacional para alunos e professores.
          </p>
          <a
            href="mailto:projetobraz.umbelina@gmail.com"
            className="absolute bottom-10 right-12 xl:right-16 text-xs text-gray-400 dark:text-brand-light/30 hover:text-brand-acao transition-colors"
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
          <p className="text-[11px] text-gray-500 dark:text-brand-cinza mt-6 text-center whitespace-nowrap">
            Ao criar sua conta, você concorda com os{" "}
            <Link
              to="/termos"
              className="text-brand-acao font-semibold hover:opacity-80 transition-opacity"
            >
              Termos de Uso
            </Link>{" "}
            e a{" "}
            <Link
              to="/privacidade"
              className="text-brand-acao font-semibold hover:opacity-80 transition-opacity whitespace-nowrap"
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

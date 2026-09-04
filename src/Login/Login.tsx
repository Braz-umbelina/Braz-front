import { useEffect, useState, type FormEvent } from "react";
import { ErroDeApi } from "../api/client";
import Alerta from "./components/Alerta";
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

/* Verification belongs to the sign up flow and reset belongs to the password one, so
they reuse the mascot of the screen that led the student there. */
const MASCOTES: Record<Tela, { imagem: string; fala: string }> = {
  login: {
    imagem: "/images/mascote-login.webp",
    fala: "Que bom ter você de volta! Vamos começar a nossa aula?",
  },
  registro: {
    imagem: "/images/mascote-registro.webp",
    fala: "Oi! Eu sou o Braz. Vamos dar o primeiro passo da nossa jornada?",
  },
  verificar: {
    imagem: "/images/mascote-registro.webp",
    fala: "Falta pouco! Confirme o código que enviei.",
  },
  esqueci: {
    imagem: "/images/mascote-redefinir-senha.webp",
    fala: "Sem problemas! Vamos recuperar sua senha.",
  },
  redefinir: {
    imagem: "/images/mascote-redefinir-senha.webp",
    fala: "Escolha uma senha nova e voltamos ao estudo.",
  },
};

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
  const mascote = MASCOTES[tela];

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
    <div className="bg-black text-brand-light font-sans min-h-screen relative overflow-hidden selection:bg-brand-teal selection:text-white">
      {/* Light coming from the top left corner, same idea as the mascot circle: it breaks
      the flat black without competing with the form. */}
      <div className="pointer-events-none absolute -top-[28rem] -left-[28rem] w-[70rem] h-[70rem] rounded-full bg-brand-teal/20 blur-[180px]" />

      <header className="relative px-6 pt-3 lg:pl-16">
        <img
          src="/images/logo-principal.webp"
          alt="Braz"
          className="h-14 w-auto object-contain"
        />
      </header>

      <main className="relative flex justify-center px-6 pb-6 -mt-2">
        {/* Barely there on purpose: a hint of light and a thin border give the form its
        own space without turning into a solid box over the background. */}
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm px-8 py-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]">
          {/* Braz greets from the top of the card, in the same shape the student will see
          in the chat later: his avatar on the left and what he says beside it. */}
          <div className="flex items-center gap-3 mb-7">
            <div className="relative w-20 h-20 flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-brand-teal" />
              <img
                src={mascote.imagem}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-contain p-1"
              />
            </div>
            <div className="relative flex-1 bg-white text-brand-dark rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
              <p className="font-display font-semibold text-xs leading-snug">
                {mascote.fala}
              </p>
              <div className="absolute -left-1 bottom-3 w-3 h-3 bg-white rotate-45 rounded-[2px]" />
            </div>
          </div>

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
        </div>
      </main>
    </div>
  );
}

export default Login;

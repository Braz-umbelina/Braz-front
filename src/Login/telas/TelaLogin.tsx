import type { FormEvent } from "react";
import CampoEmail from "../components/CampoEmail";
import CampoSenha from "../components/CampoSenha";
import {
  CLASSE_BOTAO,
  CLASSE_LINK,
  CLASSE_SUBTITULO,
  CLASSE_TITULO,
} from "../../estilos";

type Props = {
  email: string;
  senha: string;
  enviando: boolean;
  aoMudarEmail: (valor: string) => void;
  aoMudarSenha: (valor: string) => void;
  aoEnviar: (e: FormEvent) => void;
  aoEsquecerSenha: () => void;
  aoCriarConta: () => void;
};

function TelaLogin({
  email,
  senha,
  enviando,
  aoMudarEmail,
  aoMudarSenha,
  aoEnviar,
  aoEsquecerSenha,
  aoCriarConta,
}: Props) {
  return (
    <div className="animate-fade-in">
      <h2 className={CLASSE_TITULO}>Bem-vindo de volta!</h2>
      <p className={CLASSE_SUBTITULO}>
        Ainda não tem acesso?{" "}
        <button onClick={aoCriarConta} className={CLASSE_LINK}>
          Criar conta
        </button>
      </p>

      <form className="space-y-3.5" onSubmit={aoEnviar}>
        <CampoEmail rotulo="E-mail" valor={email} aoMudar={aoMudarEmail} />
        <CampoSenha
          rotulo="Senha"
          valor={senha}
          aoMudar={aoMudarSenha}
          placeholder="••••••••"
        />

        <div className="flex justify-start pb-1">
          <button
            type="button"
            onClick={aoEsquecerSenha}
            className="text-sm text-brand-acao hover:opacity-80 transition-opacity"
          >
            Esqueceu a senha?
          </button>
        </div>

        <button
          type="submit"
          disabled={enviando}
          className={`${CLASSE_BOTAO} !mt-6`}
        >
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

export default TelaLogin;

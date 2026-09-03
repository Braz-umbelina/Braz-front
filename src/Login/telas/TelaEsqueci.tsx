import type { FormEvent } from "react";
import CampoEmail from "../components/CampoEmail";
import { CLASSE_BOTAO, CLASSE_SUBTITULO, CLASSE_TITULO } from "../estilos";

type Props = {
  email: string;
  enviando: boolean;
  aoMudarEmail: (valor: string) => void;
  aoEnviar: (e: FormEvent) => void;
  esperaReenvio: number;
  aoVoltar: () => void;
};

function TelaEsqueci({
  email,
  enviando,
  aoMudarEmail,
  aoEnviar,
  esperaReenvio,
  aoVoltar,
}: Props) {
  return (
    <div className="animate-fade-in">
      <button
        onClick={aoVoltar}
        className="text-gray-400 hover:text-white mb-4 transition-colors"
      >
        <i className="fa-solid fa-arrow-left mr-2" /> Voltar
      </button>
      <h2 className={CLASSE_TITULO}>Esqueceu a senha?</h2>
      <p className={CLASSE_SUBTITULO}>
        Digite o seu e-mail e enviaremos um código para criar uma nova senha.
      </p>

      <form className="space-y-3.5" onSubmit={aoEnviar}>
        <CampoEmail
          rotulo="E-mail cadastrado"
          valor={email}
          aoMudar={aoMudarEmail}
        />
        <button
          type="submit"
          disabled={enviando || esperaReenvio > 0}
          className={`${CLASSE_BOTAO} !mt-6`}
        >
          {esperaReenvio > 0
            ? `Aguarde ${esperaReenvio}s`
            : enviando
              ? "Enviando..."
              : "Enviar código"}
        </button>
      </form>
    </div>
  );
}

export default TelaEsqueci;

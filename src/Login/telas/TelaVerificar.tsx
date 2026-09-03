import type { FormEvent } from "react";
import CampoCodigo from "../components/CampoCodigo";
import {
  CLASSE_BOTAO,
  CLASSE_LINK,
  CLASSE_SUBTITULO,
  CLASSE_TITULO,
} from "../estilos";

type Props = {
  email: string;
  digitos: string[];
  enviando: boolean;
  aoMudarDigitos: (digitos: string[]) => void;
  aoEnviar: (e: FormEvent) => void;
  aoReenviar: () => void;
  esperaReenvio: number;
  aoVoltar: () => void;
};

function TelaVerificar({
  email,
  digitos,
  enviando,
  aoMudarDigitos,
  aoEnviar,
  aoReenviar,
  esperaReenvio,
  aoVoltar,
}: Props) {
  const completo = digitos.join("").length === 6;

  return (
    <div className="animate-fade-in">
      <h2 className={CLASSE_TITULO}>Verifique o seu e-mail</h2>
      <p className={CLASSE_SUBTITULO}>
        Enviamos um código de 6 dígitos para {email || "o seu e-mail"}.
      </p>

      <form className="space-y-5" onSubmit={aoEnviar}>
        <CampoCodigo digitos={digitos} aoMudar={aoMudarDigitos} />
        <button
          type="submit"
          disabled={enviando || !completo}
          className={`${CLASSE_BOTAO} !mt-7`}
        >
          {enviando ? "Confirmando..." : "Confirmar código"}
        </button>
      </form>

      <p className="text-sm text-gray-400 mt-6">
        Não recebeu?{" "}
        {esperaReenvio > 0 ? (
          <span className="text-gray-500 font-bold">
            Reenviar em {esperaReenvio}s
          </span>
        ) : (
          <button
            onClick={aoReenviar}
            disabled={enviando}
            className={CLASSE_LINK}
          >
            Reenviar
          </button>
        )}
        <br />
        <button
          onClick={aoVoltar}
          className="mt-4 text-gray-500 hover:text-white text-xs underline"
        >
          Voltar ao login
        </button>
      </p>
    </div>
  );
}

export default TelaVerificar;

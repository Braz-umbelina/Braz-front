import { useState, type FormEvent } from "react";
import {
  CLASSE_BOTAO,
  CLASSE_INPUT,
  CLASSE_SUBTITULO,
  CLASSE_TITULO,
} from "../../estilos";

type Props = {
  chave: string;
  enviando: boolean;
  aoMudarChave: (valor: string) => void;
  aoEnviar: (e: FormEvent) => void;
  aoVoltar: () => void;
};

function TelaChave({
  chave,
  enviando,
  aoMudarChave,
  aoEnviar,
  aoVoltar,
}: Props) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div className="animate-fade-in">
      <button
        type="button"
        onClick={aoVoltar}
        className="flex items-center gap-2 text-sm text-brand-light/50 hover:text-brand-amarelo transition-colors mb-6"
      >
        <i className="fa-solid fa-arrow-left text-xs" />
        Voltar
      </button>

      <h2 className={CLASSE_TITULO}>Sua chave de acesso</h2>
      <p className={CLASSE_SUBTITULO}>Entregue pela coordenação da escola.</p>

      <form onSubmit={aoEnviar}>
        <div className="relative">
          <input
            type={visivel ? "text" : "password"}
            value={chave}
            onChange={(e) => aoMudarChave(e.target.value)}
            className={`${CLASSE_INPUT} pr-12`}
            placeholder="••••••••"
            autoFocus
            required
          />
          <button
            type="button"
            onClick={() => setVisivel((atual) => !atual)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-amarelo transition-colors"
            aria-label={visivel ? "Ocultar chave" : "Mostrar chave"}
          >
            <i className={visivel ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} />
          </button>
        </div>

        <button
          type="submit"
          disabled={enviando || !chave}
          className={`${CLASSE_BOTAO} mt-5`}
        >
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

export default TelaChave;

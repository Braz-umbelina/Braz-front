import { useState, type FormEvent } from "react";
import { CLASSE_BOTAO, CLASSE_LABEL } from "../../estilos";

type Props = {
  nome: string;
  chave: string;
  enviando: boolean;
  aoMudarChave: (valor: string) => void;
  aoEnviar: (e: FormEvent) => void;
  aoVoltar: () => void;
};

function TelaChave({
  nome,
  chave,
  enviando,
  aoMudarChave,
  aoEnviar,
  aoVoltar,
}: Props) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div className="animate-fade-in rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]">
      <button
        type="button"
        onClick={aoVoltar}
        className="flex items-center gap-2 text-sm text-brand-light/50 hover:text-brand-acao transition-colors"
      >
        <i className="fa-solid fa-arrow-left text-xs" />
        Voltar
      </button>

      <div className="text-center mt-6 mb-8">
        <div className="w-24 h-24 mx-auto rounded-full bg-brand-acao flex items-center justify-center font-display font-bold text-3xl text-black mb-4">
          {nome.charAt(0)}
        </div>
        <h2 className="font-display font-bold text-2xl text-white">{nome}</h2>
      </div>

      <form onSubmit={aoEnviar}>
        <label className={CLASSE_LABEL}>Chave de acesso</label>
        <div className="relative">
          <input
            type={visivel ? "text" : "password"}
            value={chave}
            onChange={(e) => aoMudarChave(e.target.value)}
            className="w-full bg-transparent border-2 border-white/15 focus:border-brand-acao rounded-2xl px-5 py-4 pr-12 text-center tracking-[0.4em] text-lg text-white placeholder-gray-600 outline-none transition-colors font-sans"
            placeholder="••••••••"
            autoFocus
            required
          />
          <button
            type="button"
            onClick={() => setVisivel((atual) => !atual)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-acao transition-colors"
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

import { useEffect, useState, type FormEvent } from "react";
import Alerta from "../../components/Alerta";
import { CLASSE_BOTAO, CLASSE_INPUT, CLASSE_LABEL } from "../../estilos";

type Props = {
  nome: string;
  salvando: boolean;
  erro: string | null;
  aoSalvar: (nome: string) => void;
  aoFechar: () => void;
};

function TelaPerfil({ nome, salvando, erro, aoSalvar, aoFechar }: Props) {
  const [novoNome, setNovoNome] = useState(nome);

  useEffect(() => {
    const fecharComEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !salvando) aoFechar();
    };
    window.addEventListener("keydown", fecharComEscape);
    return () => window.removeEventListener("keydown", fecharComEscape);
  }, [aoFechar, salvando]);

  const nomeTratado = novoNome.trim();
  const alterado = nomeTratado !== nome;
  const valido = nomeTratado.length >= 2;

  const enviar = (event: FormEvent) => {
    event.preventDefault();
    if (!alterado || !valido || salvando) return;
    aoSalvar(nomeTratado);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-tinta/55 p-4 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={aoFechar}
        disabled={salvando}
        aria-label="Fechar edição"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-editar-nome"
        className="relative w-full max-w-md animate-fade-in rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-brand-painel sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-[0.65rem] uppercase tracking-widest text-gray-500 dark:text-brand-light/40">
              Sua conta
            </p>
            <h2
              id="titulo-editar-nome"
              className="font-display text-2xl font-bold text-brand-tinta dark:text-white"
            >
              Alterar nome
            </h2>
          </div>
          <button
            type="button"
            onClick={aoFechar}
            disabled={salvando}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-brand-tinta disabled:opacity-40 dark:hover:bg-white/[0.06] dark:hover:text-white"
            aria-label="Fechar"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <p className="mt-3 text-sm text-gray-500 dark:text-brand-light/60">
          Este nome aparece para os alunos quando sua aula está aberta.
        </p>

        <form onSubmit={enviar} className="mt-6">
          <label htmlFor="nome-professora" className={CLASSE_LABEL}>
            Nome da professora
          </label>
          <input
            id="nome-professora"
            name="nome"
            type="text"
            autoComplete="name"
            autoFocus
            value={novoNome}
            onChange={(event) => setNovoNome(event.target.value)}
            className={CLASSE_INPUT}
            disabled={salvando}
            required
            minLength={2}
          />

          {erro && <Alerta texto={erro} tipo="erro" />}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={aoFechar}
              disabled={salvando}
              className="rounded-full border border-gray-300 px-5 py-3 font-display font-semibold text-brand-tinta transition-colors hover:bg-gray-100 disabled:opacity-40 dark:border-white/15 dark:text-white dark:hover:bg-white/[0.06]"
            >
              Cancelar
            </button>
            <div className="sm:w-40">
              <button
                type="submit"
                className={CLASSE_BOTAO}
                disabled={!alterado || !valido || salvando}
              >
                {salvando ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

export default TelaPerfil;

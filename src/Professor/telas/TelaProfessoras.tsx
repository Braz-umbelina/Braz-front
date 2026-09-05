import type { Professora } from "../services/professorService";

type Props = {
  professoras: Professora[];
  carregando: boolean;
  aoEscolher: (professora: Professora) => void;
};

function TelaProfessoras({ professoras, carregando, aoEscolher }: Props) {
  if (carregando) {
    return (
      <p className="text-center text-sm text-brand-light/50">Carregando...</p>
    );
  }

  const ordenadas = [...professoras].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR"),
  );

  return (
    <div className="flex flex-col gap-3">
      {ordenadas.map((professora, indice) => (
        <button
          key={professora.id}
          type="button"
          onClick={() => aoEscolher(professora)}
          style={{ animationDelay: `${(indice + 1) * 140}ms` }}
          className="animate-cascata group flex items-center gap-4 text-left rounded-3xl border border-white/10 hover:border-brand-acao/50 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] transition-colors"
        >
          <div className="w-14 h-14 flex-shrink-0 rounded-2xl bg-brand-acao flex items-center justify-center font-display font-bold text-xl text-black">
            {professora.nome.charAt(0)}
          </div>

          <h3 className="flex-1 font-display font-bold text-lg text-white group-hover:text-brand-acao transition-colors">
            {professora.nome}
          </h3>

          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white/5 group-hover:bg-brand-acao/20 flex items-center justify-center transition-colors">
            <i className="fa-solid fa-chevron-right text-sm text-brand-light/40 group-hover:text-brand-acao transition-colors" />
          </div>
        </button>
      ))}
    </div>
  );
}

export default TelaProfessoras;

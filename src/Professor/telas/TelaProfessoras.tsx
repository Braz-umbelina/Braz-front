import { CLASSE_SUBTITULO, CLASSE_TITULO } from "../../estilos";
import type { Professora } from "../services/professorService";

type Props = {
  professoras: Professora[];
  carregando: boolean;
  aoEscolher: (professora: Professora) => void;
};

function TelaProfessoras({ professoras, carregando, aoEscolher }: Props) {
  const ordenadas = [...professoras].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR"),
  );

  return (
    <div className="animate-fade-in">
      <h2 className={CLASSE_TITULO}>Quem está entrando?</h2>
      <p className={CLASSE_SUBTITULO}>Toque no seu nome para continuar.</p>

      {/* No card around each name: a first name is too short to fill one, and the
      empty box was all the eye could see. The name carries the click by itself.
      The height is reserved so the list arriving does not push the screen around,
      and nothing is drawn while it loads: the request is short enough that a
      loading line would only flash. */}
      <div className="flex flex-col items-start gap-1 min-h-[15rem]">
        {!carregando &&
          ordenadas.map((professora, indice) => (
            <button
              key={professora.id}
              type="button"
              onClick={() => aoEscolher(professora)}
              style={{ animationDelay: `${(indice + 1) * 90}ms` }}
              className="animate-cascata font-display font-bold text-2xl text-brand-tinta dark:text-white hover:text-brand-ocre dark:hover:text-brand-amarelo hover:translate-x-2 transition-all py-1.5"
            >
              {professora.nome}
            </button>
          ))}
      </div>
    </div>
  );
}

export default TelaProfessoras;

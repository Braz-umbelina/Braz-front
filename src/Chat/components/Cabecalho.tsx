import type { Aula } from '../services/aulaService'

type Props = {
  aula: Aula | null
  aoSair: () => void
}

function Cabecalho({ aula, aoSair }: Props) {
  return (
    <header className="flex items-center p-4 sticky top-0 z-10">
      <div className="flex items-center gap-4 ml-auto">
        <div className="text-right hidden sm:block">
          <p className="text-[0.65rem] text-gray-400 uppercase tracking-widest">
            {aula?.professor ? `Professora ${aula.professor}` : ''}
          </p>
          <p className="text-xs font-semibold text-brand-light">
            {aula?.disciplina ?? ''}
          </p>
        </div>
        <button
          onClick={aoSair}
          className="text-gray-500 hover:text-brand-teal transition-colors p-2"
          aria-label="Sair"
        >
          <i className="fa-solid fa-arrow-right-from-bracket" />
        </button>
      </div>
    </header>
  )
}

export default Cabecalho

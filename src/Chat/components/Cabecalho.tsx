import type { Aula } from '../services/aulaService'

type Props = {
  aula: Aula | null
  aoSair: () => void
}

function Cabecalho({ aula, aoSair }: Props) {
  return (
    <header className="flex items-center justify-between p-4 sticky top-0 z-10">
      <img
        src="/images/logo-principal.webp"
        alt="Braz"
        className="h-12 w-auto object-contain"
      />

      <div className="flex items-center gap-4">
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

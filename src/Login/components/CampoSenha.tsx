import { useState } from 'react'
import { CLASSE_INPUT, CLASSE_LABEL } from '../../estilos'

type Props = {
  rotulo: string
  valor: string
  aoMudar: (valor: string) => void
  placeholder: string
  /* current-password on the login, new-password anywhere a password is being chosen.
  Without the right one the browser offers the old password on the sign up screen. */
  autoComplete?: 'current-password' | 'new-password'
}

function CampoSenha({
  rotulo,
  valor,
  aoMudar,
  placeholder,
  autoComplete = 'current-password',
}: Props) {
  const [visivel, setVisivel] = useState(false)

  return (
    <div>
      <label className={CLASSE_LABEL}>{rotulo}</label>
      <div className="relative">
        <input
          type={visivel ? 'text' : 'password'}
          value={valor}
          onChange={(e) => aoMudar(e.target.value)}
          className={`${CLASSE_INPUT} pr-11`}
          placeholder={placeholder}
          name="senha"
          autoComplete={autoComplete}
          minLength={6}
          required
        />
        <button
          type="button"
          onClick={() => setVisivel((atual) => !atual)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-tinta dark:text-gray-500 dark:hover:text-brand-acao transition-colors"
          aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
        >
          <i className={visivel ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
        </button>
      </div>
    </div>
  )
}

export default CampoSenha

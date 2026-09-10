import type { FormEvent } from 'react'
import CampoCodigo from '../components/CampoCodigo'
import CampoSenha from '../components/CampoSenha'
import { CLASSE_BOTAO, CLASSE_SUBTITULO, CLASSE_TITULO } from '../../estilos'

type Props = {
  digitos: string[]
  senha: string
  enviando: boolean
  aoMudarDigitos: (digitos: string[]) => void
  aoMudarSenha: (valor: string) => void
  aoEnviar: (e: FormEvent) => void
  aoVoltar: () => void
}

function TelaRedefinir({
  digitos,
  senha,
  enviando,
  aoMudarDigitos,
  aoMudarSenha,
  aoEnviar,
  aoVoltar,
}: Props) {
  const completo = digitos.join('').length === 6

  return (
    <div className="animate-fade-in">
      <button
        onClick={aoVoltar}
        className="text-gray-500 hover:text-brand-tinta dark:text-gray-400 dark:hover:text-white mb-4 transition-colors"
      >
        <i className="fa-solid fa-arrow-left mr-2" /> Voltar
      </button>
      <h2 className={CLASSE_TITULO}>Nova senha</h2>
      <p className={CLASSE_SUBTITULO}>
        Digite o código que enviamos e escolha uma nova senha.
      </p>

      <form className="space-y-5" onSubmit={aoEnviar}>
        <CampoCodigo digitos={digitos} aoMudar={aoMudarDigitos} />
        <CampoSenha
          rotulo="Nova senha"
          valor={senha}
          aoMudar={aoMudarSenha}
          placeholder="Mínimo 6 caracteres"
          autoComplete="new-password"
        />
        <button
          type="submit"
          disabled={enviando || !completo}
          className={`${CLASSE_BOTAO} !mt-7`}
        >
          {enviando ? 'Salvando...' : 'Alterar senha'}
        </button>
      </form>
    </div>
  )
}

export default TelaRedefinir

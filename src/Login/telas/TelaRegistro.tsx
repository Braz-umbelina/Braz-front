import type { FormEvent } from 'react'
import CampoEmail from '../components/CampoEmail'
import CampoSenha from '../components/CampoSenha'
import {
  CLASSE_BOTAO,
  CLASSE_INPUT,
  CLASSE_LABEL,
  CLASSE_LINK,
  CLASSE_SUBTITULO,
  CLASSE_TITULO,
} from '../../estilos'

type Props = {
  nome: string
  email: string
  senha: string
  codigoTurma: string
  enviando: boolean
  aoMudarNome: (valor: string) => void
  aoMudarEmail: (valor: string) => void
  aoMudarSenha: (valor: string) => void
  aoMudarCodigoTurma: (valor: string) => void
  aoEnviar: (e: FormEvent) => void
  aoFazerLogin: () => void
}

function TelaRegistro({
  nome,
  email,
  senha,
  codigoTurma,
  enviando,
  aoMudarNome,
  aoMudarEmail,
  aoMudarSenha,
  aoMudarCodigoTurma,
  aoEnviar,
  aoFazerLogin,
}: Props) {
  return (
    <div className="animate-fade-in">
      <h2 className={CLASSE_TITULO}>Criar conta</h2>
      <p className={CLASSE_SUBTITULO}>
        Já tem uma conta?{' '}
        <button onClick={aoFazerLogin} className={CLASSE_LINK}>
          Fazer login
        </button>
      </p>

      <form className="space-y-3.5" onSubmit={aoEnviar}>
        <div>
          <label className={CLASSE_LABEL}>Nome completo</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => aoMudarNome(e.target.value)}
            className={CLASSE_INPUT}
            placeholder="Seu nome"
            autoComplete="name"
            minLength={3}
            required
          />
        </div>

        <CampoEmail rotulo="E-mail" valor={email} aoMudar={aoMudarEmail} />

        {/* Side by side because the card was running past the bottom of the screen with
        four stacked fields. */}
        <div className="grid sm:grid-cols-2 gap-3.5">
          <CampoSenha
            rotulo="Senha"
            valor={senha}
            aoMudar={aoMudarSenha}
            placeholder="Mínimo 6"
            autoComplete="new-password"
          />

          <div>
            <label className={CLASSE_LABEL}>Código da turma</label>
            <input
              type="text"
              value={codigoTurma}
              onChange={(e) => aoMudarCodigoTurma(e.target.value)}
              className={CLASSE_INPUT}
              placeholder="••••••"
              required
            />
          </div>
        </div>

        <button type="submit" disabled={enviando} className={`${CLASSE_BOTAO} !mt-6`}>
          {enviando ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>

    </div>
  )
}

export default TelaRegistro

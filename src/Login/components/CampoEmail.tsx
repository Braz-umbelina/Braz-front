import { CLASSE_INPUT, CLASSE_LABEL } from '../estilos'

type Props = {
  rotulo: string
  valor: string
  aoMudar: (valor: string) => void
}

function CampoEmail({ rotulo, valor, aoMudar }: Props) {
  return (
    <div>
      <label className={CLASSE_LABEL}>{rotulo}</label>
      <input
        type="email"
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        className={CLASSE_INPUT}
        placeholder="aluno@escola.com"
        autoComplete="email"
        required
      />
    </div>
  )
}

export default CampoEmail

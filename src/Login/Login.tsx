import { useState, type FormEvent } from 'react'
import Alerta from './components/Alerta'
import TelaEsqueci from './telas/TelaEsqueci'
import TelaLogin from './telas/TelaLogin'
import TelaRedefinir from './telas/TelaRedefinir'
import TelaRegistro from './telas/TelaRegistro'
import TelaVerificar from './telas/TelaVerificar'
import * as alunoService from './services/alunoService'

type Tela = 'login' | 'registro' | 'verificar' | 'esqueci' | 'redefinir'

type Props = {
  aoAutenticar: (token: string) => void
}

const DIGITOS_VAZIOS = Array<string>(6).fill('')

//-------------- component

function Login({ aoAutenticar }: Props) {
  const [tela, setTela] = useState<Tela>('login')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const [codigoTurma, setCodigoTurma] = useState('')
  const [digitos, setDigitos] = useState(DIGITOS_VAZIOS)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  const codigo = digitos.join('')

  const trocarTela = (destino: Tela) => {
    setTela(destino)
    setErro(null)
    setAviso(null)
    setDigitos(DIGITOS_VAZIOS)
  }

  /* Wraps every submit so the loading state and the error message are handled in one
  place, instead of repeating try/catch on each screen. */
  const enviar = async (acao: () => Promise<void>) => {
    setErro(null)
    setAviso(null)
    setEnviando(true)
    try {
      await acao()
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro inesperado')
    } finally {
      setEnviando(false)
    }
  }

  const entrar = (e: FormEvent) => {
    e.preventDefault()
    void enviar(async () => {
      const dados = await alunoService.login(email, senha)
      aoAutenticar(dados.token)
    })
  }

  const cadastrar = (e: FormEvent) => {
    e.preventDefault()
    void enviar(async () => {
      const dados = await alunoService.registro(nome, email, senha, codigoTurma)
      trocarTela('verificar')
      setAviso(dados.message)
    })
  }

  const confirmarCodigo = (e: FormEvent) => {
    e.preventDefault()
    void enviar(async () => {
      const dados = await alunoService.verificarCodigo(email, codigo)
      aoAutenticar(dados.token)
    })
  }

  const reenviar = () => {
    void enviar(async () => {
      const dados = await alunoService.reenviarCodigo(email)
      setAviso(dados.message)
    })
  }

  const pedirCodigoDeSenha = (e: FormEvent) => {
    e.preventDefault()
    void enviar(async () => {
      const dados = await alunoService.pedirCodigoDeSenha(email)
      trocarTela('redefinir')
      setAviso(dados.message)
    })
  }

  const redefinirSenha = (e: FormEvent) => {
    e.preventDefault()
    void enviar(async () => {
      await alunoService.trocarSenha(email, codigo, senha)
      setSenha('')
      trocarTela('login')
      setAviso('Senha alterada. Entre com a nova senha.')
    })
  }

  return (
    <div className="bg-black text-brand-light font-sans min-h-screen relative overflow-hidden selection:bg-brand-teal selection:text-white">
      {/* Light coming from the top left corner, same idea as the mascot circle: it breaks
      the flat black without competing with the form. */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-brand-teal/20 blur-[120px]" />

      <header className="relative flex items-center px-6 py-4">
        <img
          src="/cabecalho-braz.png"
          alt="Braz"
          className="h-12 w-auto object-contain"
        />
      </header>

      <main className="relative grid lg:grid-cols-2 items-center gap-10 max-w-6xl mx-auto px-6 pb-10 pt-0">
        <div className="w-full max-w-sm mx-auto lg:mx-0">
          {tela === 'login' && (
            <TelaLogin
              email={email}
              senha={senha}
              enviando={enviando}
              aoMudarEmail={setEmail}
              aoMudarSenha={setSenha}
              aoEnviar={entrar}
              aoEsquecerSenha={() => trocarTela('esqueci')}
              aoCriarConta={() => trocarTela('registro')}
            />
          )}

          {tela === 'registro' && (
            <TelaRegistro
              nome={nome}
              email={email}
              senha={senha}
              codigoTurma={codigoTurma}
              enviando={enviando}
              aoMudarNome={setNome}
              aoMudarEmail={setEmail}
              aoMudarSenha={setSenha}
              aoMudarCodigoTurma={setCodigoTurma}
              aoEnviar={cadastrar}
              aoFazerLogin={() => trocarTela('login')}
            />
          )}

          {tela === 'verificar' && (
            <TelaVerificar
              email={email}
              digitos={digitos}
              enviando={enviando}
              aoMudarDigitos={setDigitos}
              aoEnviar={confirmarCodigo}
              aoReenviar={reenviar}
              aoVoltar={() => trocarTela('login')}
            />
          )}

          {tela === 'esqueci' && (
            <TelaEsqueci
              email={email}
              enviando={enviando}
              aoMudarEmail={setEmail}
              aoEnviar={pedirCodigoDeSenha}
              aoVoltar={() => trocarTela('login')}
            />
          )}

          {tela === 'redefinir' && (
            <TelaRedefinir
              digitos={digitos}
              senha={senha}
              enviando={enviando}
              aoMudarDigitos={setDigitos}
              aoMudarSenha={setSenha}
              aoEnviar={redefinirSenha}
              aoVoltar={() => trocarTela('esqueci')}
            />
          )}

          {erro && <Alerta texto={erro} tipo="erro" />}
          {aviso && !erro && <Alerta texto={aviso} tipo="aviso" />}
        </div>

        {/* The mascot is decoration, so it leaves on small screens instead of pushing
        the form below the fold. */}
        <div className="hidden lg:flex justify-center">
          <div className="relative w-[26rem] h-[26rem]">
            <div className="absolute inset-0 rounded-full bg-brand-teal" />
            <img
              src="/mascote-braz.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain p-10 drop-shadow-2xl"
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Login

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

/* Verification belongs to the sign up flow and reset belongs to the password one, so
they reuse the mascot of the screen that led the student there. */
const MASCOTES: Record<Tela, { imagem: string; fala: string }> = {
  login: {
    imagem: '/images/mascote-login.webp',
    fala: 'Que bom ter você de volta! Vamos começar a nossa aula?',
  },
  registro: {
    imagem: '/images/mascote-registro.webp',
    fala: 'Oi! Eu sou o Braz. Vamos dar o primeiro passo da nossa jornada?',
  },
  verificar: {
    imagem: '/images/mascote-registro.webp',
    fala: 'Falta pouco! Confirme o código que enviei.',
  },
  esqueci: {
    imagem: '/images/mascote-redefinir-senha.webp',
    fala: 'Sem problemas! Vamos recuperar sua senha.',
  },
  redefinir: {
    imagem: '/images/mascote-redefinir-senha.webp',
    fala: 'Escolha uma senha nova e voltamos ao estudo.',
  },
}

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
  const mascote = MASCOTES[tela]

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
      <div className="pointer-events-none absolute -top-[28rem] -left-[28rem] w-[70rem] h-[70rem] rounded-full bg-brand-teal/20 blur-[180px]" />

      <header className="relative px-6 pt-6 lg:pl-16">
        <img
          src="/images/logo-principal.webp"
          alt="Braz"
          className="h-14 w-auto object-contain"
        />
      </header>

      {/* Anchored to the top instead of centered: the reset screen is the tallest one and
      was starting way below the others. */}
      <main className="relative grid lg:grid-cols-2 items-start gap-10 max-w-6xl px-6 pb-10 pt-8 mx-auto lg:ml-[6%] lg:mr-auto">
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
        the form below the fold. Pinned to the top because centering would move it up and
        down with the height of each form. */}
        <div className="hidden lg:flex justify-center self-start pt-10">
          <div className="relative w-[26rem] h-[26rem]">
            <div className="absolute inset-0 rounded-full bg-brand-teal" />
            <img
              src={mascote.imagem}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain p-10 drop-shadow-2xl"
            />

            {/* The tail is a small square rotated 45deg sitting half outside the balloon,
            so it reads as one piece with the circle instead of a floating box. */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 bg-white text-brand-dark rounded-xl px-5 py-3 text-center shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
              <p className="font-display font-semibold text-sm leading-snug">
                {mascote.fala}
              </p>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-white rotate-45 rounded-[3px]" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Login

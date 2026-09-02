import { useEffect, useRef, useState } from 'react'
import { ErroDeApi } from '../api/client'
import Cabecalho from './components/Cabecalho'
import CampoMensagem from './components/CampoMensagem'
import Mensagem, { Digitando, type DadosMensagem } from './components/Mensagem'
import { buscarAulaAberta, type Aula } from './services/aulaService'
import { enviarMensagem } from './services/chatService'

type Props = {
  token: string
  aoSair: () => void
}

//-------------- component

function Chat({ token, aoSair }: Props) {
  const [mensagens, setMensagens] = useState<DadosMensagem[]>([])
  const [aula, setAula] = useState<Aula | null>(null)
  const [input, setInput] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const fimRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens, enviando])

  useEffect(() => {
    const carregarAula = async () => {
      try {
        const dados = await buscarAulaAberta()
        setAula(dados)
        setMensagens([
          {
            role: 'braz',
            texto: dados
              ? `Olá! Alguma dúvida sobre ${dados.disciplina} hoje?`
              : 'Olá! No momento não há nenhuma aula aberta.',
          },
        ])
      } catch {
        setMensagens([
          { role: 'braz', texto: 'Olá! Estou aqui para ajudar você a aprender.' },
        ])
      }
    }
    void carregarAula()
  }, [])

  const perguntar = async () => {
    const texto = input.trim()
    if (!texto || enviando) return

    setMensagens((atual) => [...atual, { role: 'aluno', texto }])
    setInput('')
    setErro(null)
    setEnviando(true)

    try {
      const resposta = await enviarMensagem(texto, token)
      setMensagens((atual) => [...atual, { role: 'braz', texto: resposta }])
    } catch (error) {
      /* An expired or invalid token only shows up here, so this is where the session
      is dropped and the student goes back to the login screen. */
      if (error instanceof ErroDeApi && error.status === 401) {
        aoSair()
        return
      }
      setErro(
        error instanceof Error ? error.message : 'Erro ao falar com o Braz',
      )
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="bg-black text-brand-light font-sans h-screen flex flex-col relative overflow-hidden selection:bg-brand-teal selection:text-white">
      {/* Light coming from the top left corner, same idea as the mascot circle: it breaks
      the flat black without competing with the conversation. */}
      <div className="pointer-events-none absolute -top-[28rem] -left-[28rem] w-[70rem] h-[70rem] rounded-full bg-brand-teal/20 blur-[180px]" />

      <Cabecalho aula={aula} aoSair={aoSair} />

      <main className="relative flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-8 max-w-3xl mx-auto w-full pb-32">
        {mensagens.map((mensagem, indice) => (
          <Mensagem key={indice} mensagem={mensagem} />
        ))}

        {enviando && <Digitando />}

        {erro && (
          <div className="w-full flex justify-center animate-fade-in">
            <div className="bg-red-950/60 border border-red-800 text-red-200 text-sm rounded-xl px-4 py-2 text-center">
              {erro}
            </div>
          </div>
        )}

        <div ref={fimRef} />
      </main>

      <CampoMensagem
        valor={input}
        enviando={enviando}
        aoMudar={setInput}
        aoEnviar={() => void perguntar()}
      />
    </div>
  )
}

export default Chat

export type DadosMensagem = {
  role: 'aluno' | 'braz'
  texto: string
}

type Props = {
  mensagem: DadosMensagem
}

const CLASSE_AVATAR =
  'w-12 h-12 rounded-full bg-brand-dark border-2 border-brand-teal flex-shrink-0 mt-1 object-cover'

/* The student speaks in a bubble and Braz answers in plain text, the same way the
big chat apps do it: the bubble marks what you wrote, the answer reads like a page. */
function Mensagem({ mensagem }: Props) {
  if (mensagem.role === 'aluno') {
    return (
      <div className="flex justify-end w-full animate-fade-in">
        <div className="bg-brand-dark text-white rounded-3xl rounded-tr-sm px-5 py-3 max-w-[85%] md:max-w-[75%] shadow-sm border border-brand-dark/50">
          <p className="whitespace-pre-wrap">{mensagem.texto}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-4 max-w-3xl w-full animate-fade-in">
      <img src="/icone-braz.png" alt="Braz" className={CLASSE_AVATAR} />
      <div className="flex-1 text-brand-light leading-relaxed space-y-2 whitespace-pre-wrap">
        <p>{mensagem.texto}</p>
      </div>
    </div>
  )
}

export function Digitando() {
  return (
    <div className="flex gap-4 max-w-3xl w-full animate-fade-in">
      <img src="/icone-braz.png" alt="Braz" className={CLASSE_AVATAR} />
      <div className="flex-1 text-brand-light/60 leading-relaxed">
        <p>Digitando...</p>
      </div>
    </div>
  )
}

export default Mensagem

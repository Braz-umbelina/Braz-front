import { useRef, type FormEvent, type KeyboardEvent } from 'react'

type Props = {
  valor: string
  enviando: boolean
  aoMudar: (valor: string) => void
  aoEnviar: () => void
}

function CampoMensagem({ valor, enviando, aoMudar, aoEnviar }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  /* The textarea grows with the text instead of scrolling, so a long question stays
  readable while the student writes it. */
  const ajustarAltura = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  const submeter = (e: FormEvent) => {
    e.preventDefault()
    aoEnviar()
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const teclar = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      aoEnviar()
      if (textareaRef.current) textareaRef.current.style.height = 'auto'
    }
  }

  const habilitado = valor.trim() && !enviando

  return (
    <div className="fixed bottom-0 w-full bg-gradient-to-t from-black via-black to-transparent pt-10 pb-6 px-4">
      <form
        onSubmit={submeter}
        className="max-w-3xl mx-auto relative flex flex-col gap-3"
      >
        <div className="bg-[#1a1a1a] rounded-[24px] border border-gray-700 focus-within:border-brand-teal transition-colors flex items-end p-2 pl-4 shadow-lg">
          <textarea
            ref={textareaRef}
            rows={1}
            value={valor}
            onChange={(e) => {
              aoMudar(e.target.value)
              ajustarAltura()
            }}
            onKeyDown={teclar}
            className="w-full bg-transparent text-brand-light placeholder-gray-500 resize-none outline-none max-h-32 py-3 overflow-y-auto font-sans"
            placeholder="Pergunte ao Braz..."
          />
          <button
            type="submit"
            disabled={!habilitado}
            className={`p-3 m-1 transition-colors rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 ml-2 ${
              habilitado ? 'bg-brand-teal text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            <i className="fa-solid fa-arrow-up" />
          </button>
        </div>
        <p className="text-center text-xs text-gray-600">
          Braz pode cometer erros. Verifique informações importantes.
        </p>
      </form>
    </div>
  )
}

export default CampoMensagem

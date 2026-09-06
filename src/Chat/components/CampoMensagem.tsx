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
    <div className="shrink-0 w-full bg-gradient-to-t from-brand-claro via-brand-claro dark:from-black dark:via-black to-transparent pt-6 pb-5 px-4">
      <form
        onSubmit={submeter}
        className="max-w-3xl mx-auto relative flex flex-col gap-3"
      >
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-300 dark:border-gray-700 focus-within:border-brand-painel transition-colors flex items-center p-1 pl-4 shadow-lg">
          <textarea
            ref={textareaRef}
            rows={1}
            value={valor}
            onChange={(e) => {
              aoMudar(e.target.value)
              ajustarAltura()
            }}
            onKeyDown={teclar}
            className="w-full bg-transparent text-brand-tinta dark:text-brand-light placeholder-gray-400 dark:placeholder-gray-500 resize-none outline-none max-h-32 py-1.5 leading-6 text-[0.95rem] overflow-y-auto font-sans"
            placeholder="Pergunte ao Braz..."
          />
          <button
            type="submit"
            disabled={!habilitado}
            className={`transition-colors rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 ml-2 text-sm ${
              habilitado
                ? 'bg-brand-tinta text-white dark:bg-brand-acao dark:text-black'
                : 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <i className="fa-solid fa-arrow-up" />
          </button>
        </div>
        <p className="text-center text-xs text-gray-500 dark:text-gray-600">
          O Braz pode cometer erros. Confirme com a professora o que for
          importante.
        </p>
      </form>
    </div>
  )
}

export default CampoMensagem

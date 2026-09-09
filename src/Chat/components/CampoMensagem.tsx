import { useRef, type FormEvent, type KeyboardEvent } from 'react'

type Props = {
  valor: string
  enviando: boolean
  bloqueado: boolean
  aviso: string | null
  pausada: boolean
  placeholder: string
  aoMudar: (valor: string) => void
  aoEnviar: () => void
}

function CampoMensagem({ valor, enviando, bloqueado, aviso, pausada, placeholder, aoMudar, aoEnviar }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const ajustarAltura = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  const submeter = (e: FormEvent) => {
    e.preventDefault()
    if (bloqueado || enviando || !valor.trim()) return
    aoEnviar()
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const teclar = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (bloqueado || enviando || !valor.trim()) return
      aoEnviar()
      if (textareaRef.current) textareaRef.current.style.height = 'auto'
    }
  }

  const habilitado = valor.trim() && !enviando && !bloqueado

  return (
    <div className="shrink-0 w-full bg-gradient-to-t from-brand-claro via-brand-claro dark:from-black dark:via-black to-transparent pt-6 pb-5 px-4">
      <form
        onSubmit={submeter}
        className="max-w-3xl mx-auto relative flex flex-col gap-3"
      >
        {/* Amber, not green: this says he cannot send, and green reads as a go-ahead. */}
        {aviso && (
          <div role="status" className={
            pausada
              ? "flex items-start gap-3 rounded-2xl bg-[#fdf3d6] dark:bg-[#3a2f10] px-4 py-4 text-[#5c4405] dark:text-[#f5e3b8]"
              : "text-center text-sm text-gray-600 dark:text-gray-300"
          }>
            {pausada && <i className="fa-solid fa-pause mt-1" aria-hidden="true" />}
            <div>
              <p className="text-sm">{aviso}</p>
              {pausada && (
                <p className="text-xs mt-1 text-[#7a5f13] dark:text-[#d6c391]">
                  O envio de mensagens é retomado quando a aula for liberada.
                </p>
              )}
            </div>
          </div>
        )}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-300 dark:border-gray-700 focus-within:border-brand-painel transition-colors flex items-center p-1 pl-4 shadow-sm">
          <textarea
            ref={textareaRef}
            rows={1}
            disabled={bloqueado}
            aria-label="Mensagem para o Braz"
            value={valor}
            onChange={(e) => {
              aoMudar(e.target.value)
              ajustarAltura()
            }}
            onKeyDown={teclar}
            className="w-full bg-transparent text-brand-tinta dark:text-brand-light placeholder-gray-400 dark:placeholder-gray-500 resize-none outline-none max-h-32 py-1.5 leading-6 text-[0.95rem] overflow-y-auto font-sans"
            placeholder={placeholder}
          />
          <button
            type="submit"
            aria-label="Enviar mensagem"
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

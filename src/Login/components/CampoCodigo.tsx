import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react'

type Props = {
  digitos: string[]
  aoMudar: (digitos: string[]) => void
}

/* Six separate boxes look better than one input, but they only behave well with
manual focus control: typing moves forward, backspace moves back, and pasting the
whole code from the email fills every box at once. */
function CampoCodigo({ digitos, aoMudar }: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const escrever = (indice: number, valor: string) => {
    const limpo = valor.replace(/\D/g, '').slice(-1)
    const novos = [...digitos]
    novos[indice] = limpo
    aoMudar(novos)
    if (limpo && indice < 5) refs.current[indice + 1]?.focus()
  }

  const apagar = (indice: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Backspace' || digitos[indice]) return
    e.preventDefault()
    const novos = [...digitos]
    novos[indice - 1] = ''
    aoMudar(novos)
    refs.current[indice - 1]?.focus()
  }

  const colar = (e: ClipboardEvent<HTMLInputElement>) => {
    const texto = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!texto) return
    e.preventDefault()
    aoMudar(Array.from({ length: 6 }, (_, i) => texto[i] ?? ''))
    refs.current[Math.min(texto.length, 5)]?.focus()
  }

  return (
    <div className="flex justify-center gap-2">
      {digitos.map((digito, indice) => (
        <div key={indice} className="contents">
          {indice === 3 && (
            <span className="text-gray-600 self-center font-bold">-</span>
          )}
          <input
            ref={(el) => {
              refs.current[indice] = el
            }}
            value={digito}
            onChange={(e) => escrever(indice, e.target.value)}
            onKeyDown={(e) => apagar(indice, e)}
            onPaste={colar}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            className="w-10 sm:w-12 h-14 bg-[#1a1a1a] border border-gray-700 focus:border-brand-acao rounded-xl text-center text-2xl text-white font-display outline-none transition-colors"
          />
        </div>
      ))}
    </div>
  )
}

export default CampoCodigo

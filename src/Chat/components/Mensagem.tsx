export type DadosMensagem = {
  role: 'aluno' | 'professora' | 'braz'
  texto: string
}

type Props = {
  mensagem: DadosMensagem
}

function Mensagem({ mensagem }: Props) {
  if (mensagem.role !== 'braz') {
    return (
      <div className="flex justify-end w-full animate-fade-in">
        <div className="bg-brand-painel text-white rounded-3xl rounded-tr-sm px-5 py-3 max-w-[85%] md:max-w-[75%] shadow-sm border border-brand-painel dark:border-white/10">
          <p className="whitespace-pre-wrap">{mensagem.texto}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl w-full animate-fade-in">
      <p className="text-brand-tinta dark:text-brand-light leading-relaxed whitespace-pre-wrap">
        {mensagem.texto}
      </p>
    </div>
  )
}

export function Digitando() {
  return (
    <div className="max-w-3xl w-full animate-fade-in flex items-center gap-1.5 h-6">
      <span className="w-2 h-2 rounded-full bg-brand-tinta dark:bg-brand-light animate-pensando" />
      <span className="w-2 h-2 rounded-full bg-brand-tinta dark:bg-brand-light animate-pensando" />
      <span className="w-2 h-2 rounded-full bg-brand-tinta dark:bg-brand-light animate-pensando" />
    </div>
  )
}

export default Mensagem

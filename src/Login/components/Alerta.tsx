type Props = {
  texto: string
  tipo: 'erro' | 'aviso'
}

function Alerta({ texto, tipo }: Props) {
  const estilo =
    tipo === 'erro'
      ? 'bg-red-950/60 border-red-800 text-red-200'
      : 'bg-brand-dark/60 border-brand-teal/40 text-brand-light'

  return (
    <div
      className={`mt-5 border text-sm rounded-xl px-4 py-3 text-center animate-fade-in ${estilo}`}
    >
      {texto}
    </div>
  )
}

export default Alerta

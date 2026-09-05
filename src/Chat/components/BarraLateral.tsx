type Props = {
  aoSair: () => void;
};

/* Fixed at this width: the bar carries only the mark and the exit, and nothing in
it is worth the space an open panel would take from the conversation. */
function BarraLateral({ aoSair }: Props) {
  return (
    <aside className="relative z-20 shrink-0 h-full w-16 flex flex-col border-r border-white/5 bg-white/[0.02]">
      <div className="flex items-center justify-center p-4">
        <img
          src="/images/icone-braz.webp"
          alt="Braz"
          className="h-8 w-8 object-contain"
        />
      </div>

      <div className="mt-auto p-4">
        <button
          onClick={aoSair}
          className="w-full flex items-center justify-center rounded-xl px-3 py-2.5 text-gray-400 hover:text-brand-acao hover:bg-white/[0.04] transition-colors"
          aria-label="Sair"
        >
          <i className="fa-solid fa-arrow-right-from-bracket" />
        </button>
      </div>
    </aside>
  );
}

export default BarraLateral;

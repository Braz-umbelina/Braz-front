/* Sits outside the card, in the empty part of the screen. It says what the project
actually is: an extension course assignment run at this school, with no institution
behind it beyond those two. */
function Rodape() {
  return (
    <footer className="pointer-events-none fixed inset-x-0 bottom-0 px-6 py-4 text-[11px] leading-relaxed text-gray-500 dark:text-brand-light/25">
      <div className="hidden lg:block absolute right-6 bottom-4 text-right">
        <p>Extensionista II: Tecnologia Aplicada à Inclusão Digital</p>
        <p>Centro Universitário Internacional UNINTER</p>
      </div>

      <p className="text-center">
        &copy; 2026 Geovani Rodrigues &middot; Colégio Estadual Umbelina
        Braz Gomides
      </p>
    </footer>
  );
}

export default Rodape;

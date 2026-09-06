/* Tailwind runs from the CDN here, and @apply only works with a build step,
so the repeated classes live in constants instead of a css file.
Each one carries both themes: the light values are the default and the dark:
variants take over when the html element has the dark class. */

export const CLASSE_INPUT =
  'w-full bg-white border border-gray-300 focus:border-brand-tinta dark:focus:border-brand-acao rounded-full px-5 py-3 text-brand-tinta placeholder-gray-400 outline-none transition-colors font-sans dark:bg-transparent dark:border-white/15 dark:text-white dark:placeholder-gray-600'

export const CLASSE_BOTAO =
  'w-full bg-brand-tinta border border-brand-tinta text-white font-display font-semibold rounded-full px-5 py-3 hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed dark:bg-brand-acao dark:border-brand-acao dark:text-black dark:hover:bg-transparent dark:hover:text-white dark:hover:opacity-100'

export const CLASSE_LABEL =
  'block text-sm font-display font-semibold text-brand-tinta mb-1.5 dark:text-white'

export const CLASSE_LINK =
  'text-brand-elo dark:text-brand-eloClaro font-bold hover:underline underline-offset-4 transition-colors'

export const CLASSE_TITULO =
  'text-3xl sm:text-4xl font-display font-bold tracking-tight text-brand-tinta mb-1 dark:text-white'

export const CLASSE_SUBTITULO =
  'text-sm text-gray-500 mb-6 dark:text-brand-light/70'

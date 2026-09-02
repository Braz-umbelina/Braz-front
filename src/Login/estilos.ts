/* Tailwind runs from the CDN here, and @apply only works with a build step,
so the repeated classes live in constants instead of a css file. */

export const CLASSE_INPUT =
  'w-full bg-transparent border-2 border-brand-teal/40 focus:border-brand-teal rounded-full px-5 py-3.5 text-white placeholder-gray-600 outline-none transition-colors font-sans'

export const CLASSE_BOTAO =
  'w-full bg-brand-teal border-2 border-brand-teal text-white font-display font-bold rounded-full px-5 py-2.5 hover:bg-transparent hover:text-brand-teal transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-brand-teal disabled:hover:text-white'

export const CLASSE_LABEL =
  'block text-sm font-display font-semibold text-white mb-1.5'

export const CLASSE_LINK =
  'text-brand-teal font-bold hover:text-white transition-colors'

export const CLASSE_TITULO =
  'text-2xl sm:text-3xl font-display font-bold uppercase tracking-wide text-brand-teal mb-1'

export const CLASSE_SUBTITULO = 'text-sm text-brand-light/70 mb-6'

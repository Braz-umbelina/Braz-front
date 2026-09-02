import { requisitar } from '../../api/client'

export type Aula = {
  disciplina: string
  professor?: string
  pausada: boolean
}

/* The route is public and answers null when no class is open, so the chat can show
the right greeting before the student sends anything. */
export const buscarAulaAberta = () => requisitar<Aula | null>('/aula/aberta')

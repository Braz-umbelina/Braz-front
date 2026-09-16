import { requisitar } from '../../api/client'

export type Aula = {
  disciplina: string
  professor?: string
  pausada: boolean
}

export const buscarAulaAberta = () => requisitar<Aula | null>('/aula/aberta')

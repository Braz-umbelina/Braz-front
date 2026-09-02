import { requisitar } from '../../api/client'

export const enviarMensagem = (texto: string, token: string) =>
  requisitar<string>('/chat', {
    metodo: 'POST',
    corpo: { messages: texto },
    token,
  })

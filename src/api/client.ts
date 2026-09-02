const API_URL = import.meta.env.VITE_API_URL

//-------------- errors

/* The status travels with the message because the chat needs to tell an expired
token (401) apart from any other failure, and only the status says that. */
export class ErroDeApi extends Error {
  public status: number

  constructor(mensagem: string, status: number) {
    super(mensagem)
    this.status = status
  }
}

//-------------- client

type Opcoes = {
  metodo?: 'GET' | 'POST'
  corpo?: unknown
  token?: string
}

export const requisitar = async <T>(
  caminho: string,
  opcoes: Opcoes = {},
): Promise<T> => {
  const { metodo = 'GET', corpo, token } = opcoes

  const response = await fetch(`${API_URL}${caminho}`, {
    method: metodo,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: corpo ? JSON.stringify(corpo) : undefined,
  })

  const dados = await response.json()

  /* Every route on the backend answers with { error } when something goes wrong,
  so the message shown to the student always comes from there. */
  if (!response.ok) {
    const mensagem =
      typeof dados?.error === 'string'
        ? dados.error
        : 'Não foi possível concluir a solicitação'
    throw new ErroDeApi(mensagem, response.status)
  }

  return dados as T
}

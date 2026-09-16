const API_URL = import.meta.env.VITE_API_URL;


export class ErroDeApi extends Error {
  public status: number;
  public aguardeSegundos?: number;
  public codigo?: string;

  constructor(
    mensagem: string,
    status: number,
    aguardeSegundos?: number,
    codigo?: string,
  ) {
    super(mensagem);
    this.status = status;
    this.aguardeSegundos = aguardeSegundos;
    this.codigo = codigo;
  }
}


type Opcoes = {
  metodo?: "GET" | "POST" | "PATCH";
  corpo?: unknown;
  token?: string;
};

export const requisitar = async <T>(
  caminho: string,
  opcoes: Opcoes = {},
): Promise<T> => {
  const { metodo = "GET", corpo, token } = opcoes;

  const response = await fetch(`${API_URL}${caminho}`, {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });

  const dados = await response.json();

  if (!response.ok) {
    const mensagem =
      typeof dados?.error === "string"
        ? dados.error
        : "Não foi possível concluir a solicitação";

    const reset = response.headers.get("RateLimit-Reset");
    const espera = reset ? Number(reset) : undefined;

    const codigo = typeof dados?.codigo === "string" ? dados.codigo : undefined;

    throw new ErroDeApi(mensagem, response.status, espera, codigo);
  }

  return dados as T;
};

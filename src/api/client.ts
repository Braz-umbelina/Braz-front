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

  let response: Response;
  try {
    response = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new ErroDeApi(
      "Não foi possível conectar ao servidor. Tente novamente em instantes.",
      0,
    );
  }

  const texto = await response.text();
  let dados: unknown = null;

  if (texto) {
    try {
      dados = JSON.parse(texto);
    } catch {
      dados = null;
    }
  }

  if (!response.ok) {
    const resposta =
      typeof dados === "object" && dados !== null
        ? (dados as Record<string, unknown>)
        : null;
    const mensagem =
      typeof resposta?.error === "string"
        ? resposta.error
        : response.status >= 500
          ? "O servidor está indisponível no momento. Tente novamente em instantes."
          : "Não foi possível concluir a solicitação.";

    const reset = response.headers.get("RateLimit-Reset");
    const espera = reset ? Number(reset) : undefined;

    const codigo =
      typeof resposta?.codigo === "string" ? resposta.codigo : undefined;

    throw new ErroDeApi(mensagem, response.status, espera, codigo);
  }

  return dados as T;
};

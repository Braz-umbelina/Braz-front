import { useEffect } from "react";

/* Reads the exp claim without checking the signature: this decides which screen to
render, never whether the token is good. A forged exp buys a look at an empty chat and
a 401 on the first request. */
const lerExpiracao = (token: string): number | null => {
  const corpo = token.split(".")[1];
  if (!corpo) return null;
  try {
    const dados = JSON.parse(
      atob(corpo.replace(/-/g, "+").replace(/_/g, "/")),
    ) as { exp?: number };
    return typeof dados.exp === "number" ? dados.exp * 1000 : null;
  } catch {
    return null;
  }
};

/* Runs while the first state is built, so an expired session opens on the login
instead of mounting the chat for a frame and leaving right after. */
export const lerSessao = (chave: string): string | null => {
  const token = localStorage.getItem(chave);
  if (!token) return null;

  const expiraEm = lerExpiracao(token);
  if (expiraEm === null || expiraEm <= Date.now()) {
    localStorage.removeItem(chave);
    return null;
  }
  return token;
};

/* The tab stays open for hours: without this he would only find out the session
ended when a message failed. */
export const useExpiracaoDaSessao = (
  token: string | null,
  aoExpirar: () => void,
) => {
  useEffect(() => {
    if (!token) return;

    const expiraEm = lerExpiracao(token);
    if (expiraEm === null) return;

    const id = setTimeout(aoExpirar, Math.max(expiraEm - Date.now(), 0));
    return () => clearTimeout(id);
  }, [token, aoExpirar]);
};

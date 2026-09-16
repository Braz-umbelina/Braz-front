import { useEffect } from "react";

type ProfessorDaSessao = {
  id: string;
  nome: string;
};

const lerCorpoToken = (token: string): Record<string, unknown> | null => {
  const corpo = token.split(".")[1];
  if (!corpo) return null;
  try {
    return JSON.parse(
      atob(corpo.replace(/-/g, "+").replace(/_/g, "/")),
    ) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const lerExpiracao = (token: string): number | null => {
  const dados = lerCorpoToken(token);
  return typeof dados?.exp === "number" ? dados.exp * 1000 : null;
};

export const lerProfessorDaSessao = (
  token: string,
): ProfessorDaSessao | null => {
  const dados = lerCorpoToken(token);
  return typeof dados?.id === "string" && typeof dados.nome === "string"
    ? { id: dados.id, nome: dados.nome }
    : null;
};

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

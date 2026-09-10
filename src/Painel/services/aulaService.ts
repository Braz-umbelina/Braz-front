import { requisitar } from "../../api/client";

//-------------- types

export type Disciplina = {
  id: string;
  nome: string;
};

export type AulaAtual = {
  id: string;
  disciplina: string;
  pausada: boolean;
  abertaEm: string;
};

/* This one is the public route the chat also uses: it carries the teacher's name,
which is what tells her whether the open class is hers or someone else's. */
export type AulaAberta = {
  disciplina: string;
  pausada: boolean;
  professor: string;
};

export type ResumoAula = {
  id: string;
  disciplina: { nome: string };
  abertaEm: string;
  fechadaEm: string | null;
  /* How many students talked in this class and still have no report. The backend
  writes it whenever it finishes a round, so zero means the class is complete. */
  pendentes: number;
};

export type Relatorio = {
  id: string;
  temas: string[];
  aluno: { nome: string };
  esclarecida: "SIM" | "PARCIAL" | "NAO";
  observacoes: string;
};

//-------------- services

export const listarDisciplinas = (token: string) =>
  requisitar<Disciplina[]>("/professor/disciplina", { token });

export const buscarAulaAtual = (token: string) =>
  requisitar<AulaAtual | null>("/aula/atual", { token });

export const buscarAulaAberta = () =>
  requisitar<AulaAberta | null>("/aula/aberta");

export const abrirAula = (disciplinaId: string, token: string) =>
  requisitar<{ id: string }>("/aula/abrir", {
    metodo: "POST",
    corpo: { disciplinaId },
    token,
  });

export const fecharAula = (aulaId: string, token: string) =>
  requisitar<{ gerados: number; falhas: number }>(`/aula/fechar/${aulaId}`, {
    metodo: "POST",
    token,
  });

export const pausarAula = (aulaId: string, token: string) =>
  requisitar<unknown>(`/aula/pausar/${aulaId}`, { metodo: "POST", token });

export const despausarAula = (aulaId: string, token: string) =>
  requisitar<unknown>(`/aula/despausar/${aulaId}`, { metodo: "POST", token });

export const listarAulas = (token: string) =>
  requisitar<ResumoAula[]>("/aula/buscar-aula", { token });

export const buscarRelatorios = (aulaId: string, token: string) =>
  requisitar<Relatorio[]>(`/aula/relatorio/${aulaId}`, { token });

export const gerarRelatorios = (aulaId: string, token: string) =>
  requisitar<{ gerados: number; falhas: number }>(
    `/aula/gerar-relatorio/${aulaId}`,
    { metodo: "POST", token },
  );

import { requisitar } from "../../api/client";

//-------------- types

export type Professora = {
  id: string;
  nome: string;
  disciplinas: { nome: string }[];
};

type RespostaToken = {
  token: string;
};

type ProfessoraAtualizada = {
  id: string;
  nome: string;
};

//-------------- services

export const listarProfessoras = () => requisitar<Professora[]>("/professor");

export const login = (professorId: string, chave: string) =>
  requisitar<RespostaToken>("/professor/login", {
    metodo: "POST",
    corpo: { professorId, chave },
  });

export const atualizarNome = (novoNome: string, token: string) =>
  requisitar<ProfessoraAtualizada>("/professor/nome", {
    metodo: "PATCH",
    corpo: { novoNome },
    token,
  });

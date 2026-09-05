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

//-------------- services

export const listarProfessoras = () => requisitar<Professora[]>("/professor");

export const login = (professorId: string, chave: string) =>
  requisitar<RespostaToken>("/professor/login", {
    metodo: "POST",
    corpo: { professorId, chave },
  });

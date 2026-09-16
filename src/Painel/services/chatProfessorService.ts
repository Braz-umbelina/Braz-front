import { requisitar } from "../../api/client";

export type TurnoProfessor = {
  role: "user" | "assistant";
  text: string;
};

export const buscarHistoricoProfessor = (token: string) =>
  requisitar<TurnoProfessor[]>("/chat-professor/historico", { token });

export const enviarMensagemProfessor = (texto: string, token: string) =>
  requisitar<string>("/chat-professor", {
    metodo: "POST",
    corpo: { messages: texto },
    token,
  });

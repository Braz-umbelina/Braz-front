import { requisitar } from "../../api/client";

type Turno = {
  role: "user" | "model";
  text: string;
};

export const buscarHistorico = (token: string) =>
  requisitar<Turno[]>("/chat/chat-aberto", { token });

export const enviarMensagem = (texto: string, token: string) =>
  requisitar<string>("/chat", {
    metodo: "POST",
    corpo: { messages: texto },
    token,
  });

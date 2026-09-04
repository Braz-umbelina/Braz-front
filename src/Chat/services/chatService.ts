import { requisitar } from "../../api/client";

/* The backend keeps the conversation in Redis for the whole class, so a refresh can
pick up where the student left instead of starting from an empty screen. */
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

import { requisitar } from '../../api/client'

//-------------- types

type RespostaToken = {
  token: string
}

type RespostaMensagem = {
  message: string
}

//-------------- services

export const login = (email: string, senha: string) =>
  requisitar<RespostaToken>('/aluno/login', {
    metodo: 'POST',
    corpo: { email, senha },
  })

export const registro = (
  nome: string,
  email: string,
  senha: string,
  codigo: string,
) =>
  requisitar<RespostaMensagem>('/aluno/registro', {
    metodo: 'POST',
    corpo: { nome, email, senha, codigo },
  })

export const verificarCodigo = (email: string, codigo: string) =>
  requisitar<RespostaToken>('/aluno/verificar-codigo', {
    metodo: 'POST',
    corpo: { email, codigo },
  })

export const reenviarCodigo = (email: string) =>
  requisitar<RespostaMensagem>('/aluno/reenviar', {
    metodo: 'POST',
    corpo: { email },
  })

export const pedirCodigoDeSenha = (email: string) =>
  requisitar<RespostaMensagem>('/aluno/codigo-troca-senha', {
    metodo: 'POST',
    corpo: { email },
  })

export const trocarSenha = (email: string, codigo: string, senha: string) =>
  requisitar<RespostaMensagem>('/aluno/trocar-senha', {
    metodo: 'POST',
    corpo: { email, codigo, senha },
  })

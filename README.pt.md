<div align="right">
  <a href="./README.md">🇺🇸 English</a>
</div>

<h1 align="center">🌱 Braz</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white"/>
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black"/>
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white"/>
  <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black"/>
</p>

---

## 📋 Sobre

Frontend do **Braz**, um assistente educacional feito para uma turma de 9º ano do Colégio Estadual Umbelina Braz Gomides, em Cirilândia, Santa Isabel, Goiás. Foi desenvolvido como **Projeto Extensionista II: Tecnologia Aplicada à Inclusão Digital**, do curso de Análise e Desenvolvimento de Sistemas do Centro Universitário Internacional UNINTER.

Duas áreas dividem uma aplicação. O aluno tem um chat que tira dúvidas da matéria da aula que está aberta. A professora tem um painel para abrir, pausar e encerrar a aula, e para ler um relatório por aluno no fim dela.

A interface é usada quase inteiramente em **Chromebooks da escola**, e isso moldou boa parte dela: dois temas, um layout que sobrevive a tela estreita, e uma primeira pintura que nunca deixa o aluno olhando para uma página vazia.

Repositório do backend: [Braz-extensionista-II](https://github.com/Geovanni-dev/Braz-extensionista-II)

---

## 🛠 Tecnologias

| Camada        | Tecnologia                               |
| ------------- | ---------------------------------------- |
| Biblioteca    | React 19                                 |
| Linguagem     | TypeScript                               |
| Build         | Vite                                     |
| Estilo        | Tailwind CSS (CDN) + constantes próprias |
| Rotas         | React Router                             |
| Tempo real    | EventSource (Server Sent Events)         |
| Ícones        | Font Awesome                             |
| Fontes        | Poppins e Nunito                         |
| Qualidade     | ESLint + Prettier                        |

---

## 🗂️ Estrutura do projeto

```text
braz-front/
├── public/images/                # Marcas, ícones e ilustrações
├── src/
│   ├── api/client.ts             # Wrapper do fetch, token e erros tipados
│   ├── Chat/                     # Área do aluno
│   │   ├── components/           # Barra lateral, campo de mensagem, balão
│   │   ├── services/             # Chamadas a /chat e /aula
│   │   └── Chat.tsx              # SSE, histórico e envio
│   ├── Login/                    # Entrada, cadastro e troca de senha do aluno
│   │   ├── components/           # Campos de e-mail, senha e código
│   │   ├── services/
│   │   └── telas/                # Uma tela por etapa
│   ├── Professor/                # Entrada da professora
│   │   └── telas/                # Lista de professoras e chave de acesso
│   ├── Painel/                   # Área da professora
│   │   ├── services/
│   │   └── telas/                # Aba Aula e aba Relatórios
│   ├── Legal/                    # Termos de uso e política de privacidade
│   ├── components/               # Compartilhados: alerta, ondas, rodapé, barra de topo
│   ├── estilos.ts                # Classes que se repetem
│   ├── tema.ts                   # Tema claro e escuro
│   ├── sessao.ts                 # Lê a expiração do token e agenda a saída
│   └── App.tsx                   # Rotas e as duas áreas autenticadas
└── index.html                    # Config do Tailwind, fontes e o tema antes do React
```

---

## ✨ Funcionalidades

**O aluno nunca espera numa página em branco.** A primeira sincronização sai na montagem em vez de esperar o fluxo SSE cumprimentar, a aula e o histórico são buscados em paralelo na primeira carga, e um esqueleto no formato da conversa preenche o intervalo. Isso levou o tempo até a primeira pintura de cerca de 5,5s para uns 2,3s.

**O chat abre e fecha sozinho.** Um `EventSource` em `/aula/eventos` avisa a página que algo mudou e ela busca o estado, então o aluno que está na tela de espera vê o chat liberar no instante em que a professora abre a aula, sem recarregar.

**Relatórios que falharam podem ser recuperados pelo painel.** Uma aula com relatório faltando mostra um ícone na frente do nome da matéria. Um clique pede ao servidor que gere apenas o que falta, e o ícone some quando a contagem zera.

**Sessão vencida nunca chega numa tela logada.** O `sessao.ts` lê o `exp` do token enquanto o primeiro estado é construído, então um token vencido abre o login em vez de piscar o chat. Um token que vence com a aba aberta desloga sozinho, e qualquer 401 derruba a sessão.

**Dois temas, um interruptor.** O Tailwind roda em modo de classe, e um script no `<head>` aplica o tema antes do React montar, então a tela nunca pisca no tema errado.

**Funciona no celular.** As barras laterais dão lugar a uma barra de topo compartilhada, o painel da professora vira uma coluna só com abas no rodapé, e os relatórios viram navegação em dois passos.

**O navegador salva o login.** Os campos carregam o `name` e o `autocomplete` corretos, incluindo um campo de usuário oculto na tela da professora, para o navegador guardar uma credencial por professora em vez de uma para o site inteiro.

---

## 🗺️ Rotas

| Rota           | Descrição                                              |
| -------------- | ------------------------------------------------------ |
| `/`            | Área do aluno: login ou chat, dependendo do token       |
| `/professor`   | Área da professora: login ou painel                     |
| `/termos`      | Termos de uso                                           |
| `/privacidade` | Política de privacidade                                 |

Cada papel guarda a própria chave no `localStorage` (`braz:token:aluno` e `braz:token:professor`), porque o mesmo navegador é usado pela professora para abrir a aula e por um aluno logo depois.

---

## 🚀 Rodando localmente

### Pré-requisitos

- Node.js 20 ou mais novo
- A [Braz API](https://github.com/Geovanni-dev/Braz-extensionista-II) rodando

### Passos

```bash
# 1. Instale as dependências
npm install

# 2. Crie seu .env a partir da referência
cp .env.example .env

# 3. Suba o servidor de desenvolvimento
npm run dev
```

### Variáveis de ambiente

| Variável        | Descrição                                              |
| --------------- | ------------------------------------------------------ |
| `VITE_API_URL`  | URL base da API, sem barra no final                     |

A API precisa ter essa origem listada no `CLIENT_URL` dela, senão o CORS bloqueia todas as requisições.

---

## 🌐 Deploy

Build estático hospedado na **Render**.

```bash
npm run build
```

A saída vai para `dist/`. Depois de publicar, acrescente o endereço ao `CLIENT_URL` da API.

---

## 📄 Licença

**[MIT](./LICENSE) © Geovani Eterno Rodrigues**

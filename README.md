<div align="right">
  <a href="./README.pt.md">🇧🇷 Português</a>
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

## 📋 About

Frontend of **Braz**, an educational assistant built for a single 9th grade class at Colégio Estadual Umbelina Braz Gomides, in Cirilândia, Santa Isabel, Goiás. It was developed as **Projeto Extensionista II: Tecnologia Aplicada à Inclusão Digital**, part of the Systems Analysis and Development course at Centro Universitário Internacional UNINTER.

Two areas share one application. Students get a chat that answers doubts about the subject of the class currently open. Teachers get a panel to open, pause and close a class, and to read one report per student at the end of it.

The interface is used almost entirely on **school Chromebooks**, which shaped a good part of it: two themes, a layout that survives a narrow screen, and a first paint that never leaves the student looking at an empty page.

Backend repository: [Braz-extensionista-II](https://github.com/Geovanni-dev/Braz-extensionista-II)

---

## 🛠 Tech Stack

| Layer          | Technology                            |
| -------------- | ------------------------------------- |
| Library        | React 19                              |
| Language       | TypeScript                            |
| Build          | Vite                                  |
| Styling        | Tailwind CSS (CDN) + shared constants |
| Routing        | React Router                          |
| Realtime       | EventSource (Server Sent Events)      |
| Icons          | Font Awesome                          |
| Fonts          | Poppins and Nunito                    |
| Code Quality   | ESLint + Prettier                     |

---

## 🗂️ Project Structure

```text
braz-front/
├── public/images/                # Marks, icons and illustrations
├── src/
│   ├── api/client.ts             # fetch wrapper, token and typed errors
│   ├── Chat/                     # Student area
│   │   ├── components/           # Side bar, message field, bubble
│   │   ├── services/             # Calls to /chat and /aula
│   │   └── Chat.tsx              # SSE, history and send
│   ├── Login/                    # Student sign in, sign up and password reset
│   │   ├── components/           # Email, password and code fields
│   │   ├── services/
│   │   └── telas/                # One screen per step
│   ├── Professor/                # Teacher sign in
│   │   └── telas/                # Teacher list and access key
│   ├── Painel/                   # Teacher area
│   │   ├── services/
│   │   └── telas/                # Class tab and reports tab
│   ├── Legal/                    # Terms of use and privacy policy
│   ├── components/               # Shared: alert, waves, footer, top bar
│   ├── estilos.ts                # Repeated class strings
│   ├── tema.ts                   # Light and dark theme
│   ├── sessao.ts                 # Reads the token expiry, schedules the logout
│   └── App.tsx                   # Routes and the two authenticated areas
└── index.html                    # Tailwind config, fonts and theme bootstrap
```

---

## ✨ Features

**The student never waits on a blank page.** The first sync goes out on mount instead of waiting for the SSE stream to say hello, the class and the history are fetched in parallel on the first load, and a skeleton in the shape of the conversation fills the gap. That took the time to first paint from around 5.5s to roughly 2.3s.

**The chat opens and closes on its own.** An `EventSource` on `/aula/eventos` tells the page that something changed and it refetches the state, so a student sitting on the waiting screen sees the chat unlock the moment the teacher opens the class, with no reload.

**Reports that failed can be recovered from the panel.** A class still missing reports shows an icon next to the subject name. One click asks the server to generate only what is missing, and the icon disappears when the count reaches zero.

**Expired sessions never reach a logged in screen.** `sessao.ts` reads the token's `exp` while the first state is being built, so an expired token opens the login instead of flashing the chat. A token that expires with the tab open logs out on its own, and any 401 drops the session.

**Two themes, one switch.** Tailwind runs in class mode, and a script in `<head>` applies the theme before React mounts so the screen never flashes in the wrong one.

**It works on a phone.** The side bars give way to a shared top bar, the teacher's panel becomes a single column with bottom tabs, and the reports turn into a two step navigation.

**The browser saves the login.** The fields carry the right `name` and `autocomplete`, including a hidden user field on the teacher screen, so the browser keeps one credential per teacher instead of one for the whole site.

---

## 🗺️ Routes

| Route          | Description                                        |
| -------------- | -------------------------------------------------- |
| `/`            | Student area: login or chat, depending on the token |
| `/professor`   | Teacher area: login or panel                        |
| `/termos`      | Terms of use                                        |
| `/privacidade` | Privacy policy                                      |

Each role keeps its own key in `localStorage` (`braz:token:aluno` and `braz:token:professor`), because the same browser is used by the teacher to open the class and by a student right after.

---

## 🚀 Running Locally

### Prerequisites

- Node.js 20 or newer
- The [Braz API](https://github.com/Geovanni-dev/Braz-extensionista-II) running

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Create your .env from the reference
cp .env.example .env

# 3. Start the development server
npm run dev
```

### Environment variables

| Variable        | Description                                         |
| --------------- | --------------------------------------------------- |
| `VITE_API_URL`  | Base URL of the API, with no trailing slash          |

The API must have this origin listed in its `CLIENT_URL`, otherwise CORS blocks every request.

---

## 🌐 Deployment

Static build hosted on **Render**.

```bash
npm run build
```

The output goes to `dist/`. After publishing, add the address to the API's `CLIENT_URL`.

---

## 📄 License

**MIT © Geovani Eterno Rodrigues**

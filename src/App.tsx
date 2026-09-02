import { useState } from 'react'
import Chat from './Chat/Chat'
import Login from './Login/Login'

const CHAVE_TOKEN = 'braz:token'

/* The token lives in localStorage so a refresh doesn't send the student back to the
login screen. It expires in 8h on the backend, and the chat drops it on any 401. */
function App() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(CHAVE_TOKEN),
  )

  const autenticar = (novoToken: string) => {
    localStorage.setItem(CHAVE_TOKEN, novoToken)
    setToken(novoToken)
  }

  const sair = () => {
    localStorage.removeItem(CHAVE_TOKEN)
    setToken(null)
  }

  if (!token) {
    return <Login aoAutenticar={autenticar} />
  }

  return <Chat token={token} aoSair={sair} />
}

export default App

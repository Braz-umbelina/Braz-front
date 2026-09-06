import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Chat from "./Chat/Chat";
import Login from "./Login/Login";
import Painel from "./Painel/Painel";
import Professor from "./Professor/Professor";

const CHAVE_TOKEN_ALUNO = "braz:token:aluno";
const CHAVE_TOKEN_PROFESSOR = "braz:token:professor";

/* The token lives in localStorage so a refresh doesn't send the student back to the
login screen. It expires in 8h on the backend, and the chat drops it on any 401. */
function AreaAluno() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(CHAVE_TOKEN_ALUNO),
  );

  const autenticar = (novoToken: string) => {
    localStorage.setItem(CHAVE_TOKEN_ALUNO, novoToken);
    setToken(novoToken);
  };

  const sair = () => {
    localStorage.removeItem(CHAVE_TOKEN_ALUNO);
    setToken(null);
  };

  if (!token) {
    return <Login aoAutenticar={autenticar} />;
  }

  return <Chat token={token} aoSair={sair} />;
}

/* Each role keeps its own key: the same browser is used by the teacher to open the
class and by a student right after, and one login must not overwrite the other. */
function AreaProfessor() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(CHAVE_TOKEN_PROFESSOR),
  );

  const autenticar = (novoToken: string) => {
    localStorage.setItem(CHAVE_TOKEN_PROFESSOR, novoToken);
    setToken(novoToken);
  };

  const sair = () => {
    localStorage.removeItem(CHAVE_TOKEN_PROFESSOR);
    setToken(null);
  };

  if (!token) {
    return <Professor aoAutenticar={autenticar} />;
  }

  return <Painel token={token} aoSair={sair} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AreaAluno />} />
        <Route path="/professor" element={<AreaProfessor />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

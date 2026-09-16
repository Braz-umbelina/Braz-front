import { useCallback, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Chat from "./Chat/Chat";
import Login from "./Login/Login";
import Privacidade from "./Legal/Privacidade";
import Termos from "./Legal/Termos";
import Painel from "./Painel/Painel";
import Professor from "./Professor/Professor";
import { lerSessao, useExpiracaoDaSessao } from "./sessao";
import { useAlturaVisual } from "./useAlturaVisual";

const CHAVE_TOKEN_ALUNO = "braz:token:aluno";
const CHAVE_TOKEN_PROFESSOR = "braz:token:professor";

function AreaAluno() {
  const [token, setToken] = useState<string | null>(() =>
    lerSessao(CHAVE_TOKEN_ALUNO),
  );

  const autenticar = (novoToken: string) => {
    localStorage.setItem(CHAVE_TOKEN_ALUNO, novoToken);
    setToken(novoToken);
  };

  const sair = useCallback(() => {
    localStorage.removeItem(CHAVE_TOKEN_ALUNO);
    setToken(null);
  }, []);

  useExpiracaoDaSessao(token, sair);

  if (!token) {
    return <Login aoAutenticar={autenticar} />;
  }

  return <Chat token={token} aoSair={sair} />;
}

function AreaProfessor() {
  const [token, setToken] = useState<string | null>(() =>
    lerSessao(CHAVE_TOKEN_PROFESSOR),
  );

  const autenticar = (novoToken: string) => {
    localStorage.setItem(CHAVE_TOKEN_PROFESSOR, novoToken);
    setToken(novoToken);
  };

  const sair = useCallback(() => {
    localStorage.removeItem(CHAVE_TOKEN_PROFESSOR);
    setToken(null);
  }, []);

  useExpiracaoDaSessao(token, sair);

  if (!token) {
    return <Professor aoAutenticar={autenticar} />;
  }

  return <Painel token={token} aoSair={sair} />;
}

function App() {
  useAlturaVisual();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AreaAluno />} />
        <Route path="/professor" element={<AreaProfessor />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

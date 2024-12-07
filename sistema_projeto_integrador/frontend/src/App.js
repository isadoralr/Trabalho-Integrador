import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Agenda from "./Componentes/componentesJS/Agenda";
import Clientes from "./Componentes/componentesJS/Clientes";
import CadastroOrcamento from "./Componentes/componentesJS/CadastroOrcamento";
import HistoricoServico from "./Componentes/componentesJS/HistoricoServico";
import MateriaisFerramentas from "./Componentes/componentesJS/MateriaisFerramentas";
import Painel from "./Componentes/componentesJS/Painel";
import Relatorios from "./Componentes/componentesJS/Relatorios";
import Login from "./LoginLogout/Login";
import Logout from "./LoginLogout/Logout";
import DashboardLayoutBasic from "./DashBoard/TelaInicial";
import axios from "axios";

// Configuração global do Axios
axios.defaults.baseURL = "http://localhost:3001/";
axios.defaults.headers.common["Content-Type"] = "application/json;charset=utf-8";

// Função para proteger rotas
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Verifica se há um token salvo e define o estado de login
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        // Remove o token do armazenamento local e desloga o usuário
        localStorage.removeItem("token");
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={isLoggedIn ? <Navigate to="/TelaInicial" /> : <Login setIsLoggedIn={setIsLoggedIn} />}
                />
                <Route
                    path="/TelaInicial"
                    element={
                      <PrivateRoute>
                        <DashboardLayoutBasic handleLogout={handleLogout} />
                      </PrivateRoute>
                    }
                >
                    <Route path="Painel" element={<Painel />} />
                    <Route path="Agenda" element={<Agenda />} />
                    <Route path="Clientes" element={<Clientes/>} />
                    <Route path="HistoricoServico" element={<HistoricoServico />} />
                    <Route path="CadastroOrcamento" element={<CadastroOrcamento />} />
                    <Route path="MateriaisFerramentas" element={<MateriaisFerramentas />} />
                    <Route path="Relatorios" element={<Relatorios />} />
                    <Route path="Sair" element={<Logout/>} />
                </Route>
                <Route path="/Logout" element={<Logout />} />
                {/* Redireciona qualquer rota não definida */}
                <Route path="*" element={<Navigate to={isLoggedIn ? "/TelaInicial" : "/"} replace />} />
            </Routes>
        </Router>
    );
}

export default App;

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard"; // Página protegida
import axios from "axios";

// Configuração global do Axios
axios.defaults.baseURL = "http://localhost:3000/";
axios.defaults.headers.common["Content-Type"] = "application/json;charset=utf-8";

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
                {/* Rotas públicas */}
                <Route
                    path="/login"
                    element={isLoggedIn ? <Navigate to="/TelaInicial" /> : <Login setIsLoggedIn={setIsLoggedIn} />}
                />
                {/* Rotas protegidas */}
                <Route
                    path="/TelaInicial"
                    element={isLoggedIn ? <Dashboard handleLogout={handleLogout} /> : <Navigate to="/login" />}
                />

                {/* Redireciona qualquer rota não definida */}
                <Route path="*" element={<Navigate to={isLoggedIn ? "/TelaInicial" : "/login"} />} />
            </Routes>
        </Router>
    );
}

export default App;

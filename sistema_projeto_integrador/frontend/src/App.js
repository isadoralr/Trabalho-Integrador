import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import TelaInicial from "./components/TelaInicial";
import Login from "./components/Login";
import Cadastro from "./components/Cadastro";
import Dashboard from "./components/Dashboard"; // Página protegida
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000/";
axios.defaults.headers.common["Content-Type"] = "application/json;charset=utf-8";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Verifica se há um token salvo
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <Routes>
                {/* Rotas públicas */}
                <Route path="/Login" element={isLoggedIn ? <Navigate to="/TelaInicial" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/cadastro" element={<Cadastro />} />

                {/* Rotas protegidas */}
                <Route
                    path="/TelaInicial"
                    element={isLoggedIn ? <Dashboard handleLogout={handleLogout} /> : <Navigate to="/Login" />}
                />

                {/* Página inicial redireciona para login */}
                <Route path="*" element={<Navigate to={isLoggedIn ? "/TelaInicial" : "/Login"} />} />
            </Routes>
        </Router>
    );
}

export default App;

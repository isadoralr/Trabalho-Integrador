import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import Agenda from "./Componentes/componentesJS/Agenda";
import CadastroCliente from "./Componentes/componentesJS/CadastroCliente";
import CadastroOrcamento from "./Componentes/componentesJS/CadastroOrcamento";
import HistoricoServico from "./Componentes/componentesJS/HistoricoServico";
import MateriaisFerramentas from "./Componentes/componentesJS/MateriaisFerramentas";
import Painel from "./Componentes/componentesJS/Painel";
import Relatorios from "./Componentes/componentesJS/Relatorios";
import Login from "./LoginLogout/Login";
import Logout from "./LoginLogout/Logout";
import DashboardLayoutBasic from "./DashBoard/TelaInicial";
import "./LoginLogout/Login.css";

// Função para proteger rotas
const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem("token") !== null;
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

// Definir rotas
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/TelaInicial",
    element: <PrivateRoute />, // Proteger as rotas
    children: [
      {
        path: "/TelaInicial",
        element: <DashboardLayoutBasic />,
        children: [
          { path: "/TelaInicial/Painel", element: <Painel /> },
          { path: "/TelaInicial/Agenda", element: <Agenda /> },
          { path: "/TelaInicial/CadastroCliente", element: <CadastroCliente /> },
          { path: "/TelaInicial/HistoricoServico", element: <HistoricoServico /> },
          { path: "/TelaInicial/CadastroOrcamento", element: <CadastroOrcamento /> },
          { path: "/TelaInicial/MateriaisFerramentas", element: <MateriaisFerramentas /> },
          { path: "/TelaInicial/Relatorios", element: <Relatorios /> },
        ],
      },
    ],
  },
  {
    path: "/logout",
    element: <Logout />, // Adicionar página de logout
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Agenda from "./Componentes/componentesJS/Agenda";
import CadastroCliente from "./Componentes/componentesJS/CadastroCliente"; 
import CadastradoOrcamento from "./Componentes/componentesJS/CadastroOrcamento"; 
import HistoricoServico from "./Componentes/componentesJS/HistoricoServico"; 
import MateriaisFerramentas from "./Componentes/componentesJS/MateriaisFerramentas";
import Painel from "./Componentes/componentesJS/Painel";
import Relatorios from "./Componentes/componentesJS/Relatorio";
import Login from "./LoginLogout/Login";
import "./LoginLogout/Login.css";
import DashboardLayoutBasic from "./DashBoard/TelaInicial";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/TelaInicial",
    element: <DashboardLayoutBasic />,
    children: [
      {
        path: "Painel",
        element: <Painel />,
      },
      {
        path: "Agenda",
        element: <Agenda />,
      },
      {
        path: "CadastroCliente",
        element: <CadastroCliente />,
      },
      {
        path: "HistoricoServico",
        element: <HistoricoServico />,
      },
      {
        path: "CadastradoOrcamento",
        element: <CadastradoOrcamento />,
      },
      {
        path: "MateriaisFerramentas",
        element: <MateriaisFerramentas />,
      },
      {
        path: "Relatorios",
        element: <Relatorios />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

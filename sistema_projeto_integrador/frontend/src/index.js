import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';
import { createBrowserRouter , RouterProvider } from 'react-router-dom';



import Agenda from "./Componenetes/componentesJS/Agenda";
import CadastroCliente from "./Componenetes/componentesJS/CadastroCliente"; 
import CadastradoOrcamento from "./Componenetes/componentesJS/CadastroOrcamento"; 
import HistoricoServico from "./Componenetes/componentesJS/HistoricoServico"; 
import MateriaisFerramentas from "./Componenetes/componentesJS/MeteriaisFerramentas";
import Painel from "./Componenetes/componentesJS/Painel";
import Relatorios from "./Componenetes/componentesJS/Relatorio";
import Login from "./LoginLogout/Login";
import "./LoginLogout/Login.css";
import DashboardLayoutBasic from "./DashBoard/TelaInicial";

const router = createBrowserRouter([
  {
    path:"/",
    element:<Login/>,
  },
  {
    path:"/TelaInicial",
    element:<DashboardLayoutBasic/>,
    children: [
      {
        path:"/TelaInicial/Painel",
        element:<Painel/>
      },
      {
        path:"/TelaInicial/Agenda",
        element: <Agenda/>
      },
      {
        path:"/TelaInicial/CadastroCliente",
        element:<CadastroCliente/>,
      },
      {
        path:"/TelaInicial/HistoricoServico",
        element:<HistoricoServico/>,
      },
      {
        path:"/TelaInicial/cadastradoOrcamento",
        element:<CadastradoOrcamento/>,
      },
      {
        path:"/TelaInicial/MateriaisFerramentas",
        element:<MateriaisFerramentas/>,
      },
      {
        path:"/TelaInicial/Relatorios",
        element:<Relatorios/>,
      },
    ],
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
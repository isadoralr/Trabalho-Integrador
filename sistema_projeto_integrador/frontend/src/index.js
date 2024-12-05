import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';
import { createBrowserRouter , RouterProvider } from 'react-router-dom';



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
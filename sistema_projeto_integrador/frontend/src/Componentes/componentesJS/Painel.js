import React, { useState, useEffect } from "react";
import axios from "axios";
import "../componentesCSS/Painel.css";

const Dashboard = () => {
  const [servicos, setServicos] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);

  useEffect(() => {
    const fetchServicos = async () => {
      const response = await axios.get("/servicos");
      setServicos(response.data);
    };

    const fetchOrcamentos = async () => {
      const response = await axios.get("/orcamentos");
      setOrcamentos(response.data);
    };

    fetchServicos();
    fetchOrcamentos();
  }, []);

  // Função para formatar datas no formato dd/mm/yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  // Função para mapear status para textos descritivos
  const getStatusText = (status) => {
    switch (status) {
      case "pen":
        return "Pendente";
      case "rej":
        return "Rejeitado";
      case "and":
        return "Em Andamento";
      case "fin":
        return "Finalizado";
      default:
        return "Desconhecido";
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Painel de Controle</h1>

      <section className="dashboard-section">
        <h2 className="section-title">Serviços</h2>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Cliente</th>
              <th>Status</th>
              <th>Endereço</th>
              <th>Data Início</th>
              <th>Data Conclusão</th>
            </tr>
          </thead>
          <tbody>
            {servicos.map((servico) => (
              <tr key={servico.sid}>
                <td>{servico.sid}</td>
                <td>{servico.servico_nome}</td>
                <td>{servico.cliente_nome}</td>
                <td className={`status ${servico.stts}`}>
                  {getStatusText(servico.stts)}
                </td>
                <td>{servico.endr}</td>
                <td>{formatDate(servico.dti)}</td>
                <td>{formatDate(servico.dtc)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="dashboard-section">
        <h2 className="section-title">Orçamentos</h2>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Cliente</th>
              <th>Status</th>
              <th>Endereço</th>
              <th>Data Início</th>
              <th>Data Conclusão</th>
            </tr>
          </thead>
          <tbody>
            {orcamentos.map((orcamento) => (
              <tr key={orcamento.sid}>
                <td>{orcamento.sid}</td>
                <td>{orcamento.orcamento_nome}</td>
                <td>{orcamento.cliente_nome}</td>
                <td className={`status ${orcamento.stts}`}>
                  {getStatusText(orcamento.stts)}
                </td>
                <td>{orcamento.endr}</td>
                <td>{formatDate(orcamento.dti)}</td>
                <td>{formatDate(orcamento.dtc)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Dashboard;

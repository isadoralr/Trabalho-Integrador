import React, { useState } from "react";
import axios from "axios";
import "../componentesCSS/Agenda.css";

const Agenda = () => {
  const [data, setData] = useState("");
  const [agenda, setAgenda] = useState([]);
  const [error, setError] = useState("");

  const handleBuscarAgenda = async () => {
    try {
      setError("");
      const response = await axios.get("/agenda", { params: { data } });
      setAgenda(response.data);
    } catch (err) {
      setError("Erro ao buscar na agenda. Verifique a data ou tente novamente.");
    }
  };

  return (
    <div className="agenda-container">
      <h1 className="agenda-title">Agenda de Serviços</h1>

      <div className="agenda-filtro">
        <label htmlFor="data">Selecione uma data:</label>
        <input
          type="date"
          id="data"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <button onClick={handleBuscarAgenda}>Buscar</button>
      </div>

      {error && <p className="agenda-error">{error}</p>}

      {agenda.length > 0 ? (
        <table className="agenda-tabela">
          <thead>
            <tr>
              <th>Data</th>
              <th>Serviço</th>
              <th>Cliente</th>
              <th>Turno</th>
              <th>Hora Início</th>
              <th>Hora Fim</th>
            </tr>
          </thead>
          <tbody>
            {agenda.map((item, index) => (
              <tr key={index}>
                <td>{new Date(item.dia).toLocaleDateString("pt-BR")}</td>
                <td>{item.servico_nome}</td>
                <td>{item.cliente_nome}</td>
                <td>{item.turno_num}</td>
                <td>{item.hora_inicio}</td>
                <td>{item.hora_fim}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="agenda-empty">Nenhum serviço encontrado para esta data.</p>
      )}
    </div>
  );
};

export default Agenda;

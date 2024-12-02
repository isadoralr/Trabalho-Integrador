import React, { useState } from "react";
import axios from "axios";

function CadastroCliente() {
  const [cliente, setCliente] = useState({
    nome: "",
    email: "",
    telefone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envia os dados para o backend (rota fictícia, ajuste conforme necessário)
      await axios.post("http://localhost:3001/cadastrar-cliente", cliente);
      alert("Cliente cadastrado com sucesso!");
      setCliente({ nome: "", email: "", telefone: "", endereco: "" });
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      alert("Erro ao cadastrar cliente. Tente novamente.");
    }
  };

  return (
    <div className="cadastro-cliente-container">
      <h1>Cadastro de Cliente</h1>
      <form className="cadastro-cliente-form" onSubmit={handleSubmit}>
        <label>
          Nome:
          <input
            type="text"
            name="nome"
            value={cliente.nome}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={cliente.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Telefone:
          <input
            type="tel"
            name="telefone"
            value={cliente.telefone}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default CadastroCliente;

import React, { useState } from "react";
import { TextField, Box, Button, Alert, Grid, Typography } from "@mui/material";
import axios from "axios";
import "../componentesCSS/CadastroFerramenta.css"; // Arquivo CSS

const CadastroFerramenta = () => {
  const [formData, setFormData] = useState({
    nome: "",
    valu: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const formatCurrency = (value) => {
    // Remove caracteres não numéricos
    const numericValue = value.replace(/\D/g, "");
    // Formata como moeda
    const formattedValue = (Number(numericValue) / 100).toFixed(2).replace('.', ',');
    return formattedValue;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Formatação do preço
    if (name === "valor") {
      setFormData({ ...formData, valu: formatCurrency(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = "O nome da ferramenta é obrigatório.";
    if (!formData.valu.trim()) newErrors.valu = "O valor unitário é obrigatório.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateFields()) {
      try {
        await axios.post("/cadastro-ferramenta", formData);
        setSuccessMessage("Ferramenta cadastrada com sucesso!");
        setFormData({ nome: "", valu: "" });
        setErrors({});
      } catch (err) {
        console.error(err);
        setErrorMessage("Erro ao cadastrar ferramenta. Tente novamente.");
      }
    }
  };

  return (
    <Box
      className="cadastro-ferramenta-form"
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, margin: "auto", padding: "20px" }}
    >
      <Typography variant="h5" component="h1" className="cadastro-ferramenta-titulo">
        Cadastro de Ferramenta
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="nome"
            label="Nome da Ferramenta"
            value={formData.nome}
            onChange={handleChange}
            error={!!errors.nome}
            helperText={errors.nome}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="valor"
            label="Valor Unitário"
            value={formData.valu}
            onChange={handleChange}
            error={!!errors.valu}
            helperText={errors.valu}
            required
            fullWidth
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Cadastrar
        </Button>
      </Box>
      {successMessage && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      )}
    </Box>
  );
};

export default CadastroFerramenta;

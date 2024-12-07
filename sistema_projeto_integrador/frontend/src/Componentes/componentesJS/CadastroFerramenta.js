import { TextField, Box, Button, Alert, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import Grid from '@mui/material/Grid2'; // Usando Grid2

const CadastroFerramenta = ({ onClose, setFerramentas }) => {
  const [formData, setFormData] = useState({
    nome: "",
    valu: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const formatCurrency = (value) => {
    const numericValue = value.replace(/\D/g,'');
    const formattedValue = (Number(numericValue) / 100).toFixed(2).replace('.', ',');
    return formattedValue;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
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
        const response = await axios.post("/cadastro-ferramenta", formData);
        setSuccessMessage("Ferramenta cadastrada com sucesso!");
        setFerramentas((prev) => [...prev, response.data]);
        setFormData({ nome: "", valu: "" });
        setErrors({});
        onClose(); // Fechar o diálogo ao sucesso
      } catch (err) {
        console.error(err);
        setErrorMessage("Erro ao cadastrar ferramenta. Tente novamente.");
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Typography 
        sx={{ textAlign: 'center', marginBottom: 2 }}
        variant="h5" 
        component="h1"
      >
        Cadastrar nova Ferramenta
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

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {/* <Grid item xs={12}> */}
          <Button 
            size="medium"
            type="submit" 
            variant="contained" 
            color="primary" 
            // fullWidth
          >
            Cadastrar
          </Button>
        {/* </Grid> */}
        {/* <Grid  item xs={12}> */}
          <Button 
            size="medium"
            onClick={onClose} 
            variant="outlined" 
            color="secondary" 
            // fullWidth
          >
            Cancelar
          </Button>
        {/* </Grid> */}
      </Grid>

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

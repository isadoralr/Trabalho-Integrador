import React, { useState } from "react";
import { TextField, Box, Button, Alert, Typography } from "@mui/material";
import axios from "axios";
import Grid from '@mui/material/Grid2'; // Usando Grid2

import "../componentesCSS/CadastroCliente.css"; // Arquivo CSS

const CadastroCliente = () => {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Função para formatar o telefone
  const formatTelefone = (value) => {
    // Remove caracteres não numéricos
    const onlyNumbers = value.replace(/[^\d]/g, "");

    // Formata no padrão (XX) XXXXX-XXXX
    if (onlyNumbers.length <= 2) return `(${onlyNumbers}`;
    if (onlyNumbers.length <= 7) return `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2)}`;
    return `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2, 7)}-${onlyNumbers.slice(7, 11)}`;
  };

  // Validação do email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Formatação do telefone
    if (name === "telefone") {
      setFormData({ ...formData, telefone: formatTelefone(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = "O nome do cliente é obrigatório.";
    if (!formData.telefone.trim()) newErrors.telefone = "O telefone é obrigatório.";
    if (formData.telefone.length > 15) newErrors.telefone = "O telefone deve ter no máximo 14 caracteres.";
    if (formData.email && !isValidEmail(formData.email)) newErrors.email = "Formato de email inválido.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateFields()) {
      try {
        await axios.post("/cadastro-cliente", formData);
        setSuccessMessage("Cliente cadastrado com sucesso!");
        setFormData({ nome: "", telefone: "", email: "" });
        setErrors({});
      } catch (err) {
        console.error(err);
        setErrorMessage("Erro ao cadastrar cliente. Tente novamente.");
      }
    }
  };

  return (
    <Box>
      <Box
       borderRadius="30px" border="2px solid gray" // define a borda
       sx={{
         '& .MuiTextField-root': { m: 1, width: '100%' },
         maxWidth: '1000px',
         margin: '0 auto',
       }}
       component="form"
       onSubmit={handleSubmit}
       >
      <Typography 
      sx={{
        textAlign:'center',
        marginTop:'10px',
        marginBottom: '10px',
      }}
      variant="h5" 
      component="h1"
      > Cadastro de Cliente
      </Typography>  

      <Grid container spacing={2}>
        <Grid xs={12} sm={6} sx={{width:'40%',marginLeft:'5%'}}>
          <TextField
          name="nome"
          label="Nome do Cliente"
          value={formData.nome}
          onChange={handleChange}
          error={!!errors.nome}
          helperText={errors.nome}
          required
          fullWidth
          >
          </TextField>
        </Grid>
        <Grid xs={12} sm={6} sx={{width:'40%',marginLeft:'5%'}}>
        <TextField
            name="telefone"
            label="Telefone"
            type="tel"
            value={formData.telefone}
            onChange={handleChange}
            error={!!errors.telefone}
            helperText={errors.telefone}
            required
            fullWidth
          />
        </Grid>
      </Grid>
      
      <Grid container spacing={1} sx={{ mt: 2 }} marginLeft="5%" marginRight="5%">
      <TextField
        name="email"
        label="Email (Opcional)"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        // fullWidth
      />        
      </Grid>
      <Grid container spacing={1} sx={{ mt: 2 }} 
      marginLeft="5%" marginRight="5%" marginBottom="20px">
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Cadastrar
        </Button>
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
    </Box>
  );
};

export default CadastroCliente;

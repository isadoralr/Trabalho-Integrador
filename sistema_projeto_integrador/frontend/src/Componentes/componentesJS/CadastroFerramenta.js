import { TextField, Box, Button, Alert, Typography } from "@mui/material";
import axios from "axios";
import React from  'react';
import { useState } from "react";
import Grid from '@mui/material/Grid2'; // Usando Grid2


const Relatorios = () => {
  const [formData, setFormData] = useState({
    nome: "",
    valu: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const formatCurrency = (value) => {
    // Remove caracteres não numéricos
    const numericValue = value.replace(/\D/g,'');
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
      > Cadastro de Ferramenta
      </Typography>
      
      <Grid container spacing={2}>
      <Grid xs={12} sm={6} sx={{width:'40%',marginLeft:'5%'}}>
          <TextField
            name="nome"
            label="Nome da Ferramenta"
            value={formData.nome}
            onChange={handleChange}
            error={!!errors.nome}
            helperText={errors.nome}
            required
            // fullWidth
          />
      </Grid>
      <Grid xs={12} sm={6} sx={{width:'40%',marginLeft:'5%'}}>
          <TextField
            name="valor"
            label="Valor Unitário"
            value={formData.valu}
            onChange={handleChange}
            error={!!errors.valu}
            helperText={errors.valu}
            required
            // fullWidth
          />
      </Grid>
      </Grid>

      <Grid
      container spacing={1} sx={{ mt: 0 ,marginBottom:'10px'}}>
        {/* <Box sx={{ mt: 2,marginLeft:'100%'}}> */}
        <Button 
        sx={{marginLeft:'30%' ,marginRight:'30%'}}
        type="submit" variant="contained" color="primary" fullWidth>
        Cadastrar
        </Button>
      </Grid>
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
  )
}

export default Relatorios;
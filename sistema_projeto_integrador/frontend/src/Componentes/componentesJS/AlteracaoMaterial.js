import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import Grid from '@mui/material/Grid2'; // Usando Grid2
import axios from 'axios';

const AlteracaoMaterial = ({ material, setMateriais, onClose }) => {
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
      
  useEffect(() => {
    if (material) {
      setFormData({ nome: material.nome, valu: material.valu });
    }
  }, [material]);

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
    if (!formData.nome.trim()) newErrors.nome = "O nome da material é obrigatório.";
    if (!formData.valu.trim()) newErrors.valu = "O valor unitário é obrigatório.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateFields()) {
      try {
        await axios.put(`/materiais/${material.mid}`, formData);
        setSuccessMessage("Material cadastrado com sucesso!");
        setMateriais((prev) =>
        prev.map((m) =>
            m.mid === material.mid ? { ...m, nome: formData.nome, valu: formData.valu } : m
          )
        );
        setErrors({});
        onClose();
      } catch (err) {
        console.error('Erro ao atualizar material:', err);
        setErrorMessage("Erro ao atualizar material. Tente novamente.");
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Typography 
        sx={{ textAlign: 'center', marginBottom: 2}}
        variant="h5" 
        component="h1"
      >
        Editar Material
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="nome"
            label="Nome do Material"
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
            label="Preço Unitário"
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
        <Grid item xs={6}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
          >
            Salvar
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button 
            onClick={onClose} 
            variant="outlined" 
            color="secondary" 
            fullWidth
          >
            Cancelar
          </Button>
        </Grid>
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

export default AlteracaoMaterial;

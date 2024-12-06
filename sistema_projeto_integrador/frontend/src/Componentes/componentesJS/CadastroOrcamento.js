import React, { useState } from 'react';
import { TextField, Box, Button, Alert } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InputManager from '../Funcao/MultiInput';
import Grid from '@mui/material/Grid2'; // Usando Grid2

const CurrencyInput = () => {
  const [value, setValue] = useState('');
  const [nomeorcamento, setNomercamento] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState([]);

  const formatCurrency = (value) => {
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = (Number(numericValue) / 100).toFixed(2).replace('.', ',');
    return formattedValue;
  };

  const handleChange = (event) => {
    const rawValue = event.target.value;
    const formattedValue = formatCurrency(rawValue);
    setValue(formattedValue);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!nomeorcamento) newErrors.nomeorcamento = 'O nome do orçamento é obrigatório.';
    if (!value || value === '0,00') newErrors.value = 'O valor da mão de obra é obrigatório.';
    if (!startDate) newErrors.startDate = 'A data inicial é obrigatória.';
    if (!endDate) newErrors.endDate = 'A data final é obrigatória.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      console.log({
        nomeorcamento,
        value,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        formData,
      });
    }
  };

  const handleDynamicInputChange = (values) => {
    setFormData(values); // Atualiza o estado com os pares entrada/saída
  };

  return (
    <Box
      sx={{
        '& .MuiTextField-root': { m: 1, width: '100%' },
        maxWidth: '1000px',
        margin: '0 auto',
      }}
      component="form"
      onSubmit={handleSubmit}
    >
      {/* Primeira linha: 2 inputs */}
      <Grid container spacing={2}>
        <Grid xs={12} sm={6}
        sx={{width:'40%'}}
        >
          <TextField
            required
            label="Nome do orçamento"
            placeholder="Digite um nome"
            value={nomeorcamento}
            onChange={(e) => setNomercamento(e.target.value)}
            error={!!errors.nomeorcamento}
            helperText={errors.nomeorcamento}
          />
        </Grid>
        <Grid xs={12} sm={6} sx={{width:'40%'}}>
          <TextField
            required
            label="Mão de Obra / h"
            value={value}
            onChange={handleChange}
            placeholder="Digite um valor"
            variant="outlined"
            error={!!errors.value}
            helperText={errors.value}
          />
        </Grid>
      </Grid>

      {/* Segunda linha: 2 inputs */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid xs={12} sm={6} sx={{width:'40%'}}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Data de Início"
              value={startDate}
              onChange={setStartDate}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!!errors.startDate}
                  helperText={errors.startDate}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid xs={12} sm={6} sx={{width:'40%'}}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Data de Finalização"
              value={endDate}
              onChange={setEndDate}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!!errors.endDate}
                  helperText={errors.endDate}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      {/* Terceira linha: InputManager */}
      <Box sx={{ mt: 2 }}>
        <InputManager onChange={handleDynamicInputChange} />
      </Box>

      {/* Botão de envio */}
      <Box sx={{ mt: 2 }}>
        <Button type="submit" variant="outlined">
          Cadastrar
        </Button>
      </Box>

      {/* Alerta de erro */}
      {Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Preencha todos os campos obrigatórios.
        </Alert>
      )}
    </Box>
  );
};

export default CurrencyInput;

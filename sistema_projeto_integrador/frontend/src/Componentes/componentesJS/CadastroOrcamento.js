import React, { useState } from 'react';
import { TextField, Box, Button, Alert } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const CurrencyInput = () => {
  const [value, setValue] = useState('');
  const [nomeorcamento, setNomercamento] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [errors, setErrors] = useState({});

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
      });
      // Clear form fields after submission if needed
    }
  };

  return (
    <Box
      sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
      component="form"
      onSubmit={handleSubmit}
    >
      <Box>
        <TextField
          required
          id="outlined-required"
          label="Nome do orçamento"
          placeholder="Digite um nome"
          value={nomeorcamento}
          onChange={(e) => setNomercamento(e.target.value)}
          error={!!errors.nomeorcamento}
          helperText={errors.nomeorcamento}
        />
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker
              label="Data de Inicio"
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
          </DemoContainer>
        </LocalizationProvider>
      </Box>
      <Button type="submit" variant="outlined" sx={{ mt: 2 }}>
        Cadastrar
      </Button>
      {Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Preencha todos os campos obrigatórios.
        </Alert>
      )}
    </Box>
  );
};

export default CurrencyInput;

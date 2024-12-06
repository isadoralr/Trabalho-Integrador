import React, { useState } from 'react';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InputManager from '../../Funcoes/MultiInput';
import Grid from '@mui/material/Grid2'; // Usando Grid2
import Typography from '@mui/material/Typography';

import {
  // Table,
  Alert,
  TextField,
  Box,
  // TableBody,
  // TableCell,
  // TableContainer,
  // TableHead,
  // TableRow,
  // IconButton,
  Button,
} from '@mui/material';


const CurrencyInput = () => {
  /*forms para salvar os valores dos inputs */
  const [value, setValue] = useState('');//valor da mao de obra / h
  const [nomeorcamento, setNomercamento] = useState('');// para o nome do orcamento
  const [startDate, setStartDate] = useState(null);//inicio da data
  const [endDate, setEndDate] = useState(null);//fim da data
  const [formData, setFormData] = useState([]);//para os turnos
  
  /* para pegar uma mansagem de erro*/
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
        startDate: startDate.format('DD-MM-YYYY'),
        endDate: endDate.format('DD-MM-YYYY'),
        formData,
      });
    }
  };

  const handleDynamicInputChange = (values) => {
    setFormData(values); // Atualiza o estado com os pares entrada/saída
  };

  return (
    <Box>
    {/*box para conter o cadastro do orcamento */}
    <Box borderRadius="30px" border="2px solid gray" // define a borda
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
      > Cadastro de Orcamento </Typography>
   
      <Grid container spacing={2}>
        <Grid xs={12} sm={6}
        sx={{width:'40%',marginLeft:'5%'}}
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
        <Grid xs={12} sm={6} sx={{width:'40%',marginRight:'5%'}}>
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
        <Grid xs={12} sm={6} sx={{width:'40%',marginLeft:'5%'}}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Data de Início"
              format="DD-MM-YYYY"
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
        <Grid xs={12} sm={6} sx={{width:'40%',marginRight:'5%'}}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Data de Finalização"
              format="DD-MM-YYYY"
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

      <Grid container spacing={2} sx={{ mt: 2 ,marginBottom:'10px'}}>
      <Grid xs={12} sm={6} sx={{width:'40%',marginLeft:'5%'}}>
        <InputManager onChange={handleDynamicInputChange} />
      </Grid>
      <Grid xs={12} sm={6} sx={{marginRight:'5%'}}>
      {/* botao de enviar o cadastro */}
        <Box sx={{ mt: 2,marginLeft:'10%'}}>
        <Button type="submit" variant="contained" color="primary">
          Cadastrar
        </Button>
        </Box>
      </Grid>
      </Grid>

      {/* mostrar o erro que seria a falta de alguma entrada */}
      {Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mt: 2 }}>
        Preencha todos os campos obrigatórios.
        </Alert>
      )}
    </Box>

    {/* AQUI VAI FICAR A TABELA DE ORCAMENTOS*/}
    <Box></Box>
    </Box>
  );
};

export default CurrencyInput;

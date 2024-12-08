import React, { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InputManager from '../Funcoes/MultiInput';
import Grid from '@mui/material/Grid2'; // Usando Grid2
import Typography from '@mui/material/Typography';
import { Autocomplete, TextField, Box, Button, FormGroup, FormControlLabel, Checkbox, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

const CurrencyInput = () => {
  const [value, setValue] = useState(''); // Valor da mão de obra / h
  const [nomeorcamento, setNomeOrcamento] = useState(''); // Nome do orçamento
  const [descricaoOrcamento, setDescricaoOrcamento] = useState(''); // Descrição do orçamento
  const [enderecoOrcamento, setEnderecoOrcamento] = useState(''); // Descrição do orçamento
  const [startDate, setStartDate] = useState(null); // Data de início
  const [endDate, setEndDate] = useState(null); // Data de finalização
  const [formData, setFormData] = useState([]); // Turnos
  const [selectedCliente, setSelectedCliente] = useState(null); // Cliente selecionado
  const [clientes, setClientes] = useState([]); // Lista de clientes

  const [selectedMaterial, setSelectedMaterial] = useState(null); // Material selecionado
  const [materialQuantidade, setMaterialQuantidade] = useState(''); // Quantidade do material
  const [materiais, setMateriais] = useState([]); // Lista de materiais
  const [materiaisTabela, setMateriaisTabela] = useState([]); // Materiais na tabela
  const [nomeGasto, setNomeGasto] = useState(''); // Nome do gasto
  const [gastoDiario, setGastoDiario] = useState(''); // Gasto diário
  const [errors, setErrors] = useState({});
  const [custosAdicionais, setCustosAdicionais] = useState([]); // Tabela de custos adicionais
  const [selectedDays, setSelectedDays] = useState([]); // Dias selecionados

  const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

  const handleDayChange = (event) => {
    const day = event.target.name;
    setSelectedDays((prevSelectedDays) =>
      prevSelectedDays.includes(day)
        ? prevSelectedDays.filter((d) => d !== day)
        : [...prevSelectedDays, day]
    );
  };


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
    if (endDate > startDate) newErrors.endDate = 'A data final deve ser após a data inicial.';
    if (!selectedCliente) newErrors.cliente = 'Selecione um cliente.';
    if (!enderecoOrcamento) newErrors.endereco = 'Insira o endereço.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      console.log({
        nomeorcamento,
        descricaoOrcamento,
        enderecoOrcamento,
        value,
        startDate: startDate?.format('DD-MM-YYYY'),
        endDate: endDate?.format('DD-MM-YYYY'),
        cliente: selectedCliente,
        formData,
        materiaisTabela,
      });
    }
  };

  const handleDynamicInputChange = (values) => {
    setFormData(values);
  };

  const handleAddMaterial = () => {
    if (selectedMaterial && materialQuantidade) {
      // Verifica se a quantidade é válida
      const quantidade = parseInt(materialQuantidade, 10);
      if (quantidade <= 0 || isNaN(quantidade)) {
        alert('A quantidade deve ser um número positivo.');
        return;
      }

      // Verifica se o material já existe na lista de materiaisTabela pelo ID
      const materialExistente = materiaisTabela.find(material => material.mid === selectedMaterial.mid);

      if (!materialExistente) {
        const materialComDetalhes = {
          ...selectedMaterial,
          valu: selectedMaterial.valu, // Assegura que o valor unitário está correto
          quantidade: materialQuantidade,
        };

        setMateriaisTabela(prevMateriais => [...prevMateriais, materialComDetalhes]);

        // Limpa os campos após adicionar
        setSelectedMaterial(null);
        setMaterialQuantidade('');
      } else {
        alert('Este material já foi adicionado!');
      }
    } else {
      alert('Selecione um material e uma quantidade!');
    }
  };


  const handleRemoveMaterial = (mid) => {
    // Filtra os materiais para remover o material com o ID correspondente
    setMateriaisTabela(prevMateriais => prevMateriais.filter(material => material.mid !== mid));
  };

  const handleAddGasto = () => {
    if (nomeGasto && gastoDiario) {
      const gastoValor = parseFloat(gastoDiario.replace(',', '.')); // Converte para número
      if (isNaN(gastoValor) || gastoValor <= 0) {
        alert('O valor do gasto diário deve ser um número positivo.');
        return;
      }

      setCustosAdicionais([...custosAdicionais, { nome: nomeGasto, valor: gastoValor }]);
      setNomeGasto('');
      setGastoDiario('');
    } else {
      alert('Preencha todos os campos do gasto adicional.');
    }
  };

  const handleRemoveGasto = (index) => {
    setCustosAdicionais(prevCustos => prevCustos.filter((_, i) => i !== index));
  };


  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('/clientes');
        setClientes(response.data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  useEffect(() => {
    const fetchMateriais = async () => {
      try {
        const response = await axios.get('/materiais');
        setMateriais(response.data);
      } catch (error) {
        console.error('Erro ao buscar materiais:', error);
      }
    };

    fetchMateriais();
  }, []);

  return (
    <Box>
      <Box
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' },
          maxWidth: '1500px',
          margin: '0 auto',
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography
          sx={{
            textAlign: 'center',
            marginTop: '10px',
            marginBottom: '10px',
          }}
          variant="h5"
          component="h1"
        >
          Cadastro de Orçamento
        </Typography>

        <Grid container spacing={2}>
          <Grid xs={12} sm={6} sx={{ width: '40%', marginLeft: '5%' }}>
            <TextField
              required
              label="Nome do orçamento"
              placeholder="Digite um nome"
              value={nomeorcamento}
              onChange={(e) => setNomeOrcamento(e.target.value)}
              error={!!errors.nomeorcamento}
              helperText={errors.nomeorcamento}
            />
          </Grid>
          <Grid xs={12} sm={6} sx={{ width: '40%', marginRight: '5%' }}>
            <TextField
              label="Descrição do orçamento"
              placeholder="Digite uma descrição"
              value={descricaoOrcamento}
              onChange={(e) => setDescricaoOrcamento(e.target.value)}
            />
          </Grid>
          <Grid xs={12} sm={6} sx={{ width: '40%', marginLeft: '5%' }}>
            <Autocomplete
              options={clientes}
              getOptionLabel={(option) => option.nome}
              renderInput={(params) => (
                <TextField
                  required
                  {...params}
                  label="Cliente"
                  error={!!errors.cliente}
                  helperText={errors.cliente}
                />
              )}
              onChange={(_, value) => setSelectedCliente(value)}
            />
          </Grid>
          <Grid xs={12} sm={6} sx={{ width: '40%', marginRight: '5%' }}>
            <TextField
              required
              label="Endereço do serviço"
              placeholder="Digite o endereço"
              value={enderecoOrcamento}
              onChange={(e) => setEnderecoOrcamento(e.target.value)}
            />
          </Grid>
          <Grid xs={12} sm={6} sx={{ width: '40%', marginLeft: '5%' }}>
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

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid xs={12} sm={6} sx={{ width: '40%', marginLeft: '5%' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Data de Início"
                format="DD-MM-YYYY"
                value={startDate}
                onChange={setStartDate}
                renderInput={(params) => (
                  <TextField
                    required
                    {...params}
                    error={!!errors.startDate}
                    helperText={errors.startDate}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid xs={12} sm={6} sx={{ width: '40%', marginRight: '5%' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Data de Conclusão"
                format="DD-MM-YYYY"
                value={endDate}
                onChange={setEndDate}
                renderInput={(params) => (
                  <TextField
                    required
                    {...params}
                    error={!!errors.endDate}
                    helperText={errors.endDate}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Grid xs={12} sm={6} sx={{ mt: '5%', ml: '5%' }}>
        <Typography variant="h6" gutterBottom>
        Lista de Materiais
        </Typography>
        </Grid>
        <Grid container spacing={2}>
          <Grid sx={{ marginLeft: '5%' }}>
            <Autocomplete
              options={materiais}
              getOptionLabel={(option) => option.nome}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Material"
                />
              )}
              onChange={(_, value) => setSelectedMaterial(value)}
            />
          </Grid>
          <Grid sx={{ marginRight: '5%' }}>
            <TextField
              label="Quantidade"
              value={materialQuantidade}
              onChange={(e) => setMaterialQuantidade(e.target.value)}
              placeholder="Digite a quantidade"
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 2, marginBottom: '10px' }}>
          <Grid xs={12} sm={6} sx={{ marginLeft: '6%' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddMaterial}
              disabled={!selectedMaterial || !materialQuantidade}
            >
              Adicionar Material
            </Button>
          </Grid>
        </Grid>

        <Grid xs={12} sm={6} sx={{ marginRight: '5%', marginLeft: '5%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Valor Unitário</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Remover</TableCell> {/* Coluna de Remover */}
              </TableRow>
            </TableHead>
            <TableBody>
              {materiaisTabela.map((material) => (
                <TableRow key={material.mid}>
                  <TableCell>{material.mid}</TableCell>
                  <TableCell>{material.nome}</TableCell>
                  <TableCell>{material.valu}</TableCell>
                  <TableCell>{material.quantidade}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleRemoveMaterial(material.mid)} // Chama a função para remover
                    >
                      Remover
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
        <Grid xs={12} sm={6} sx={{ mt: '3%', ml: '5%' }}>
        <Typography variant="h6" gutterBottom>
        Gastos Adicionais
        </Typography>
        </Grid>
        <Grid container spacing={2} sx={{ marginBottom: '2px' }}>
          <Grid xs={12} sm={6} sx={{ marginLeft: '5%' }}>
            <TextField
              label="Nome do Gasto"
              value={nomeGasto}
              onChange={(e) => setNomeGasto(e.target.value)}
              placeholder="Digite o nome do gasto"
            />
          </Grid>
          <Grid xs={12} sm={6} sx={{ marginRight: '5%' }}>
            <TextField
              label="Gasto Diário"
              value={gastoDiario}
              onChange={(e) => setGastoDiario(e.target.value)}
              placeholder="Digite o valor diário"
            />
          </Grid>
        </Grid>
        <Grid xs={12} sm={6} sx={{ marginLeft: '6%' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddGasto}
            disabled={!nomeGasto || !gastoDiario}
          >
            Adicionar Gasto
          </Button>
        </Grid>

        <Grid xs={12} sm={6} sx={{ marginRight: '5%', marginLeft: '5%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Gasto Diário</TableCell>
                <TableCell>Remover</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {custosAdicionais.map((gasto, index) => (
                <TableRow key={index}>
                  <TableCell>{gasto.nome}</TableCell>
                  <TableCell>{gasto.valor.toFixed(2).replace('.', ',')}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleRemoveGasto(index)} // Chama a função para remover
                    >
                      Remover
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>

        <Grid container spacing={5} sx={{ mt:'3%', marginBottom: '10px' }}>
          <Grid xs={12} sm={6} sx={{ marginLeft: '5%' }}>
          <Typography variant="h6" gutterBottom>
              Selecione a quantidade de turnos e os horários de cada um
            </Typography>
            <InputManager onChange={handleDynamicInputChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Selecione os dias da semana
            </Typography>
            <FormGroup>
              {daysOfWeek.map((day) => (
                <FormControlLabel
                  key={day}
                  control={
                    <Checkbox
                      checked={selectedDays.includes(day)}
                      onChange={handleDayChange}
                      name={day}
                    />
                  }
                  label={day}
                />
              ))}
            </FormGroup>
          </Grid>
          <Grid xs={12} sm={6} sx={{ margin: '5%' }}>
            <Button variant="contained" type="submit">Cadastrar Orçamento</Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CurrencyInput;

import React, { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InputManager from '../Funcoes/MultiInput';
import Grid from '@mui/material/Grid2'; 
import Typography from '@mui/material/Typography';
import { Autocomplete, TextField, Box, Button, FormGroup, FormControlLabel, Checkbox, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AlteracaoOrcamento = () => {
  const [value, setValue] = useState(''); // Valor da mão de obra / h
  const [nomeorcamento, setNomeOrcamento] = useState(''); // Nome do orçamento
  const [descricaoOrcamento, setDescricaoOrcamento] = useState(''); // Descrição do orçamento
  const [enderecoOrcamento, setEnderecoOrcamento] = useState(''); // Endereço do orçamento
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
  const [totalMaoDeObra, setTotalMaoDeObra] = useState(0);
  const [totalHorasTrabalhadas, setTotalHorasTrabalhadas] = useState(0);
  const [totalMateriais, setTotalMateriais] = useState(0);
  const [totalCustosAdicionais, setTotalCustosAdicionais] = useState(0);
  const [totalServico, setTotalServico] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID do orçamento da URL

  const token = localStorage.getItem("token");
  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      isAdmin = decoded.admin; 
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
    }
  }
  
  if (!isAdmin) {
    return <Typography variant="h6" color="error">Acesso negado. Apenas administradores podem alterar orçamentos.</Typography>;
  }

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
    if (endDate <= startDate) newErrors.endDate = 'A data final deve ser após a data inicial.';
    if (!selectedCliente) newErrors.cliente = 'Selecione um cliente.';
    if (!enderecoOrcamento) newErrors.endereco = 'Insira o endereço.';
    if (formData.length === 0 || formData.some(turno => !turno.entrada || !turno.saida)) {
      newErrors.turnos = 'Todos os turnos devem ter horários válidos.';
    }
    if (selectedDays.length === 0) {
      newErrors.dias = 'Selecione pelo menos um dia da semana.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateFields()) {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const response = await axios.put(`/orcamentos/${id}`, {
          nomeorcamento,
          descricaoOrcamento,
          enderecoOrcamento,
          value,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
          cliente: selectedCliente,
          formData,
          materiaisTabela,
          custosAdicionais,
          selectedDays: selectedDays.map(day => daysOfWeek.indexOf(day))
        }, config);
        console.log('Orçamento atualizado com sucesso:', response.data);
        alert('Orçamento atualizado com sucesso!');
        setSuccessMessage('Orçamento atualizado com sucesso!');
        setTimeout(() => {
          navigate('/TelaInicial/Painel');
        }, 1000);
      } catch (error) {
        console.error('Erro ao atualizar orçamento:', error);
      }
    }
  };

  const handleDynamicInputChange = (values) => {
    setFormData(values);
  };

  const handleAddMaterial = () => {
    if (selectedMaterial && materialQuantidade) {
      // Check if the material already exists in the table
      const materialExists = materiaisTabela.some(material => material.mid === selectedMaterial.mid);
      if (materialExists) {
        alert('Este material já foi adicionado.');
        return;
      }
  
      // Converte quantidade para número
      const quantidade = parseInt(materialQuantidade, 10);
      if (isNaN(quantidade) || quantidade <= 0) {
        alert('A quantidade deve ser um número positivo.');
        return;
      }
  
      // Remove "R$" e converte valor para número
      const valorUnitario = parseFloat(selectedMaterial.valu.replace('R$', '').replace(',', '.').trim());
      if (isNaN(valorUnitario) || valorUnitario <= 0) {
        alert('O valor do material é inválido.');
        return;
      }
  
      // Calcula o custo total
      const totalMaterial = valorUnitario * quantidade;
  
      const materialComDetalhes = {
        ...selectedMaterial,
        valu: valorUnitario, // Agora está como número
        quantidade, // Agora está como número
        total: totalMaterial, // Total calculado
      };
  
      setMateriaisTabela((prevMateriais) => [...prevMateriais, materialComDetalhes]);
  
      // Limpa os campos
      setSelectedMaterial(null);
      setMaterialQuantidade('');
    } else {
      alert('Selecione um material e insira uma quantidade válida!');
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

  const handleGastoDiarioChange = (event) => {
    const rawValue = event.target.value;
    const numericValue = rawValue.replace(/[^0-9,]/g, ''); // Permite apenas números e vírgula
    setGastoDiario(numericValue);
  };

  const handleMaterialQuantidadeChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setMaterialQuantidade(value);
    }
  };

  const calcularTotais = async () => {
    try {
      const maoDeObra = await calcularTotalMaoDeObra();
      if (maoDeObra) {
        setTotalMaoDeObra(maoDeObra.maoObraTotal);
        setTotalHorasTrabalhadas(maoDeObra.totalHorasTrabalhadas);
      } else {
        setTotalMaoDeObra(0);
        setTotalHorasTrabalhadas(0);
      }
  
      const materiais = await calcularCustoTotalMateriais();
      if (materiais !== null) {
        setTotalMateriais(materiais);
      } else {
        setTotalMateriais(0);
      }
  
      const custosAdicionais = await calcularCustoTotalCustosAdicionais();
      if (custosAdicionais) {
        setTotalCustosAdicionais(custosAdicionais.totalCost);
      } else {
        setTotalCustosAdicionais(0);
      }
  
      // Calcular o total do serviço
      const totalServico = (maoDeObra ? maoDeObra.maoObraTotal : 0) + (materiais !== null ? materiais : 0) + (custosAdicionais ? custosAdicionais.totalCost : 0);
      setTotalServico(totalServico);
    } catch (error) {
      console.error("Erro ao calcular totais:", error);
    }
  };
  
  
  useEffect(() => {
    calcularTotais();
  }, [startDate, endDate, selectedDays, formData, value, materiaisTabela, custosAdicionais]);

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

  useEffect(() => {
    const fetchOrcamento = async () => {
      try {
        const response = await axios.get(`/orcamentos/${id}`);
        const orcamento = response.data;
        setNomeOrcamento(orcamento.nomeorcamento); // Errado
        setDescricaoOrcamento(orcamento.descricaoOrcamento);
        setEnderecoOrcamento(orcamento.enderecoOrcamento);
        setValue(orcamento.value.toString().replace('.', ','));
        setStartDate(new Date(orcamento.startDate));
        setEndDate(new Date(orcamento.endDate));
        setSelectedCliente(orcamento.cliente);
        setFormData(orcamento.formData);
        setMateriaisTabela(orcamento.materiaisTabela);
        setCustosAdicionais(orcamento.custosAdicionais);
        setSelectedDays(orcamento.selectedDays.map(day => daysOfWeek[day]));
      } catch (error) {
        console.error('Erro ao buscar orçamento:', error);
      }
    };

    fetchOrcamento();
  }, [id]);

  // Função para calcular o total da mão de obra
  const calcularTotalMaoDeObra = async () => {
    try {
      const response = await axios.post('/calcular-total-mao-de-obra', {
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
        repetition: selectedDays.map(day => daysOfWeek.indexOf(day)),
        shifts: formData.map(turno => ({
          inicio: turno.entrada,
          fim: turno.saida
        })),
        laborCostPerHour: parseFloat(value.replace(',', '.')),
        diasNaoTrabalhados: [] // Adicione os dias não trabalhados se necessário
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao calcular o total da mão de obra:', error);
      return null;
    }
  };

  const calcularCustoTotalMateriais = async () => {
    console.log('Enviando materiaisTabela para a API:', materiaisTabela);
    try {
      const response = await axios.post('/calcular-custo-total-materiais', {
        materiais: materiaisTabela
      });
      console.log('Resposta da API:', response.data);
      return response.data.totalCost;
    } catch (error) {
      console.error('Erro ao calcular o custo total dos materiais:', error);
      return null;
    }
  };

  const calcularCustoTotalCustosAdicionais = async () => {
    try {
      const response = await axios.post('/calcular-custo-total-custos-adicionais', {
        custosAdicionais
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao calcular o custo total dos custos adicionais:', error);
      return null;
    }
  };

  const obterTotalServico = async () => {
    try {
      const response = await axios.get('/obter-total-servico');
      console.log('Resposta da API de total do serviço:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter o total do serviço:', error);
      return null;
    }
  };

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
          Alteração de Orçamento
        </Typography>

        {/* nome do orcamento , descricao do orc, clientes,endereco do servico,mao de obra / h*/}
        <Grid container spacing={2} marginLeft="5%">
          <Grid xs={12} sm={6} sx={{ width: '40%' }}>
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
          <Grid xs={12} sm={6} sx={{ width: '40%' }}>
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
              value={selectedCliente}
            />
          </Grid>
          <Grid xs={12} sm={6} sx={{ width: '50%' }}>
            <TextField
              required
              label="Endereço do serviço"
              placeholder="Digite o endereço"
              value={enderecoOrcamento}
              onChange={(e) => setEnderecoOrcamento(e.target.value)}
            />
          </Grid>
          <Grid xs={12} sm={6} sx={{ width: '30%' }}>
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
          <Grid xs={12} sm={12} sx={{ width: '81%' }}>
            <TextField
              label="Descrição do orçamento"
              placeholder="Digite uma descrição"
              value={descricaoOrcamento}
              multiline
              rows={4}
              onChange={(e) => setDescricaoOrcamento(e.target.value)}
            />
          </Grid>
        </Grid>
        {/* data de inicio e fim */}
        <Grid container spacing={2} sx={{ mt: 2 }} marginLeft="5%">
          <Grid xs={12} sm={6} sx={{ width: '40%' }}>
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
          <Grid xs={12} sm={6} sx={{ width: '40%' }}>
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
        {/* titulo */}
        <Grid xs={12} sm={6} sx={{ mt: '5%', ml: '5%' }}>
          <Typography variant="h6" gutterBottom>
            Lista de Materiais
          </Typography>
        </Grid>
        {/* materais,quantidade */}
        <Grid container spacing={2} marginLeft="5%">
          <Grid xs={12} sm={6} sx={{ width: '40%' }}>
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
              value={selectedMaterial}
            />
          </Grid>
          <Grid xs={12} sm={6} sx={{ width: '40%' }}>
            <TextField
              label="Quantidade de Material"
              value={materialQuantidade}
              onChange={handleMaterialQuantidadeChange}
              placeholder="Digite a quantidade de material"
            />
          </Grid>
        </Grid>
        {/* botao */}
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
        {/* tabela para os materiais */}
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
                  <TableCell>{material.valu.toFixed(2).replace('.', ',')}</TableCell>
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
        {/* titulo */}
        <Grid xs={12} sm={6} sx={{ mt: '3%', ml: '5%' }}>
          <Typography variant="h6" gutterBottom>
            Gastos Adicionais
          </Typography>
        </Grid>
        {/*nome do gasto,gasto diario  */}
        <Grid container spacing={2} sx={{ marginLeft: "5%" }}>
          <Grid xs={12} sm={6} sx={{ width: '40%' }}>
            <TextField
              label="Nome do Gasto"
              value={nomeGasto}
              onChange={(e) => setNomeGasto(e.target.value)}
              placeholder="Digite o nome do gasto"
            />
          </Grid>
          <Grid xs={12} sm={6} sx={{ width: '40%' }}>
            <TextField
              label="Gasto Diário"
              value={gastoDiario}
              onChange={handleGastoDiarioChange}
              placeholder="Digite o valor diário"
            />
          </Grid>
        </Grid>
        {/* botao */}
        <Grid xs={12} sm={6} sx={{ marginLeft: '6%', marginTop: '10px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddGasto}
            disabled={!nomeGasto || !gastoDiario}
          >
            Adicionar Gasto
          </Button>
        </Grid>
        {/* tabela */}
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
        {/* titulo ,turnos*/}
        <Grid container spacing={5} sx={{ mt: '3%', marginBottom: '10px' }}>
          <Grid xs={12} sm={6} sx={{ marginLeft: '5%' }}>
            <Typography variant="h6" gutterBottom>
              Selecione a quantidade de turnos e os horários de cada um
            </Typography>
            <InputManager onChange={handleDynamicInputChange} />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginLeft: '5%' }}>
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
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Resumo do Orçamento
              </Typography>
              <Typography variant="body1">
                Total de Horas Trabalhadas: {totalHorasTrabalhadas ? totalHorasTrabalhadas : 0}
              </Typography>
              <Typography variant="body1">
                Total de Mão de Obra: R$ {totalMaoDeObra ? totalMaoDeObra.toFixed(2).replace('.', ',') : '0,00'}
              </Typography>
              <Typography variant="body1">
                Total de Materiais: R$ {totalMateriais ? totalMateriais.toFixed(2).replace('.', ',') : '0,00'}
              </Typography>
              <Typography variant="body1">
                Total de Custos Adicionais: R$ {totalCustosAdicionais ? totalCustosAdicionais.toFixed(2).replace('.', ',') : '0,00'}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Total do Serviço: R$ {totalServico ? totalServico.toFixed(2).replace('.', ',') : '0,00'}
              </Typography>
              {errors.turnos && <Typography color="error">{errors.turnos}</Typography>}
              {errors.dias && <Typography color="error">{errors.dias}</Typography>}
            </Grid>
          </Grid>
          <Grid xs={12} sm={6} sx={{ margin: '5%' }}>
            <Button variant="contained" type="submit">Atualizar Orçamento</Button>
          </Grid>
        </Grid>

      </Box>
    </Box>
  );
};

export default AlteracaoOrcamento;
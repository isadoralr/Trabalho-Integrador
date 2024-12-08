import React, { useEffect, useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import axios from 'axios';
import '../componentesCSS/Painel.css'; // Importando o CSS modernizado

// Registro dos componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [servicos, setServicos] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [relatorioServicos, setRelatorioServico] = useState([]);

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const response = await axios.get('/Relatorioservicos');
        setRelatorioServico(response.data);
      } catch (error) {
        console.error('Error fetching relatorios de servicos', error);
      }
    };
    fetchServicos();
  }, []);

  const months = Object.keys(relatorioServicos);
  const pendentes = months.map((mes) => relatorioServicos[mes].pen);
  const rejeitados = months.map((mes) => relatorioServicos[mes].rej);
  const finalizados = months.map((mes) => relatorioServicos[mes].fin);
  const andamento = months.map((mes) => relatorioServicos[mes].and);

  const chartData = {
    labels: months, // Meses como rótulos do eixo X
    datasets: [
      {
        label: 'Pendentes',
        data: pendentes,
        backgroundColor: '#FF6384',
      },
      {
        label: 'Não Aceitos',
        data: rejeitados,
        backgroundColor: '#36A2EB',
      },
      {
        label: 'Finalizados',
        data: finalizados,
        backgroundColor: '#FFCE56',
      },
      {
        label: 'Em Andamento',
        data: andamento,
        backgroundColor: '#4BC0C0',
      },
    ],
  };

  const pieData = {
    labels: ['Pendentes', 'Não Aceitos', 'Finalizados', 'Em Andamento'],
    datasets: [
      {
        data: [
          pendentes.reduce((a, b) => a + b, 0),
          rejeitados.reduce((a, b) => a + b, 0),
          finalizados.reduce((a, b) => a + b, 0),
          andamento.reduce((a, b) => a + b, 0),
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 14 } } },
      title: {
        display: true,
        text: 'Servicos e Orçamentos',
        font: {
          size: 18
        }
      },
    },
    scales: {
      x: { ticks: { font: { size: 14 } } }
    },
  };

  useEffect(() => {
    const fetchServicos = async () => {
      const response = await axios.get("/servicos");
      setServicos(response.data);
    };

    const fetchOrcamentos = async () => {
      const response = await axios.get("/orcamentos");
      setOrcamentos(response.data);
    };

    fetchServicos();
    fetchOrcamentos();
  }, []);

  // Função para formatar datas no formato dd/mm/yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  // Função para mapear status para textos descritivos
  const getStatusText = (status) => {
    switch (status) {
      case "pen":
        return "Pendente";
      case "rej":
        return "Rejeitado";
      case "and":
        return "Em Andamento";
      case "fin":
        return "Finalizado";
      default:
        return "Desconhecido";
    }
  };

  return (
    <Box className="dashboard-container" sx={{ padding: '2%' }}>
      <Typography variant="h3" component="h1" className="dashboard-title">
        Painel de Controle
      </Typography>

      <Grid container spacing={3} sx={{ marginBottom: '4%' }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="card">
            <CardContent>
              <Typography variant="h6" component="h2" className="card-title">
                Total de Serviços
              </Typography>
              <Typography variant="h4" component="p" className="card-value">
                {servicos.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="card">
            <CardContent>
              <Typography variant="h6" component="h2" className="card-title">
                Total de Orçamentos
              </Typography>
              <Typography variant="h4" component="p" className="card-value">
                {orcamentos.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="card">
            <CardContent>
              <Typography variant="h6" component="h2" className="card-title">
                Serviços Finalizados
              </Typography>
              <Typography variant="h4" component="p" className="card-value">
                {finalizados.reduce((a, b) => a + b, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="card">
            <CardContent>
              <Typography variant="h6" component="h2" className="card-title">
                Orçamentos Pendentes
              </Typography>
              <Typography variant="h4" component="p" className="card-value">
                {pendentes.reduce((a, b) => a + b, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={5} sx={{ marginBottom: '4%', justifyContent: 'center' }}>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" component="h2" sx={{ marginBottom: '2%', fontWeight: 'bold', textAlign: 'center' }}>
              Gráfico de Serviços
            </Typography>
            <Box sx={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center' }}>
              <Bar data={chartData} options={options} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" component="h2" sx={{ marginBottom: '2%', fontWeight: 'bold', textAlign: 'center' }}>
              Status dos Serviços
            </Typography>
            <Box sx={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center' }}>
              <Pie data={pieData} />
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box className="dashboard-section" sx={{ marginBottom: '4%' }}>
        <Typography variant="h4" component="h2" className="section-title">
          Serviços
        </Typography>
        <TableContainer component={Paper}>
          <Table className="dashboard-table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Endereço</TableCell>
                <TableCell>Data Início</TableCell>
                <TableCell>Data Conclusão</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servicos.map((servico) => (
                <TableRow key={servico.sid}>
                  <TableCell>{servico.sid}</TableCell>
                  <TableCell>{servico.servico_nome}</TableCell>
                  <TableCell>{servico.cliente_nome}</TableCell>
                  <TableCell className={`status ${servico.stts}`}>
                    {getStatusText(servico.stts)}
                  </TableCell>
                  <TableCell>{servico.endr}</TableCell>
                  <TableCell>{formatDate(servico.dti)}</TableCell>
                  <TableCell>{formatDate(servico.dtc)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box className="dashboard-section" sx={{ marginBottom: '4%' }}>
        <Typography variant="h4" component="h2" className="section-title">
          Orçamentos
        </Typography>
        <TableContainer component={Paper}>
          <Table className="dashboard-table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Endereço</TableCell>
                <TableCell>Data Início</TableCell>
                <TableCell>Data Conclusão</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orcamentos.map((orcamento) => (
                <TableRow key={orcamento.sid}>
                  <TableCell>{orcamento.sid}</TableCell>
                  <TableCell>{orcamento.orcamento_nome}</TableCell>
                  <TableCell>{orcamento.cliente_nome}</TableCell>
                  <TableCell className={`status ${orcamento.stts}`}>
                    {getStatusText(orcamento.stts)}
                  </TableCell>
                  <TableCell>{orcamento.endr}</TableCell>
                  <TableCell>{formatDate(orcamento.dti)}</TableCell>
                  <TableCell>{formatDate(orcamento.dtc)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Dashboard;
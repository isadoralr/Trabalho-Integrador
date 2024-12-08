import React, { useEffect, useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

// Registro dos componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 
  'Maio', 'Junho', 'Julho', 'Agosto', 
  'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 20 } } },
      title: {
        display: true,
        text: 'Servicos e Orçamentos',
        font: {
          size: 24
        }
      },
    },
    scales: {
      x: { ticks: { font: { size: 20 } } }
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
      <Typography variant="h3" component="h1" sx={{ textAlign: 'center', marginBottom: '2%' }}>
        Painel de Controle
      </Typography>

      <Box className="dashboard-section" sx={{ marginBottom: '4%' }}>
        <Typography variant="h4" component="h2" sx={{ marginBottom: '1%' }}>
          Serviços
        </Typography>
        <TableContainer component={Paper}>
          <Table>
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
        <Typography variant="h4" component="h2" sx={{ marginBottom: '1%' }}>
          Orçamentos
        </Typography>
        <TableContainer component={Paper}>
          <Table>
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

      <Box>
        <Typography variant="h4" component="h2" sx={{ marginBottom: '2%', fontWeight: 'bold' }}>
          Gráfico de Serviços
        </Typography>
        <Box sx={{ width: '100%', maxWidth: '800px', height: '400px', margin: '0 auto' }}>
          <Bar data={chartData} options={options} />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
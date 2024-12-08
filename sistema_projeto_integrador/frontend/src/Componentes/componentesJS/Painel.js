import React, { useState, useEffect } from "react";
import axios from "axios";
import "../componentesCSS/Painel.css";


const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 
  'Maio', 'Junho', 'Julho', 'Agosto', 
  'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const Dashboard = () => {
  const [servicos, setServicos] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const[relatorioServicos,setRelatorioServico] = useState([]);

  useEffect(()=>{
    const fetchServicos = async () => {
    try {
        const response = await axios.get('/Relatorioservicos');
        setRelatorioServico(response.data);
    }catch(error){
        console.error('Error fetching relatorios de servicos',error);
    }
    };
    fetchServicos();
  },[]);
  console.log(relatorioServicos);

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
  legend: { position: 'top' ,labels: {font:{ size:20}}},
  title: {
      display: true,
      text: 'Servicos e Orçamentos',
      font: {
      size: 24
      }
  },
  },
  scales: {
  x: {ticks: { font: { size:20}}}
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
    <div className="dashboard-container">
      <h1 className="dashboard-title">Painel de Controle</h1>

      <section className="dashboard-section">
        <h2 className="section-title">Serviços</h2>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Cliente</th>
              <th>Status</th>
              <th>Endereço</th>
              <th>Data Início</th>
              <th>Data Conclusão</th>
            </tr>
          </thead>
          <tbody>
            {servicos.map((servico) => (
              <tr key={servico.sid}>
                <td>{servico.sid}</td>
                <td>{servico.servico_nome}</td>
                <td>{servico.cliente_nome}</td>
                <td className={`status ${servico.stts}`}>
                  {getStatusText(servico.stts)}
                </td>
                <td>{servico.endr}</td>
                <td>{formatDate(servico.dti)}</td>
                <td>{formatDate(servico.dtc)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="dashboard-section">
        <h2 className="section-title">Orçamentos</h2>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Cliente</th>
              <th>Status</th>
              <th>Endereço</th>
              <th>Data Início</th>
              <th>Data Conclusão</th>
            </tr>
          </thead>
          <tbody>
            {orcamentos.map((orcamento) => (
              <tr key={orcamento.sid}>
                <td>{orcamento.sid}</td>
                <td>{orcamento.orcamento_nome}</td>
                <td>{orcamento.cliente_nome}</td>
                <td className={`status ${orcamento.stts}`}>
                  {getStatusText(orcamento.stts)}
                </td>
                <td>{orcamento.endr}</td>
                <td>{formatDate(orcamento.dti)}</td>
                <td>{formatDate(orcamento.dtc)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <Box>
            <Typography variant="h4" component="h2" sx={{margin:'5%',fontWeight:'bold'}}>
                Grafico de Servicos
            </Typography>
            <Box sx={{width:'100%',maxWidth:'800px',height:'400px',margin:'5%'}}>
            <Bar data={chartData} options={options} />
            </Box>
            </Box>
    </div>
  );
};

export default Dashboard;

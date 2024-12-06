import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper, IconButton } from '@mui/material';
import { Edit, Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import axios from 'axios';
import CadastroFerramenta from './CadastroFerramenta'; // Importe o componente de cadastro

const MateriaisFerramentas = () => {
  const [showCadastro, setShowCadastro] = useState(false);
  const [ferramentas, setFerramentas] = useState([]);
  const [orderBy, setOrderBy] = useState('nome');
  const [order, setOrder] = useState('asc');

  useEffect(() => {
    // Fetch the list of tools from the backend
    const fetchFerramentas = async () => {
      try {
        const response = await axios.get('/ferramentas');
        setFerramentas(response.data);
      } catch (error) {
        console.error('Error fetching tools:', error);
      }
    };

    fetchFerramentas();
  }, []);

  const handleToggleCadastro = () => {
    setShowCadastro(!showCadastro);
  };

  const handleCheckboxChange = async (id, obtido) => {
    try {
      await axios.patch(`/ferramentas/${id}`, { obtido: !obtido });
      setFerramentas(ferramentas.map(ferramenta => ferramenta.fid === id ? { ...ferramenta, obtido: !obtido } : ferramenta));
    } catch (error) {
      console.error('Error updating tool status:', error);
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedFerramentas = [...ferramentas].sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    } else {
      return a[orderBy] < b[orderBy] ? 1 : -1;
    }
  });

  return (
    <Box sx={{ mt: 2, textAlign: 'center'}}>
        <Typography variant="h5" component="h2" gutterBottom> 
        Ferramentas
        </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort('nome')} style={{ width: '50%' }}>
                Nome {orderBy === 'nome' ? (order === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />) : null}
              </TableCell>
              <TableCell onClick={() => handleSort('valu')} style={{ width: '20%' }}>
                Preço Unitário {orderBy === 'valu' ? (order === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />) : null}
              </TableCell>
              <TableCell style={{ width: '10%' }}>Obtido</TableCell>
              <TableCell style={{ width: '10%' }}>Editar</TableCell>
              <TableCell style={{ width: '10%' }}>Excluir</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedFerramentas.map((ferramenta, index) => (
              <TableRow key={ferramenta.fid} sx={{ '&:nth-of-type(odd)': { backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'inherit' } }}>
                <TableCell>{ferramenta.nome}</TableCell>
                <TableCell>{ferramenta.valu}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={ferramenta.obtido}
                    onChange={() => handleCheckboxChange(ferramenta.fid, ferramenta.obtido)}
                  />
                </TableCell>
                <TableCell>
                  <IconButton>
                    <Edit />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" onClick={handleToggleCadastro}>
        {showCadastro ? 'Fechar Cadastro de Ferramenta' : 'Cadastrar nova ferramenta'}
      </Button>
      {showCadastro && (
        <Box sx={{ mt: 2 }}>
          <CadastroFerramenta />
        </Box>
      )}
    </Box>
  );
};

export default MateriaisFerramentas;

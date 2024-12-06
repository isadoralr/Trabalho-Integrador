import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper } from '@mui/material';
import axios from 'axios';
import CadastroFerramenta from './CadastroFerramenta'; // Importe o componente de cadastro

const MateriaisFerramentas = () => {
  const [showCadastro, setShowCadastro] = useState(false);
  const [ferramentas, setFerramentas] = useState([]);

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
      await axios.patch(`/api/ferramentas/${id}`, { obtido: !obtido });
      setFerramentas(ferramentas.map(ferramenta => ferramenta.fid === id ? { ...ferramenta, obtido: !obtido } : ferramenta));
    } catch (error) {
      console.error('Error updating tool status:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Materiais e Ferramentas
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Preço Unitário</TableCell>
              <TableCell>Obtido</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ferramentas.map((ferramenta) => (
              <TableRow key={ferramenta.fid}>
                <TableCell>{ferramenta.nome}</TableCell>
                <TableCell>{ferramenta.valu}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={ferramenta.obtido}
                    onChange={() => handleCheckboxChange(ferramenta.fid, ferramenta.obtido)}
                  />
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

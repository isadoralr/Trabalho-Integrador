import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper, IconButton, Dialog, 
DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Edit, Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import axios from 'axios';
import CadastroFerramenta from './CadastroFerramenta'; 
import AlteracaoFerramenta from './AlteracaoFerramenta'; 
import { jwtDecode } from 'jwt-decode';

const Ferramentas = () => {
  const [showCadastro, setShowCadastro] = useState(false);
  const [ferramentas, setFerramentas] = useState([]);
  const [orderBy, setOrderBy] = useState('nome');
  const [order, setOrder] = useState('asc');
  const [selectedFerramenta, setSelectedFerramenta] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const token = localStorage.getItem("token");
  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      isAdmin = decoded.admin; // Supondo que o campo `admin` exista no payload do JWT
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
    }
  }

  useEffect(() => {
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

  const handleCheckboxChange = async (fid, obtido) => {
    try {
      await axios.patch(`/ferramentas/${fid}`, { obtido: !obtido });
      setFerramentas(ferramentas.map(ferramenta => ferramenta.fid === fid ? { ...ferramenta, obtido: !obtido } : ferramenta));
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

  const handleEdit = (ferramenta) => {
    setSelectedFerramenta(ferramenta);
    setOpenEditDialog(true);
  };

  const handleDelete = (ferramenta) => {
    setSelectedFerramenta(ferramenta);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedFerramenta) {
      console.error('Nenhuma ferramenta selecionada para exclusão.');
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.delete(`/ferramentas/${selectedFerramenta.fid}`, config); // Corrigido
      setFerramentas((prev) =>
        prev.filter((ferramenta) => ferramenta.fid !== selectedFerramenta.fid)
      );
      setOpenDeleteDialog(false);
      setSelectedFerramenta(null);
    } catch (error) {
      console.error('Erro ao excluir ferramenta:', error);
    }
  };
  
  return (
    <Box sx={{ mt: 2, textAlign: 'left', padding:'5%'}}>
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
              {isAdmin && (
              <TableCell style={{ width: '10%' }}>Editar</TableCell>
              )}
              {isAdmin && (
              <TableCell style={{ width: '10%' }}>Excluir</TableCell>
            )}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedFerramentas.map((ferramenta, index) => (
              <TableRow key={ferramenta.fid} sx={{
                '&:nth-of-type(odd)': {
                  backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#000', // Alterna o fundo
                  color: index % 2 === 0 ? '#000' : '#fff', // Texto inverso da linha par
                },
                '&:nth-of-type(odd) td': { // Garante que as células acompanhem a cor do texto
                  color: index % 2 === 0 ? '#000' : '#fff',
                },
                '&:nth-of-type(odd) .MuiIconButton-root': {
                  color: index % 2 === 0 ? '#000' : '#fff', // Ícones acompanham a cor do texto
                },
              }}>
                <TableCell>{ferramenta.nome}</TableCell>
                <TableCell>{ferramenta.valu}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={ferramenta.obtido}
                    onChange={() => handleCheckboxChange(ferramenta.fid, ferramenta.obtido)}
                  />
                </TableCell>
                {isAdmin && (
                <TableCell>
                  <IconButton onClick={() => handleEdit(ferramenta)}>
                    <Edit />
                  </IconButton>
                </TableCell>
              )}
              {isAdmin && (
                <TableCell>
                  <IconButton onClick={() => handleDelete(ferramenta)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isAdmin && (
      <Box paddingTop="20px">
      <Button variant="contained" color="primary" onClick={handleToggleCadastro}>
        {showCadastro ? 'Fechar Cadastro de Ferramenta' : 'Cadastrar nova ferramenta'}
      </Button>
      </Box>
      )}

      {/* Diálogo para cadastro de nova ferramenta */}
      <Dialog open={showCadastro} onClose={() => setShowCadastro(false)}>
        <DialogContent>
          <CadastroFerramenta 
            setFerramentas={setFerramentas} 
            onClose={() => setShowCadastro(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo para edição de ferramenta */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogContent>
          <AlteracaoFerramenta 
            ferramenta={selectedFerramenta} 
            setFerramentas={setFerramentas} 
            onClose={() => setOpenEditDialog(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmação de exclusão */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogContent>
                <DialogContentText>
                {selectedFerramenta
                    ? `Tem certeza de que deseja excluir a ferramenta "${selectedFerramenta.nome}"?`
                    : 'Nenhuma ferramenta selecionada.'}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
                Cancelar
                </Button>
                <Button onClick={confirmDelete} color="secondary">
                Excluir
                </Button>
            </DialogActions>
        </Dialog>
    </Box>
  );
};

export default Ferramentas;
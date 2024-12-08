import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper, IconButton, Dialog, 
DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Edit, Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import axios from 'axios';
import CadastroCliente from './CadastroCliente'; 
import AlteracaoCliente from './AlteracaoCliente';

const Clientes = () => {
  const [showCadastro, setShowCadastro] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [orderBy, setOrderBy] = useState('nome');
  const [order, setOrder] = useState('asc');
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('/clientes');
        setClientes(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
    fetchClientes();
  }, []);

  const handleToggleCadastro = () => {
    setShowCadastro(!showCadastro);
  };
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedClientes = [...clientes].sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    } else {
      return a[orderBy] < b[orderBy] ? 1 : -1;
    }
  });

  const handleEdit = (cliente) => {
    setSelectedCliente(cliente);
    setOpenEditDialog(true);
  };

  const handleDelete = (cliente) => {
    setSelectedCliente(cliente);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedCliente) {
      console.error('Nenhum(a) cliente selecionado para exclusão.');
      return;
    }
  
    try {
      await axios.delete(`/clientes/${selectedCliente.cid}`);
      setClientes((prev) =>
        prev.filter((cliente) => cliente.cid !== selectedCliente.cid)
      );
      setOpenDeleteDialog(false);
      setSelectedCliente(null);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  };
  

  return (
    <Box sx={{ mt: 2, textAlign: 'left', padding:'5%'}} >
        <Typography variant="h5" component="h2" gutterBottom> 
        Clientes
        </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort('nome')} style={{ width: '50%' }}>
                Nome {orderBy === 'nome' ? (order === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />) : null}
              </TableCell>
              <TableCell onClick={() => handleSort('tel')} style={{ width: '10%' }}>
                Telefone {orderBy === 'tel' ? (order === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />) : null}
              </TableCell>
              <TableCell onClick={() => handleSort('email')} style={{ width: '30%' }}>
                Email {orderBy === 'email' ? (order === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />) : null}
              </TableCell>
              <TableCell style={{ width: '5%' }}>Editar</TableCell>
              <TableCell style={{ width: '5%' }}>Excluir</TableCell>
            </TableRow>
          </TableHead>
          <TableBody >
            {sortedClientes.map((cliente, index) => (
              <TableRow key={cliente.cid}  sx={{
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
                <TableCell>{cliente.nome}</TableCell>
                <TableCell>{cliente.tel}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(cliente)}>
                    <Edit />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(cliente)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          
        </Table>
      </TableContainer>
      <Box paddingTop="20px">
      <Button variant="contained" color="primary" onClick={handleToggleCadastro} >
        {showCadastro ? 'Fechar Cadastro de Cliente' : 'Cadastrar novo cliente'}
      </Button>
      </Box>

      {/* Diálogo para cadastro de novo cliente */}
      <Dialog open={showCadastro} onClose={() => setShowCadastro(false)}>
        <DialogContent>
          <CadastroCliente 
            setClientes={setClientes} 
            onClose={() => setShowCadastro(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo para edição de cliente */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogContent>
          <AlteracaoCliente 
            cliente={selectedCliente} 
            setClientes={setClientes} 
            onClose={() => setOpenEditDialog(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmação de exclusão */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogContent>
                <DialogContentText>
                {selectedCliente
                    ? `Tem certeza de que deseja excluir o(a) cliente "${selectedCliente.nome}"?`
                    : 'Nenhum(a) cliente selecionada.'}
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

export default Clientes;

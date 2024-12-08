import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper, IconButton, Dialog, 
DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Edit, Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import axios from 'axios';
import CadastroMaterial from './CadastroMaterial'; 
import AlteracaoMaterial from './AlteracaoMaterial'; 

const Materiais = () => {
  const [showCadastro, setShowCadastro] = useState(false);
  const [materiais, setMateriais] = useState([]);
  const [orderBy, setOrderBy] = useState('nome');
  const [order, setOrder] = useState('asc');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    const fetchMateriais = async () => {
      try {
        const response = await axios.get('/materiais');
        setMateriais(response.data);
      } catch (error) {
        console.error('Error fetching tools:', error);
      }
    };
    fetchMateriais();
  }, []);

  const handleToggleCadastro = () => {
    setShowCadastro(!showCadastro);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedMateriais = [...materiais].sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    } else {
      return a[orderBy] < b[orderBy] ? 1 : -1;
    }
  });

  const handleEdit = (material) => {
    setSelectedMaterial(material);
    setOpenEditDialog(true);
  };

  const handleDelete = (material) => {
    setSelectedMaterial(material);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedMaterial) {
      console.error('Nenhum material selecionada para exclusão.');
      return;
    }
  
    try {
      await axios.delete(`/materiais/${selectedMaterial.mid}`);
      setMateriais((prev) =>
        prev.filter((material) => material.mid !== selectedMaterial.mid)
      );
      setOpenDeleteDialog(false);
      setSelectedMaterial(null);
    } catch (error) {
      console.error('Erro ao excluir material:', error);
    }
  };
  
  

  return (
    <Box sx={{ mt: 2, textAlign: 'left', padding:'5%'}}>
        <Typography variant="h5" component="h2" gutterBottom> 
        Materiais
        </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort('nome')} style={{ width: '55%' }}>
                Nome {orderBy === 'nome' ? (order === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />) : null}
              </TableCell>
              <TableCell onClick={() => handleSort('valu')} style={{ width: '25%' }}>
                Preço Unitário {orderBy === 'valu' ? (order === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />) : null}
              </TableCell>
              <TableCell style={{ width: '10%' }}>Editar</TableCell>
              <TableCell style={{ width: '10%' }}>Excluir</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedMateriais.map((material, index) => (
              <TableRow key={material.mid} sx={{
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
                <TableCell>{material.nome}</TableCell>
                <TableCell>{material.valu}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(material)}>
                    <Edit />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(material)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box paddingTop="20px">
      <Button variant="contained" color="primary" onClick={handleToggleCadastro}>
        {showCadastro ? 'Fechar Cadastro de Material' : 'Cadastrar novo material'}
      </Button>
      </Box>

      {/* Diálogo para cadastro de novo material */}
      <Dialog open={showCadastro} onClose={() => setShowCadastro(false)}>
        <DialogContent>
          <CadastroMaterial 
            setMateriais={setMateriais} 
            onClose={() => setShowCadastro(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo para edição de material */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogContent>
          <AlteracaoMaterial 
            material={selectedMaterial} 
            setMateriais={setMateriais} 
            onClose={() => setOpenEditDialog(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmação de exclusão */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogContent>
                <DialogContentText>
                {selectedMaterial
                    ? `Tem certeza de que deseja excluir o material "${selectedMaterial.nome}"?`
                    : 'Nenhum material selecionada.'}
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

export default Materiais;

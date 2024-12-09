import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import Grid from '@mui/material/Grid2';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AlteracaoCliente = ({ cliente, setClientes, onClose }) => {
    const [formData, setFormData] = useState({
        nome: "",
        tel: "",
        email: "",
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

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

    // Função para formatar o telefone
    const formatTelefone = (value) => {
        // Remove caracteres não numéricos
        const onlyNumbers = value.replace(/[^\d]/g, "");

        // Formata no padrão (XX) XXXXX-XXXX
        if (onlyNumbers.length <= 2) return `(${onlyNumbers}`;
        if (onlyNumbers.length <= 7) return `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2)}`;
        return `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2, 7)}-${onlyNumbers.slice(7, 11)}`;
    };

    // Validação do email
    const isValidEmail = (email) => {
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    };

    useEffect(() => {
        if (cliente) {
            setFormData({ nome: cliente.nome, tel: cliente.tel, email: cliente.email });
        }
    }, [cliente]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Formatação do telefone
        if (name === "tel") {
            setFormData({ ...formData, tel: formatTelefone(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validateFields = () => {
        const newErrors = {};
        if (!formData.nome.trim()) newErrors.nome = "O nome do cliente é obrigatório.";
        if (!formData.tel.trim()) newErrors.tel = "O telefone é obrigatório.";
        if (formData.tel.length > 15) newErrors.tel = "O telefone deve ter no máximo 15 caracteres.";
        if (formData.tel.length < 15) newErrors.tel = "O telefone deve ter no mínimo 15 caracteres.";
        if (formData.email && !isValidEmail(formData.email)) newErrors.email = "Formato de email inválido.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateFields()) {
            try {
                const token = localStorage.getItem("token");
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                await axios.put(`/clientes/${cliente.cid}`, formData, config); // Corrigido
                setSuccessMessage("Cliente atualizado com sucesso!");
                setClientes((prev) =>
                    prev.map((c) =>
                        c.cid === cliente.cid ? { ...c, nome: formData.nome, tel: formData.tel, email: formData.email } : c
                    )
                );
                setErrors({});
                onClose();
            } catch (err) {
                console.error('Erro ao atualizar cliente:', err);
                setErrorMessage("Erro ao atualizar cliente. Tente novamente.");
            }
        }
    };

    if (!isAdmin) {
        return <Typography variant="h6" color="error">Acesso negado. Apenas administradores podem alterar clientes.</Typography>;
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
            <Typography
                sx={{ textAlign: 'center', marginBottom: 2 }}
                variant="h5"
                component="h1"
            >
                Editar Cliente
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="nome"
                        label="Nome do(a) Cliente"
                        value={formData.nome}
                        onChange={handleChange}
                        error={!!errors.nome}
                        helperText={errors.nome}
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="tel"
                        label="Telefone"
                        value={formData.tel}
                        onChange={handleChange}
                        error={!!errors.tel}
                        helperText={errors.tel}
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="email"
                        label="Email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        fullWidth
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Salvar
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        color="secondary"
                        fullWidth
                    >
                        Cancelar
                    </Button>
                </Grid>
            </Grid>
            {successMessage && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    {successMessage}
                </Alert>
            )}
            {errorMessage && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {errorMessage}
                </Alert>
            )}
        </Box>
    );
};

export default AlteracaoCliente;
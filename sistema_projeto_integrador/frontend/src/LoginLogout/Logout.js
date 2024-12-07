import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove o token do localStorage e redireciona para a página de login
    localStorage.removeItem('token');
    onLogout && onLogout(); // Chama o callback onLogout, se fornecido
    navigate('/login'); // Redireciona para a tela de login
  }, [navigate, onLogout]);

  return null; // Não renderiza nada
};

export default Logout;

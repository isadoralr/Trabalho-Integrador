import React, { useState } from "react";
import { Box, TextField, Button, InputAdornment } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState({ email: false, password: false });
  const [loginError, setLoginError] = React.useState(""); // Para mensagens de erro do servidor
  const navigate = useNavigate();

  // Função para tratar o envio do formulário
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validação dos campos
    const emailError = email.trim() === "";
    const passwordError = password.trim() === "";
    setError({ email: emailError, password: passwordError });

    if (emailError || passwordError) {
      return;
    }

    try {
      // Envio dos dados para o servidor
      const response = await axios.post("/login", { email, password });
      const { token } = response.data;
      console.log("Token recebido:", token);

      // Salva o token no localStorage e atualiza o estado de login
      localStorage.setItem("token", token);
      console.log("Antes de setIsLoggedIn:", setIsLoggedIn);
      setIsLoggedIn(true);
      console.log("Depois de setIsLoggedIn:", setIsLoggedIn);

      // Redireciona para a página protegida
      navigate("/TelaInicial");
    } catch (err) {
      console.error("Erro ao fazer login:", err.response || err.message || err);
      if (err.response && err.response.status === 401) {
        setLoginError("Credenciais inválidas. Verifique seu email e senha.");
      } else {
        setLoginError("Erro inesperado. Tente novamente.");
      }
    }
  };

  return (
    <Box className="BoxInput">
      <form method="POST" className="FormLogin" onSubmit={handleSubmit}>
        <h1>Login</h1>

        {/* Campo de Email */}
        <TextField
          type="email"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error.email} // Marca o campo como erro
          helperText={error.email && "O campo Email é obrigatório"} // Exibe mensagem de erro
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircleIcon />
              </InputAdornment>
            ),
          }}
          fullWidth
        />

        {/* Campo de Senha */}
        <TextField
          type="password"
          label="Senha"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error.password} // Marca o campo como erro
          helperText={error.password && "O campo Senha é obrigatório"} // Exibe mensagem de erro
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
          }}
          fullWidth
        />

        {/* Mensagem de erro de login */}
        {loginError && <p style={{ color: "red" }}>{loginError}</p>}

        {/* Botão de envio */}
        <Button type="submit" variant="contained" color="primary" id="bnt">
          Acessar
        </Button>
      </form>
    </Box>
  );
}

export default Login;

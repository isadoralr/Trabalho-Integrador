import React, { useState } from 'react';
import { Box, TextField, Button, InputAdornment} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ email: false, password: false });

  // Função para tratar o envio do formulário
  const handleSubmit = (event) => {
    event.preventDefault(); 

    //trim remove espaços vazios e assim verifica se a String ta vazia
    const emailError = email.trim() === '';
    const passwordError = password.trim() === '';
    setError({ email: emailError, password: passwordError });
    if (emailError || passwordError) {
      return;
    }

    console.log('Email:', email);
    console.log('Password:', password);

    // Aqui você pode enviar os dados para um servidor, por exemplo.
  };

  return (
    <Box className="BoxImput">
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
          label="Password"
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

        {/* Botão de envio */}
        <Button type="submit" variant="contained" color="primary" id="bnt">
          Acessar
        </Button>
      </form>
    </Box>
  );
}

export default Login;

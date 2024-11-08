import React from 'react';
import {Box,TextField,Button} from "@mui/material";


function Login() {
  return (        
        <Box class="BoxImput">
            {/* colocar (action=(rota do dado a ser processado pelo banco de dados)) */}
            <form method="POST" class="FormLogin" >
                <h1>Login</h1>

                <TextField 
                type="email"
                // id="inputEmail" 
                label="Email" 
                variant="filled" />
                
                <TextField 
                type="password"
                // id="inputSenha" 
                label="Password" 
                variant="filled" />

                <Button type="submit" variant="contained" color="primary" id="bnt">
                    Acessar
                </Button>
            </form>
        </Box>
  );
}

export default Login;
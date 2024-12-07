import React from "react";
import { Button } from '@mui/material';

function Painel({ handleLogout }) {
    return (
        <div>
            <h1>Bem-vindo ao Dashboard</h1>
            <Button onClick={handleLogout} variant="contained" color="secondary">Logout</Button>
            {/* Outras partes do painel */}
        </div>
    );
}

export default Painel;
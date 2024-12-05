import React from "react";

function Dashboard({ handleLogout }) {
    return (
        <div>
            <h1>Bem-vindo ao Dashboard</h1>
            <button onClick={handleLogout}>Logout</button>
            {/* Outras partes do painel */}
        </div>
    );
}

export default Dashboard;

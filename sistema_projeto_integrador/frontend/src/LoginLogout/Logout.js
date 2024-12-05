import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.css";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Remover o token do localStorage e redirecionar
    localStorage.removeItem("token");
    navigate("/");
  }, [navigate]);

  return (
    <div className="logout-container">
      <h1>Saindo...</h1>
    </div>
  );
}

export default Logout;

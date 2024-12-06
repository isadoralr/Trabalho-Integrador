import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Box, Typography } from '@mui/material';

const InputManager = ({ onChange }) => {
  const [selectedValue, setSelectedValue] = useState(1); // Valor selecionado
  const [inputs, setInputs] = useState([]); // Valores dos inputs

  const handleValueChange = (event) => {
    const value = Number(event.target.value);
    setSelectedValue(value);
    setInputs(
      Array(value).fill({ entrada: '', saida: '' }) // Inicializa cada item com campos de entrada e saída vazios
    );
  };

  const handleInputChange = (index, field, value) => {
    setInputs((prev) => {
      const updatedInputs = [...prev];
      updatedInputs[index] = {
        ...updatedInputs[index],
        [field]: value, // Atualiza somente o campo correspondente (entrada ou saída)
      };
      return updatedInputs;
    });
  };

  // Notifica o formulário pai sempre que os valores mudam
  useEffect(() => {
    if (onChange) {
      onChange(inputs);
    }
  }, [inputs, onChange]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%',marginBottom:'10px' }}>
      {/* Dropdown de seleção */}
      <TextField
        required
        select
        label="Escolha um valor"
        value={selectedValue}
        onChange={handleValueChange}
      >
        {[1, 2, 3].map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      {/* Renderização dinâmica dos pares de entrada e saída */}
      {inputs.map((item, index) => (
        <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle1">{`Conjunto ${index + 1}`}</Typography>
          <TextField
            label={`Entrada ${index + 1}`}
            type="time"
            value={item.entrada}
            onChange={(e) => handleInputChange(index, 'entrada', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={`Saída ${index + 1}`}
            type="time"
            value={item.saida}
            onChange={(e) => handleInputChange(index, 'saida', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default InputManager;

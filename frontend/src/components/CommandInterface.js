import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { startAction, stopAllActions } from '../api';

const CommandInterface = () => {
  const [actionType, setActionType] = useState('');
  const [additionalInput, setAdditionalInput] = useState('');

  const handleStart = () => {
    try {
      const parsedInput = additionalInput ? JSON.parse(additionalInput) : {};
      startAction(actionType, null, parsedInput);
    } catch (error) {
      alert('Invalid additionalInput (must be JSON)');
    }
  };

  return (
    <div>
      <h2>Command Interface</h2>
      <TextField
        label="Action Type"
        variant="outlined"
        value={actionType}
        onChange={(e) => setActionType(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Additional Input (JSON)"
        variant="outlined"
        value={additionalInput}
        onChange={(e) => setAdditionalInput(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleStart} style={{ marginRight: '1rem' }}>
        Start Action
      </Button>
      <Button variant="contained" color="secondary" onClick={stopAllActions}>
        Stop All Actions
      </Button>
    </div>
  );
};

export default CommandInterface;
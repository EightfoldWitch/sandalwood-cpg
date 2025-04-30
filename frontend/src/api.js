import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

export const startAction = (actionType, inputId = null, additionalInput = {}) => {
  return axios.post(`${API_BASE}/actions/start`, { actionType, inputId, additionalInput });
};

export const stopAction = (actionId) => {
  return axios.post(`${API_BASE}/actions/stop/${actionId}`);
};

export const stopAllActions = () => {
  return axios.post(`${API_BASE}/actions/stop-all`);
};

export const getHealth = () => {
  return axios.get(`${API_BASE}/health`);
};
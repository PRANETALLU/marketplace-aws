import axios from 'axios';
import { getIdToken } from '../auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await getIdToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getUserTransactions = async () => {
  const response = await api.get('/transactions');
  return response.data;
};

export const getTransactionById = async (transactionId) => {
  const response = await api.get(`/transactions/${transactionId}`);
  return response.data;
};

import axios from 'axios';
import { getIdToken } from '../auth';

const api = axios.create({
  baseURL: 'https://03ii3aewhl.execute-api.us-east-1.amazonaws.com/dev',
});

api.interceptors.request.use(async (config) => {
  const token = await getIdToken();
  console.log('From api file', token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const placeOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getOrdersPlaced = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrdersReceived = async () => {
  const response = await api.get('/orders/received');
  return response.data;
};

export const updateOrderStatus = async (orderId, statusData) => {
  const response = await api.put(`/orders/${orderId}`, statusData);
  return response.data;
};

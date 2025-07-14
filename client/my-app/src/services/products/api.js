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

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (formData) => {
  const response = await api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
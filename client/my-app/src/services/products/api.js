import axios from 'axios';
import { getIdToken } from '../auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const updateProduct = async (id, formData) => {
  const isFormData = formData instanceof FormData;
  const response = await api.put(
    `/products/${id}`,
    formData,
    isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}
  );
  return response.data;
};

export const getProductsBySeller = async () => {
  const response = await api.get('/products/seller');
  return response.data;
};
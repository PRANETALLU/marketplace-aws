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

export const checkoutCartItems = async (cartItems) => {
  const response = await api.post('/payments/checkout-cart', { cartItems });
  return response.data;
};

export const checkoutSingleItem = async (productId, quantity = 1) => {
  const response = await api.post('/payments/checkout-single', { productId, quantity });
  return response.data;
};

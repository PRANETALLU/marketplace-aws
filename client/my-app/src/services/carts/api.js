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

// 🛒 Carts

export const getCartItems = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCart = async (cartItemData) => {
  // cartItemData should contain { productId, qty }
  const response = await api.post('/cart', cartItemData);
  console.log('Backend addToCart', response)
  return response.data;
};

export const updateCartItem = async (productId, updatedData) => {
  // updatedData can contain new quantity or product changes
  const response = await api.put(`/cart/${productId}`, updatedData);
  return response.data;
};

export const removeCartItem = async (productId) => {
  const response = await api.delete(`/cart/${productId}`);
  return response.data;
};
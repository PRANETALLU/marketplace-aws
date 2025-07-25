import axios from 'axios';
import { getIdToken } from '../auth';

const api = axios.create({
  baseURL: 'https://03ii3aewhl.execute-api.us-east-1.amazonaws.com/dev',
});

api.interceptors.request.use(async (config) => {
  const token = await getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get all reviews for a specific product
export const getReviewsForProduct = async (productId) => {
  const response = await api.get(`/reviews/${productId}`);
  return response.data;
};

// Create a review for a product
export const createReviewForProduct = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};



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
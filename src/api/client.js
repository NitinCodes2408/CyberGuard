import axios from 'axios';
import { getApiBaseUrl } from './config';

// Create dynamic axios instance using configured base URL
const createApiClient = () => {
  return axios.create({
    baseURL: getApiBaseUrl(),
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Check backend health status
 * GET /health
 */
export const checkHealth = async () => {
  const client = createApiClient();
  const response = await client.get('/health');
  return response.data;
};

/**
 * Fetch summary statistics
 * GET /stats
 */
export const fetchStats = async () => {
  const client = createApiClient();
  const response = await client.get('/stats');
  return response.data;
};

/**
 * Fetch recent threat logs from SQLite
 * GET /threats
 */
export const fetchThreats = async (limit = 100) => {
  const client = createApiClient();
  const response = await client.get('/threats', {
    params: { limit },
  });
  return response.data;
};

/**
 * Submit network traffic metrics to AI models for prediction
 * POST /predict
 */
export const predictTraffic = async (trafficData) => {
  const client = createApiClient();
  const response = await client.post('/predict', trafficData);
  return response.data;
};

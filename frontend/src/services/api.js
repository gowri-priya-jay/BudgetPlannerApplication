import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:9090',
});

const isTokenExpired = () => {
  const expiry = localStorage.getItem('tokenExpiry');
  if (!expiry) return true;
  return Date.now() > parseInt(expiry, 10);
};


API.interceptors.request.use((config) => {

  if (config.url === '/login' || config.url === '/register') 
    return config;

  const token = localStorage.getItem('token');

  if (token && !isTokenExpired()) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    window.location.href = '/login';
    return Promise.reject(new Error('Token expired'));
  }
  return config;
});

export default API;
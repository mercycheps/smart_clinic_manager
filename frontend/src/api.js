// src/api.js

import axios from 'axios';

// Use environment variable for flexibility across dev/prod
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3005';

export const api = axios.create({
  baseURL: API_BASE,
});

// Auth header helper
export const authHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

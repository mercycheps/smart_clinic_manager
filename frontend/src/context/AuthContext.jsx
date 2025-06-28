import React, { createContext, useContext, useState } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const register = async (username, email, password) => {
    return await api.post('/register', { username, email, password });
  };

  const createUserAsAdmin = async ({ username, email, password, role }) => {
    return await api.post('/admin/create-user', {
      username,
      email,
      password,
      role,
    });
  };

  const login = async (username, password) => {
    const res = await api.post('/login', { username, password });
    const { access_token, refresh_token } = res.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    const tokenPayload = JSON.parse(atob(access_token.split('.')[1]));
    setUser(tokenPayload.sub);
  };

  return (
    <AuthContext.Provider value={{ user, register, createUserAsAdmin, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


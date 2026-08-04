import axiosClient from './axiosClient';

export const authApi = {
  register: (data) => axiosClient.post('/api/auth/register', data),
  login: (data) => axiosClient.post('/api/auth/login', data),
};
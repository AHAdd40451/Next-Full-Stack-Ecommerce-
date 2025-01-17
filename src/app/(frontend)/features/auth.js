import api from '@/app/(frontend)/utils/axios';

export const authApi = {
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response;
  },

  signin: async (credentials) => {
    const response = await api.post('/auth/signin', credentials);
    return response;
  },

  verifyEmail: async (token) => {
    const response = await api.get(`/auth/signup/verify?token=${token}`);
    return response;
  }
};
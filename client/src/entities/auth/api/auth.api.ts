import { api, setAccessToken } from '@/shared/api/base-api';
import { RegisterInput, LoginInput } from '@wanderboard/shared';

export const authApi = {
  register: async (data: RegisterInput) => {
    const res = await api.post('/api/auth/register', data);
    setAccessToken(res.data.accessToken);
    return res.data;
  },

  login: async (data: LoginInput) => {
    const res = await api.post('/api/auth/login', data);
    setAccessToken(res.data.accessToken);
    return res.data;
  },

  logout: async () => {
    await api.post('/api/auth/logout');
    setAccessToken(null);
  },

  me: async () => {
    const res = await api.get('/api/auth/me');
    return res.data.user;
  },

  refresh: async () => {
    const res = await api.post('/api/auth/refresh');
    setAccessToken(res.data.accessToken);
    return res.data;
  },
};

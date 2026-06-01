import { api } from './fetchInstance';

export const authApi = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    logout: () => api.post('/auth/logout'),
    me: () => api.get('/auth/me'),
    switchRole : (role) => api.post('/auth/switch-role', {activeRole : role}) 
};
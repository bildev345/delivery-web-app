import { api } from "./fetchInstance";

export const zoneApi = {
    getAll : () => api.get('/admin/zones'),
    getById : (id) => api.get(`/admin/zones/${id}`),
    create : (data) => api.post('/admin/zones', data),
    update : (id, data) => api.put(`/admin/zones/${id}`, data),
    deactivate : (id) => api.patch(`/admin/zones/${id}/deactivate`),
    toggle : (id) => api.patch(`/admin/zones/${id}/toggle`)
};

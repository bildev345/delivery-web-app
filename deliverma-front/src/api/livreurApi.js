import { api } from "./fetchInstance";

export const livreurApi = {
    getAll : (page = 0, size = 10) =>
        api.get(`/admin/livreurs?page=${page}&size=${size}`),
    create : (data) => api.post('/admin/livreurs/create-livreur', data),
    toggle : (id) => api.patch(`/admin/livreurs/${id}/toggle`)
};
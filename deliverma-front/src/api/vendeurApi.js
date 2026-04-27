import { api } from "./fetchInstance";

export const vendeurApi =  {
    // Admin
    getAll : (page = 0, size = 5) => api.get(`/admin/vendeurs?page=${page}&size=${size}`),
    getById : (id) => api.get(`/admin/vendeurs/${id}`),
    toggle : (id) => api.patch(`/admin/vendeurs/${id}`),
    // Vendeur
    getProfil: () => api.get('/vendeur/profile'),
    updateProfil: (data) => api.put('/vendeur/profile', data)
};
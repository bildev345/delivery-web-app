import { api } from "./fetchInstance";

export const adresseApi = {
    getAll : () => api.get('/client/adresses'),
    create : (data) => api.post('/client/adresses', data),
    update : (id, data) => api.put(`/client/adresses/${id}`, data),
    delete : (id) => api.delete(`/client/adresses/${id}`),
    setDefault : (id) => api.patch(`/client/adresses/${id}/default`)
};
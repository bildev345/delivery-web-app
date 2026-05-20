import { api } from "./fetchInstance";

export const commandeApi = {
    passer : (data) => api.post('/client/commandes', data),
    getAll : () => api.get('/client/commandes'),
    getById : (id) => api.get(`/client/commandes/${id}`),
    annuler : (id) => api.post(`/client/commandes/${id}/annuler`),
    suivi : (numero) => api.get(`/commandes/suivi/${numero}`)
}
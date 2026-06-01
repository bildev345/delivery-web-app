import { api } from './fetchInstance';

export const offreApi = {
    getAll: () => api.get('/vendeur/offres'),
    getById: (id) => api.get(`/vendeur/offres/${id}`),
    create: (data) => api.post('/vendeur/offres', data),
    update: (id, data) => api.put(`/vendeur/offres/${id}`, data),
    toggle: (id) => api.patch(`/vendeur/offres/${id}/toggle`),
    delete: (id) => api.delete(`/vendeur/offres/${id}`),
};

export const uniteApi = {
    getByOffre: (offreId) => api.get(`/vendeur/unites/offre/${offreId}`),
    generer: (data) => api.post('/vendeur/unites/generer', data),
    updateStatut: (id, statut, notes) => {
        const q = new URLSearchParams({ statut });
        if (notes) q.set('notes', notes);
        return api.patch(`/vendeur/unites/${id}/statut?${q.toString()}`);
    },
    remettreEnVente: (id) =>
        api.patch(`/vendeur/unites/${id}/remettre-en-vente`)
};
import {api} from './fetchInstance';

export const statutApi = {
    // vendeur
    getCommandesVendeur: (page = 0, size = 10) => 
        api.get(`/vendeur/commandes?page=${page}&size=${size}`),
    
    changerStatutVendeur: (id, data) => 
        api.patch(`/vendeur/commandes/${id}/statut`, data),

    // livreur
    getTournee: () => api.get('/livreur/commandes'),
    
    changerStatutLivreur: (id, data) => 
        api.patch(`/livreur/commandes/${id}/statut`, data)
};
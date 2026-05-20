import { api } from "./fetchInstance";

export const catalogueApi = {
    // public : récuperer les produits qui ont des offres
    getProduits: (params = {}) => {
        const q = new URLSearchParams();
        if(params.search){
            q.set('search', params.search);
        }
        if(params.categorieId){
            q.set('categorieId', params.categorieId);
        }
        return api.get(`/catalogue/produits?${q.toString()}`);
        
    },
    getProduit:  (id) => api.get(`/catalogue/produits/${id}`),
    getOffres:   (id) => api.get(`/catalogue/produits/${id}/offres`)
}
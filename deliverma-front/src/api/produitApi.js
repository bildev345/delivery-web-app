import { api } from "./fetchInstance";

export const produitApi = {
    getAll : (params = {}) => {
        const q = new URLSearchParams();
        if(params.search){
            q.set('search', params.search);
        }
        if(params.categorieId){
            q.set('categorieId', params.categorieId);
        }
        if(params.page != null){
            q.set('page', params.page)
        }
        if(params.size != null){
            q.set('size', params.size)
        }
        return api.get(`/admin/produits?${q.toString()}`);
    },

    getById : (id) => api.get(`/admin/produits/${id}`),
    create : (data) => api.post(`/admin/produits`, data),
    update : (id, data) => api.put(`/admin/produits/${id}`, data),
    delete : (id) => api.delete(`/admin/produits/${id}`),

    getCatalogue: (params = {}) => {
        const q = new URLSearchParams();
        if(params.search){
            q.set('search', params.search);
        }
        if(params.categorieId){
            q.set('categorieId', params.categorieId);
        }
        return api.get(`/catalogue/produits?${q.toString()}`);
        
    }


}
import { api } from "./fetchInstance";

export const categorieApi = {
    getAll : () => api.get("/admin/categories"),
    create : (data) => api.post("/admin/categories", data),
    update : (id, data) => api.put(`/admin/categories/${id}`, data),
    delete : (id) => api.delete(`/admin/categories/${id}`) 
};
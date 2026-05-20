import { api } from "./fetchInstance";

export const fideliteApi = {
    getHistorique : (clientId) => api.get(`/client/fidelite/${clientId}/historique`),
    getSolde : () => api.get('/client/fidelite/solde')
}
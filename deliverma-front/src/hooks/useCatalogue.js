import { useQuery } from "@tanstack/react-query";
import { catalogueApi } from "../api/catalogueApi";

export function useCatalogue(params = {}) {
    return useQuery({
        queryKey: ['catalogue', params],
        queryFn:  () => catalogueApi.getProduits(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useProduitDetail(id) {
    return useQuery({
        queryKey: ['catalogue', 'produit', id],
        queryFn:  () => catalogueApi.getProduit(id),
        enabled:  !!id,
    });
}

export function useOffresProduit(produitId) {
    return useQuery({
        queryKey: ['catalogue', 'offres', produitId],
        queryFn:  () => catalogueApi.getOffres(produitId),
        enabled:  !!produitId,
    });
}
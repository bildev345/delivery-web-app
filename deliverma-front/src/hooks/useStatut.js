import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { statutApi } from "../api/statutApi"

export const useCommandesVendeur = (page = 0) => {
    return useQuery({
        queryKey : ['commandes-vendeur', page],
        queryFn : () => statutApi.getCommandesVendeur(page),
        placeholderData : keepPreviousData
    });
}

export const useChangerStatutVendeur = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({id, data}) => statutApi.changerStatutVendeur(id, data),
        onSuccess : () => qc.invalidateQueries({queryKey : ['commandes-vendeur']})
    });
}

export const useTournee = () => {
    return useQuery({
        queryKey: ['tournee'],
        queryFn : statutApi.getTournee,
        // rafraichir toutes les 2 minutes pour le livreur
        refetchInterval : 2 * 60 * 1000
    });
}

export const useChangerStatutLivreur = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn : ({id, data}) => statutApi.changerStatutLivreur(id, data),
        onSuccess : () => qc.invalidateQueries({queryKey : ['tournee']})
    })
}
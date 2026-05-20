import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { commandeApi } from "../api/commandeApi"

export const useCommandes = () => {
    return useQuery({
        queryKey : ['commandes'],
        queryFn : commandeApi.getAll
    });
}

export const useCommande = (id) => {
    return useQuery({
        queryKey : ['commandes', id],
        queryFn : () => commandeApi.getById(id),
        enabled : !!id
    });
}

export const usePasserCommande = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn : commandeApi.passer,
        onSuccess : () => {
            qc.invalidateQueries({queryKey : ['commandes']}),
            qc.invalidateQueries({queryKey : ['adresses']})
        }
    });
}

export const useAnnulerCommande = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn : commandeApi.annuler,
        onSuccess : () => qc.invalidateQueries({queryKey : ['commandes']})
    });
}
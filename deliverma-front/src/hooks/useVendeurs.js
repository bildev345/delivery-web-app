import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { vendeurApi } from "../api/vendeurApi"

// ADMIN
export const useVendeurs = (page = 0, size = 5) => {
    return useQuery({
        queryKey : ['vendeurs', page, size],
        queryFn : () => vendeurApi.getAll(page, size),
        placeholderData : keepPreviousData
    })
}

export const useToggleVendeur = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn : (id) => vendeurApi.toggle(id),
        onSuccess : () => queryClient.invalidateQueries({queryKey: ['vendeurs']})
    })
}

// VENDEUR
export const useProfil = () => {
    return useQuery({
        queryKey : ['vendeur-profil'],
        queryFn : vendeurApi.getProfil
    });
}

export const useUpdateProfil = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn : (data) => vendeurApi.updateProfil(data),
        onSuccess : () => queryClient.invalidateQueries({
            queryKey : ['vendeur-profil']
        })
    });
}
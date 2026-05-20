import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { adresseApi } from "../api/adresseApi"

export const useAdresses = () => {
    return useQuery({
        queryKey : ['adresses'],
        queryFn : adresseApi.getAll
    });
}

export const useCreateAdresse = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn : adresseApi.create,
        onSuccess : () => qc.invalidateQueries({
            queryKey : ['adresses']
        })
    });
}

export const useUpdateAdresse = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn : ({id, data}) => adresseApi.update(id, data),
        onSuccess : () => qc.invalidateQueries({queryKey : ['adresses']})
    });
}

export const useDeleteAdresse = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn : adresseApi.delete,
        onSuccess : () => qc.invalidateQueries({queryKey : ['adresses']})
    });
}

export const useSetDefaultAdresse = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn : adresseApi.setDefault,
        onSuccess : () => qc.invalidateQueries({
            queryKey : ['adresses']
        })
    });
}

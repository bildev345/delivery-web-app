import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { categorieApi } from "../api/categorieApi"

export const useCategories = () => {
    return useQuery({
        queryKey : ['categories'],
        queryFn : categorieApi.getAll
    });
}

export const useCreateCategorie = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn : categorieApi.create,
        onSuccess : () => qc.invalidateQueries({queryKey : ['categories']})
    });
}

export const useUpdateCategorie = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => categorieApi.update(id, data),
        onSuccess:  () => qc.invalidateQueries({ queryKey: ['categories'] }),
    });
}

export const useDeleteCategorie = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: categorieApi.delete,
        onSuccess:  () => qc.invalidateQueries({ queryKey: ['categories'] }),
    });
}
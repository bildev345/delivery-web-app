import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { produitApi } from '../api/produitApi';

export const useProduits = (params = {}) => {
    return useQuery({
        queryKey: ['produits', params],
        queryFn: () => produitApi.getAll(params),
        placeholderData : keepPreviousData
    });
}
// pour remplir le selectbox
//  pour que le vendeur crée son offre
export const useProduitsPublic = (params = {}) => {
    return useQuery({
        queryKey: ['catalogue', params],
        queryFn: () => produitApi.getAllPublic(params)
    });
}

export const useCreateProduit = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: produitApi.create,
        onSuccess:  () => qc.invalidateQueries({ queryKey: ['produits'] }),
    });
}

export const useUpdateProduit = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => produitApi.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['produits'] }),
    });
}

export const useDeleteProduit = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: produitApi.delete,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['produits'] }),
    });
}
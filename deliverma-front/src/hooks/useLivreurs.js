// src/hooks/useLivreurs.js
import { useQuery, useMutation, useQueryClient }
    from '@tanstack/react-query';
import { livreurApi } from '../api/livreurApi';

export function useLivreurs(page = 0) {
    return useQuery({
        queryKey: ['livreurs', page],
        queryFn:  () => livreurApi.getAll(page),
        keepPreviousData: true,
    });
}

export function useCreateLivreur() {
    const qc = useQueryClient();
    return useMutation({
        // Utilise l'endpoint admin existant
        mutationFn: (data) => livreurApi.create({
            ...data,
            role: 'LIVREUR',
        }),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: ['livreurs'] }),
    });
}

export function useToggleLivreur() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: livreurApi.toggle,
        onSuccess:  () =>
            qc.invalidateQueries({ queryKey: ['livreurs'] }),
    });
}
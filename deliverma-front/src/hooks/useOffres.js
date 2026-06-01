import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { offreApi, uniteApi } from '../api/offreApi';

export function useOffres() {
    return useQuery({
        queryKey: ['offres'],
        queryFn:  offreApi.getAll,
    });
}

export function useCreateOffre() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: offreApi.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['offres'] })
    });
}

export function useUpdateOffre() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => offreApi.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['offres'] })
    });
}

export function useToggleOffre() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: offreApi.toggle,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['offres'] })
    });
}

export function useDeleteOffre() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: offreApi.delete,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['offres'] }),
    });
}

export function useUnitesByOffre(offreId) {
    return useQuery({
        queryKey: ['unites', offreId],
        queryFn: () => uniteApi.getByOffre(offreId),
        enabled: !!offreId,
    });
}

export function useGenererUnites() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: uniteApi.generer,
        onSuccess: (_, vars) => {
            qc.invalidateQueries({queryKey: ['unites', vars.offreId]}),
            qc.invalidateQueries({queryKey: ['offres']})
        }
    });
}

export function useRemettreEnVente() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => uniteApi.remettreEnVente(id),
        onSuccess: (_, id) => {
            qc.invalidateQueries({ queryKey: ['unites'] });
            qc.invalidateQueries({ queryKey: ['offres'] });
        },
    });
}
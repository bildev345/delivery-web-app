import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { zoneApi } from "../api/zoneApi"

// récupérer tous
export const useZones = () => {
    return useQuery({
        queryKey : ['zones'],
        queryFn : zoneApi.getAll
    });
}

// ajouter
export const useCreateZone = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn : zoneApi.create,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : ['zones']})
        }
    });
}

// modifier
export function useUpdateZone() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => zoneApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['zones'] });
        },
    });
}

// switcher l'activité
export function useToggleZone() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => zoneApi.toggle(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['zones'] });
        },
    });
}

import { useQuery } from "@tanstack/react-query"
import { vendeurDashboardApi } from "../api/vendeurApi"

export const useVendeurDashboard = () => {
    return useQuery({
        queryKey : ['vendeur-dashboard'],
        queryFn : vendeurDashboardApi.getStats,
        staleTime : 1000 * 60 * 5
    });
} 
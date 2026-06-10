package org.deliverma.api.admin.dto.dashboard;

import java.math.BigDecimal;
import java.util.List;

import lombok.Builder;

@Builder
public record AdminDashboardResponse(
    long totalUtilisateurs,
    long totalVendeurs,
    long totalLivreurs,
    long totalClients,
    long totalCommandes,
    long commandesEnCours,
    long commandesLivrees,
    long commandesAnnulees,
    BigDecimal chiffreAffairesTotal,
    List<StatutCount> repartitionStatus 
) {}

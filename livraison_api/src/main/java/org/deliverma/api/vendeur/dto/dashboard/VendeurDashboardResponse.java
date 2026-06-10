package org.deliverma.api.vendeur.dto.dashboard;

import java.math.BigDecimal;
import java.util.List;

import org.deliverma.api.shared.dto.CommandeVendeurResponse;

import lombok.Builder;

@Builder
public record VendeurDashboardResponse(
    long totalCommandes,
    long commandesEnAttente,
    long commandesAExpedier,
    int totalOffres,
    int offresEnRupture,
    BigDecimal chiffreAffaires,
    List<CommandeVendeurResponse> commandesRecentes
) {}

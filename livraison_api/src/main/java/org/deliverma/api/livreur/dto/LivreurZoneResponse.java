package org.deliverma.api.livreur.dto;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.Builder;

@Builder
public record LivreurZoneResponse(
    UUID zoneId,
    String nom,
    String villesCouvertes,
    BigDecimal fraisLivraison,
    int delaiJours,
    boolean principale
) {}

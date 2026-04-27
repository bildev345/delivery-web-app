package org.deliverma.api.admin.dto.zoneLivraison;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.Builder;

@Builder
public record ZoneResponse(
    UUID id,
    String nom,
    String villesCouvertes,
    BigDecimal fraisLivraison,
    int delaisJours,
    boolean active
) {}

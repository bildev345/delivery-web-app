package org.deliverma.api.shared.dto;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.Builder;

@Builder
public record ZoneResponse(
    UUID id,
    String nom,
    String villesCouvertes,
    BigDecimal fraisLivraison,
    int delaiJours,
    boolean active
) {}

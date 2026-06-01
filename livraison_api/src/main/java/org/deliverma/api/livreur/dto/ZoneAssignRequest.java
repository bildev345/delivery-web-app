package org.deliverma.api.livreur.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record ZoneAssignRequest(
    @NotNull(message = "${VALIDATION.LIVREUR_UPDATE.TELEPHONE.BLANK}") 
    UUID zoneId,
    
    Boolean principale
) {}

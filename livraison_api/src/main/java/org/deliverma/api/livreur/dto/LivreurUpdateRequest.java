package org.deliverma.api.livreur.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;

public record LivreurUpdateRequest(
    @NotBlank(message = "${VALIDATION.LIVREUR_UPDATE.TELEPHONE.BLANK}")
    String telephone,

    @NotBlank(message = "${VALIDATION.LIVREUR_UPDATE.VEHICLE.BLANK}")
    String vehicle,
    List<ZoneAssignRequest> zones
) {}

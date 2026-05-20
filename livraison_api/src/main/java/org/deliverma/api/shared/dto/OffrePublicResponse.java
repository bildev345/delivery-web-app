package org.deliverma.api.shared.dto;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.Builder;

@Builder
public record OffrePublicResponse(
    UUID offreId,
    BigDecimal prixHt,
    BigDecimal tva,
    BigDecimal prixTtc,
    int stock,
    String nomBoutique,
    String logoBoutique,
    String villeBoutique,
    boolean tracable
) {}

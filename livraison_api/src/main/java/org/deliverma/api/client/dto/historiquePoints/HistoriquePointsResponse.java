package org.deliverma.api.client.dto.historiquePoints;

import java.time.LocalDateTime;
import java.util.UUID;

import org.deliverma.api.shared.enums.TypePoints;

import lombok.Builder;

@Builder
public record HistoriquePointsResponse(
    UUID id,
    TypePoints type,
    int points,
    String motif,
    LocalDateTime dateOperation,
    UUID commandeId
) {}

package org.deliverma.api.client.dto.commande;

import java.util.UUID;

import lombok.Builder;

@Builder
public record CommandeResponse(
    UUID commandeId
) {}

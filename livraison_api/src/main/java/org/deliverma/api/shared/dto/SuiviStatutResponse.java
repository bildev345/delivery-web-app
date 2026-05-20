package org.deliverma.api.shared.dto;

import java.time.LocalDateTime;

import org.deliverma.api.shared.enums.StatutCommande;

import lombok.Builder;

@Builder
public record SuiviStatutResponse(
    StatutCommande statut,
    String commentaire,
    LocalDateTime dateChangement
) {}

package org.deliverma.api.shared.dto;

import org.deliverma.api.shared.enums.StatutCommande;

import jakarta.validation.constraints.NotNull;

public record SuiviStatutRequest(
   @NotNull(message = "${VALIDATION.SUIVI_STATUT_STATUT.NULL}") 
   StatutCommande statut,
   String commentaire
) {}

package org.deliverma.api.vendeur.dto.uniteProduit;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UniteProduitRequest(
    @NotNull(message = "${VALIDATION.UNITE_PRODUIT.OFFRE.NULL}")
    UUID offreId,

    @NotNull(message = "${VALIDATION.UNITE_PRODUIT.QUANTITE.NULL}")
    @Min(value = 1, message = "${VALIDATION.UNITE_PRODUIT.QUANTITE.MIN}")
    int quantite,   // nombre d'unités à générer

    LocalDate dateGarantie  // optionnel — même date pour toutes les unités du lot
) {}

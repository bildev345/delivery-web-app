package org.deliverma.api.vendeur.dto.offre;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

@Builder
public record OffreRequest(
    @NotNull(message = "${VALIDATION.OFFRE.PRODUIT.NULL}")
    UUID produitId,

    @Positive(message = "${VALIDATION.OFFRE.PRIX_HT.POSITIF}")
    BigDecimal prixHt,

    @NotNull(message = "${VALIDATION.OFFRE.TVA.NULL}")
    @DecimalMin(value = "0.0")
    @DecimalMax(value = "100.0")
    BigDecimal tva,
    
    int stock,

    String photo,

    @NotNull(message = "${VALIDATION.OFFRE.TRACABLE.NULL}")
    boolean tracable,
    // optionnel au cas d'ajout
    boolean active
) {
    
}

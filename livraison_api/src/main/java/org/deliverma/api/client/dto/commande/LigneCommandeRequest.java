package org.deliverma.api.client.dto.commande;

import java.util.UUID;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;


@Builder
public record LigneCommandeRequest(
    @NotNull(message = "${VALIDATION.LIGNE_COMMANDE.OFFRE.NULL}")
    UUID offreId,

    @NotNull(message = "${VALIDATION.LIGNE_COMMANDE.QUANTITE.NULL}")
    @Min(1)
    int quantite
    
) {}

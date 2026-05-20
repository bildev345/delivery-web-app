package org.deliverma.api.client.dto.commande;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record CommandeRequest(
    @NotNull(message = "${VALIDATION.COMMANDE.ADRESSE.NULL}")
    UUID adresseId,
    
    String notes,

    @NotNull(message = "${VALIDATION.COMMANDE.LIGNES.NULL}")
    @Size(min = 1, message = "${VALIDATION.COMMANDE.LIGNES.SIZE}")
    List<LigneCommandeRequest> lignes,
    
    @Min(value = 0, message = "${VALIDATION.COMMANDE.POINTS_A_UTILISER.MIN}")
    Integer pointsAUtiliser // nullable - points fidélité à déduire

) {}

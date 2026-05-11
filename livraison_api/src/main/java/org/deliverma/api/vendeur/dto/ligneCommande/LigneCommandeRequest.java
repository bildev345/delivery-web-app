package org.deliverma.api.vendeur.dto.ligneCommande;

import java.util.UUID;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record LigneCommandeRequest(
    @NotNull(message = "${VALIDATION.LIGNE_COMMANDE.COMMANDE.NULL}")
    UUID commandeId,
    
    @NotNull(message = "${VALIDATION.LIGNE_COMMANDE.OFFRE.NULL}")
    UUID offreId,

    @NotNull(message = "${VALIDATION.LIGNE_COMMANDE.QUANTITE.NULL}")
    @Min( value = 1 ,message = "${VALIDATION.LIGNE_COMMANDE.QUANTITE}")
    int quantite,

    UUID uniteProduitId
) {}

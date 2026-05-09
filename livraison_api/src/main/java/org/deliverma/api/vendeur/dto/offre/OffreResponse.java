package org.deliverma.api.vendeur.dto.offre;

import java.math.BigDecimal;
import java.util.UUID;

import org.deliverma.api.admin.dto.produit.ProduitResponse;

import lombok.Builder;

@Builder
public record OffreResponse(
    UUID offreId,
    BigDecimal prixHt,
    BigDecimal tva,
    BigDecimal prixTttc,
    int stock, 
    boolean active,
    boolean tracable,

    ProduitResponse produit,

    String nomBoutique
) {

}

package org.deliverma.api.shared.dto;

import java.math.BigDecimal;
import java.util.UUID;


import lombok.Builder;

@Builder
public record LigneCommandeResponse(
    UUID ligneCommandeId,
    int quantite,
    BigDecimal prixUnitaireHt,
    BigDecimal tva,
    BigDecimal montantTtc,
    String designation, // snapshot du nom produit
    String photo,
    String nomBoutique,
    String numeroSerie // null si non tracable
) {}

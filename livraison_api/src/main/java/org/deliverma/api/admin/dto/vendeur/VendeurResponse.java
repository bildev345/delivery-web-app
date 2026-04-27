package org.deliverma.api.admin.dto.vendeur;

import java.util.UUID;

import lombok.Builder;
@Builder
public record VendeurResponse(
    // infos boutique
    UUID vendeurId,
    String nomBoutique,
    String description,
    String logo,
    String ville,
    boolean actif,
    
    // user associé
    String nom,
    String prenom,
    String email

) {}

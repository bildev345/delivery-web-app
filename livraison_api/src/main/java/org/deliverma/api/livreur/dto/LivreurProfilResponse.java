package org.deliverma.api.livreur.dto;

import java.util.UUID;

import lombok.Builder;

@Builder
public record LivreurProfilResponse(
    UUID id,
    String nom,
    String prenom,
    String email,
    String telephone,
    String vehicle,
    String numeroPermis,
    boolean disponible,
    String zonePrincipale
) {}

package org.deliverma.api.admin.dto.livreur;

import java.util.UUID;

import lombok.Builder;

@Builder
public record LivreurResponse(
    UUID id,
    String nom,
    String prenom,
    String email,
    String telephone,
    String vehicle,
    String numeroPermis,
    boolean disponible,
    boolean actif,
    String zonePrincipale
) {}

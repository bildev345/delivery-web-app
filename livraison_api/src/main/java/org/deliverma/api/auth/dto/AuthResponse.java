package org.deliverma.api.auth.dto;

import java.util.List;
import java.util.UUID;

import lombok.Builder;

@Builder
public record AuthResponse(
    UUID userId,
    String nom,
    String prenom,
    String email,
    List<String> roles,
    // role actif dans la session courante
    String activeRole,
    String message,
    // s'il s'agit d'un client
    int pointsFidelite
) {
    
}

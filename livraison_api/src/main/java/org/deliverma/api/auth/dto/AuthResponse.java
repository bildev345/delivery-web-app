package org.deliverma.api.auth.dto;

import lombok.Builder;

@Builder
public record AuthResponse(
    String userId,
    String nom,
    String prenom,
    String email,
    String role,
    String message
) {
    
}

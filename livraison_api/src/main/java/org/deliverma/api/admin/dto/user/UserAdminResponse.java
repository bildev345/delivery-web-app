package org.deliverma.api.admin.dto.user;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.Builder;

@Builder
public record UserAdminResponse(
    UUID id,
    String nom,
    String prenom,
    String email,
    String telephone,
    List<String> roles,
    boolean actif,
    LocalDateTime dateCreation
) {
    
}

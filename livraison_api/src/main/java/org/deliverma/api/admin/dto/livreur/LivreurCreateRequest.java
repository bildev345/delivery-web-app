package org.deliverma.api.admin.dto.livreur;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LivreurCreateRequest(
    @NotBlank String nom,
    @NotBlank String prenom,
    @NotBlank @Email String email,
    @NotBlank String telephone,
    @NotBlank String vehicle,
    @NotBlank String numeroPermis
) {}

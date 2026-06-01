package org.deliverma.api.auth.dto;

public record TokenValidationResponse(
    String nom,
    String prenom,
    String email
) {}

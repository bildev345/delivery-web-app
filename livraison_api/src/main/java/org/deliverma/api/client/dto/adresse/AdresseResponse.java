package org.deliverma.api.client.dto.adresse;

import java.util.UUID;

import org.deliverma.api.shared.dto.ZoneResponse;

import lombok.Builder;

@Builder
public record AdresseResponse(
    UUID id,
    String libelle,
    String ville,
    String adresse,
    String codePostal,
    boolean parDefaut,
    ZoneResponse zone
) {}

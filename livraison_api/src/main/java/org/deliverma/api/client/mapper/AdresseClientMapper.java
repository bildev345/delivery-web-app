package org.deliverma.api.client.mapper;

import org.deliverma.api.client.dto.adresse.AdresseResponse;
import org.deliverma.api.shared.entities.AdresseClient;
import org.deliverma.api.shared.mapper.ZoneMapper;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AdresseClientMapper {
    private final ZoneMapper zoneMapper;

    public AdresseResponse toResponse(AdresseClient adresseClient){
        return AdresseResponse
        .builder()
        .id(adresseClient.getId())
        .libelle(adresseClient.getLibelle())
        .ville(adresseClient.getVille())
        .adresse(adresseClient.getAdresse())
        .codePostal(adresseClient.getCodePostal())
        .parDefaut(adresseClient.isParDefaut())
        .zone(zoneMapper.toResponse(adresseClient.getZone()))
        .build();

    }
}

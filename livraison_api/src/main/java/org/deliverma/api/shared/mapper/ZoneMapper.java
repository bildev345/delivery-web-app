package org.deliverma.api.shared.mapper;

import org.deliverma.api.admin.dto.zoneLivraison.ZoneRequest;
import org.deliverma.api.shared.dto.ZoneResponse;
import org.deliverma.api.shared.entities.ZoneLivraison;
import org.springframework.stereotype.Component;

@Component
public class ZoneMapper {
    public ZoneResponse toResponse(ZoneLivraison zone){
        return ZoneResponse.builder()
        .nom(zone.getNom())
        .id(zone.getId())
        .delaiJours(zone.getDelaiJours())
        .fraisLivraison(zone.getFraisLivraison())
        .villesCouvertes(zone.getVillesCouvertes())
        .active(zone.isActive())
        .build();
    }

    public ZoneLivraison toEntity(ZoneRequest request){
        return ZoneLivraison.builder()
        .nom(request.nom())
        .villesCouvertes(request.villesCouvertes())
        .fraisLivraison(request.fraisLivraison())
        .delaiJours(request.delaiJours())
        .active(true)
        .build();
    }
}

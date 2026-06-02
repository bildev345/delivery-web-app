package org.deliverma.api.livreur.mapper;

import java.util.List;

import org.deliverma.api.livreur.dto.LivreurProfilResponse;
import org.deliverma.api.livreur.dto.LivreurZoneResponse;
import org.deliverma.api.shared.entities.Livreur;
import org.deliverma.api.shared.entities.LivreurZone;
import org.springframework.stereotype.Component;

@Component
public class LivreurMapper {
    public LivreurProfilResponse toResponse(Livreur livreur){
        List<LivreurZoneResponse> zones = 
                    livreur.getLivreurZones().stream()
                    .map(this::toLivreurZoneResponse)
                    .toList();

        return LivreurProfilResponse
        .builder()
        .id(livreur.getId())
        .nom(livreur.getUser().getNom())
        .prenom(livreur.getUser().getPrenom())
        .email(livreur.getUser().getEmail())
        .telephone(livreur.getUser().getTelephone())
        .vehicle(livreur.getVehicle())
        .numeroPermis(livreur.getNumeroPermis())
        .disponible(livreur.isDisponible())
        .zones(zones)
        .build();
    }

    public LivreurZoneResponse toLivreurZoneResponse(LivreurZone livreurZone){
        return LivreurZoneResponse
               .builder()
               .zoneId(livreurZone.getZoneLivraison().getId())
               .nom(livreurZone.getZoneLivraison().getNom())
               .villesCouvertes(livreurZone.getZoneLivraison().getVillesCouvertes())
               .fraisLivraison(livreurZone.getZoneLivraison().getFraisLivraison())
               .delaiJours(livreurZone.getZoneLivraison().getDelaiJours())
               .principale(livreurZone.isPrincipale())
               .build();
    }
}

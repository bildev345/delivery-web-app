package org.deliverma.api.livreur.mapper;

import org.deliverma.api.livreur.dto.LivreurProfilResponse;
import org.deliverma.api.shared.entities.Livreur;
import org.springframework.stereotype.Component;

@Component
public class LivreurMapper {
    public LivreurProfilResponse toResponse(Livreur livreur){
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
        .zonePrincipale(livreur.getZonePrincipale() != null 
            ? livreur.getZonePrincipale().getNom()
            : null
        )
        .build();
    }
}

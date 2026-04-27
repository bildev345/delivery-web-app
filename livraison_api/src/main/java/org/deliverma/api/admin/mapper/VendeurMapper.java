package org.deliverma.api.admin.mapper;

import org.deliverma.api.admin.dto.vendeur.VendeurResponse;
import org.deliverma.api.shared.entities.Vendeur;
import org.springframework.stereotype.Component;

@Component
public class VendeurMapper {
    public VendeurResponse toResponse(Vendeur vendeur){
        return VendeurResponse.builder()
               .vendeurId(vendeur.getId())
               .nomBoutique(vendeur.getNomBoutique())
               .description(vendeur.getDescription())
               .logo(vendeur.getLogo())
               .ville(vendeur.getVille())
               .actif(vendeur.isActif())
               .nom(vendeur.getUser().getNom())
               .prenom(vendeur.getUser().getPrenom())
               .email(vendeur.getUser().getEmail())
               .build();
    }

    
}

package org.deliverma.api.livreur.service;

import org.deliverma.api.admin.repository.ZoneLivraisonRepository;
import org.deliverma.api.livreur.dto.LivreurProfilResponse;
import org.deliverma.api.livreur.dto.LivreurUpdateRequest;
import org.deliverma.api.livreur.dto.ZoneAssignRequest;
import org.deliverma.api.livreur.mapper.LivreurMapper;
import org.deliverma.api.shared.entities.Livreur;
import org.deliverma.api.shared.entities.LivreurZone;
import org.deliverma.api.shared.entities.ZoneLivraison;
import org.deliverma.api.shared.exception.ResourceNotFoundException;
import org.deliverma.api.shared.repositories.LivreurRepository;
import org.deliverma.api.utils.SecurityUtils;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LivreurService {
    private final LivreurMapper livreurMapper;
    private final LivreurRepository livreurRepository;
    private final ZoneLivraisonRepository zoneLivraisonRepository;

    public LivreurProfilResponse getProfil(){
        String email = SecurityUtils.currentUserEmail();
        Livreur livreur = livreurRepository.findByUserEmail(email)
                         .orElseThrow(() -> new ResourceNotFoundException("Livreur", email));

        return livreurMapper.toResponse(livreur);                 
    }
    public LivreurProfilResponse updateProfil(LivreurUpdateRequest request) {
        String email = SecurityUtils.currentUserEmail();
        Livreur livreur = livreurRepository.findByUserEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("Livreur", email));

        livreur.getUser().setTelephone(request.telephone());
        livreur.setVehicle(request.vehicle());

        // mettre à jour les zones
        if(request.zones() != null){
            livreur.getLivreurZones().clear();
            for(ZoneAssignRequest z : request.zones()){
                ZoneLivraison zone = zoneLivraisonRepository.findById(z.zoneId())
                .orElseThrow(() -> new ResourceNotFoundException("Zone", z.zoneId()));

                LivreurZone livreurZone = LivreurZone
                            .builder()
                            .livreur(livreur)
                            .zoneLivraison(zone)
                            .principale(z.principale())
                            .build();
                livreur.getLivreurZones().add(livreurZone);            
            }
        }
        return livreurMapper.toResponse(livreurRepository.save(livreur));
    }
    
}

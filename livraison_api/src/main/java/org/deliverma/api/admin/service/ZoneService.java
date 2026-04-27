package org.deliverma.api.admin.service;

import java.util.List;
import java.util.UUID;

import org.deliverma.api.admin.mapper.ZoneMapper;
import org.deliverma.api.admin.dto.zoneLivraison.ZoneRequest;
import org.deliverma.api.admin.dto.zoneLivraison.ZoneResponse;
import org.deliverma.api.admin.repository.ZoneLivraisonRepository;
import org.deliverma.api.shared.entities.ZoneLivraison;
import org.deliverma.api.shared.exception.DuplicateResourceException;
import org.deliverma.api.shared.exception.ResourceNotFoundException;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ZoneService {
    private final ZoneLivraisonRepository zoneRepo;
    private final ZoneMapper zoneMapper;

    public List<ZoneResponse> getAll(){
        return zoneRepo.findAll()
        .stream()
        .map(zoneMapper::toResponse)
        .toList();
    }

    public ZoneResponse getById(@NonNull UUID id){
        return zoneMapper.toResponse(findOrThrow(id));
    }

    public ZoneResponse desactiverZone(@NonNull UUID id) {
        ZoneLivraison zone = findOrThrow(id);
        zone.setActive(false);
        zoneRepo.save(zone);
        return zoneMapper.toResponse(zone);
    }

    public ZoneResponse addZone(ZoneRequest zoneRequest) {
        if(zoneRepo.existsByNomIgnoreCase(zoneRequest.nom())){
            throw new DuplicateResourceException("Une zone avec le nom '" + zoneRequest.nom() + "' existe déjà");
        }
        ZoneLivraison saved = zoneRepo.save(zoneMapper.toEntity(zoneRequest));
        return zoneMapper.toResponse(saved);
    }
    
    @Transactional
    public ZoneResponse toggleZoneActivity(UUID id){
        ZoneLivraison zone = findOrThrow(id);
        zone.setActive(!zone.isActive());
        return zoneMapper.toResponse(zoneRepo.save(zone));

    }
    
    @Transactional
    public ZoneResponse updateZone(UUID id, ZoneRequest zoneRequest){
        ZoneLivraison zone = findOrThrow(id);
        if(!zone.getNom().equals(zoneRequest.nom()) && zoneRepo.existsByNomIgnoreCase(zoneRequest.nom())){
            throw new DuplicateResourceException("Une zone avec le nom '" + zoneRequest.nom() + "' existe déjà");
        }
        zone.setNom(zoneRequest.nom());
        zone.setVillesCouvertes(zoneRequest.villesCouvertes());
        zone.setFraisLivraison(zoneRequest.fraisLivraison());
        zone.setDelaisJours(zoneRequest.delaisJours());
        return zoneMapper.toResponse(zoneRepo.save(zone));
    }

    private ZoneLivraison findOrThrow(UUID id){
        return zoneRepo.findById(id)
               .orElseThrow(() -> new ResourceNotFoundException("Zone", id));        
    }
    
}

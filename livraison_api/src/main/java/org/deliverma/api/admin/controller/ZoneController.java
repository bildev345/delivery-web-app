package org.deliverma.api.admin.controller;

import java.util.List;
import java.util.UUID;

import org.deliverma.api.admin.dto.zoneLivraison.ZoneRequest;
import org.deliverma.api.shared.dto.ZoneResponse;
import org.deliverma.api.admin.service.ZoneService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/admin/zones")
@Tag(name = "Zones de livraison", description = "Endpoints restreints au rôle ADMIN")
public class ZoneController {
    private final ZoneService zoneService; 
    // récuperer tous les zones
    @GetMapping
    public ResponseEntity<List<ZoneResponse>> getAllZones() {
        return ResponseEntity.ok(zoneService.getAll());
    }
    
    // récuperer une zone par son Id
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("{id}")
    public ResponseEntity<ZoneResponse> getZone(@PathVariable UUID id){
        return ResponseEntity.ok(zoneService.getById(id));
    }

    // ajouter une zone
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ZoneResponse> ajouterZone(@Valid @RequestBody ZoneRequest zoneRequest) {        
        return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(zoneService.addZone(zoneRequest));
    }
    
    // modifier une zone
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("{id}")
    public ResponseEntity<ZoneResponse> modifierZone(@PathVariable UUID id, @Valid @RequestBody ZoneRequest zoneRequest){
        return ResponseEntity.ok(zoneService.updateZone(id, zoneRequest));
    }
    
    // activer ou désactiver une zone
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("{id}/toggle")
    public ResponseEntity<ZoneResponse> toggleZone(@PathVariable UUID id){
        return ResponseEntity.ok(zoneService.toggleZoneActivity(id));
    }

    // désactiver une zone au lieu de la supprimer
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("{id}/deactivate")
    public ResponseEntity<ZoneResponse> desactiverZone(@PathVariable UUID id){
        return ResponseEntity.ok(zoneService.desactiverZone(id));

    }
    
}

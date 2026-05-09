package org.deliverma.api.vendeur.controller;

import java.util.List;
import java.util.UUID;

import org.deliverma.api.vendeur.dto.offre.OffreRequest;
import org.deliverma.api.vendeur.dto.offre.OffreResponse;
import org.deliverma.api.vendeur.service.OffreService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RequiredArgsConstructor
@RestController
@PreAuthorize("hasRole('VENDEUR')")
@RequestMapping("/api/v1/vendeur/offres")
@Tag(name = "Gestion des offres")
public class OffreController {
    private final OffreService offreService;

    @GetMapping
    public ResponseEntity<List<OffreResponse>> getVendeurOffres() {
        return ResponseEntity.ok(offreService.findVendeurOffres());
    }

    @GetMapping("{id}")
    public ResponseEntity<OffreResponse> getVendeurOffreById(@PathVariable UUID id) {
        return ResponseEntity.ok(offreService.findOffreById(id));
    }

    @PostMapping
    public ResponseEntity<OffreResponse> createOffre(
        @Valid @RequestBody OffreRequest request
    ) {
        return ResponseEntity
               .status(HttpStatus.CREATED)
               .body(offreService.createOffre(request));

    }

    @PutMapping("{id}")
    public ResponseEntity<OffreResponse> updateOffre(
        @PathVariable UUID id,
        @Valid @RequestBody OffreRequest request
    ) {
        return ResponseEntity.ok(offreService.updateOffre(id, request));
    }

    @PatchMapping("{id}/toggle")
    public ResponseEntity<OffreResponse> toggleOffreActivity(@PathVariable UUID id){
        return ResponseEntity.ok(offreService.toggleActivity(id));
    }
    
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteOffre(@PathVariable UUID id){
        offreService.deleteOffre(id);
        return ResponseEntity.noContent().build();
    }
}

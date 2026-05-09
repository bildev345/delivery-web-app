package org.deliverma.api.vendeur.controller;

import java.util.List;
import java.util.UUID;

import org.deliverma.api.shared.enums.UniteStatut;
import org.deliverma.api.vendeur.dto.uniteProduit.UniteProduitRequest;
import org.deliverma.api.vendeur.dto.uniteProduit.UniteProduitResponse;
import org.deliverma.api.vendeur.service.UniteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@PreAuthorize("hasRole('VENDEUR')")
@RequestMapping("/api/v1/vendeur/unites")
@Tag(name = "gestion des unités des produits")
@RequiredArgsConstructor
public class UniteProduitController {
    private final UniteService uniteService;

    // Lister les unités d'une offre
    @GetMapping("/offre/{offreId}")
    public ResponseEntity<List<UniteProduitResponse>> getByOffre(
            @PathVariable UUID offreId) {
        return ResponseEntity.ok(uniteService.getUnitesByOffre(offreId));
    }
     
    @PostMapping("/generer")
    public ResponseEntity<List<UniteProduitResponse>> generer(
            @Valid @RequestBody UniteProduitRequest request) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(uniteService.genererUnites(request));
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<UniteProduitResponse> updateStatut(
            @PathVariable UUID id,
            @RequestParam UniteStatut statut,
            @RequestParam(required = false) String notes) {
        return ResponseEntity.ok(
            uniteService.updateStatut(id, statut, notes)
        );
    }

    
}

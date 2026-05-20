package org.deliverma.api.livreur.controller;

import java.util.List;
import java.util.UUID;

import org.deliverma.api.client.service.CommandeService;
import org.deliverma.api.shared.dto.CommandeResponse;
import org.deliverma.api.shared.dto.SuiviStatutRequest;
import org.deliverma.api.shared.enums.Role;
import org.deliverma.api.shared.service.StatutService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/livreur/commandes")
@PreAuthorize("hasRole('LIVREUR')")
@RequiredArgsConstructor
@Tag(name = "Commandes Livreur")
public class CommandeLivreurController {

    private final StatutService statutService;
    private final CommandeService commandeService;

    @GetMapping
    public ResponseEntity<List<CommandeResponse>> getMaTournee() {
        return ResponseEntity.ok(
            commandeService.getCommandesLivreur());
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<CommandeResponse> changerStatut(
            @PathVariable UUID id,
            @Valid @RequestBody SuiviStatutRequest request) {
        return ResponseEntity.ok(
            statutService.changerStatut(id, request, Role.LIVREUR));
    }
}


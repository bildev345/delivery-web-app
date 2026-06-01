package org.deliverma.api.admin.controller;

import java.util.UUID;

import org.deliverma.api.client.service.CommandeService;
import org.deliverma.api.shared.dto.CommandeResponse;
import org.deliverma.api.shared.dto.CommandeVendeurResponse;
import org.deliverma.api.shared.dto.SuiviStatutRequest;
import org.deliverma.api.shared.enums.Role;
import org.deliverma.api.shared.enums.StatutCommande;
import org.deliverma.api.shared.service.StatutService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/commandes")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Gestion des commandes Admin")
@RequiredArgsConstructor
public class CommandeAdminController {

    private final StatutService statutService;
    private final CommandeService commandeService;

    @GetMapping
    public ResponseEntity<Page<CommandeVendeurResponse>> getAll(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) StatutCommande statut) {
        return ResponseEntity.ok(
            commandeService.getAllCommandes(
                PageRequest.of(page, size), statut));
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<CommandeResponse> changerStatut(
            @PathVariable UUID id,
            @Valid @RequestBody SuiviStatutRequest request) {
        return ResponseEntity.ok(
            statutService.changerStatut(id, request, Role.ADMIN));
    }
}
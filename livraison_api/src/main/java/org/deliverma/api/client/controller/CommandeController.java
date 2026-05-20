package org.deliverma.api.client.controller;

import java.util.List;
import java.util.UUID;

import org.deliverma.api.client.dto.commande.CommandeRequest;
import org.deliverma.api.client.service.CommandeService;
import org.deliverma.api.shared.dto.CommandeResponse;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
@Tag(name = "Commandes Client")
public class CommandeController {
    private final CommandeService commandeService;
    
    @PostMapping("client/commandes")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<CommandeResponse> passerCommande(@Valid @RequestBody CommandeRequest request) {
        return ResponseEntity
               .status(HttpStatus.CREATED)
               .body(commandeService.passerCommande(request));
    }

    @GetMapping("client/commandes")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<CommandeResponse>> getHistorique() {
        return ResponseEntity.ok(commandeService.getHistorique());
    }

    @GetMapping("client/commandes/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<CommandeResponse> getCommande(@PathVariable UUID id) {
        return ResponseEntity.ok(commandeService.getCommande(id));
    }

    @PostMapping("client/commandes/{id}/annuler")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<CommandeResponse> annuler(@PathVariable UUID id) {
        
        return ResponseEntity.ok(commandeService.annulerCommande(id));
    }

    @GetMapping("commandes/suivi/{numero}")
    public ResponseEntity<CommandeResponse> suivi(@PathVariable String numero) {
        return ResponseEntity.ok(commandeService.getSuiviPublic(numero));
    }
     
}

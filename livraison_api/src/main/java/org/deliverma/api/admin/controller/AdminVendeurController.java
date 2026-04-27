package org.deliverma.api.admin.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

import org.deliverma.api.admin.dto.vendeur.VendeurResponse;
import org.deliverma.api.vendeur.VendeurService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RequiredArgsConstructor
@RestController
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/api/v1/admin/vendeurs")
@Tag(name = "Gestion Vendeurs", description = "Endpoints restreints au rôle ADMIN")
public class AdminVendeurController {
    private final VendeurService vendeurService;

    @GetMapping
    public ResponseEntity<Page<VendeurResponse>> getAllVendeurs(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "5") int size
    ) {
        Page<VendeurResponse> vendeurs = vendeurService.getAllVendeurs(PageRequest.of(page, size));
        return ResponseEntity.ok(vendeurs);
        
    }
    
    @GetMapping("{id}")
    public ResponseEntity<VendeurResponse> getVendeurById(@PathVariable UUID id) {
        return ResponseEntity.ok(vendeurService.getVendeurById(id));
    }

    @PatchMapping("{id}")
    public ResponseEntity<VendeurResponse> toggleVendeurActivity(@PathVariable UUID id){
        return ResponseEntity.ok(vendeurService.toggleActivity(id));
    }
    
    
}

package org.deliverma.api.vendeur;

import org.deliverma.api.admin.dto.vendeur.VendeurResponse;
import org.deliverma.api.admin.dto.vendeur.VendeurUpdateRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RequiredArgsConstructor
@RestController
@PreAuthorize("hasRole('VENDEUR')")
@RequestMapping("/api/v1/vendeur/profile")
@Tag(name = "Espace Vendeur")
public class VendeurController {
    private final VendeurService vendeurService;

    @GetMapping
    public ResponseEntity<VendeurResponse> viewDetails() {
        return ResponseEntity.ok(
            vendeurService.toResponse(vendeurService.getVendeurByEmail())
        );
    }

    @PutMapping
    public ResponseEntity<VendeurResponse> updateBoutique(@RequestBody VendeurUpdateRequest request) {
        
        return ResponseEntity.ok(vendeurService.updateBoutique(request));
    }
    
}

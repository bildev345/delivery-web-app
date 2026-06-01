package org.deliverma.api.livreur.controller;

import org.deliverma.api.livreur.dto.LivreurProfilResponse;
import org.deliverma.api.livreur.dto.LivreurUpdateRequest;
import org.deliverma.api.livreur.service.LivreurService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/api/v1/livreur")
@PreAuthorize("hasRole('LIVREUR')")
@RequiredArgsConstructor
@Tag(name = "Espace Livreur")
public class LivreurController {
    private final LivreurService livreurService;

    @GetMapping("/profil")
    public ResponseEntity<LivreurProfilResponse> getProfil() {
        return ResponseEntity.ok(livreurService.getProfil());
    }

    @PutMapping("/profil")
    public ResponseEntity<LivreurProfilResponse> updateProfil(
        @Valid @RequestBody LivreurUpdateRequest request
    ) {
        
        return ResponseEntity.ok(
            livreurService.updateProfil(request)
        );
    }
    
}

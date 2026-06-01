package org.deliverma.api.admin.controller;

import java.util.UUID;

import org.deliverma.api.admin.dto.livreur.LivreurCreateRequest;
import org.deliverma.api.admin.dto.livreur.LivreurResponse;
import org.deliverma.api.admin.service.LivreurAdminService;
import org.deliverma.api.auth.dto.RegisterRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("/api/v1/admin/livreurs")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin Gére les Livreurs")
public class LivreurAdminController {
    private final LivreurAdminService livreurAdminService;

    @GetMapping
    public ResponseEntity<Page<LivreurResponse>> getAll(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
            livreurAdminService.getAll(PageRequest.of(page, size)));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<LivreurResponse> toggle(
            @PathVariable UUID id) {
        return ResponseEntity.ok(livreurAdminService.toggle(id));
    }

    @PostMapping("/create-livreur")
    @Operation(summary = "Admin crée un compte Livreur")
    public ResponseEntity<String> createLivreur(@Valid @RequestBody LivreurCreateRequest request) {
        livreurAdminService.creerLivreur(request);
        return ResponseEntity.ok("Livreur account created successfully");
    }    
}

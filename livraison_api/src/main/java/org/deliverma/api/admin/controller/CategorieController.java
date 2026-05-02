package org.deliverma.api.admin.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

import org.deliverma.api.admin.dto.categorie.CategorieRequest;
import org.deliverma.api.admin.dto.categorie.CategorieResponse;
import org.deliverma.api.admin.service.CategorieService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;




@RestController
@RequestMapping("/api/v1/admin/categories")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Gestion des catégories")
public class CategorieController {
    private final CategorieService categorieService;

    @GetMapping
    public ResponseEntity<List<CategorieResponse>> getAll() {
        return ResponseEntity.ok(categorieService.selectAll());
    }

    @PostMapping
    public ResponseEntity<CategorieResponse> creerCategorie(@Valid @RequestBody CategorieRequest request) {        
        return ResponseEntity.status(HttpStatus.CREATED)
        .body(categorieService.createCategorie(request));
    }

    @PutMapping("{id}")
    public ResponseEntity<CategorieResponse> editCategorie(@PathVariable UUID id, @Valid @RequestBody CategorieRequest request) {
        return ResponseEntity.ok(categorieService.updateCategorie(id, request));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteCategorie(@PathVariable UUID id){
        categorieService.deleteCategorie(id);
        return ResponseEntity.noContent().build();
    }
    
    
}

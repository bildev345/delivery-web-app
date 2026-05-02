package org.deliverma.api.admin.controller;

import java.util.UUID;

import org.deliverma.api.admin.dto.produit.ProduitRequest;
import org.deliverma.api.admin.dto.produit.ProduitResponse;
import org.deliverma.api.admin.service.ProduitService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Gestion des produits")
@RequestMapping("/api/v1/admin/produits")
public class ProduitController {
    private final ProduitService produitService;
    
    @GetMapping
    public ResponseEntity<Page<ProduitResponse>> getAllProducts(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) UUID categorieId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(
            produitService.getAllProducts(
                search, categorieId, PageRequest.of(page, size)
            )
        );
    }

    @GetMapping("{id}")
    public ResponseEntity<ProduitResponse> getProductById(@PathVariable UUID id) {
        return ResponseEntity.ok(produitService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<ProduitResponse> createProduct(@Valid @RequestBody ProduitRequest produitRequest) {
        return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(produitService.createProduct(produitRequest));
    }

    @PutMapping("{id}")
    public ResponseEntity<ProduitResponse> editProduct(@PathVariable UUID id, @Valid @RequestBody ProduitRequest produitRequest) {
        
        return ResponseEntity.ok(produitService.updateProduct(id, produitRequest));
    }
    
    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id){
        produitService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
   
}

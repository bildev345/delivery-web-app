package org.deliverma.api.shared.catalogue;

import java.util.List;
import java.util.UUID;

import org.deliverma.api.admin.dto.produit.ProduitResponse;
import org.deliverma.api.admin.service.ProduitService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.micrometer.core.ipc.http.HttpSender.Response;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/catalogue")
@Tag(name = "Espace public")
public class CatalogueController {
    private final ProduitService produitService;
    
    // récupérer le catalogue des produits qui ont des offres actives
    @GetMapping("produits")
    public ResponseEntity<List<ProduitResponse>> getCatalogue(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) UUID categorieId
    ) {
        return ResponseEntity.ok(
            produitService.getCatalogue(search, categorieId)
        );
    }

    @GetMapping("produits/{id}")
    public ResponseEntity<ProduitResponse> getProduit(@PathVariable UUID id) {
        return ResponseEntity.ok(produitService.getProductById(id));
    }
    
    
}

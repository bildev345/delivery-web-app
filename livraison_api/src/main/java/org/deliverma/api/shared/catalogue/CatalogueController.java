package org.deliverma.api.shared.catalogue;

import java.util.List;
import java.util.UUID;

import org.deliverma.api.admin.dto.produit.ProduitResponse;
import org.deliverma.api.admin.service.ProduitService;
import org.deliverma.api.shared.dto.OffrePublicResponse;
import org.deliverma.api.vendeur.service.OffreService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/catalogue/produits")
@Tag(name = "Espace public")
public class CatalogueController {
    private final ProduitService produitService;
    private final OffreService offreService;
    
    // récupérer le catalogue des produits qui ont des offres actives
    @GetMapping
    public ResponseEntity<List<ProduitResponse>> getCatalogue(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) UUID categorieId
    ) {
        return ResponseEntity.ok(
            produitService.getProduitsHavingOffreAndActive(search, categorieId)
        );
    }

    @GetMapping("{id}")
    public ResponseEntity<ProduitResponse> getProduit(@PathVariable UUID id) {
        return ResponseEntity.ok(produitService.getProductById(id));
    }

    @GetMapping("{id}/offres")
    public ResponseEntity<List<OffrePublicResponse>> getOffreParProduit(@PathVariable UUID id) {
        return ResponseEntity.ok(
            offreService.getOffresPublicByProduit(id)
        );
    }
    

    //récuperer tous les produits pour que les vendeurs crées ses offres 
    @GetMapping("all")
    public ResponseEntity<List<ProduitResponse>> getAllProducts() {
        return ResponseEntity.ok(produitService.getllProducts());
    }   
}

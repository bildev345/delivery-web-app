package org.deliverma.api.admin.service;

import java.util.List;
import java.util.UUID;

import org.deliverma.api.admin.dto.produit.ProduitRequest;
import org.deliverma.api.admin.dto.produit.ProduitResponse;
import org.deliverma.api.admin.mapper.ProduitCategorieMapper;
import org.deliverma.api.admin.repository.CategorieRepository;
import org.deliverma.api.admin.repository.ProduitRepository;
import org.deliverma.api.shared.entities.Categorie;
import org.deliverma.api.shared.entities.Produit;
import org.deliverma.api.shared.exception.BusinessException;
import org.deliverma.api.shared.exception.DuplicateResourceException;
import org.deliverma.api.shared.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProduitService {
    private final ProduitRepository produitRepository;
    private final ProduitCategorieMapper mapper;
    private final CategorieRepository categorieRepository;

    // lister tous les produits paginés avec filtres
    public Page<ProduitResponse> getAllProducts(String search, UUID categorieId, Pageable pageable){
        return produitRepository.findAllWithFilters(search, categorieId, pageable)
        .map(mapper::toProduitResponse);
    }

    public ProduitResponse getProductById(UUID id){
        return mapper.toProduitResponse(findOrThrow(id));
    }

    @Transactional
    public ProduitResponse createProduct(ProduitRequest request){
        if(produitRepository.existsByDesignationIgnoreCase(request.designation())){
            throw new DuplicateResourceException("Un produit avec la designation '" + request.designation() + "' existe déjà");
        }
        Categorie categorie = findCategorieOrThrow(request.categorieId());
        Produit savedProduct = produitRepository.save(mapper.toProduitEntity(request, categorie));

        return mapper.toProduitResponse(savedProduct);
    }

    @Transactional
    public ProduitResponse updateProduct(UUID id, ProduitRequest request){
        Categorie categorie = findCategorieOrThrow(request.categorieId());
        Produit produit = findOrThrow(id);
        if(!produit.getDesignation().equals(request.designation()) && produitRepository.existsByDesignationIgnoreCase(request.designation())){
            throw new DuplicateResourceException("Un produit avec la designation '" + request.designation() + "' existe déjà");
        }
        produit.setDesignation(request.designation());
        produit.setDescription(request.description());
        produit.setPhoto(request.photo());
        produit.setCategorie(categorie);
        return mapper.toProduitResponse(produitRepository.save(produit));
    }
    
    // Suppression : bloquer si des offres existent sur ce produit
    @Transactional
    public void deleteProduct(UUID id) {
        Produit produit = findOrThrow(id);
        if (!produit.getOffres().isEmpty()) {
            throw new BusinessException(
                "Impossible de supprimer un produit lié à des offres.");
        }
        produitRepository.delete(produit);
    }

    public List<ProduitResponse> getProduitsHavingOffreAndActive(
        String search, UUID categorieId){
        return produitRepository.findCatalogueProduitHavingOffreAndActive(search, categorieId)
        .stream()
        .map(mapper::toProduitResponse)
        .toList();
    }

    private Produit findOrThrow(UUID id){
        return produitRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("produit", id));
    }

    private Categorie findCategorieOrThrow(UUID id){
        return categorieRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Catégorie", id));
    }

    public List<ProduitResponse> getllProducts() {
        return produitRepository.findAll()
                                .stream()
                                .map(mapper::toProduitResponse)
                                .toList();
    } 
    
}

package org.deliverma.api.admin.service;

import java.util.List;
import java.util.UUID;

import org.deliverma.api.admin.dto.categorie.CategorieRequest;
import org.deliverma.api.admin.dto.categorie.CategorieResponse;
import org.deliverma.api.admin.mapper.ProduitCategorieMapper;
import org.deliverma.api.admin.repository.CategorieRepository;
import org.deliverma.api.admin.repository.ProduitRepository;
import org.deliverma.api.shared.entities.Categorie;
import org.deliverma.api.shared.exception.BusinessException;
import org.deliverma.api.shared.exception.DuplicateResourceException;
import org.deliverma.api.shared.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategorieService {
    private final CategorieRepository categorieRepository;
    private final ProduitCategorieMapper categorieMapper;
    private final ProduitRepository produitRepository;

    public List<CategorieResponse> selectAll(){
        return categorieRepository.findAll()
        .stream().map(categorieMapper::toCategorieResponse)
        .toList();
    }

    public CategorieResponse createCategorie(CategorieRequest request){
        if(categorieRepository.existsByDesignationIgnoreCase(request.designation())){
            throw new DuplicateResourceException("Une catégorie '" + request.designation() + "' existe déjà");
        }
        Categorie savedCategorie = categorieRepository.save(categorieMapper.toCategorieEntity(request));
        return categorieMapper.toCategorieResponse(savedCategorie);
    }

    @Transactional
    public CategorieResponse updateCategorie(UUID id, CategorieRequest request){
        Categorie foundCategorie = findOrThrow(id);
        foundCategorie.setDesignation(request.designation());
        return categorieMapper.toCategorieResponse(categorieRepository.save(foundCategorie));
    }

    @Transactional
    public void deleteCategorie(UUID id){
        Categorie foundCategorie = findOrThrow(id);
        if(produitRepository.existsByCategorieId(foundCategorie.getId())){
            throw new BusinessException("La catégorie que vous-voulez supprimé est liée aux certains produits");
        }
        categorieRepository.delete(foundCategorie);
    }

    public Categorie findOrThrow(UUID id){
        return categorieRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("catégorie", id));
    }
}

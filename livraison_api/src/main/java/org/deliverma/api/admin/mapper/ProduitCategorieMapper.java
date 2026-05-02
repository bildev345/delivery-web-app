package org.deliverma.api.admin.mapper;

import org.deliverma.api.admin.dto.categorie.CategorieRequest;
import org.deliverma.api.admin.dto.categorie.CategorieResponse;
import org.deliverma.api.admin.dto.produit.ProduitRequest;
import org.deliverma.api.admin.dto.produit.ProduitResponse;
import org.deliverma.api.shared.entities.Categorie;
import org.deliverma.api.shared.entities.Produit;
import org.springframework.stereotype.Component;

@Component
public class ProduitCategorieMapper {

    public CategorieResponse toCategorieResponse(Categorie categorie){
        return CategorieResponse
        .builder()
        .id(categorie.getId())
        .designation(categorie.getDesignation())
        .build();
    }

    public Categorie toCategorieEntity(CategorieRequest request){
        return Categorie
        .builder()
        .designation(request.designation())
        .build();
    }

    public ProduitResponse toProduitResponse(Produit produit){
        return ProduitResponse
               .builder()
               .id(produit.getId())
               .designation(produit.getDesignation())
               .description(produit.getDescription())
               .photo(produit.getPhoto())
               .categorie(toCategorieResponse(produit.getCategorie()))
               .build();
    }
    public Produit toProduitEntity(ProduitRequest request, Categorie categorie){
        return Produit
               .builder()
               .designation(request.designation())
               .description(request.description())
               .photo(request.photo())
               .categorie(categorie)
               .build();
    }
}

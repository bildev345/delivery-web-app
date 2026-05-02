package org.deliverma.api.admin.dto.produit;

import java.util.UUID;

import org.deliverma.api.admin.dto.categorie.CategorieResponse;

import lombok.Builder;

@Builder
public record ProduitResponse(
    UUID id,
    String designation,
    String description,
    String photo,
    CategorieResponse categorie
) {}

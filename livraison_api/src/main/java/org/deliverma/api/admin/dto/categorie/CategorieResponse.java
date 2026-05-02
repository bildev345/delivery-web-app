package org.deliverma.api.admin.dto.categorie;

import java.util.UUID;

import lombok.Builder;

@Builder
public record CategorieResponse(
    UUID id,
    String designation
){}

package org.deliverma.api.admin.dto.vendeur;

public record VendeurUpdateRequest(
   String nomBoutique,
   String description,
   String logo,
   String ville
){}

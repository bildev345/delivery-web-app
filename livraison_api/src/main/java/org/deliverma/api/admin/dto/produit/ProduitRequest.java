package org.deliverma.api.admin.dto.produit;

import java.util.UUID;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record ProduitRequest(
   @NotBlank(message = "{VALIDATION.PRODUIT.DESIGNATION.BLANK}")
   @Size(
        min = 1,
        max = 50,
        message = "{VALIDATION.PRODUIT.DESIGNATION.SIZE}"
    
   )
   @Schema(example = "Samsung A40") 
   String designation,

   @NotBlank(message = "{VALIDATION.PRODUIT.DESCRIPTION.BLANK}")
   @Size(
        min = 1,
        max = 255,
        message = "{VALIDATION.PRODUIT.DESCRIPTION.SIZE}"
   )
   String description,

   String photo,

   @NotNull(message = "{VALIDATION.PRODUIT.CATEGORIE.NULL}")
   UUID categorieId

){}

package org.deliverma.api.admin.dto.categorie;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record CategorieRequest(
    @NotBlank(message = "{VALIDATION.CATEGORIE.DESIGNATION.BLANK}")
    @Size(
        min = 1,
        max = 50,
        message = "{VALIDATION.CATEGORIE.DESIGNATION.SIZE}"
    )
    @Schema(example = "Électronique")
    String designation
) 
{}

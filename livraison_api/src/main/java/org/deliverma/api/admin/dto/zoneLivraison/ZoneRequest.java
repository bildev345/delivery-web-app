package org.deliverma.api.admin.dto.zoneLivraison;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record ZoneRequest(
    @NotBlank(message = "{VALIDATION.ZONE.NAME.BLANK}")
    @Size(
        min = 1,
        max = 255,
        message = "{VALIDATION.ZONE.NAME.SIZE}"
    )
    @Schema(example = "Zone Centre Fès")
    String nom,
    
    @NotBlank(message = "{VALIDATION.ZONE.VILLES_COUVERTES.BLANK}")
    @Size(
        min = 1,
        max = 255,
        message = "{VALIDATION.ZONE.VILLES_COUVERTES.SIZE}"
    )
    @Schema(example = "Fès, Meknes, Ifrane")
    String villesCouvertes,
    
    @NotNull(message = "{VALIDATION.ZONE.FRAIS_LIVRAISON.NULL}")
    @Positive(message = "{VALIDATION.ZONE.FRAIS_LIVRAISON.POSITIVE}")
    BigDecimal fraisLivraison,
    
    @NotNull(message = "{VALIDATION.ZONE.DELAIS_JOURS.NULL}")
    @Positive(message = "{VALIDATION.ZONE.DELAIS_JOURS.POSITIVE}")
    int delaisJours
){}

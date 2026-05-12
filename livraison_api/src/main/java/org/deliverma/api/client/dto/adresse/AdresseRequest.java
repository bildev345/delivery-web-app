package org.deliverma.api.client.dto.adresse;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record AdresseRequest(
    @NotBlank(message = "${VALIDATION.ADRESSE.LIBELLE.BLANK}")
    @Size(
        min = 1,
        max = 50,
        message = "${VALIDATION.ADRESSE.LIBELLE.SIZE}"
    )
    String libelle,
    
    @NotBlank(message = "${VALIDATION.ADRESSE.ADRESSE.BLANK}")
    @Size(
        min = 1,
        max = 256,
        message = "${VALIDATION.ADRESSE.ADRESSE.SIZE}"
    )
    String adresse,

    @NotBlank(message = "${VALIDATION.ADRESSE.VILLE.BLANK}")
    @Size(
        min = 1,
        max = 50,
        message = "${VALIDATION.ADRESSE.VILLE.SIZE}"
    )
    String ville,

    @NotBlank(message = "${VALIDATION.ADRESSE.CODE_POSTAL.BLANK}")
    @Size(
        min = 5,
        max = 5,
        message = "${VALIDATION.ADRESSE.CODE_POSTAL.SIZE}"
    )
    String codePostal,

    @NotNull(message = "${VALIDATION.ADRESSE.ZONE_ID.NULL}")
    UUID zoneId

) {}

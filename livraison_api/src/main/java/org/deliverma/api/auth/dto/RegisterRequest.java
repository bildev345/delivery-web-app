package org.deliverma.api.auth.dto;

import org.deliverma.api.shared.enums.Role;
import org.deliverma.api.validation.NonDisposableEmail;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank(message = "{VALIDATION.REGISTRATION.NOM.BLANK}") 
    @Size(
        min = 1,
        max = 50,
        message = "{VALIDATION.REGISTRATION.NOM.SIZE}"
    )
    @Schema(example = "Alami")
    String nom,

    @NotBlank(message = "{VALIDATION.REGISTRATION.PRENOM.BLANK}") 
    @Size(
        min = 1,
        max = 50,
        message = "{VALIDATION.REGISTRATION.PRENOM.SIZE}"
    )
    @Schema(example = "Kamal")
    String prenom,

    @NotBlank(message = "{VALIDATION.REGISTRATION.EMAIL.BLANK}")
    @Email(message = "{VALIDATION.REGISTRATION.EMAIL.FORMAT}")
    //@NonDisposableEmail(message = "{VALIDATION.REGISTRATION.EMAIL.DISPOSABLE}")
    @Schema(example = "bilal@mail.com")
    String email,
    
    @NotBlank(message = "{VALIDATION.REGISTRATION.PASSWORD.BLANK}") 
    @Size(min = 8,
        max = 72,
        message = "{VALIDATION.REGISTRATION.PASSWORD.SIZE"
    )
    @Schema(example = "pAssword1!_")
    String password,
    
    @NotBlank(message = "{VALIDATION.REGISTRATION.CONFIRM_PASSWORD.BLANK}")
    @Size(min = 8,
          max = 72,
          message = "{VALIDATION.REGISTRATION.CONFIRM_PASSWORD.SIZE}"
    )
    @Schema(example = "pAssword1!_")
    String confirm,

    @NotBlank(message = "{VALIDATION.REGISTRATION.PHONE.BLANK}")
    @Schema(example = "0610057592")
    String telephone,
     
    @NotNull(message = "{VALIDATION.REGISTRATION.ROLE.NULL}")
    Role role,

    // infos supplémentaires vendeur uniquement(nullable pour client)
    String nomBoutique,
    String ville
) {
    
}

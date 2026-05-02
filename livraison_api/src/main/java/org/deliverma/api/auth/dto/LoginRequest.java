package org.deliverma.api.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(

    @NotBlank(message = "{VALIDATION.AUTHENTICATION.EMAIL.BLANK}")
    @Email(message = "{VALIDATION.AUTHENTICATION.EMAIL.FORMAT}")
    @Schema(example = "bilal@mail.com")
    String email,

    @NotBlank(message = "{VALIDATION.AUTHENTICATION.PASSWORD.BLANK}")
    @Schema(example = "pAssword1!_")
    String password,

    String activeRole
) {}

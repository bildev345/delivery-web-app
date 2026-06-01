package org.deliverma.api.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SettingPasswordRequest(
    @NotBlank(message = "VALIDATION.SETTING_PASSWORD.TOKEN.BLANK")
    String token,
    @NotBlank(message = "VALIDATION.SETTING_PASSWORD.PASSWORD.BLANK")
    @Size(min = 8, message = "VALIDATION.SETTING_PASSWORD.PASSWORD.MIN")
    String password
) {
    
}

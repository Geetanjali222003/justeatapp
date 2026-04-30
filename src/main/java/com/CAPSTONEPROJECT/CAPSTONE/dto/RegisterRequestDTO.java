package com.CAPSTONEPROJECT.CAPSTONE.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Incoming payload for POST /auth/register.
 *
 * Fields:
 *   username — must not be blank
 *   email    — must be a valid email format and not blank
 *   password — must not be blank
 *   role     — must be "CUSTOMER" or "OWNER" (as String, converted to enum in service)
 *   otp      — 6-digit OTP for verification (validated against Redis)
 *
 * @NotBlank, @Email etc. are validated automatically when you annotate
 * the controller method parameter with @Valid.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDTO {

    @NotBlank(message = "Username is required")
    private String username;

    @Email(message = "Email must be a valid address (e.g. user@example.com)")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Role is required (CUSTOMER or OWNER)")
    private String role;

    @NotBlank(message = "OTP is required")
    private String otp;
}

package com.CAPSTONEPROJECT.CAPSTONE.dto;

import com.CAPSTONEPROJECT.CAPSTONE.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Incoming payload for POST /auth/register.
 *
 * Fields:
 *   username — must not be blank
 *   password — must not be blank
 *   email    — must be a valid email format and not blank
 *   role     — must be CUSTOMER or OWNER
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

    @NotBlank(message = "Password is required")
    private String password;

    /**
     * User's email address.
     * Must be a valid format and is saved to the DB.
     * Used for sending password-reset emails.
     */
    @Email(message = "Email must be a valid address (e.g. user@example.com)")
    @NotBlank(message = "Email is required")
    private String email;

    @NotNull(message = "Role is required (CUSTOMER or OWNER)")
    private Role role;
}

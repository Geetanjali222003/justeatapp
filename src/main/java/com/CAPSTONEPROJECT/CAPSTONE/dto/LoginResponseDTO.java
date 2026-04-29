package com.CAPSTONEPROJECT.CAPSTONE.dto;

import lombok.*;

/**
 * Response returned after a successful login.
 * Contains a JWT token and the user's role.
 *
 * Example: { "token": "<jwt>", "role": "CUSTOMER" }
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {
    private String token;
    private String role;
}

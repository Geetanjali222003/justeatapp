package com.CAPSTONEPROJECT.CAPSTONE.dto;

import lombok.*;

/**
 * Request body for POST /auth/forgot-password
 * The "email" field is treated as the username in this app
 * (since User entity currently has no email field).
 *
 * Example: { "email": "owner1" }
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ForgotPasswordRequestDTO {
    private String email;
}


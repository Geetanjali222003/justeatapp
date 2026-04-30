package com.CAPSTONEPROJECT.CAPSTONE.dto;

import lombok.*;

/**
 * Request body for POST /auth/forgot-password
 * Uses the user's registered email.
 *
 * Example: { "email": "owner1@example.com" }
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ForgotPasswordRequestDTO {
    private String email;
}


package com.CAPSTONEPROJECT.CAPSTONE.dto;

import lombok.*;

/**
 * Request body for POST /auth/reset-password
 *
 * Example: {
 *   "token": "uuid-from-email",
 *   "newPassword": "MyPass@123"
 * }
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequestDTO {
    private String token;
    private String newPassword;
}


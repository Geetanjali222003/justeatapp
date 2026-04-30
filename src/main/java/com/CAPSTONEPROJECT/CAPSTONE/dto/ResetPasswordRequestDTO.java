package com.CAPSTONEPROJECT.CAPSTONE.dto;

import lombok.*;

/**
 * Request body for POST /auth/reset-password
 *
 * Example: {
 *   "email": "owner1@example.com",
 *   "otp": "123456",
 *   "newPassword": "MyPass@123"
 * }
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequestDTO {
    private String email;
    private String otp;
    private String newPassword;
}


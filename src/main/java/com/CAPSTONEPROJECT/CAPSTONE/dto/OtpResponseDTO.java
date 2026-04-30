package com.CAPSTONEPROJECT.CAPSTONE.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Response DTO for OTP operations
 * Provides consistent response structure for OTP-related endpoints
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpResponseDTO {

    private boolean success;
    private String message;
    private String email;

    /**
     * Factory method for success response
     */
    public static OtpResponseDTO success(String message, String email) {
        return OtpResponseDTO.builder()
                .success(true)
                .message(message)
                .email(email)
                .build();
    }

    /**
     * Factory method for error response
     */
    public static OtpResponseDTO error(String message, String email) {
        return OtpResponseDTO.builder()
                .success(false)
                .message(message)
                .email(email)
                .build();
    }
}


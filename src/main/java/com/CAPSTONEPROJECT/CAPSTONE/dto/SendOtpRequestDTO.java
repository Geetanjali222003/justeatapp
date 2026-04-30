package com.CAPSTONEPROJECT.CAPSTONE.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request body for POST /auth/send-otp
 * User provides their registered email to receive OTP.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SendOtpRequestDTO {
    
    @Email(message = "Email must be a valid address")
    @NotBlank(message = "Email is required")
    private String email;
}


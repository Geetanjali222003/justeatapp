package com.CAPSTONEPROJECT.CAPSTONE.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request DTO for sending OTP
 * Used in POST /user/send-otp endpoint
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OtpRequestDTO {

    @Email(message = "Email must be a valid address")
    @NotBlank(message = "Email is required")
    private String email;
}


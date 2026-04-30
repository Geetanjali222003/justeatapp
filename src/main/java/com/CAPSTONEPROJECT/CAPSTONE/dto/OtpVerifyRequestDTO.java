package com.CAPSTONEPROJECT.CAPSTONE.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request DTO for verifying OTP
 * Used when validating OTP before completing an action
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OtpVerifyRequestDTO {

    @Email(message = "Email must be a valid address")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "OTP is required")
    @Pattern(regexp = "^[0-9]{6}$", message = "OTP must be a 6-digit number")
    private String otp;
}


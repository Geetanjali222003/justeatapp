package com.CAPSTONEPROJECT.CAPSTONE.controller;

import com.CAPSTONEPROJECT.CAPSTONE.dto.ForgotPasswordRequestDTO;
import com.CAPSTONEPROJECT.CAPSTONE.dto.ResetPasswordRequestDTO;
import com.CAPSTONEPROJECT.CAPSTONE.service.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * PasswordResetController
 *
 * These endpoints are under /auth/** so they are already PUBLICLY accessible
 * (no JWT token required) — as configured in SecurityConfig.
 *
 * Endpoints:
 *   POST /auth/forgot-password  → generate token and send email
 *   POST /auth/reset-password   → validate token and update password
 *
 * THIN controller — zero business logic here.
 * All logic lives in PasswordResetService.
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    /**
     * POST /auth/forgot-password
     *
     * Request:  { "email": "owner1" }
     * Response: { "message": "Reset link sent. Check your email." }
     *
     * On failure (user not found): 400 Bad Request (handled by GlobalExceptionHandler)
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @RequestBody ForgotPasswordRequestDTO request) {

        passwordResetService.sendOtp(request.getEmail());

        return ResponseEntity.ok(Map.of(
                "message", "Password reset link has been sent. Please check your email."
        ));
    }

    /**
     * POST /auth/reset-password
     *
     * Request:  { "email": "owner1@example.com", "otp": "123456", "newPassword": "MyPass@123" }
     * Response: { "message": "Password has been reset successfully." }
     *
     * On failure (invalid/expired token or weak password): 400 Bad Request
     */
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestBody ResetPasswordRequestDTO request) {

        passwordResetService.resetPassword(
                request.getEmail(),
                request.getOtp(),
                request.getNewPassword()
        );

        return ResponseEntity.ok(Map.of(
                "message", "Password has been reset successfully. You can now log in."
        ));
    }
}


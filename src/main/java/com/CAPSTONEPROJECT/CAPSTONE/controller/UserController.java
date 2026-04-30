package com.CAPSTONEPROJECT.CAPSTONE.controller;

import com.CAPSTONEPROJECT.CAPSTONE.dto.OtpRequestDTO;
import com.CAPSTONEPROJECT.CAPSTONE.dto.OtpResponseDTO;
import com.CAPSTONEPROJECT.CAPSTONE.dto.RegisterRequestDTO;
import com.CAPSTONEPROJECT.CAPSTONE.service.AuthService;
import com.CAPSTONEPROJECT.CAPSTONE.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * UserController - Handles user registration with OTP verification
 * Uses OtpService which supports Redis with in-memory fallback
 * 
 * Endpoints:
 * - POST /user/send-otp - Generate and send OTP
 * - POST /user/register - Register user after OTP validation
 */
@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class UserController {

    private final AuthService userService;
    private final OtpService otpService;

    /**
     * Send OTP to user's email
     * OTP is stored with 5-minute expiry and sent via email
     */
    @PostMapping("/send-otp")
    public ResponseEntity<OtpResponseDTO> sendOtp(@Valid @RequestBody OtpRequestDTO request) {
        String email = request.getEmail();

        // Generate, store and send OTP via email (5-minute expiry)
        otpService.generateAndSendOtp(email, 5);

        return ResponseEntity.ok(OtpResponseDTO.success("OTP sent successfully to your email", email));
    }

    /**
     * Register user after OTP validation
     * User is created ONLY if OTP is valid
     */
    @PostMapping("/register")
    public ResponseEntity<OtpResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {

        // Validate OTP
        if (!otpService.verifyOtp(request.getEmail(), request.getOtp())) {
            return ResponseEntity.badRequest().body(OtpResponseDTO.error("Invalid or expired OTP", request.getEmail()));
        }

        // OTP is valid - register user
        userService.register(request);

        // Delete OTP after successful registration (one-time use)
        otpService.deleteOtp(request.getEmail());

        return ResponseEntity.ok(OtpResponseDTO.success("User registered successfully", request.getEmail()));
    }
}


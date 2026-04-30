package com.CAPSTONEPROJECT.CAPSTONE.service;

import com.CAPSTONEPROJECT.CAPSTONE.entity.User;
import com.CAPSTONEPROJECT.CAPSTONE.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Pattern;

/**
 * PasswordResetService - Handles password reset functionality
 * Uses OtpService for OTP generation/validation with Redis support
 * 
 * Flow:
 * 1. User requests reset -> sendOtp(email) -> OTP sent via email
 * 2. User enters OTP + new password -> resetPassword() validates and updates
 * 
 * Security:
 * - OTP expires after 5 minutes
 * - Password must meet complexity rules
 * - OTP is deleted after successful reset (one-time use)
 */
@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final OtpService otpService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    // Password complexity: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
    );

    /**
     * Generate and send OTP for password reset
     * @param email User's email address
     */
    public void sendOtp(String email) {
        // Verify user exists
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with email: " + email));

        // Generate, store and send OTP (5-minute expiry)
        otpService.generateAndSendOtp(email, 5);
        
        System.out.println("✓ Password reset OTP sent to: " + email);
    }

    /**
     * Reset password after OTP validation
     * @param email User's email
     * @param otp OTP code from email
     * @param newPassword New password (must meet complexity rules)
     */
    @Transactional
    public void resetPassword(String email, String otp, String newPassword) {
        // Validate OTP
        if (!otpService.verifyOtp(email, otp)) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        // Validate password complexity
        if (!isPasswordValid(newPassword)) {
            throw new RuntimeException(
                "Password must be at least 8 characters and contain: " +
                "1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character (@$!%*?&)"
            );
        }

        // Find user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update password (encrypted)
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Delete OTP after successful reset (one-time use)
        otpService.deleteOtp(email);

        System.out.println("✓ Password reset successful for: " + email);
    }

    /**
     * Validate password meets complexity requirements
     */
    private boolean isPasswordValid(String password) {
        if (password == null || password.isEmpty()) {
            return false;
        }
        return PASSWORD_PATTERN.matcher(password).matches();
    }
}


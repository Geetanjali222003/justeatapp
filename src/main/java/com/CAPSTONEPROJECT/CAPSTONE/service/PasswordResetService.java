package com.CAPSTONEPROJECT.CAPSTONE.service;

import com.CAPSTONEPROJECT.CAPSTONE.entity.Otp;
import com.CAPSTONEPROJECT.CAPSTONE.entity.User;
import com.CAPSTONEPROJECT.CAPSTONE.repository.OtpRepository;
import com.CAPSTONEPROJECT.CAPSTONE.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final OtpRepository otpRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void sendOtp(String email) {

        // Ensure the email belongs to an existing account.
        userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("No user found with this email."));

        // Keep only one active OTP per email.
        otpRepository.findByEmail(email).ifPresent(otpRepository::delete);

        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);

        Otp otpEntity = new Otp();
        otpEntity.setEmail(email);
        otpEntity.setOtp(otp);
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        otpRepository.save(otpEntity);

        emailService.sendOtp(email, otp);
    }

    public void resetPassword(String email, String otp, String newPassword) {

        Otp otpEntity = otpRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or OTP."));

        if (otpEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
            otpRepository.delete(otpEntity);
            throw new IllegalArgumentException("OTP expired.");
        }

        if (!otpEntity.getOtp().equals(otp)) {
            throw new IllegalArgumentException("Invalid OTP.");
        }

        // Password validation: min 8 chars, upper, lower, number, special char.
        if (!newPassword.matches("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@#$%^&+=]).{8,}$")) {
            throw new IllegalArgumentException("Password does not meet complexity rules.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("No user found with this email."));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        otpRepository.delete(otpEntity);
    }
}
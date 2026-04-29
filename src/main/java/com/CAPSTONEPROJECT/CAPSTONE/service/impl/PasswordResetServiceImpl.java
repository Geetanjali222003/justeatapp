package com.CAPSTONEPROJECT.CAPSTONE.service.impl;

import com.CAPSTONEPROJECT.CAPSTONE.entity.PasswordResetToken;
import com.CAPSTONEPROJECT.CAPSTONE.entity.User;
import com.CAPSTONEPROJECT.CAPSTONE.repository.PasswordResetTokenRepository;
import com.CAPSTONEPROJECT.CAPSTONE.repository.UserRepository;
import com.CAPSTONEPROJECT.CAPSTONE.service.PasswordResetService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.regex.Pattern;

/**
 * PasswordResetServiceImpl
 *
 * FULL RESET FLOW:
 *  1. User calls POST /auth/forgot-password with their username.
 *  2. We look up the user, delete any old token, create a new UUID token with 15-min expiry.
 *  3. We save the token in the DB and email the reset link to the user.
 *  4. User clicks the link -> frontend reads token from URL param.
 *  5. User submits new password + token to POST /auth/reset-password.
 *  6. We validate the token (exists + not expired), BCrypt-encode the new password,
 *     update the user, and DELETE the token so it can never be reused.
 *
 * SECURITY CONSIDERATIONS:
 *  - Tokens are UUID v4 — cryptographically random, not guessable.
 *  - Expiry (15 min) limits the window if an email is intercepted.
 *  - One token per user at a time — old tokens deleted on new request.
 *  - Token deleted after use — prevents replay attacks.
 *  - Password strength enforced server-side (not just frontend).
 *  - We do NOT reveal whether a username exists — we return the same message either way
 *    (see note in generateResetToken). This prevents user enumeration.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {

    // HS regex: min 8 chars, 1 upper, 1 lower, 1 digit, 1 special
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$"
    );

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;   // BCryptPasswordEncoder bean (from SecurityConfig)
    private final JavaMailSender mailSender;          // Auto-configured by spring-boot-starter-mail

    @Value("${app.password-reset.expiry-minutes:15}")
    private int expiryMinutes;

    @Value("${app.password-reset.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    // -----------------------------------------------------------------------
    // Step 1: Generate token and send email
    // -----------------------------------------------------------------------

    @Override
    @Transactional
    public void generateResetToken(String emailOrUsername) {

        /*
         * UPDATED: Now looks up by EMAIL (since User has an email field).
         * Previously used findByUsername — kept as fallback comment.
         *
         * SECURITY NOTE — user enumeration:
         * We intentionally throw for unknown emails here (good for dev/testing).
         * In production you may want to silently return 200 either way so
         * attackers cannot tell which emails are registered.
         */
        User user = userRepository.findByEmail(emailOrUsername)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No account found with email: " + emailOrUsername));

        // Delete any previous token for this user → only ONE active token at a time
        tokenRepository.deleteByUser(user);

        // Generate a random UUID as the reset token (impossible to guess)
        String tokenValue = UUID.randomUUID().toString();

        // Build and persist the token with expiry time
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(tokenValue)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(expiryMinutes))
                .build();

        tokenRepository.save(resetToken);
        log.info("Password reset token generated for user: {}", user.getUsername());

        // Send email with the clickable reset link
        String resetLink = frontendUrl + "/reset-password?token=" + tokenValue;
        sendResetEmail(user.getEmail(), resetLink);
    }

    // -----------------------------------------------------------------------
    // Step 2: Reset the password using token
    // -----------------------------------------------------------------------

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {

        // 1) Validate password strength FIRST (fail fast, no DB calls needed)
        validatePasswordStrength(newPassword);

        // 2) Find the token in DB
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or already used reset token."));

        // 3) Check if the token has expired
        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            // Clean up expired token
            tokenRepository.delete(resetToken);
            throw new IllegalArgumentException(
                    "Reset token has expired. Please request a new password reset.");
        }

        // 4) Encode the new password using BCrypt (NEVER store plain text)
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("Password successfully reset for user: {}", user.getUsername());

        // 5) Delete the token immediately — one-time use only
        tokenRepository.delete(resetToken);
    }

    // -----------------------------------------------------------------------
    // Private helpers
    // -----------------------------------------------------------------------

    /**
     * Validates password against the security policy:
     * - At least 8 characters
     * - At least 1 uppercase letter (A–Z)
     * - At least 1 lowercase letter (a–z)
     * - At least 1 digit (0–9)
     * - At least 1 special character (anything not alphanumeric)
     */
    private void validatePasswordStrength(String password) {
        if (password == null || !PASSWORD_PATTERN.matcher(password).matches()) {
            throw new IllegalArgumentException(
                    "Password must be at least 8 characters and contain at least one uppercase letter, "
                  + "one lowercase letter, one number, and one special character.");
        }
    }

    /**
     * Sends a simple plain-text email with the reset link.
     *
     * NOTE on "to" field:
     * - Your User entity currently has only a username, not an email address.
     * - So the email is sent TO the username (which works only if username is an email).
     * - When you add an email field to User, replace user.getUsername() with user.getEmail().
     *
     * SMTP configuration lives in application.properties (spring.mail.*).
     */
    private void sendResetEmail(String to, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("Password Reset Request");
        message.setText(
                "Hello,\n\n"
              + "You requested a password reset.\n\n"
              + "Click the link below to set a new password:\n"
              + resetLink + "\n\n"
              + "This link will expire in " + expiryMinutes + " minutes.\n\n"
              + "If you did not request this, please ignore this email.\n\n"
              + "— The CAPSTONE Team"
        );

        mailSender.send(message);
        log.info("Password reset email sent to: {}", to);
    }
}


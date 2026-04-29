package com.CAPSTONEPROJECT.CAPSTONE.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * PasswordResetToken — stores one-time-use password reset tokens.
 *
 * TOKEN FLOW:
 *  1. User requests "Forgot Password" -> backend generates a UUID token and saves it here.
 *  2. Backend sends email: "http://localhost:3000/reset-password?token=<UUID>"
 *  3. User clicks link -> frontend calls POST /auth/reset-password with token + new password.
 *  4. Backend validates token (exists? not expired?) -> updates password -> deletes this record.
 *
 * WHY EXPIRY IS NEEDED:
 *  - Without expiry, a stolen email link would remain usable forever.
 *  - 15 minutes is a safe window — long enough for the user, short enough to limit risk.
 *
 * SECURITY CONSIDERATIONS:
 *  - Token is a UUID (random, unpredictable — cannot be guessed by brute force).
 *  - Only one active token per user (old ones are deleted before creating new).
 *  - Token is deleted immediately after successful use (one-time use).
 *  - Token is also deleted if found expired (keeps the table clean).
 */
@Entity
@Table(name = "password_reset_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The actual reset token — a random UUID string.
     * Must be unique across the table.
     */
    @Column(nullable = false, unique = true, length = 100)
    private String token;

    /**
     * The user who requested the password reset.
     * LAZY fetch: we only load the User object when we actually need it.
     */
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * When this token becomes invalid (= created time + 15 minutes).
     * After this time the token is rejected and deleted.
     */
    @Column(nullable = false)
    private LocalDateTime expiryDate;
}


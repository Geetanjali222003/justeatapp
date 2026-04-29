package com.CAPSTONEPROJECT.CAPSTONE.service;

/**
 * PasswordResetService — defines the three steps of the reset flow.
 *
 * FLOW OVERVIEW:
 *   Step 1: generateResetToken() — user asks for reset link.
 *   Step 2: (implicit) user clicks email link, frontend reads token from URL.
 *   Step 3: resetPassword()     — user submits new password + token.
 */
public interface PasswordResetService {

    /**
     * Step 1 — Generate a one-time-use token, save it in DB, and email the reset link.
     *
     * @param emailOrUsername the username (or email, if you add that field later)
     */
    void generateResetToken(String emailOrUsername);

    /**
     * Step 3 — Validate token + encode + save new password, then delete the token.
     *
     * @param token       UUID from the email link
     * @param newPassword plain-text password (will be BCrypt-encoded before saving)
     */
    void resetPassword(String token, String newPassword);
}


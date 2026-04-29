package com.CAPSTONEPROJECT.CAPSTONE.repository;

import com.CAPSTONEPROJECT.CAPSTONE.entity.PasswordResetToken;
import com.CAPSTONEPROJECT.CAPSTONE.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for password reset tokens.
 * Spring Data JPA auto-generates all implementations at runtime.
 */
@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    /**
     * Find a token record by the UUID token string.
     * Used during validation and reset steps.
     */
    Optional<PasswordResetToken> findByToken(String token);

    /**
     * Delete all existing tokens for a user before creating a new one.
     * Ensures only ONE active reset token per user at any time.
     *
     * WHY: Without this, a user could accumulate many valid tokens in the DB,
     * increasing the attack surface if emails are intercepted.
     */
    void deleteByUser(User user);
}


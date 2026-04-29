package com.CAPSTONEPROJECT.CAPSTONE.repository;

import com.CAPSTONEPROJECT.CAPSTONE.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository for User entity.
 *
 * findByUsername  — used by Spring Security (CustomUserDetailsService) during login.
 * findByEmail     — used by PasswordResetService to find user via email.
 * existsByUsername — used in register to block duplicate usernames.
 * existsByEmail    — used in register to block duplicate emails.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /** Used by login + JWT filter. DO NOT REMOVE. */
    Optional<User> findByUsername(String username);

    /** Used during forgot-password: look up user by their email address. */
    Optional<User> findByEmail(String email);

    /** Returns true if a user with this username already exists. Used in register. */
    boolean existsByUsername(String username);

    /**
     * Returns true if a user with this email already exists.
     * Used in register to enforce unique email constraint at service level
     * (gives a friendly error message before the DB unique constraint fires).
     */
    boolean existsByEmail(String email);
}

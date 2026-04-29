package com.CAPSTONEPROJECT.CAPSTONE.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * User entity mapped to the "users" table.
 *
 * WHY PRIMARY KEY (id):
 *   Every database table must have a unique identifier per row so that
 *   JPA, foreign keys (e.g. PasswordResetToken → User), and SQL queries
 *   can reliably reference a specific user.
 *   We use IDENTITY generation so the DB auto-increments it.
 *
 * WHY EMAIL IS ADDED:
 *   - The forgot-password flow needs to email the reset link to the user.
 *   - Using a real email instead of username makes the system more realistic.
 *   - In future features (notifications, profile) email is essential.
 *
 * WHY EMAIL MUST BE UNIQUE:
 *   - Two accounts must not share an email or password-reset emails
 *     would go to the wrong person.
 *   - Uniqueness is enforced BOTH at DB level (unique = true) and
 *     service level (existsByEmail check before saving).
 *
 * LOGIN IS UNCHANGED:
 *   Authentication still uses username + password via Spring Security.
 *   Email is an additional field — it does NOT replace username.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    /**
     * Primary key — auto-incremented by the database.
     * Required by JPA and used as the FK target in PasswordResetToken.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Unique login identifier. Used by Spring Security for authentication. */
    @NotBlank
    @Column(nullable = false, unique = true, length = 50)
    private String username;

    /**
     * BCrypt-encoded password. NEVER stored or returned as plain text.
     * Encoding is done in AuthServiceImpl / DataInitializer using PasswordEncoder.
     */
    @NotBlank
    @Column(nullable = false)
    private String password;

    /**
     * User's email address.
     *
     * WHY UNIQUE:
     *   Prevents two accounts sharing the same email so that password-reset
     *   emails always reach exactly the right person.
     *
     * @Email validates format (e.g. "user@example.com") at the bean level.
     * unique = true enforces uniqueness at the database level.
     * nullable = false means every user MUST have an email.
     */
    @Email(message = "Email must be a valid address (e.g. user@example.com)")
    @NotBlank(message = "Email is required")
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    /** Role controls which endpoints the user can access (CUSTOMER / OWNER). */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;
}

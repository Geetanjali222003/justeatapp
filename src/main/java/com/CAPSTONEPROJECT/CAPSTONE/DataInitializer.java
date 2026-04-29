package com.CAPSTONEPROJECT.CAPSTONE;

import com.CAPSTONEPROJECT.CAPSTONE.entity.Role;
import com.CAPSTONEPROJECT.CAPSTONE.entity.User;
import com.CAPSTONEPROJECT.CAPSTONE.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds two default users on startup (only if they don't already exist).
 *
 *   Username   Password     Role
 *  ------------------------------------
 *   owner1     owner123     OWNER
 *   customer1  customer123  CUSTOMER
 *
 * Passwords are BCrypt-encoded before saving.
 * This is required because Spring Security (AuthenticationManager) uses
 * BCryptPasswordEncoder to verify passwords during login.
 * Storing plain text would cause login to fail with 401.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // BCryptPasswordEncoder from SecurityConfig

    @Override
    public void run(String... args) {
        createUserIfAbsent("owner1",    "owner123",    "owner1@example.com",    Role.OWNER);
        createUserIfAbsent("customer1", "customer123", "customer1@example.com", Role.CUSTOMER);
    }

    private void createUserIfAbsent(String username, String rawPassword, String email, Role role) {
        if (userRepository.findByUsername(username).isEmpty()) {
            User user = User.builder()
                    .username(username)
                    .password(passwordEncoder.encode(rawPassword)) // BCrypt hash stored in DB
                    .email(email)
                    .role(role)
                    .build();
            userRepository.save(user);
            log.info("Seeded user: {} [{}] <{}>", username, role, email);
        }
    }
}

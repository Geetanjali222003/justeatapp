package com.CAPSTONEPROJECT.CAPSTONE.controller;

import com.CAPSTONEPROJECT.CAPSTONE.dto.LoginRequestDTO;
import com.CAPSTONEPROJECT.CAPSTONE.dto.LoginResponseDTO;
import com.CAPSTONEPROJECT.CAPSTONE.dto.RegisterRequestDTO;
import com.CAPSTONEPROJECT.CAPSTONE.entity.User;
import com.CAPSTONEPROJECT.CAPSTONE.repository.UserRepository;
import com.CAPSTONEPROJECT.CAPSTONE.security.JwtUtil;
import com.CAPSTONEPROJECT.CAPSTONE.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication controller - thin layer, zero business logic.
 *
 * Endpoints:
 *   POST /auth/login    → validate credentials, return message + role
 *   POST /auth/register → create a new user account
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    /**
     * POST /auth/login
     *
     * Request Body:
     *   { "username": "john", "password": "pass123" }
     *
     * Success Response (200):
     *   { "message": "Login successful", "role": "CUSTOMER" }
     *
     * Failure Response (401):
     *   { "status": 401, "message": "Invalid username or password" }
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        // 1) Ask Spring Security to authenticate username + password.
        // Spring will:
        //  - load user via CustomUserDetailsService
        //  - compare password using PasswordEncoder (BCrypt)
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            // 2) Fetch role from DB (our domain model) to include in JWT + response.
            User user = userRepository.findByUsername(authentication.getName())
                    .orElseThrow();

            String role = user.getRole().name();
            String token = jwtUtil.generateToken(user.getUsername(), role);

            // Reuse the existing DTO but now message contains the token to keep changes minimal.
            // If your frontend expects {token, role}, adjust LoginResponseDTO accordingly.
            return ResponseEntity.ok(new LoginResponseDTO(token, role));
        } catch (BadCredentialsException ex) {
            // Will be converted to 401 by GlobalExceptionHandler (InvalidCredentialsException)
            throw new com.CAPSTONEPROJECT.CAPSTONE.exception.InvalidCredentialsException("Invalid username or password");
        }
    }

    /**
     * POST /auth/register
     *
     * Request Body:
     *   {
     *     "username": "john",
     *     "password": "pass123",
     *     "email":    "john@example.com",
     *     "role":     "CUSTOMER"
     *   }
     *
     * Success Response (201): "User registered successfully"
     * Failure Response (400): duplicate username / email, or validation error
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequestDTO request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("User registered successfully");
    }
}

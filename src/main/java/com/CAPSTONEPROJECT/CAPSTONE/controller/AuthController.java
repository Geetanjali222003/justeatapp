package com.CAPSTONEPROJECT.CAPSTONE.controller;

import com.CAPSTONEPROJECT.CAPSTONE.dto.LoginRequestDTO;
import com.CAPSTONEPROJECT.CAPSTONE.dto.LoginResponseDTO;
import com.CAPSTONEPROJECT.CAPSTONE.dto.RegisterRequestDTO;
import com.CAPSTONEPROJECT.CAPSTONE.entity.User;
import com.CAPSTONEPROJECT.CAPSTONE.exception.InvalidCredentialsException;
import com.CAPSTONEPROJECT.CAPSTONE.exception.UserNotRegisteredException;
import com.CAPSTONEPROJECT.CAPSTONE.repository.UserRepository;
import com.CAPSTONEPROJECT.CAPSTONE.security.JwtUtil;
import com.CAPSTONEPROJECT.CAPSTONE.service.AuthService;
import com.CAPSTONEPROJECT.CAPSTONE.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;

    // 🔹 LOGIN
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            // User must exist in DB after successful authentication.
            User user = userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new UserNotRegisteredException("User not registered"));

            // JWT is generated only after successful authentication and DB lookup.
            String role = user.getRole().name();
            String token = jwtUtil.generateToken(user.getUsername(), role);

            return ResponseEntity.ok(new LoginResponseDTO(token, role));
        } catch (AuthenticationException ex) {
            throw new InvalidCredentialsException("Invalid username or password");
        }
    }


    // 🔹 SEND OTP (Step 1: Generate and send OTP to email)
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        
        // Generate, store and send OTP via email (5-minute expiry)
        otpService.generateAndSendOtp(email, 5);
        
        return ResponseEntity.ok("OTP sent");
    }

    // 🔹 REGISTER (Step 2: Validate OTP and create user)
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequestDTO request) {
        
        // SECURITY: Validate OTP before creating user
        if (!otpService.verifyOtp(request.getEmail(), request.getOtp())) {
            return ResponseEntity.badRequest().body("Invalid or expired OTP");
        }
        
        // OTP is valid - create user
        authService.register(request);
        
        // Delete OTP after successful registration (one-time use)
        otpService.deleteOtp(request.getEmail());
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("User registered successfully");
    }


}
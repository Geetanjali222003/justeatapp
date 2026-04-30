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

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

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

            User user = userRepository.findByUsername(authentication.getName())
                    .orElseThrow();

            String role = user.getRole().name();
            String token = jwtUtil.generateToken(user.getUsername(), role);

            return ResponseEntity.ok(new LoginResponseDTO(token, role));

        } catch (BadCredentialsException ex) {
            throw new com.CAPSTONEPROJECT.CAPSTONE.exception.InvalidCredentialsException(
                    "Invalid username or password"
            );
        }
    }

    // 🔹 REGISTER
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequestDTO request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("User registered successfully");
    }

}
package com.CAPSTONEPROJECT.CAPSTONE.service;

import com.CAPSTONEPROJECT.CAPSTONE.dto.LoginRequestDTO;
import com.CAPSTONEPROJECT.CAPSTONE.dto.LoginResponseDTO;
import com.CAPSTONEPROJECT.CAPSTONE.dto.RegisterRequestDTO;

/**
 * Contract for authentication operations.
 */
public interface AuthService {

    /**
     * Validates credentials (plain-text comparison) and returns message + role.
     * Throws InvalidCredentialsException if username/password don't match.
     */
    LoginResponseDTO login(LoginRequestDTO request);

    /**
     * Registers a new user (plain-text password for now).
     * Throws IllegalArgumentException if username already exists.
     */
    void register(RegisterRequestDTO request);
}

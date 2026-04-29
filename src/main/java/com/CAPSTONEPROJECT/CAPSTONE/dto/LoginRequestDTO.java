package com.CAPSTONEPROJECT.CAPSTONE.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Incoming payload for POST /auth/login.
 * Simple DTO - just username and password (plain text for now).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestDTO {
    private String username;
    private String password;
}

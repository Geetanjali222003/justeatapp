package com.CAPSTONEPROJECT.CAPSTONE.exception;

/**
 * Thrown by AuthServiceImpl when username/password do not match.
 * Mapped to HTTP 401 by GlobalExceptionHandler.
 */
public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException(String message) {
        super(message);
    }
}


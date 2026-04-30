package com.CAPSTONEPROJECT.CAPSTONE.service;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * OTP Service with Redis support and in-memory fallback
 * Uses Redis when available, falls back to ConcurrentHashMap if Redis is unavailable
 * Sends OTP via email using EmailService
 */
@Service
public class OtpService {

    private final StringRedisTemplate redisTemplate;
    private final EmailService emailService;
    
    // In-memory fallback storage: email -> OtpEntry
    private final Map<String, OtpEntry> inMemoryStore = new ConcurrentHashMap<>();
    
    private boolean redisAvailable = true;

    public OtpService(StringRedisTemplate redisTemplate, EmailService emailService) {
        this.redisTemplate = redisTemplate;
        this.emailService = emailService;
        // Check Redis availability on startup
        checkRedisConnection();
    }

    private void checkRedisConnection() {
        try {
            redisTemplate.getConnectionFactory().getConnection().ping();
            redisAvailable = true;
            System.out.println("✓ Redis connection successful - using Redis for OTP storage");
        } catch (Exception e) {
            redisAvailable = false;
            System.out.println("⚠ Redis not available - using in-memory OTP storage (fallback mode)");
        }
    }

    /**
     * Store OTP with expiration time
     * @param email User's email (key)
     * @param otp The OTP code
     * @param expiryMinutes Expiration time in minutes
     */
    public void storeOtp(String email, String otp, long expiryMinutes) {
        // Normalize email to lowercase for consistent storage
        String normalizedEmail = email.trim().toLowerCase();
        
        if (redisAvailable) {
            try {
                redisTemplate.opsForValue().set(normalizedEmail, otp, expiryMinutes, TimeUnit.MINUTES);
                System.out.println("DEBUG: Stored OTP for " + normalizedEmail + " = " + otp);
            } catch (Exception e) {
                redisAvailable = false;
                System.out.println("⚠ Redis connection lost - switching to in-memory storage");
                // Store in memory as fallback
                LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(expiryMinutes);
                inMemoryStore.put(normalizedEmail, new OtpEntry(otp, expiryTime));
                System.out.println("DEBUG: Stored OTP in memory for " + normalizedEmail + " = " + otp);
            }
        } else {
            // Fallback to in-memory storage
            LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(expiryMinutes);
            inMemoryStore.put(normalizedEmail, new OtpEntry(otp, expiryTime));
            System.out.println("DEBUG: Stored OTP in memory for " + normalizedEmail + " = " + otp);
        }
        
        // Clean up expired entries
        cleanupExpiredEntries();
    }

    /**
     * Generate, store and send OTP via email
     * @param email User's email
     * @param expiryMinutes Expiration time in minutes
     * @return Generated OTP (for logging/testing purposes)
     */
    public String generateAndSendOtp(String email, long expiryMinutes) {
        // Generate 6-digit OTP
        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);
        
        // Store OTP
        storeOtp(email, otp, expiryMinutes);
        
        // Send OTP via email
        try {
            emailService.sendOtp(email, otp);
            System.out.println("✓ OTP sent to email: " + email);
        } catch (Exception e) {
            System.out.println("⚠ Failed to send OTP email to " + email + ": " + e.getMessage());
            // Still print to console as fallback for testing
            System.out.println("OTP for " + email + ": " + otp);
        }
        
        return otp;
    }

    /**
     * Get OTP for email
     * @param email User's email
     * @return OTP if valid and not expired, null otherwise
     */
    public String getOtp(String email) {
        // Normalize email to lowercase for consistent lookup
        String normalizedEmail = email.trim().toLowerCase();
        
        if (redisAvailable) {
            try {
                String otp = redisTemplate.opsForValue().get(normalizedEmail);
                System.out.println("DEBUG: Retrieved OTP from Redis for " + normalizedEmail + " = " + otp);
                return otp;
            } catch (Exception e) {
                redisAvailable = false;
                System.out.println("⚠ Redis connection lost - switching to in-memory storage");
            }
        }
        
        // Fallback to in-memory storage
        OtpEntry entry = inMemoryStore.get(normalizedEmail);
        if (entry == null) {
            System.out.println("DEBUG: No OTP found in memory for " + normalizedEmail);
            System.out.println("DEBUG: Current in-memory keys: " + inMemoryStore.keySet());
            return null;
        }
        
        // Check if expired
        if (LocalDateTime.now().isAfter(entry.expiryTime)) {
            System.out.println("DEBUG: OTP expired for " + normalizedEmail);
            inMemoryStore.remove(normalizedEmail);
            return null;
        }
        
        System.out.println("DEBUG: Retrieved OTP from memory for " + normalizedEmail + " = " + entry.otp);
        return entry.otp;
    }

    /**
     * Delete OTP after successful use
     * @param email User's email
     */
    public void deleteOtp(String email) {
        // Normalize email to lowercase
        String normalizedEmail = email.trim().toLowerCase();
        
        if (redisAvailable) {
            try {
                redisTemplate.delete(normalizedEmail);
                return;
            } catch (Exception e) {
                redisAvailable = false;
            }
        }
        
        // Fallback to in-memory storage
        inMemoryStore.remove(normalizedEmail);
    }

    /**
     * Verify OTP
     * @param email User's email
     * @param otp OTP to verify
     * @return true if OTP matches and is not expired
     */
    public boolean verifyOtp(String email, String otp) {
        String storedOtp = getOtp(email);
        String trimmedOtp = otp != null ? otp.trim() : null;
        
        System.out.println("DEBUG: Verifying OTP for " + email);
        System.out.println("DEBUG: Stored OTP = [" + storedOtp + "], Provided OTP = [" + trimmedOtp + "]");
        
        boolean isValid = storedOtp != null && storedOtp.equals(trimmedOtp);
        System.out.println("DEBUG: OTP verification result = " + isValid);
        
        return isValid;
    }

    /**
     * Clean up expired entries from in-memory store
     */
    private void cleanupExpiredEntries() {
        LocalDateTime now = LocalDateTime.now();
        inMemoryStore.entrySet().removeIf(entry -> now.isAfter(entry.getValue().expiryTime));
    }

    /**
     * Check if using Redis or in-memory fallback
     */
    public boolean isRedisAvailable() {
        return redisAvailable;
    }

    /**
     * Inner class to store OTP with expiry time
     */
    private static class OtpEntry {
        final String otp;
        final LocalDateTime expiryTime;

        OtpEntry(String otp, LocalDateTime expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }
}


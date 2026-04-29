package com.CAPSTONEPROJECT.CAPSTONE.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.nio.charset.StandardCharsets;

/**
 * JwtUtil
 *
 * Why JWT?
 * - JWT allows the backend to remain STATELESS (no server session storage).
 * - After login, the client stores the token and sends it on every request.
 * - The server validates the token and extracts username/role to authorize access.
 */
@Component
public class JwtUtil {

    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtUtil(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms:86400000}") long expirationMs
    ) {
        // JJWT expects a key of sufficient length for HS256.
        // We support both base64 strings and plain text strings.
        byte[] keyBytes = toSigningKeyBytes(secret);
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    private byte[] toSigningKeyBytes(String secret) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalArgumentException("app.jwt.secret must be configured");
        }

        // Try Base64 first only when the value looks like Base64.
        // Otherwise treat it as plain text.
        byte[] bytes;
        try {
            bytes = Decoders.BASE64.decode(secret);
        } catch (Exception ignored) {
            bytes = secret.getBytes(StandardCharsets.UTF_8);
        }

        // HS256 requires at least 256 bits (32 bytes).
        if (bytes.length < 32) {
            // Keep it beginner-friendly: fail fast with a clear message.
            throw new IllegalArgumentException(
                    "app.jwt.secret is too short for HS256 (need at least 32 bytes). " +
                            "Use a long random string or a 32+ byte base64 value."
            );
        }
        return bytes;
    }

    /**
     * Generates a JWT token that includes username (subject) and role (custom claim).
     */
    public String generateToken(String username, String role) {
        Instant now = Instant.now();
        Instant expiry = now.plusMillis(expirationMs);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(expiry))
                .addClaims(Map.of("role", role))
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Validates signature + expiration.
     */
    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public String extractRole(String token) {
        Object role = parseClaims(token).get("role");
        return role == null ? null : role.toString();
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}


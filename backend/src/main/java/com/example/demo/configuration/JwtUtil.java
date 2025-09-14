package com.example.demo.configuration;

import com.example.demo.entity.User;
import com.example.demo.service.TokenBlacklistService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    private final TokenBlacklistService blacklistService;
    private final String SECRET_KEY = "farnam-very-secret-jwt-key";

    public JwtUtil(TokenBlacklistService blacklistService) {
        this.blacklistService = blacklistService;
    }

    public String generateToken(User user) {
        long expirationMs = 1000 * 60 * 60; // 60 minutes
        return Jwts.builder()
                .setSubject(user.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        if (blacklistService.isBlacklisted(token)) {
            return false;
        }
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        Date expiration = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
        return expiration.before(new Date());
    }

    public long getRemainingExpiration(String token) {
        Date expiration = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
        long diffMillis = expiration.getTime() - System.currentTimeMillis();
        return Math.max(diffMillis / 1000, 0);
    }
}

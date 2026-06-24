package com.ethan.personal_finance_dashboard.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.ethan.personal_finance_dashboard.user.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private Key getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(User user) {
        Date issuedAt = new Date();

        long expirationMillis
                = issuedAt.getTime() + expiration;

        Date expirationDate
                = new Date(expirationMillis);

        return Jwts.builder()
                .subject(user.getUsername())
                .claim("userId", user.getId())
                .issuedAt(issuedAt)
                .expiration(expirationDate)
                .signWith(getSigningKey())
                .compact();

    }

}

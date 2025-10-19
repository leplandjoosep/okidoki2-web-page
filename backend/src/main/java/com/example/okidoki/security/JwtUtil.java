package com.example.okidoki.security;


import io.jsonwebtoken.*;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    SecretKey key = Jwts.SIG.HS256.key().build();

    public String generateToken(Integer id) {
        return Jwts.builder()
                .issuedAt(new Date())
                .claim("id", id)
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }
    //Kui midagi lappes siis probs see
    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}

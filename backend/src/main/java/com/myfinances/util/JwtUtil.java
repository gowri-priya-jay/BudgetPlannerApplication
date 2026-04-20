package com.myfinances.util;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	private SecretKey key;
	
	public JwtUtil(@Value("${spring.security.oauth2.resourceserver.jwt.secret-key}") String secret) {
	    key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
	}

	public String generateToken(UserDetails userDetails) {
		return Jwts.builder().subject(userDetails.getUsername()).issuedAt(new Date())
				.expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 30))
				.signWith(key).compact();
	}

	public String extractUsername(String token) {
		return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();
	}

	public boolean validateToken(String token, UserDetails userDetails) {
		String username = extractUsername(token);
		return username.equals(userDetails.getUsername());
	}

}

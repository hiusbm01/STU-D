package com.stud.backend.security;

import com.stud.backend.domain.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


import java.security.Key;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {

    private final Key key;
    // application.yml에 정의된 secret 키 주입받기
    public JwtTokenProvider(@Value("${jwt.secret}") String secretKey){
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    //JWT 토큰에서 주체를 추출
    public String getUsernameFromToken(String token){
       Claims claims = Jwts.parserBuilder()
               .setSigningKey(key)
               .build()
               .parseClaimsJws(token)
               .getBody();

       return claims.getSubject();
    }
    public String getRoleFromToken(String token){
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return (String)claims.get("auth");
    }

    //


    // JWT 토큰 유효성검토.
    public boolean validateToken(String token){
        try{
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch(io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            log.info("잘못된 Jwt 서명입니다.");
        } catch(ExpiredJwtException e){
            log.info("만료된 JWT 토큰입니다.");
        } catch(UnsupportedJwtException e){
            log.info("지원되지 않는 JWT 토큰입니다.");
        } catch(IllegalArgumentException e){
            log.info("JWT 토큰이 잘못되었습니다.");
        }
        return false;
    }
   public String generateToken(User user){
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + 360000);

        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("auth", user.getRole().name())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key)
                .compact();
   }


}

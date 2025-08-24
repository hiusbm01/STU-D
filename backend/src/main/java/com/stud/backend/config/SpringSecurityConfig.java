package com.stud.backend.config;

import com.stud.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SpringSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // REST API이므로 CSRF 보호를 비활성화합니다.
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())

                // JWT 기반 인증을 사용하므로 세션을 사용하지 않습니다.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // HTTP 요청에 대한 인가 규칙을 설정합니다.
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        //로그인 회원가입 접근가능
                        .requestMatchers("/api/users/register", "api/users/login", "/ws/**").permitAll()
                        //GET요청은 인증된 사용자에게 대부분허용
                        .requestMatchers(HttpMethod.GET, "/api/**").authenticated()
                        //POST 등 요청 명시적으로 추가해주는곳
                        .requestMatchers(HttpMethod.POST, "/api/seats/**", "/api/tickets/**").authenticated()
                        //관리자용 경로
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        //나머지 모든 요청 일단 인증 필요하도록 설정
                        .anyRequest().authenticated()
                        
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration configuration = new CorsConfiguration();
        //프론트 서버 주소 허용
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        //허용할 HTTP 메서드 설정
        configuration.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE","OPTIONS"));
        //헤더 설정
        configuration.setAllowedHeaders(Arrays.asList("Authorization","Content-Type"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        //모든 경로에 대해 위 설정 적용
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}

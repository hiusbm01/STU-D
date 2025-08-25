package com.stud.backend.service;

import com.stud.backend.domain.User;
import com.stud.backend.domain.User.Role;
import com.stud.backend.dto.UserRegisterDto;
import com.stud.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.stud.backend.security.JwtTokenProvider;

import java.util.Date;

@Service
@RequiredArgsConstructor   // Lombok: final 필드나 @NonNull이 붙은 필드에 대한 생성자를 자동으로 만들어줍니다. (의존성 주입을 위함)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;



    @Transactional
    public User registerUser(UserRegisterDto userDto){
        if(userRepository.existsByEmail(userDto.getEmail())){
            throw new IllegalArgumentException("이미 사용중인 이메일입니다.");
        }

        String encodedPassword = passwordEncoder.encode(userDto.getPassword());

        User newUser = User.builder()
                .email(userDto.getEmail())
                .password(encodedPassword)
                .name(userDto.getName())
                .phoneNumber(userDto.getPhoneNumber())
                .role(User.Role.ROLE_USER)
                .build();

        return userRepository.save(newUser);
    }

    //로그인 메서드
    public String login(String email, String password){
        //1. 이메일로 사용자 찾기
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("해당 이메일의 사용자를 찾을 수 없습니다."));

        //2. 비밀번호 일치 여부 확인
        //passwordEncoder.matches(일반, 암호화 비밀번호)
        if(!passwordEncoder.matches(password, user.getPassword())){
            throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
        }
        
        //3. 로그인 성공 시 JWT 토큰 생성
        // 토큰 만료 시간은 1시간으로 설정
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + 360000); //1시간

        //JWT 토큰 반환
        return jwtTokenProvider.generateToken(user);
    }
}

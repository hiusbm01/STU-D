package com.stud.backend.controller;

import com.stud.backend.dto.LoginRequest;
import com.stud.backend.dto.UserRegisterDto;
import com.stud.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody UserRegisterDto userRegisterDto){
        try{
            userService.registerUser(userRegisterDto);
            return new ResponseEntity<>("회원가입에 성공했습니다.", HttpStatus.CREATED);
        }catch (IllegalArgumentException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }catch(Exception e){
            return new ResponseEntity<>("회원가입 중 오류가 발생했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){
        //UserService의 login메서드를 호출하여 JWT토큰을 받음
        String token = userService.login(loginRequest.getEmail(), loginRequest.getPassword());

        //JWT 토큰을 JSON형태로 클라이언트에게 반환
        return ResponseEntity.ok(Map.of("token", token));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo(@AuthenticationPrincipal UserDetails userDetails){
        String userEmail = userDetails.getUsername();
        return ResponseEntity.ok(Map.of("email",userEmail));
    }


}

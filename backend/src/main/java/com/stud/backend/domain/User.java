package com.stud.backend.domain;

import jakarta.persistence.*;
import lombok.*;


@Entity // 클래스가 데이터베이스의 테이블과 매핑됨.
@Table(name = "user") // 테이블 이름 user
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="user_id")
    private Long id;

    @Column(name = "name",nullable = false, length = 10)
    private String name;

    @Column(name ="email", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "phone_number", unique = true, nullable = true, length= 20)
    private String phoneNumber;

    //사용자 권한
    @Enumerated(EnumType.STRING) // enum타입을 데이터베이스에 문자열 형태로 젖아하도록
    @Column(name = "role", nullable = false, length = 20)
    private Role role;

    public enum Role{
        ROLE_USER,
        ROLE_ADMIN
    }
}

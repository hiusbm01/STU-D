package com.stud.backend.repository;

import com.stud.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

    //이메일로 사용자를 찾아 반환하는 메소드
    //없을 수도 있으므로 Optional로 감싸서 반환.
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

}

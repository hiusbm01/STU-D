package com.stud.backend.repository;

import com.stud.backend.domain.Seat;
import com.stud.backend.domain.SeatStatus;
import com.stud.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    //사용자가 사용중인 좌석 찾는 메서드
    Optional<Seat> findByUserAndStatus(User user, SeatStatus status);
}

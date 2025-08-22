package com.stud.backend.repository;

import com.stud.backend.domain.Seat;
import com.stud.backend.domain.SeatStatus;
import com.stud.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    //사용자가 사용중인 좌석 찾는 메서드
    List<Seat> findByUserAndStatus(User user, SeatStatus status);

    //이용중 시간이 만료된 좌석 퇴실처리
    List<Seat> findByStatusAndEndTimeBefore(SeatStatus status, LocalDateTime now);
}

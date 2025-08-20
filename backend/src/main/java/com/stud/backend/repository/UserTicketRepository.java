package com.stud.backend.repository;

import com.stud.backend.domain.User;
import com.stud.backend.domain.UserTicket;
import com.stud.backend.domain.UserTicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserTicketRepository extends JpaRepository<UserTicket, Long> {

    //특정 사용자의 특정 상태를 가진 이용권 목록 찾는 메서드
    List<UserTicket> findByUserAndStatus(User user, UserTicketStatus status);

    List<UserTicket> findByUser(User user);
}

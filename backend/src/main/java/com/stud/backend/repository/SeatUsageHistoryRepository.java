package com.stud.backend.repository;

import com.stud.backend.domain.SeatUsageHistory;
import com.stud.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatUsageHistoryRepository  extends JpaRepository<SeatUsageHistory, Long> {

    List<SeatUsageHistory> findByUser(User user);
}

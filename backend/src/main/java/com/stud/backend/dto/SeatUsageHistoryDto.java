package com.stud.backend.dto;

import com.stud.backend.domain.SeatUsageHistory;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SeatUsageHistoryDto {

    private Long id;
    private String seatNumber;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private Long durationMinutes;

    public SeatUsageHistoryDto(SeatUsageHistory history){
        this.id = history.getId();
        this.seatNumber = history.getSeatNumber();
        this.checkInTime = history.getCheckInTime();
        this.checkOutTime = history.getCheckOutTime();
        this.durationMinutes = history.getDurationMinutes();
    }
}

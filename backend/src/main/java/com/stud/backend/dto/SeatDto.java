package com.stud.backend.dto;

import com.stud.backend.domain.Seat;
import com.stud.backend.domain.SeatStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SeatDto {
    private Long id;
    private String seatNumber;
    private SeatStatus status;
    private String userEmail;
    private LocalDateTime endTime;

    public SeatDto(Seat seat){
        this.id = seat.getId();
        this.seatNumber = seat.getSeatNumber();
        this.status = seat.getStatus();
        this.endTime = seat.getEndTime();
        if(seat.getUser() != null){
            this.userEmail = seat.getUser().getEmail();
        }
    }
}

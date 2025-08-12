package com.stud.backend.dto;

import com.stud.backend.domain.Seat;
import com.stud.backend.domain.SeatStatus;
import lombok.Data;

@Data
public class SeatDto {
    private Long id;
    private String seatNumber;
    private SeatStatus status;
    private String userEmail;

    public SeatDto(Seat seat){
        this.id = seat.getId();
        this.seatNumber = seat.getSeatNumber();
        this.status = seat.getStatus();
        //사용자가 있으면 이메일, 없으면 null 설정
        if(seat.getUser() != null){
            this.userEmail = seat.getUser().getEmail();
        }
    }
}

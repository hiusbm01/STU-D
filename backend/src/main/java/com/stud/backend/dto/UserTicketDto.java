package com.stud.backend.dto;


import com.stud.backend.domain.UserTicket;
import com.stud.backend.domain.UserTicketStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserTicketDto {


    private Long id;
    private String ticketName;
    private LocalDateTime purchaseDate;
    private LocalDateTime expiryDate;
    private Integer remainingTime;
    private UserTicketStatus status;

    public UserTicketDto(UserTicket userTicket){
        this.id = userTicket.getId();
        this.ticketName = userTicket.getTicket().getName();
        this.purchaseDate = userTicket.getPurchaseDate();
        this.expiryDate = userTicket.getExpiryDate();
        this.remainingTime = userTicket.getRemainingTime();
        this.status = userTicket.getStatus();

    }
}

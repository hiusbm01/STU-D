package com.stud.backend.dto;

import com.stud.backend.domain.Ticket;
import com.stud.backend.domain.TicketType;
import lombok.Data;

@Data
public class TicketDto {
    private Long id;
    private String name;
    private TicketType type;
    private Integer durationDays;
    private Integer durationHours;
    private Integer price;

    public TicketDto(Ticket ticket){
        this.id = ticket.getId();
        this.name = ticket.getName();
        this.type = ticket.getType();
        this.durationDays = ticket.getDurationDays();
        this.durationHours = ticket.getDurationHours();
        this.price = ticket.getPrice();
    }

}

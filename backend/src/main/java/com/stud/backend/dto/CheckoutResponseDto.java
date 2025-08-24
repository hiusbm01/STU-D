package com.stud.backend.dto;


import com.stud.backend.domain.TicketType;
import com.stud.backend.domain.UserTicket;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CheckoutResponseDto {
    private Long durationMinutes;
    private UserTicketDto updatedUserTicket;
    private String remainingBalanceMessage;

    public CheckoutResponseDto(Long durationMinutes, UserTicket userTicket){
       this.durationMinutes = durationMinutes;
       this.updatedUserTicket = new UserTicketDto(userTicket);


       TicketType type= userTicket.getTicket().getType();

       System.out.println(" DTO 생성자 - 이용권 타입: " + type);

       if(type == TicketType.PERIOD){
           this.remainingBalanceMessage = "만료일 : "+userTicket.getExpiryDate().toString();
       }else if(type == TicketType.FIXED || type == TicketType.HOURLY){
           long hours = userTicket.getRemainingTime()/60;
           long minutes = userTicket.getRemainingTime() % 60;
           this.remainingBalanceMessage =String.format("남은 시간 : %d시간 %d분", hours, minutes);
       }

       System.out.println("DTO 생성자 - 최종 메시지 : "+remainingBalanceMessage);
    }
}

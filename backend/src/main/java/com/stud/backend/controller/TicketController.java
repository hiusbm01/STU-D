package com.stud.backend.controller;


import com.stud.backend.domain.TicketType;
import com.stud.backend.dto.TicketDto;
import com.stud.backend.dto.UserTicketDto;
import com.stud.backend.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @GetMapping
    public ResponseEntity<List<TicketDto>> getTickets(@RequestParam(name ="type", required = false) String type){
        TicketType ticketType = null;
        if(type != null){
            try{
                ticketType = TicketType.valueOf(type.toUpperCase());
            }catch( IllegalArgumentException e){
                return ResponseEntity.badRequest().build();
            }
        }
        List<TicketDto> tickets = ticketService.findAvailableTickets(ticketType);
        return ResponseEntity.ok(tickets);
    }

    //구매 API
    @PostMapping("/{ticketId}/purchase")
    public ResponseEntity<String> purchaseTicket(@PathVariable Long ticketId,@AuthenticationPrincipal UserDetails userDetails){

        ticketService.purchaseTicket(ticketId, userDetails.getUsername());
        return ResponseEntity.ok("이용권 구매에 성공하셨습니다");
    }

    @GetMapping("/my")
    public ResponseEntity<List<UserTicketDto>> geMyTickets(@AuthenticationPrincipal UserDetails userDetails){
        List<UserTicketDto> myTickets = ticketService.getMyTickets(userDetails.getUsername());

        return ResponseEntity.ok(myTickets);
    }

}

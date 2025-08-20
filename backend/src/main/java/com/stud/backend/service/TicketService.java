package com.stud.backend.service;

import com.stud.backend.domain.*;
import com.stud.backend.dto.TicketDto;
import com.stud.backend.dto.UserTicketDto;
import com.stud.backend.repository.TicketRepository;
import com.stud.backend.repository.UserRepository;
import com.stud.backend.repository.UserTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final UserTicketRepository userTicketRepository;

    @Transactional(readOnly = true)
    public List<TicketDto> getAllTickets(){
        return ticketRepository.findAll().stream().map(TicketDto::new).collect(Collectors.toList());

    }

    public void purchaseTicket(Long ticketId, String userEmail){
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new IllegalArgumentException("이용권을 찾을 수 없습니다"));


        UserTicket userTicket = new UserTicket();
        userTicket.setUser(user);
        userTicket.setTicket(ticket);
        userTicket.setPurchaseDate(LocalDateTime.now());
        userTicket.setStatus(UserTicketStatus.ACTIVE);

        if(ticket.getType() == TicketType.PERIOD){
            userTicket.setExpiryDate(LocalDateTime.now().plusDays(ticket.getDurationDays()));
        } else{
            userTicket.setExpiryDate(LocalDateTime.now().plusDays(ticket.getDurationDays()));
            userTicket.setRemainingTime(ticket.getDurationHours() * 60);
        }

        userTicketRepository.save(userTicket);
    }

    @Transactional(readOnly = true)
    public List<UserTicketDto> getMyTickets(String userEmail){
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        List<UserTicket> userTickets = userTicketRepository.findByUser(user);

        return userTickets.stream()
                .map(UserTicketDto::new)
                .collect(Collectors.toList());
    }

}
